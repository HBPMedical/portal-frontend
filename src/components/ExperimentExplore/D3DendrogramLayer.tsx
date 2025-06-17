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

const SVG = styled.svg`
  width: 100%;
  height: 1000px;
  min-height: 800px;
`;

const diameter = 800;

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

  useEffect(() => {
    if (!svgRef.current || !layout) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = Math.max(svgRef.current.clientHeight, 800);

    // Clear previous content
    svg.selectAll('*').remove();

    // Create tree layout with increased height
    const treeLayout = d3
      .tree<NodeData>()
      .size([height - 60, width - 200])
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2.5));

    // Generate tree layout data
    const root = d3.hierarchy(layout.data);
    const treeData = treeLayout(root);

    // Create a group for the entire visualization with adjusted padding
    const g = svg.append('g').attr('transform', 'translate(100, 30)');

    // Draw links
    const linkGenerator = d3
      .linkHorizontal<
        d3.HierarchyPointLink<NodeData>,
        d3.HierarchyPointNode<NodeData>
      >()
      .x((d) => d.y)
      .y((d) => d.x);

    g.selectAll('.link')
      .data(treeData.links())
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1.5)
      .attr('d', linkGenerator);

    // Create node groups with explicit typing
    const nodes = g
      .selectAll<SVGGElement, d3.HierarchyPointNode<NodeData>>('.node')
      .data(treeData.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    // Add circles for nodes
    nodes
      .append('circle')
      .attr('r', 4.5)
      .attr('fill', (d) => {
        // Match color with selected variables
        const matchingGroup = groupVars.find((group) =>
          group.items.includes(d.data.id)
        );
        return matchingGroup ? matchingGroup.color : '#fff';
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
    nodes
      .append('text')
      .attr('dy', '.31em')
      .attr('x', (d) => (d.children ? -6 : 6))
      .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .style('font-size', '12px')
      .text((d) => d.data.id)
      .style('fill', '#333');

    // Highlight selected node if any
    if (selectedNode) {
      nodes
        .filter((d) => d.data.id === selectedNode.data.id)
        .select('circle')
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('r', 6);
    }
  }, [layout, selectedNode, groupVars, handleSelectNode]);

  return <SVG ref={svgRef} />;
};

export default D3DendrogramLayer;
