/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ClusterResult } from '../../API/GraphQL/types.generated';

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
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;
  const slug = 'cluster-kmeans';

  const { data } = props;

  const tools = 'pan,crosshair,wheel_zoom,box_zoom,reset,save';
  const p = plot.figure({ title: data.name, tools: tools });

  p.circle(...data.nmatrix, { size: 50 });

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    plot.show(p, `#${slug}`);
  }, [plot, props.data]);

  if (data.nmatrix.length === 2)
    return <Container id={slug} className="result" ref={containerRef} />;
  else
    return (
      <div>
        No plotting available, as it&apos;s a {data.nmatrix[0].length}{' '}
        dimensions matrix
      </div>
    );
};

export default Cluster;
