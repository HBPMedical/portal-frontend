/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useReactiveVar } from '@apollo/client';
import * as d3 from 'd3';
import React, { useCallback, useEffect, useRef } from 'react';
import { zoomNodeVar } from '../API/GraphQL/cache';
import { HierarchyCircularNode } from '../utils';
import './CirclePack.css';
import {
  cleanupTooltip,
  createTooltip,
  hideTooltip,
  moveTooltip,
  showTooltip,
  TooltipData,
} from './tooltipUtils';

const diameter = 800;
const padding = 1.5;

type IView = [number, number, number];

export type GroupVars = {
  name: string;
  items: string[];
  color: string;
};

const depth = (n: HierarchyCircularNode): number =>
  n.children ? 1 + (d3.max<number>(n.children.map(depth)) || 0) : 1;

export interface Props {
  selectedNode: HierarchyCircularNode | undefined;
  layout: HierarchyCircularNode;
  handleSelectNode: (node: HierarchyCircularNode) => void;
  groupVars: GroupVars[];
}

const maxSigns = 13;

// split text if it contains whitespaces or underscores (_)
// input : "Sleeping with or checking on attachment figures at night in the past 4 weeks"
// ouput : ['Sleeping', 'with or', 'checking on', 'attachment', 'figures at', 'night in the', 'past 4 weeks']
const splitText = (text: string): string[] => {
  if (!text) return [];
  const bits = text.split(/\s|_/);

  return bits.reduce(
    (accumulator, value) => {
      const lastItem = accumulator.pop() ?? '';
      const merge = [lastItem, value].join(' ').trim();
      return merge.length >= maxSigns
        ? [...accumulator, lastItem, value]
        : [...accumulator, merge];
    },
    ['']
  );
};

const createLabelGroup = (
  group: d3.Selection<SVGGElement, any, any, any>,
  d: any,
  colorCallback: (depth: number) => string | undefined
) => {
  // Remove any existing elements
  group.selectAll('*').remove();

  // Create text element
  const text = group
    .append('text')
    .attr('class', 'label')
    .style('font-weight', 'bold')
    .style('font-size', '14px')
    .style('fill', (d) =>
      (d.depth === 3 || d.depth === 4) && d.children ? 'white' : '#2c3e50'
    );

  // Add tspans for text wrapping
  text
    .selectAll('tspan')
    //.data((d) => (d.depth === 1 ? [d.data.label] : splitText(d.data.label)))
    .data(splitText(d.data.label))
    .join('tspan')
    .attr('x', 0)
    .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    .text((d) => d);

  // Use requestAnimationFrame to ensure text is rendered before calculating background
  requestAnimationFrame(() => {
    const textNode = text.node();
    if (textNode) {
      const bbox = textNode.getBBox();
      const padding = 4;

      // Add background rectangle
      group
        .insert('rect', 'text')
        .attr('class', 'label-bg')
        .attr('x', bbox.x - padding)
        .attr('y', bbox.y - padding)
        .attr('width', bbox.width + padding * 2)
        .attr('height', bbox.height + padding * 2)
        .attr('rx', 4)
        .style(
          'fill',
          d.children ? colorCallback(d.depth) ?? 'white' : 'white'
        );
    }
  });
};

