import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BoxPlotData } from '../../../utils/boxPlotUtils';

const Container = styled.div`
  align-self: center;
  display: flex;
  margin-bottom: 30px;
`;

interface BoxPlotProps {
  data: BoxPlotData;
  title: string;
}

const BoxPlot = ({ data, title }: BoxPlotProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.datasets.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create tooltip
    if (tooltipRef.current) {
      tooltipRef.current.remove();
    }
    tooltipRef.current = d3
      .select('body')
      .append('div')
      .attr('class', 'boxplot-tooltip')
      .style('position', 'fixed')
      .style('padding', '8px 12px')
      .style('background', 'rgba(255, 255, 255, 0.95)')
      .style('color', 'black')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font', '12px sans-serif')
      .style('box-shadow', '0 2px 6px rgba(0,0,0,0.15)')
      .style('visibility', 'hidden')
      .style('z-index', '1000')
      .style('max-width', '300px')
      .style('word-wrap', 'break-word')
      .style('white-space', 'normal')
      .node() as HTMLDivElement;

    // Set up dimensions
    const margin = { top: 60, right: 40, bottom: 80, left: 60 };
    const height = 400 - margin.top - margin.bottom;

    // Prepare data first
    const datasetNames = data.datasets.map((d) => d.name);
    const allValues = data.datasets.flatMap((d) => [d.min, d.max]);
    const yMin = Math.min(...allValues);
    const yMax = Math.max(...allValues);
    const yRange = yMax - yMin;

    // Calculate responsive width based on number of datasets
    const baseWidthPerDataset = 150; // pixels per dataset
    const minWidth = 600;
    const maxWidth = 1200;
    const responsiveWidth = Math.max(
      minWidth,
      Math.min(maxWidth, datasetNames.length * baseWidthPerDataset)
    );

    const width = responsiveWidth - margin.left - margin.right;

    // Create SVG with responsive width
    const svg = d3
      .select(svgRef.current)
      .attr('width', responsiveWidth + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add title
    svg
      .append('text')
      .attr('x', -50)
      .attr('y', -40)
      .attr('text-anchor', 'start')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Selected dataset(s) for ' + title);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(datasetNames)
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([yMin - yRange * 0.1, yMax + yRange * 0.1])
      .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g').call(yAxis);

    // Add axis labels
    svg
      .append('text')
      .attr('x', width + 8)
      .attr('y', height + 7)
      .attr('text-anchor', 'start')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#495057')
      .text('Datasets');

    svg
      .append('text')
      .attr('x', 0) // Position at right side
      .attr('y', -15) // Position at top
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#495057')
      .text(title);

    // Tooltip functions
    const showTooltip = (event: any, dataset: any) => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      tooltip.innerHTML = `
        <strong>${dataset.name}</strong><br/>
        Min: ${dataset.min.toFixed(3)}<br/>
        Q1: ${dataset.q1.toFixed(3)}<br/>
        Median: ${dataset.median.toFixed(3)}<br/>
        Q3: ${dataset.q3.toFixed(3)}<br/>
        Max: ${dataset.max.toFixed(3)}<br/>
        Mean: ${dataset.mean.toFixed(3)}
      `;

      tooltip.style.visibility = 'visible';
    };

    const moveTooltip = (event: any) => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY - 10}px`;
    };

    const hideTooltip = () => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      tooltip.style.visibility = 'hidden';
    };

    // Helper function to safely get y position
    const getY = (value: number): number => {
      const y = yScale(value);
      return y !== undefined ? y : 0;
    };

    // Draw box plots
    data.datasets.forEach((dataset, index) => {
      const x = xScale(dataset.name);
      const bandwidth = xScale.bandwidth();

      if (x === undefined || bandwidth === undefined) return;

      const boxWidth = bandwidth * 0.8;
      const boxX = x + (bandwidth - boxWidth) / 2;

      // Draw whiskers
      const whiskerWidth = boxWidth * 0.1;

      // Lower whisker (min to Q1)
      svg
        .append('line')
        .attr('x1', boxX + boxWidth / 2)
        .attr('x2', boxX + boxWidth / 2)
        .attr('y1', getY(dataset.min))
        .attr('y2', getY(dataset.q1))
        .attr('stroke', '#2b33e9')
        .attr('stroke-width', 2);

      // Upper whisker (Q3 to max)
      svg
        .append('line')
        .attr('x1', boxX + boxWidth / 2)
        .attr('x2', boxX + boxWidth / 2)
        .attr('y1', getY(dataset.q3))
        .attr('y2', getY(dataset.max))
        .attr('stroke', '#2b33e9')
        .attr('stroke-width', 2);

      // Whisker caps
      svg
        .append('line')
        .attr('x1', boxX + boxWidth / 2 - whiskerWidth / 2)
        .attr('x2', boxX + boxWidth / 2 + whiskerWidth / 2)
        .attr('y1', getY(dataset.min))
        .attr('y2', getY(dataset.min))
        .attr('stroke', '#2b33e9')
        .attr('stroke-width', 2);

      svg
        .append('line')
        .attr('x1', boxX + boxWidth / 2 - whiskerWidth / 2)
        .attr('x2', boxX + boxWidth / 2 + whiskerWidth / 2)
        .attr('y1', getY(dataset.max))
        .attr('y2', getY(dataset.max))
        .attr('stroke', '#2b33e9')
        .attr('stroke-width', 2);

      // Draw box (Q1 to Q3)
      const boxHeight = getY(dataset.q1) - getY(dataset.q3);
      svg
        .append('rect')
        .attr('x', boxX)
        .attr('y', getY(dataset.q3))
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('fill', '#2b33e9')
        .attr('fill-opacity', 0.3)
        .attr('stroke', '#2b33e9')
        .attr('stroke-width', 1)
        .on('mouseover', (event) => showTooltip(event, dataset))
        .on('mousemove', moveTooltip)
        .on('mouseout', hideTooltip);

      // Draw median line
      svg
        .append('line')
        .attr('x1', boxX)
        .attr('x2', boxX + boxWidth)
        .attr('y1', getY(dataset.median))
        .attr('y2', getY(dataset.median))
        .attr('stroke', '#2b33e9')
        .attr('stroke-width', 2);

      // Draw mean point
      svg
        .append('circle')
        .attr('cx', boxX + boxWidth / 2)
        .attr('cy', getY(dataset.mean))
        .attr('r', 4)
        .attr('fill', '#ffba08')
        .attr('stroke', '#2b33e9')
        .attr('stroke-width', 1)
        .on('mouseover', (event) => showTooltip(event, dataset))
        .on('mousemove', moveTooltip)
        .on('mouseout', hideTooltip);
    });

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width}, -20)`);

    // Box legend
    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#2b33e9')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#2b33e9');

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .text('Q1-Q3');

    // Mean legend
    legend
      .append('circle')
      .attr('cx', 8)
      .attr('cy', 25)
      .attr('r', 4)
      .attr('fill', '#ffba08')
      .attr('stroke', '#2b33e9')
      .attr('stroke-width', 1);

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 28)
      .style('font-size', '12px')
      .text('Mean');

    // Cleanup function
    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, [data, title]);

  return (
    <Container>
      <svg ref={svgRef} />
    </Container>
  );
};

export default BoxPlot;
