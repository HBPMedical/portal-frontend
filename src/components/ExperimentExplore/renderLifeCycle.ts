/* eslint-disable @typescript-eslint/ban-types */
// Source: https://github.com/alexzywiak/d3-react-components/blob/master/src/hooks/renderLifecycle.ts

import { useLayoutEffect, useRef } from 'react';

interface RenderLifecycleArgs {
  firstRender?: Function;
  updateRender?: Function;
  lastRender?: Function;
}

const RenderLifeCycle = ({
  firstRender,
  updateRender,
  lastRender,
}: RenderLifecycleArgs): void => {
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (!isFirstRender.current) {
      updateRender && updateRender();
    }
  }, [firstRender, updateRender]);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      firstRender && firstRender();
    }

    return () => {
      lastRender && lastRender();
    };
  }, [firstRender, lastRender]);
};

export default RenderLifeCycle;