const D3CirclePackLayer = ({ layout, ...props }: Props): JSX.Element => {
  const svgRef = useRef(null);
  const view = useRef<IView>([diameter / 2, diameter / 2, diameter]);
  const focus = useRef(layout);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // const tooltipRef = useRef<d3.Selection<
  //   HTMLDivElement,
  //   unknown,
  //   HTMLElement,
  //   any
  // > | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { selectedNode, groupVars } = props;
  const zoomNode = useReactiveVar(zoomNodeVar);

  const color = d3
    .scaleLinear<string, string>()
    .domain([0, depth(layout)])
    .range(['hsl(190,80%,80%)', 'hsl(228,80%,40%)'])
    .interpolate(d3.interpolateHcl);

  const zoomTo = (v: IView) => {
    const k = diameter / v[2];
    view.current = v;

    const svg = d3.select(svgRef.current);
    const nodeContainers = svg.selectAll('g.node-container');
    const labels = svg.selectAll('g.label-group');

    nodeContainers.attr(
      'transform',
      (d: any) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    );
    nodeContainers.select('circle').attr('r', (d: any) => d.r * k);

    labels.attr(
      'transform',
      (d: any) => `translate(${0},${d.children ? -d.r * k * 1 : 0})`
    );
  };

  const zoom = useCallback(
    (circleNode: HierarchyCircularNode | undefined): void => {
      if (!circleNode) {
        return;
      }

      focus.current = circleNode;

      const zoomFactor = circleNode.children ? 2 : 3;
      const targetView: IView = [
        circleNode.x,
        circleNode.y,
        circleNode.r * zoomFactor + padding,
      ];
      const transition = d3
        .transition<d3.BaseType>()
        .duration(d3.event?.altKey ? 7500 : 750)
        .tween('zoom', () => {
          const i = d3.interpolateZoom(view.current, targetView);
          return (t: number) => zoomTo(i(t));
        });

      const shouldDisplay = (
        dd: HierarchyCircularNode,
        ffocus: HierarchyCircularNode
      ): boolean => dd.parent === ffocus || !ffocus.children;

      const svg = d3.select(svgRef.current);
      const labelGroup = svg.selectAll('g.label-group');

      labelGroup
        .filter(function (dd: any) {
          const el = this as HTMLElement;
          return (
            shouldDisplay(dd, focus.current) ||
            (el && el.style && el.style.display === 'inline')
          );
        })
        .transition(transition as any)
        .style('fill-opacity', (dd: any) =>
          shouldDisplay(dd, focus.current) ? 1 : 0
        )
        .style('display', (dd: any) =>
          shouldDisplay(dd, focus.current) ? 'inline' : 'none'
        )
        .on('start', function (dd: any) {
          const el = this as SVGGElement;
          if (shouldDisplay(dd, focus.current)) {
            el.style.display = 'inline';
            createLabelGroup(
              d3.select<SVGGElement, any>(el),
              dd,
              colorCallback
            );
          }
        });
    },
    [color]
  );

  const colorCallback = useCallback(color, [layout]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const circle = svg.selectAll<any, HierarchyCircularNode>('circle');
    circle
      .style('fill-opacity', '1')
      .filter(
        (d) =>
          ![...(groupVars.flatMap((g) => g.items) || [])].includes(d.data.id)
      )
      .style('fill', (d) =>
        d.children ? colorCallback(d.depth) ?? 'white' : 'white'
      );

    if (selectedNode && selectedNode !== layout) {
      circle
        .filter((d) => d.data.id === selectedNode.data.id)
        .transition()
        .duration(80)
        .style('fill-opacity', '0.8');
    }

    groupVars.forEach((g) => {
      circle
        .filter((d) => g.items.includes(d.data.id))
        .transition()
        .duration(250)
        .style('fill', g.color ?? 'white');
    });
  }, [colorCallback, selectedNode, layout, groupVars]);

  const zoomCallback = useCallback(zoom, []);
  const selectNodeCallback = useCallback(props.handleSelectNode, []);

  useEffect(() => {
    d3.select(svgRef.current).selectAll('g').remove();

    // Create tooltip
    // tooltipRef.current = d3
    //   .select('body')
    //   .append('div')
    //   .attr('class', 'circle-pack-tooltip')
    //   .style('position', 'absolute')
    //   .style('padding', '6px 10px')
    //   .style('background', 'rgba(255, 255, 255, 0.9)')
    //   .style('border', '1px solid #ccc')
    //   .style('border-radius', '4px')
    //   .style('pointer-events', 'none')
    //   .style('font', '12px sans-serif')
    //   .style('color', '#222')
    //   .style('box-shadow', '0 2px 6px rgba(0,0,0,0.15)')
    //   .style('visibility', 'hidden')
    //   .style('z-index', '1000')
    //   .style('max-width', '300px')
    //   .style('word-wrap', 'break-word')
    //   .style('white-space', 'normal');
    tooltipRef.current = createTooltip('circle-pack-tooltip');

    const svg = d3
      .select(svgRef.current)
      .attr('width', diameter)
      .attr('height', diameter)
      .attr(
        'viewBox',
        `-${diameter / 2} -${diameter / 2} ${diameter} ${diameter}`
      )
      .style('margin', '0')
      .style('width', 'calc(100%)')
      .style('height', 'auto')
      .style('cursor', 'pointer')
      .style('border-radius', '4px')
      .on('click', () => {
        d3.event.stopPropagation();
        zoomCallback(layout);
      });

    // Create a group for circles
    const circlesGroup = svg.append('g');

    // Create a group for labels (will be rendered on top)
    const labelsGroup = svg.append('g');

    // Add circles to the circles group
    const nodeCircles = circlesGroup
      .selectAll('g.node-container')
      .data(layout.descendants())
      .join('g')
      .attr('class', 'node-container')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .attr('data-node-id', (d) => d.data.id); // Add node ID for reference

    nodeCircles
      .append('circle')
      .attr('class', (d) => `node ${d && d.children ? '' : 'node--leaf'}`)
      .attr('r', (d) => d.r)
      .attr('fill', (d) =>
        d.children ? colorCallback(d.depth) ?? 'white' : 'white'
      )
      .on(
        'mouseenter',
        function (this: SVGCircleElement, d: HierarchyCircularNode) {
          const event = d3.event as MouseEvent;
          // Find and stroke the corresponding label background
          const nodeId = d3
            .select<SVGGElement, any>(this.parentNode as SVGGElement)
            .attr('data-node-id');
          labelsGroup
            .select(`g.node-container[data-node-id="${nodeId}"] .label-bg`)
            .style('stroke', '#000');

          //showTooltip(event, d);
          const tooltipData: TooltipData = {
            label: d.data.label,
            description: d.data.description,
          };
          showTooltip(tooltipRef.current, event, tooltipData);
        }
      )
      .on('mousemove', function (this: SVGCircleElement) {
        const event = d3.event as MouseEvent;
        moveTooltip(tooltipRef.current, event);
      })
      .on('mouseleave', function (this: SVGCircleElement) {
        // Remove stroke from the corresponding label background
        // const nodeId = d3
        //   .select<SVGGElement, any>(this.parentNode as SVGGElement)
        //   .attr('data-node-id');
        // labelsGroup
        //   .select(`g.node-container[data-node-id="${nodeId}"] .label-bg`)
        //   .style('stroke', 'none');

        hideTooltip(tooltipRef.current);
      })
      .on('click', function (this: SVGCircleElement, d: HierarchyCircularNode) {
        const event = d3.event as MouseEvent;
        selectNodeCallback(d);
        event.stopPropagation();
        // Don't zoom on single variable selection
        if (!d.children) {
          return;
        }
        return focus.current !== d && zoomCallback(d);
      });

    // Add labels to the labels group
    const nodeLabels = labelsGroup
      .selectAll('g.node-container')
      .data(layout.descendants())
      .join('g')
      .attr('class', 'node-container')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .attr('data-node-id', (d) => d.data.id); // Add node ID for reference

    nodeLabels
      .append('g')
      .attr('class', 'label-group')
      .style('fill-opacity', (d) => (d.parent === layout ? 1 : 0))
      .style('display', (d) => (d.parent === layout ? 'inline' : 'none'))
      .each(function (d: any) {
        if (d.parent === layout) {
          const el = this as SVGGElement;
          createLabelGroup(d3.select<SVGGElement, any>(el), d, colorCallback);
        }
      });

    selectNodeCallback(layout);
    zoomTo([layout.x, layout.y, layout.r * 2]);
  }, [layout, colorCallback, selectNodeCallback, zoomCallback]);

  const zoomToNode = useCallback(
    (id: string) => {
      const node = layout.descendants().find((n) => n.data.id === id);

      if (node) {
        zoom(node);
        selectNodeCallback(node);
      }
    },
    [layout, selectNodeCallback, zoom]
  );

  useEffect(() => {
    if (zoomNode) {
      zoomToNode(zoomNode);
      zoomNodeVar(undefined);
    }
  }, [zoomNode, zoomToNode]);

  // Add tooltip helper functions
  // const showTooltip = (event: MouseEvent, d: HierarchyCircularNode) => {
  //   if (!tooltipRef.current) return;

  //   // Only show tooltip if the label is NOT displayed
  //   const isLabelDisplayed =
  //     d.parent === focus.current || !focus.current.children;

  //   if (!isLabelDisplayed) {
  //     // Clear any existing hide timeout
  //     if (tooltipTimeoutRef.current) {
  //       clearTimeout(tooltipTimeoutRef.current);
  //       tooltipTimeoutRef.current = null;
  //     }

  //     tooltipRef.current
  //       .style('visibility', 'visible')
  //       .html(
  //         `
  //           <strong>Name:</strong> ${d.data.label}${
  //           d.data.description
  //             ? `<br><strong>Description:</strong> ${d.data.description}`
  //             : ''
  //         }
  //         `
  //       )
  //       .style('left', `${event.pageX + 10}px`)
  //       .style('top', `${event.pageY + 10}px`);
  //   } else {
  //     hideTooltip();
  //   }
  // };

  // const hideTooltip = () => {
  //   if (!tooltipRef.current) return;

  //   // Set a timeout to hide the tooltip after 200ms
  //   tooltipTimeoutRef.current = setTimeout(() => {
  //     tooltipRef.current?.style('visibility', 'hidden');
  //     tooltipTimeoutRef.current = null;
  //   }, 200);
  // };

  // const moveTooltip = (event: MouseEvent) => {
  //   if (!tooltipRef.current) return;

  //   // Clear any existing hide timeout when moving
  //   if (tooltipTimeoutRef.current) {
  //     clearTimeout(tooltipTimeoutRef.current);
  //     tooltipTimeoutRef.current = null;
  //   }

  //   tooltipRef.current
  //     .style('left', `${event.pageX + 10}px`)
  //     .style('top', `${event.pageY + 10}px`);
  // };

  // Update cleanup effect
  useEffect(() => {
    return () => {
      cleanupTooltip(tooltipRef.current);
    };
  }, []);

  return <svg id="variables-select" ref={svgRef} />;
};

export default D3CirclePackLayer;
