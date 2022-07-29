import { useReactiveVar } from '@apollo/client';
import * as d3 from 'd3';
import React, { useCallback, useEffect, useRef } from 'react';
import { zoomNodeVar } from '../API/GraphQL/cache';
import { HierarchyCircularNode } from '../utils';
import './CirclePack.css';

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

// input : "Sleeping with or checking on attachment figures at night in the past 4 weeks"
// ouput : ['Sleeping', 'with or', 'checking on', 'attachment', 'figures at', 'night in the', 'past 4 weeks']
const splitText = (text: string): string[] => {
  if (!text) return [];
  const bits = text.split(/\s/);

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

export default ({ layout, ...props }: Props): JSX.Element => {
  const svgRef = useRef(null);
  const view = useRef<IView>([diameter / 2, diameter / 2, diameter]);
  const focus = useRef(layout);
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
    const node = svg.selectAll('circle');
    const label = svg.selectAll('text');

    label.attr(
      'transform',
      (d: any) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    );
    node.attr(
      'transform',
      (d: any) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    );
    node.attr('r', (d: any) => d.r * k);
  };

  const zoom = useCallback(
    (circleNode: HierarchyCircularNode | undefined): void => {
      if (!circleNode) {
        return;
      }

      focus.current = circleNode;

      // reduce zoom if it's a leaf node
      const zoomFactor = circleNode.children ? 2 : 3;
      const targetView: IView = [
        circleNode.x,
        circleNode.y,
        circleNode.r * zoomFactor + padding
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
      ): boolean => dd.parent === ffocus || !ffocus.children; // || !dd.children;

      const svg = d3.select(svgRef.current);
      const text = svg.selectAll('text');

      text
        .filter(function(dd: any) {
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
        .on('start', function(dd: any) {
          const el = this as HTMLElement;
          if (shouldDisplay(dd, focus.current)) {
            el.style.display = 'inline';
            shouldDisplay(dd, focus.current);
          }
        });
    },
    []
  );

  const colorCallback = useCallback(color, [layout]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const circle = svg.selectAll<any, HierarchyCircularNode>('circle');
    circle
      .style('fill-opacity', '1')
      .filter(
        d => ![...(groupVars.flatMap(g => g.items) || [])].includes(d.data.id)
      )
      .style('fill', d =>
        d.children ? colorCallback(d.depth) ?? 'white' : 'white'
      );

    if (selectedNode && selectedNode !== layout) {
      circle
        .filter(d => d.data.id === selectedNode.data.id)
        .transition()
        .duration(80)
        .style('fill-opacity', '0.8');
    }

    groupVars.forEach(g => {
      circle
        .filter(d => g.items.includes(d.data.id))
        .transition()
        .duration(250)
        .style('fill', g.color ?? 'white');
    });
  }, [colorCallback, selectedNode, layout, groupVars]);

  const zoomCallback = useCallback(zoom, []);
  const selectNodeCallback = useCallback(props.handleSelectNode, []);

  useEffect(() => {
    d3.select(svgRef.current)
      .selectAll('g')
      .remove();

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

    svg
      .append('g')
      .selectAll('circle')
      .data(layout.descendants())
      .join('circle')
      .attr('class', 'node')
      .attr('fill', d =>
        d.children ? colorCallback(d.depth) ?? 'white' : 'white'
      )
      .on('click', d => {
        selectNodeCallback(d);
        d3.event.stopPropagation();
        // Don't zoom on single variable selection
        if (!d.children) {
          return;
        }

        return focus.current !== d && zoomCallback(d);
      });

    svg
      .selectAll('circle')
      .data(layout.descendants())
      .append('title')
      .text(
        d => `${d.data.label}\n${d.data.description ? d.data.description : ''}`
      );

    svg
      .append('g')
      .selectAll('text')
      .data(layout.descendants())
      .join('text')
      .attr('class', 'label')
      .style('fill-opacity', d => (d.parent === layout ? 1 : 0))
      .style('display', d => (d.parent === layout ? 'inline' : 'none'))
      .style('font-size', (d: any) => {
        const size = 12 - Math.log(d.data.label.length) + Math.log(d.r);
        return Math.round(size) + 'px';
      })
      .selectAll('tspan')
      .data(d => splitText(d.data.label))
      .join('tspan')
      .attr('x', 0)
      .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d);

    selectNodeCallback(layout);
    zoomTo([layout.x, layout.y, layout.r * 2]);
  }, [layout, colorCallback, selectNodeCallback, zoomCallback]);

  const zoomToNode = useCallback(
    (id: string) => {
      const node = layout.descendants().find(n => n.data.id === id);

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

  return <svg ref={svgRef} />;
};
