/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  BarChartResult,
  BarEnumValues,
} from '../../API/GraphQL/types.generated';

const Container = styled.div`
  align-self: center;
  display: inline-block;
  position: relative;
`;

const barColors = [
  'blue',
  'green',
  'orange',
  'yellow',
  'red',
  'purple',
  'brown',
  'pink',
  'gray',
  'gold',
  'silver',
  'black',
  'white',
];

interface Props {
  data: BarChartResult;
  variableType?: string; // Add variable type prop
  isLeafNode?: boolean; // Add prop to indicate if selected node is a leaf (variable) or group
}

const D3BarGraph = (props: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const data: BarChartResult = JSON.parse(JSON.stringify(props.data));
  const { variableType, isLeafNode } = props;

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create tooltip
    if (tooltipRef.current) {
      tooltipRef.current.remove();
    }
    tooltipRef.current = d3
      .select('body')
      .append('div')
      .attr('class', 'bar-chart-tooltip')
      .style('position', 'fixed') // Changed from absolute to fixed
      .style('padding', '6px 10px')
      .style('background', 'rgba(255, 255, 255, 0.9)') // Made more visible
      .style('color', 'black') // White text on dark background
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font', '12px sans-serif')
      .style('box-shadow', '0 2px 6px rgba(0,0,0,0.15)')
      .style('visibility', 'hidden')
      .style('z-index', '1000') // Very high z-index
      .style('max-width', '300px')
      .style('word-wrap', 'break-word')
      .style('white-space', 'normal')
      .node() as HTMLDivElement;

    // Parse and prepare data
    const originalCategories =
      data.xAxis?.categories ??
      data.barValues?.map((_, i) => i + 1).map(String);

    // Improved detection of histogram data (non-nominal variables)
    const hasRangePatterns = originalCategories?.some((cat) => {
      // Check for range pattern like "10-20", "11.77-11.78", "-5-10", "-5763--5529.72", "-164.28-69"
      // This regex handles: positive ranges, negative ranges, mixed ranges, and decimal values
      const rangePattern = /^-?\d*\.?\d+--?\d*\.?\d+$/.test(cat);
      return rangePattern;
    });

    // Helper function to properly parse range values
    const parseRangeValues = (
      rangeStr: string
    ): { min: number; max: number } | null => {
      if (!rangeStr.includes('-')) return null;

      // Handle the case where both values are negative (e.g., "-5763--5529.72")
      if (rangeStr.startsWith('-') && rangeStr.includes('--')) {
        // Split on the double dash, but keep the negative signs
        const parts = rangeStr.split('--');
        if (parts.length === 2) {
          const min = parseFloat(parts[0]); // "-5763"
          const max = parseFloat('-' + parts[1]); // "-5529.72"
          if (!isNaN(min) && !isNaN(max)) {
            return { min, max };
          }
        }
      } else {
        // Handle regular ranges (e.g., "10-20", "-164.28-69")
        const parts = rangeStr.split('-');
        if (parts.length === 2) {
          const min = parseFloat(parts[0]);
          const max = parseFloat(parts[1]);
          if (!isNaN(min) && !isNaN(max)) {
            return { min, max };
          }
        } else if (parts.length === 3 && parts[0] === '') {
          // Handle case like "-164.28-69" where first part is empty
          const min = parseFloat('-' + parts[1]);
          const max = parseFloat(parts[2]);
          if (!isNaN(min) && !isNaN(max)) {
            return { min, max };
          }
        }
      }
      return null;
    };

    // Adaptive thresholds based on data characteristics
    const totalBars = originalCategories?.length || 0;
    const isSmallRange =
      hasRangePatterns &&
      originalCategories?.some((cat) => {
        const rangeValues = parseRangeValues(cat);
        return rangeValues && Math.abs(rangeValues.max - rangeValues.min) < 1;
      });

    // For small ranges, require fewer bars (5 instead of 10) since they're more likely to be proper histograms
    const minBarsForHistogram = isSmallRange ? 5 : 10;
    const hasEnoughBars = totalBars >= minBarsForHistogram;
    const isHistogram = hasRangePatterns && hasEnoughBars;

    const barEnumValues = data.barEnumValues;

    // Log debugging information after variables are declared
    console.log('Variable Type:', variableType);
    console.log('BarChartResult:', data);
    console.log('Original Categories:', originalCategories);
    console.log('Is Histogram:', isHistogram);
    console.log('Bar Enum Values:', barEnumValues);

    // For histogram data, extract middle values and display as appropriate numbers
    // For nominal data or insufficient bars, keep original categories
    const displayCategories = isHistogram
      ? originalCategories?.map((category) => {
          const rangeValues = parseRangeValues(category);
          if (rangeValues) {
            const middleValue = (rangeValues.min + rangeValues.max) / 2;
            const range = Math.abs(rangeValues.max - rangeValues.min);

            // For integer variables, always round to whole numbers
            if (variableType === 'integer') {
              return Math.round(middleValue).toString();
            }

            // Format based on range size for other variable types
            if (range < 0.01) {
              // Very small ranges: show 4 decimal places
              return middleValue.toFixed(4);
            } else if (range < 0.1) {
              // Small ranges: show 3 decimal places
              return middleValue.toFixed(3);
            } else if (range < 1) {
              // Medium-small ranges: show 2 decimal places
              return middleValue.toFixed(2);
            } else if (range < 10) {
              // Medium ranges: show 1 decimal place
              return middleValue.toFixed(1);
            } else {
              // Large ranges: show as integer
              return Math.round(middleValue).toString();
            }
          }
          // For single values, use as is
          return category;
        })
      : originalCategories?.map((category) => {
          // Apply integer rounding for comparative bar charts and other numeric categories
          if (variableType === 'integer') {
            // Check if the category is a numeric string
            const numValue = parseFloat(category);
            if (!isNaN(numValue)) {
              console.log(
                `Rounding integer category: ${category} -> ${Math.round(
                  numValue
                )}`
              );
              return Math.round(numValue).toString();
            }
          } else {
            // For comparative bar charts, also check if categories are numeric strings
            // This handles cases where variableType might not be set but categories are numeric
            const numValue = parseFloat(category);
            if (!isNaN(numValue) && Number.isInteger(numValue)) {
              console.log(
                `Rounding numeric category: ${category} -> ${Math.round(
                  numValue
                )}`
              );
              return Math.round(numValue).toString();
            }
          }
          return category;
        });

    // Set up dimensions
    const margin = { top: 80, right: 40, bottom: 80, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', 800 + margin.left + margin.right)
      .attr('height', 450 + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add chart title only for comparative bar charts
    if (barEnumValues) {
      svg
        .append('text')
        .attr('x', 0)
        .attr('y', -50)
        .attr('text-anchor', 'start')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(data.name);
    }

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(displayCategories || [])
      .range([0, width])
      .padding(isHistogram ? 0 : 0.1); // Make bars touch for histogram data

    // Calculate y-scale domain based on data type
    let yMax = 0;
    if (barEnumValues) {
      // For grouped bars, find max across all groups
      const allValues = barEnumValues.flatMap(
        (bar: BarEnumValues) => bar.values
      );
      yMax = Math.max(...allValues) || 0;
    } else {
      // For single bars, use barValues
      yMax = Math.max(...(data.barValues || [])) || 0;
    }

    const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add x-axis with adaptive label limiting for histogram data
    const xAxisGroup = svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // For histogram data, limit the number of x-axis labels to prevent overcrowding
    if (isHistogram && displayCategories && displayCategories.length > 8) {
      // Calculate evenly spaced labels
      const totalLabels = displayCategories.length;
      const maxLabelsToShow = 12; // Maximum number of labels to show
      const step = Math.ceil(totalLabels / maxLabelsToShow);

      xAxisGroup
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-30)')
        .style('opacity', (d, i) => {
          // Show evenly spaced labels, excluding first and last
          return i % step === 0 && i > 0 && i < totalLabels - 1 ? 1 : 0;
        });

      // Also hide the tick marks that don't have visible labels
      xAxisGroup.selectAll('line').style('opacity', (d, i) => {
        // Show tick marks at evenly spaced intervals, excluding first and last
        return i % step === 0 && i > 0 && i < totalLabels - 1 ? 1 : 0;
      });
    } else if (
      isHistogram &&
      displayCategories &&
      displayCategories.length <= 8
    ) {
      // For small histograms, show evenly spaced labels
      const totalLabels = displayCategories.length;
      const maxLabelsToShow = Math.min(5, totalLabels);
      const step = Math.ceil(totalLabels / maxLabelsToShow);

      xAxisGroup
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-30)')
        .style('opacity', (d, i) => {
          // Show evenly spaced labels, excluding first and last
          return i % step === 0 && i > 0 && i < totalLabels - 1 ? 1 : 0;
        });

      // Also hide the tick marks that don't have visible labels
      xAxisGroup.selectAll('line').style('opacity', (d, i) => {
        // Show tick marks at evenly spaced intervals, excluding first and last
        return i % step === 0 && i > 0 && i < totalLabels - 1 ? 1 : 0;
      });
    } else {
      // For regular bar charts, show all labels
      xAxisGroup
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-30)');
    }

    // Add x-axis label
    svg
      .append('text')
      .attr('x', variableType === 'nominal' ? width + 15 : width / 2)
      .attr('y', variableType === 'nominal' ? height + 7 : height + 50)
      .attr('text-anchor', variableType === 'nominal' ? 'start' : 'middle')
      .style('font-size', '12px')
      .style('fill', 'black')
      .text(
        variableType === 'nominal' ? 'Categories' : data.xAxis?.label || ''
      );

    // Add y-axis with evenly spaced ticks
    const yAxisGroup = svg.append('g').call(yAxis);

    // Apply evenly spaced tick logic to y-axis
    const yTickCount = yAxisGroup.selectAll('text').size();
    if (yTickCount > 8) {
      const maxYTicksToShow = 8;
      const yStep = Math.ceil(yTickCount / maxYTicksToShow);

      yAxisGroup.selectAll('text').style('opacity', (d, i) => {
        // Show evenly spaced labels, excluding first and last
        return i % yStep === 0 && i > 0 && i < yTickCount - 1 ? 1 : 0;
      });

      yAxisGroup.selectAll('line').style('opacity', (d, i) => {
        // Show tick marks at evenly spaced intervals, excluding first and last
        return i % yStep === 0 && i > 0 && i < yTickCount - 1 ? 1 : 0;
      });
    }

    // Add y-axis label
    svg
      .append('text')
      .attr('x', -10) // Position at right side
      .attr('y', -15) // Position at top
      .attr('text-anchor', 'start') // Align to start (left)
      .style('font-size', '12px')
      .style('fill', 'black')
      .text(
        barEnumValues
          ? 'Nb of groups and variables'
          : isLeafNode
          ? 'Nb of patients'
          : 'Nb of groups and variables'
      );

    // Tooltip functions
    const showTooltip = (
      event: MouseEvent,
      label1: string,
      label2: string,
      description: string
    ) => {
      if (!tooltipRef.current) {
        console.log('tooltipRef.current is null');
        return;
      }

      // Set content first
      tooltipRef.current.innerHTML = `
        <strong>${label1}</strong>${label2}<br/>
        <strong>Count: </strong>${description}
      `;

      // Try different ways to get coordinates
      let x = 0;
      let y = 0;

      if ((event as any).pageX !== undefined) {
        x = (event as any).pageX;
        y = (event as any).pageY;
      } else if ((event as any).clientX !== undefined) {
        x = (event as any).clientX;
        y = (event as any).clientY;
      } else if ((event as any).offsetX !== undefined) {
        x = (event as any).offsetX;
        y = (event as any).offsetY;
      } else {
        // Fallback to mouse position
        x = window.event ? (window.event as any).clientX : 0;
        y = window.event ? (window.event as any).clientY : 0;
      }

      // Add offset
      x += 10;
      y -= 10;

      tooltipRef.current.style.left = `${x}px`;
      tooltipRef.current.style.top = `${y}px`;
      tooltipRef.current.style.visibility = 'visible';
    };

    const hideTooltip = () => {
      if (!tooltipRef.current) return;
      tooltipRef.current.style.visibility = 'hidden';
    };

    const moveTooltip = (event: MouseEvent) => {
      if (!tooltipRef.current) return;

      // Try different ways to get coordinates
      let x = 0;
      let y = 0;

      if ((event as any).pageX !== undefined) {
        x = (event as any).pageX;
        y = (event as any).pageY;
      } else if ((event as any).clientX !== undefined) {
        x = (event as any).clientX;
        y = (event as any).clientY;
      } else if ((event as any).offsetX !== undefined) {
        x = (event as any).offsetX;
        y = (event as any).offsetY;
      } else {
        // Fallback to mouse position
        x = window.event ? (window.event as any).clientX : 0;
        y = window.event ? (window.event as any).clientY : 0;
      }

      // Add offset
      x += 10;
      y -= 10;

      tooltipRef.current.style.left = `${x}px`;
      tooltipRef.current.style.top = `${y}px`;
    };

    if (!barEnumValues) {
      // Single bar chart
      const barsSelection = svg
        .selectAll('.bar')
        .data(data.barValues || [])
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr(
          'x',
          (d: any, i: any) => xScale(displayCategories?.[i] || '') || 0
        )
        .attr('y', (d: any) => yScale(d) || 0)
        .attr('width', xScale.bandwidth())
        .attr('height', (d: any) => height - (yScale(d) || 0))
        .style('fill', 'blue')
        .style('opacity', 0.5)
        .style('stroke', 'blue')
        .style('stroke-opacity', 0.5)
        .on('mouseover', function (event: any, d: any) {
          const nodes = svg.selectAll('.bar').nodes();
          const index = nodes.indexOf(this);
          showTooltip(
            event,
            `${data.xAxis?.label || 'Category'}: `,
            `${originalCategories?.[index] || ''}`,
            `${event}`
          );
          d3.select(this).style('opacity', 0.8);
        })
        .on('mousemove', function (event: any) {
          moveTooltip(event);
        })
        .on('mouseout', function (event: any) {
          hideTooltip();
          d3.select(this).style('opacity', 0.5);
        });
    } else {
      // Grouped bar chart
      const n = barEnumValues.length;
      const barWidth = xScale.bandwidth() / n;

      barEnumValues.forEach((bar: BarEnumValues, groupIndex: number) => {
        const barsSelection = svg
          .selectAll(`.bar-group-${groupIndex}`)
          .data(bar.values)
          .enter()
          .append('rect')
          .attr('class', `bar-group-${groupIndex}`)
          .attr('x', (d: any, i: any) => {
            const baseX = xScale(displayCategories?.[i] || '') || 0;
            return baseX + groupIndex * barWidth;
          })
          .attr('y', (d: any) => yScale(d) || 0)
          .attr('width', barWidth)
          .attr('height', (d: any) => height - (yScale(d) || 0))
          .style('fill', barColors[groupIndex] || 'blue')
          .style('opacity', 0.5)
          .style('stroke', barColors[groupIndex] || 'blue')
          .style('stroke-opacity', 0.5)
          .on('mouseover', function (event: any, d: any) {
            const nodes = svg.selectAll(`.bar-group-${groupIndex}`).nodes();
            const index = nodes.indexOf(this);
            showTooltip(
              event,
              `${data.xAxis?.label || 'Category'}: `,
              `${originalCategories?.[index] || ''}`,
              `${event}`
            );
            d3.select(this).style('opacity', 0.8);
          })
          .on('mousemove', function (event: any) {
            moveTooltip(event);
          })
          .on('mouseout', function (event: any) {
            hideTooltip();
            d3.select(this).style('opacity', 0.5);
          });

        // Add legend
        svg
          .append('rect')
          .attr('x', width - 100)
          .attr('y', -50 + groupIndex * 20)
          .attr('width', 15)
          .attr('height', 15)
          .style('fill', barColors[groupIndex] || 'blue')
          .style('opacity', 0.5);

        svg
          .append('text')
          .attr('x', width - 80)
          .attr('y', -40 + groupIndex * 20)
          .style('font-size', '12px')
          .text(bar.label);
        console.log(bar.label);
      });
    }

    // Cleanup function
    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, [data]);

  return (
    <Container>
      <svg ref={svgRef} />
    </Container>
  );
};

export default D3BarGraph;
