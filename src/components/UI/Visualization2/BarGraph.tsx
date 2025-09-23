/* eslint-disable react-hooks/exhaustive-deps */
import { BarChartResult } from '../../API/GraphQL/types.generated';
import D3BarGraph from './D3BarGraph';

interface Props {
  data: BarChartResult;
  variableType?: string; // Add variable type prop
  isLeafNode?: boolean; // Add prop to indicate if selected node is a leaf (variable) or group
}

const BarGraph = (props: Props) => {
  return (
    <D3BarGraph
      data={props.data}
      variableType={props.variableType}
      isLeafNode={props.isLeafNode}
    />
  );
};

export default BarGraph;

// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useRef } from 'react';
// import styled from 'styled-components';
// import { BarChartResult } from '../../API/GraphQL/types.generated';
// import { formatRange } from '../../utils';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// declare let window: any;

// const Container = styled.div`
//   align-self: center;
//   display: inline-block;
// `;

// const barWidth = 0.8;
// const barColors = ['blue', 'green', 'orange', 'yellow'];

// interface Props {
//   data: BarChartResult;
// }

// const BarGraph = (props: Props) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const Bokeh = window.Bokeh;
//   const plot = Bokeh.Plotting;
//   const data: BarChartResult = JSON.parse(JSON.stringify(props.data)); // copy data if manipulations needed
//   const slug =
//     'bar-graph-' +
//     data.name
//       .toLowerCase()
//       .replace(/\s/g, '-')
//       .replace(/[^\w-]+/g, '');

//   // Format categories for display while keeping originals for tooltips
//   const originalCategories =
//     data.xAxis?.categories ?? data.barValues?.map((_, i) => i + 1).map(String);
//   const displayCategories = originalCategories?.map(formatRange);
//   const barEnumValues = data.barEnumValues;

//   //title of chart
//   const title = new Bokeh.Title({
//     text: data.name,
//     text_font_size: '16px',
//     text_font_style: 'bold',
//     align: 'center',
//     standoff: 30,
//   });
//   const p = plot.figure({
//     height: 450,
//     x_range: displayCategories,
//     title: title,
//     toolbar_location: null,
//     tools: 'hover',
//     x_axis_label: data.xAxis?.label,
//     y_axis_label: data.yAxis?.label,
//   });

//   //x axis label
//   p.xaxis[0].major_label_orientation = Math.PI / 6;
//   p.xaxis[0].axis_label_text_font_size = '12px';
//   p.xaxis[0].axis_label_text_font_style = 'bold';
//   p.xaxis[0].axis_label_text_color = '#495057';

//   //y axis label
//   p.yaxis[0].axis_label_text_font_size = '12px';
//   p.yaxis[0].axis_label_text_font_style = 'bold';
//   p.yaxis[0].axis_label_text_color = '#495057';

//   // Configure hover tool
//   const hover = p.toolbar.select_one(Bokeh.HoverTool);
//   hover.tooltips = (_source: any, info: any) => {
//     const index = info.index; // Use the index directly from hover info
//     const div = document.createElement('div');

//     if (index !== undefined) {
//       const category = _source.data.originalCategories[index];
//       const count = _source.data.counts[index];

//       div.innerHTML = `${data.xAxis?.label || 'Category'}: ${category}<br>`;
//       div.innerHTML += `${data.yAxis?.label || 'Count'}: ${count}`;
//     }

//     return div;
//   };

//   if (!barEnumValues) {
//     const source = new Bokeh.ColumnDataSource({
//       data: {
//         categories: displayCategories,
//         originalCategories,
//         counts: data.barValues,
//       },
//     });
//     p.vbar({
//       x: { field: 'categories' },
//       top: { field: 'counts' },
//       width: barWidth,
//       line_alpha: 0.5,
//       fill_alpha: 0.5,
//       source: source,
//     });

//     if (data.hasConnectedBars) {
//       p.line({
//         x: { field: 'categories' },
//         y: { field: 'counts' },
//         source: source,
//       });

//       p.circle({
//         x: { field: 'categories' },
//         y: { field: 'counts' },
//         source: source,
//       });
//     }
//   } else {
//     // Please keep in mind that this is a rough equivalent of the python version as the dodge function from bokeh.transform module is not available in BokehJS, and is used as a workaround to achieve the same effect.
//     barEnumValues.forEach((bar, i) => {
//       const n = barEnumValues.length;
//       const w = barWidth / n;
//       p.vbar({
//         x: displayCategories?.map((_, j) => j + w / 2 + i * w),
//         top: bar.values,
//         width: w,
//         line_alpha: 0.5,
//         fill_alpha: 0.5,
//         fill_color: barColors[i] || 'blue',
//         legend: bar.label,
//       });

//       // doesn't display
//       p.legend.location = 'top_center';
//       p.legend.orientation = 'horizontal';
//     });
//   }

//   p.xgrid.grid_line_color = null;
//   p.y_range.start = 0;

//   useEffect(() => {
//     if (containerRef.current) containerRef.current.innerHTML = '';
//     plot.show(p, `#${slug}`);
//   }, [plot, props.data]);

//   return <Container id={slug} className="result" ref={containerRef} />;
// };

// export default BarGraph;
