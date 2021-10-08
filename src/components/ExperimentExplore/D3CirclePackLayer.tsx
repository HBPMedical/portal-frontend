import './CirclePack.css';

import * as d3 from 'd3';
import React, { useCallback, useEffect, useRef } from 'react';

import { APICore, APIMining, APIModel, APIExperiment } from '../API';
import { D3Model, HierarchyCircularNode, ModelResponse } from '../API/Model';
import { ModelType } from './Container';
import Explore from './Explore';

const diameter = 800;
const padding = 1.5;

type IView = [number, number, number];

const depth = (n: HierarchyCircularNode): number =>
  n.children ? 1 + (d3.max<number>(n.children.map(depth)) || 0) : 1;

export interface Props {
  apiCore: APICore;
  apiModel: APIModel;
  apiMining: APIMining;
  apiExperiment: APIExperiment;
  selectedNode: HierarchyCircularNode | undefined;
  layout: HierarchyCircularNode;
  histograms?: any;
  d3Model: D3Model;
  handleSelectPathology: (code: string) => void;
  handleSelectNode: (node: HierarchyCircularNode) => void;
  handleUpdateD3Model: (type?: ModelType, node?: HierarchyCircularNode) => void;
  handleSelectModel: (d3Model?: ModelResponse) => void;
  handleGoToAnalysis: Function;
  setFormulaString: (f: string) => void;
}

const maxSigns = 13;
const extractWord = (bit: string) => (bit !== undefined ? bit : '');

// "Sleeping with or checking on attachment figures at night in the past 4 weeks"
// very basic text splitting, test for 3, 2, 1 words
const splitText = (text: string): string[] => {
  const acc: string[] = [];
  let currentBitIndex = 0;
  const bits = text.split(/(?=[A-Z][a-z])|[\s+]|_/g); // ["Sleeping", "with", "or", "checking", "on" ...]

  bits.forEach((curr, i) => {
    if (i === currentBitIndex) {
      const test1word = extractWord(bits[currentBitIndex]);
      const test2word = [
        test1word,
        extractWord(bits[currentBitIndex + 1])
      ].join(' ');
      const test3word = [
        test2word,
        extractWord(bits[currentBitIndex + 2])
      ].join(' ');

      if (test3word.length < maxSigns) {
        currentBitIndex = currentBitIndex + 3;
        acc.push(test3word);
      } else if (test2word.length < maxSigns) {
        currentBitIndex = currentBitIndex + 2;
        acc.push(test2word);
      } else {
        currentBitIndex = currentBitIndex + 1;
        acc.push(test1word);
      }
    }
  });

  return acc;
};

export default ({ layout, ...props }: Props): JSX.Element => {
  const svgRef = useRef(null);
  const view = useRef<IView>([diameter / 2, diameter / 2, diameter]);
  const focus = useRef(layout);
  const { d3Model, selectedNode } = props;

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

  const zoom = (circleNode: HierarchyCircularNode | undefined) => {
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
      .duration(d3.event.altKey ? 7500 : 750)
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
  };

  const colorCallback = useCallback(color, [layout]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const circle = svg.selectAll('circle');
    circle
      .style('fill-opacity', '1')
      .filter(
        (d: any) =>
          ![
            ...(d3Model.variables || []),
            ...(d3Model.covariables || []),
            ...(d3Model.filters || [])
          ].includes(d)
      )
      .style('fill', (d: any) =>
        d.children ? colorCallback(d.depth) ?? 'white' : 'white'
      );

    if (selectedNode && selectedNode !== layout) {
      circle
        .filter((d: any) => d.data.code === selectedNode.data.code)
        .transition()
        .duration(80)
        .style('fill-opacity', '0.8');
    }

    if (d3Model.filters && d3Model.filters.length > 0) {
      circle
        .filter(
          (d: any) =>
            d3Model.filters !== undefined && d3Model.filters.includes(d)
        )
        .transition()
        .duration(250)
        .style('fill', 'slategray');
    }
    if (d3Model.variables) {
      circle
        .filter(
          (d: any) =>
            d3Model.variables !== undefined && d3Model.variables.includes(d)
        )
        .transition()
        .duration(250)
        .style('fill', '#5cb85c');
    }

    if (d3Model.covariables && d3Model.covariables.length > 0) {
      circle
        .filter(
          (d: any) =>
            d3Model.covariables !== undefined && d3Model.covariables.includes(d)
        )
        .transition()
        .duration(250)
        .style('fill', '#f0ad4e');
    }
  }, [d3Model, colorCallback, selectedNode, layout]);

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
      .selectAll('tspan')
      .data(d => splitText(d.data.label))
      .join('tspan')
      .attr('x', 0)
      .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d);

    selectNodeCallback(layout);
    zoomTo([layout.x, layout.y, layout.r * 2]);
  }, [layout, colorCallback, selectNodeCallback, zoomCallback]);

  return (
    <Explore layout={layout} zoom={zoom} {...props}>
      <svg ref={svgRef} />
    </Explore>
  );
};
