/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ClusterResult } from '../../API/GraphQL/types.generated';
import Plot from 'react-plotly.js';

const Container = styled.div`
  align-self: center;
  display: inline-block;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

interface Props {
  data: ClusterResult;
}

const Cluster = ({ ...props }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slug = 'cluster-kmeans';
  const { data } = props;

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    if (data.nmatrix.length === 2) {
      const Bokeh = window.Bokeh;
      const plot = Bokeh.Plotting;
      const tools = 'pan,crosshair,wheel_zoom,box_zoom,reset,save';
      const p = plot.figure({ title: data.name, tools: tools });
      p.circle(...data.nmatrix, { size: 50 });
      plot.show(p, `#${slug}`);
    }
  }, [props.data]);

  if (data.nmatrix.length === 2)
    return <Container id={slug} className="result" ref={containerRef} />;
  else if (data.nmatrix.length === 3) {
    return (
      <Plot
        data={[
          {
            x: data.nmatrix[0],
            y: data.nmatrix[1],
            z: data.nmatrix[2],
            mode: 'markers',
            marker: {
              size: 12,
              line: {
                color: 'rgba(217, 217, 217, 0.14)',
                width: 0.5,
              },
              opacity: 0.8,
            },
            type: 'scatter3d',
          },
        ]}
        layout={{
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
          },
        }}
      />
    );
  } else
    return (
      <div>
        No plotting available, as it&apos;s a {data.nmatrix[0].length}{' '}
        dimensions matrix
      </div>
    );
};

export default Cluster;
