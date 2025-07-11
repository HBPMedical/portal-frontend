import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { useReactiveVar } from '@apollo/client';
import { HierarchyCircularNode } from '../utils';
import { NodeData } from './d3Hierarchy';
import { zoomNodeVar } from '../API/GraphQL/cache';
import './D3DendrogramLayer.css';
import {
  createTooltip,
  showTooltip,
  hideTooltip,
  moveTooltip,
  cleanupTooltip,
  TooltipData,
} from './tooltipUtils';

interface Props {
  layout: HierarchyCircularNode;
  selectedNode: HierarchyCircularNode | undefined;
  groupVars: Array<{
    name: string;
    items: string[];
    color: string;
  }>;
  handleSelectNode: (node: HierarchyCircularNode) => void;
}

const diameter = 800;

const depth = (n: HierarchyCircularNode): number =>
  n.children ? 1 + (d3.max<number>(n.children.map(depth)) || 0) : 1;

const splitText = (text: string): string[] => {
  if (!text) return [];
  const bits = text.split(/\s|_/);

  return bits;
};

const D3DendrogramLayer = ({
  layout,
  selectedNode,
  groupVars,
  handleSelectNode,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const currentTransformRef = useRef<d3.ZoomTransform | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);
  const previousDomainId = useRef<string | undefined>();
  const zoomNode = useReactiveVar(zoomNodeVar);

  const zoomToNode = useCallback(
    (id: string) => {
      const node = layout.descendants().find((n) => n.data.id === id);
      if (node) {
        // Use the pre-generated uniqueId from the node data
        (node as any).uniqueId = node.data.uniqueId;
        if (typeof (node as any).r !== 'number') {
          (node as any).r = 0;
        }
        handleSelectNode(node as unknown as HierarchyCircularNode);
      }
    },
    [layout, handleSelectNode]
  );

  useEffect(() => {
    if (!svgRef.current || !layout) return;

    const svg = d3.select(svgRef.current);

    // Store current transform before clearing
    const currentZoom = d3.zoomTransform(svg.node() as Element);
    if (currentZoom.k !== 1 || currentZoom.x !== 0 || currentZoom.y !== 0) {
      currentTransformRef.current = currentZoom;
    }

    // Clear previous content
    svg.selectAll('*').remove();

    // Generate tree layout data
    const root = d3.hierarchy(layout.data);

    // First, create the tree layout
    const treeLayout = d3
      .tree<NodeData>()
      .nodeSize([80, 400])
      .separation((a, b) => (a.parent === b.parent ? 0.3 : 0.5));

    // Apply the layout
    const treeData = treeLayout(root);
    type HierarchyPointNodeWithXY = d3.HierarchyPointNode<NodeData>;
    const rootWithXY = treeData as HierarchyPointNodeWithXY;
    const nodes = rootWithXY.descendants();

    // Calculate bounds
    const bounds = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    };

    // First pass: calculate basic bounds
    nodes.forEach((d) => {
      bounds.minX = Math.min(bounds.minX, d.y);
      bounds.maxX = Math.max(bounds.maxX, d.y);
      bounds.minY = Math.min(bounds.minY, d.x);
      bounds.maxY = Math.max(bounds.maxY, d.x);
    });

    // Create temporary text element to measure text widths
    const tempText = svg
      .append('text')
      .style('font-size', '12px')
      .style('visibility', 'hidden');

    // Second pass: account for label lengths
    nodes.forEach((d) => {
      tempText.text(d.data.label);
      const textWidth = tempText.node()?.getBBox().width || 0;
      // For leaf nodes (no children), extend maxX to account for label
      if (!d.children) {
        bounds.maxX = Math.max(bounds.maxX, d.y + textWidth + 10); // 10px extra padding
      }
      // For internal nodes (with children), extend minX to account for label
      if (d.children) {
        bounds.minX = Math.min(bounds.minX, d.y - textWidth - 10);
      }
    });

    // Remove temporary text element
    tempText.remove();

    // Add padding
    const padding = {
      left: 60,
      right: 60,
      top: 40,
      bottom: 40,
    };

    const width = bounds.maxX - bounds.minX + padding.left + padding.right;
    const height = bounds.maxY - bounds.minY + padding.top + padding.bottom;

    // Set SVG size
    const minHeight = Math.max(height, 830);
    svg.attr('width', width).attr('height', minHeight);
    svg.style('width', 'calc(100%)');

    const color = d3
      .scaleLinear<string, string>()
      .domain([0, depth(layout)])
      .range(['hsl(190,80%,80%)', 'hsl(228,80%,40%)'])
      .interpolate(d3.interpolateHcl);

    // Create a group for the entire visualization with adjusted transform
    const g = svg
      .append('g')
      .attr(
        'transform',
        `translate(${padding.left - bounds.minX}, ${padding.top - bounds.minY})`
      );

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2]) // Allow zooming between 50% and 200%
      .on('zoom', () => {
        g.attr('transform', d3.event.transform);
      });

    svg.call(zoom as any);

    // Reapply stored transform if it exists
    if (currentTransformRef.current) {
      svg.call(zoom.transform as any, currentTransformRef.current);
      currentTransformRef.current = null; // Clear after applying
    }

    // Focus on selected node or root node on first render
    if (isFirstRender.current) {
      let focusNode = null;

      // If a node is selected, try to find it in the current layout
      if (selectedNode) {
        focusNode = nodes.find(
          (n) => n.data.uniqueId === (selectedNode as any).uniqueId
        );
      }

      // If no selected node found, fall back to root node
      if (!focusNode) {
        focusNode = nodes.find((n) => n.depth === 0); // Find root node
      }

      if (focusNode) {
        const viewportWidth = svg.node()?.getBoundingClientRect().width || 800;
        const viewportHeight = 830;

        const nodeX = focusNode.y; // Note: in tree layout, x and y are swapped
        const nodeY = focusNode.x;

        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;

        const initialTransform = d3.zoomIdentity
          .translate(centerX - nodeX, centerY - nodeY)
          .scale(1);

        svg.call(zoom.transform as any, initialTransform);
      }
      isFirstRender.current = false; // Mark that first render is complete
    }

    // Draw links using rootWithXY
    const linkGenerator = d3
      .linkHorizontal<
        d3.HierarchyPointLink<NodeData>,
        d3.HierarchyPointNode<NodeData>
      >()
      .x((d) => d.y)
      .y((d) => d.x);

    g.selectAll('.link')
      .data(rootWithXY.links())
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1.5)
      .attr('d', linkGenerator);

    // Create node groups with explicit typing using rootWithXY
    const nodeGroups = g
      .selectAll<SVGGElement, d3.HierarchyPointNode<NodeData>>('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', function (d) {
        d3.event.stopPropagation();
        hideTooltip(tooltipRef.current);
        // Use the pre-generated uniqueId from the node data
        (d as any).uniqueId = d.data.uniqueId;
        if (typeof (d as any).r !== 'number') {
          (d as any).r = 0;
        }
        handleSelectNode(d as unknown as HierarchyCircularNode);
      })
      .on('mouseenter', function (d) {
        const event = d3.event as MouseEvent;

        const nodeGroup = d3.select(this);

        nodeGroup.classed('hover', true); // add hover class to node group

        nodeGroup
          .select('rect')
          .style('stroke', '#000')
          .style('stroke-width', 2);

        nodeGroup
          .select('circle')
          .style('stroke', '#000')
          .style('stroke-width', 2);

        const tooltipData: TooltipData = {
          label: splitText(d.data.label).join(' '),
          description: d.data.description,
        };
        showTooltip(tooltipRef.current, event, tooltipData);
      })
      .on('mousemove', function () {
        const event = d3.event as MouseEvent;
        moveTooltip(tooltipRef.current, event);
      })
      .on('mouseleave', function (d) {
        const nodeGroup = d3.select(this);
        nodeGroup.classed('hover', false); // remove hover class from node group
        if (
          !selectedNode ||
          d.data.uniqueId !== (selectedNode as any).uniqueId
        ) {
          nodeGroup
            .select('rect')
            .style('stroke', '#999')
            .style('stroke-width', 1);

          nodeGroup
            .select('circle')
            .style('stroke', '#999')
            .style('stroke-width', 1);
        }

        hideTooltip(tooltipRef.current);
      });

    // Add circles for nodes
    nodeGroups
      .append('circle')
      .attr('r', 4.5)
      .attr('fill', (d) => {
        // Check if this node should have a group color
        const isLeafNode = !d.children;
        const isGroupVariable =
          isLeafNode && groupVars.some((g) => g.items.includes(d.data.id));

        if (isGroupVariable) {
          // Apply group color directly during rendering
          return (
            groupVars.find((g) => g.items.includes(d.data.id))?.color ??
            '#ffffff'
          );
        }

        // Use hierarchical colors based on depth level, white for leaf nodes
        return d.children ? color(d.depth) ?? '#ffffff' : '#ffffff';
      })
      .attr('stroke', '#999')
      .attr('stroke-width', 1);

    // Add labels
    nodeGroups.each(function (d) {
      const nodeGroup = d3.select(this);
      const isLeaf = !d.children;

      // Check if this node should have a group color
      const isGroupVariable =
        isLeaf && groupVars.some((g) => g.items.includes(d.data.id));

      // Use hierarchical colors based on depth level, white for leaf nodes
      // But apply group colors directly for group variables
      const bgColor = isGroupVariable
        ? groupVars.find((g) => g.items.includes(d.data.id))?.color ?? '#ffffff'
        : d.children
        ? color(d.depth) ?? '#ffffff'
        : '#ffffff';

      // Create text element
      const text = nodeGroup
        .append('text')
        .attr('dy', '.31em')
        .style('font-size', '12px')
        .style(
          'fill',
          (d.depth === 3 || d.depth === 4) && d.children ? 'white' : '#2c3e50'
        )
        .style('text-anchor', isLeaf ? 'start' : 'end')
        .text(splitText(d.data.label).join(' '));

      // Add background rectangle
      requestAnimationFrame(() => {
        const textNode = text.node();
        if (textNode) {
          const bbox = textNode.getBBox();
          const padding = 4;
          const xOffset = isLeaf ? 6 : -6 - bbox.width;

          // Position text after getting bbox
          text.attr('transform', `translate(${isLeaf ? 6 : -6}, 0)`);

          // Add background rectangle
          const rect = nodeGroup
            .insert('rect', 'text')
            .attr('x', xOffset - padding)
            .attr('y', bbox.y - padding)
            .attr('width', bbox.width + padding * 2)
            .attr('height', bbox.height + padding * 2)
            .style('fill', bgColor)
            .attr('stroke', '#999')
            .attr('stroke-width', 1)
            .attr('rx', 4);

          // highlight selected node's rectangle bg if any
          if (
            selectedNode &&
            (selectedNode as any).uniqueId === d.data.uniqueId
          ) {
            rect.attr('stroke', '#000').attr('stroke-width', 2);
          }
        }
      });
    });

    // Highlight selected node's circle if any
    if (selectedNode) {
      const selectedNodeGroup = nodeGroups.filter(
        (d) => (selectedNode as any).uniqueId === d.data.uniqueId
      );
      selectedNodeGroup
        .select('circle')
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('r', 6);
    }
  }, [layout, selectedNode, handleSelectNode, groupVars]);

  // Automatically select root node when layout changes (e.g., when switching domains)
  useEffect(() => {
    // Only auto-select root if no node is currently selected
    // This preserves user selection when switching between visualization types
    if (!selectedNode) {
      const rootWithUniqueId = layout as any;
      rootWithUniqueId.uniqueId = layout.data.uniqueId;
      handleSelectNode(rootWithUniqueId);
    }
  }, [layout, handleSelectNode, selectedNode]);

  // Create tooltip once on component mount
  useEffect(() => {
    tooltipRef.current = createTooltip('dendrogram-tooltip');

    // Cleanup on unmount
    return () => {
      cleanupTooltip(tooltipRef.current);
    };
  }, []); // Empty dependency array = runs only once

  // Reset first render flag when domain changes
  useEffect(() => {
    const currentDomainId = layout.data.id;
    if (previousDomainId.current === undefined) {
      previousDomainId.current = currentDomainId;
    }
    if (previousDomainId.current !== currentDomainId) {
      isFirstRender.current = true; // Reset for new domain
      previousDomainId.current = currentDomainId;
    }
  }, [layout.data.id]);

  // Handle search-to-node selection
  useEffect(() => {
    if (zoomNode) {
      zoomToNode(zoomNode);
      zoomNodeVar(undefined);
    }
  }, [zoomNode, zoomToNode]);

  return (
    <div className="dendrogram-viewport">
      <svg id="dendrogram-svg" ref={svgRef} />
    </div>
  );
};

export default D3DendrogramLayer;
