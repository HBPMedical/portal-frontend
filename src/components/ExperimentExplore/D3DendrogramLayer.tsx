import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { HierarchyCircularNode } from '../utils';
import { NodeData } from './d3Hierarchy';

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

// viewport container that lets the user scroll
const ViewportContainer = styled.div`
  width: 100%;
  height: 830px;
  overflow: hidden;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const SVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
`;

const diameter = 800;

const depth = (n: HierarchyCircularNode): number =>
  n.children ? 1 + (d3.max<number>(n.children.map(depth)) || 0) : 1;

const splitText = (text: string): string[] => {
  if (!text) return [];
  const bits = text.split(/\s|_/);

  return bits;
};

const isColorDark = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};

// Helper function to convert tree node to circle node format
const convertToCircleNode = (
  treeNode: d3.HierarchyPointNode<NodeData>
): HierarchyCircularNode => {
  // Create a new hierarchy from the node's data
  const newHierarchy = d3.hierarchy(treeNode.data);

  // Apply circle packing layout
  const packLayout = d3
    .pack<NodeData>()
    .size([diameter, diameter])
    .padding((d) => {
      if (d.depth === 0) return 4;
      return 3;
    });

  const packedLayout = packLayout(newHierarchy);

  // Copy over the x, y coordinates from the tree layout
  const copyCoordinates = (
    source: d3.HierarchyPointNode<NodeData>,
    target: d3.HierarchyNode<NodeData> & { x: number; y: number; r: number }
  ) => {
    target.x = source.x || 0;
    target.y = source.y || 0;

    if (source.children && target.children) {
      source.children.forEach((child, i) => {
        if (target.children && target.children[i]) {
          copyCoordinates(
            child as d3.HierarchyPointNode<NodeData>,
            target.children[i] as d3.HierarchyNode<NodeData> & {
              x: number;
              y: number;
              r: number;
            }
          );
        }
      });
    }
  };

  copyCoordinates(treeNode, packedLayout);

  return packedLayout as unknown as HierarchyCircularNode;
};

const D3DendrogramLayer = ({
  layout,
  selectedNode,
  groupVars,
  handleSelectNode,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const currentTransformRef = useRef<d3.ZoomTransform | null>(null);

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
    svg.attr('width', width).attr('height', height);

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
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    // Add circles for nodes
    nodeGroups
      .append('circle')
      .attr('r', 4.5)
      .attr('fill', (d) => {
        // Use hierarchical colors based on depth level, white for leaf nodes
        return d.children ? color(d.depth) ?? '#ffffff' : '#ffffff';
      })
      .attr('stroke', '#999')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .each(function (d) {
        d3.select(this).on('click', () => {
          const circleNode = convertToCircleNode(d);
          handleSelectNode(circleNode);
        });
      });

    // Add labels
    nodeGroups.each(function (d) {
      const nodeGroup = d3.select(this);
      const isLeaf = !d.children;
      // Use hierarchical colors based on depth level, white for leaf nodes
      const bgColor = d.children ? color(d.depth) ?? '#ffffff' : '#ffffff';

      // Create text element
      const text = nodeGroup
        .append('text')
        .attr('dy', '.31em')
        .style('font-size', d.children ? '16px' : '12px')
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
          nodeGroup
            .insert('rect', 'text')
            .attr('class', 'label-bg')
            .attr('x', xOffset - padding)
            .attr('y', bbox.y - padding)
            .attr('width', bbox.width + padding * 2)
            .attr('height', bbox.height + padding * 2)
            .attr('rx', 4)
            .style('fill', bgColor)
            .style('stroke', '#ccc')
            .style('stroke-width', 1);
        }
      });
    });

    // Highlight selected node if any
    if (selectedNode) {
      nodeGroups
        .filter((d) => d.data.id === selectedNode.data.id)
        .select('circle')
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('r', 6);
    }
  }, [layout, selectedNode, groupVars, handleSelectNode]);

  // Automatically select root node when layout changes (e.g., when switching domains)
  useEffect(() => {
    // Only auto-select root if no node is currently selected
    // This preserves user selection when switching between visualization types
    if (!selectedNode) {
      handleSelectNode(layout);
    }
  }, [layout, handleSelectNode, selectedNode]);

  return (
    <ViewportContainer>
      <SVG ref={svgRef} />
    </ViewportContainer>
  );
};

export default D3DendrogramLayer;
