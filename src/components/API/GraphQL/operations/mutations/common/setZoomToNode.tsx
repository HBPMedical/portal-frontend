import { ReactiveVar } from '@apollo/client';

export default function createSetZoomToNode(
  zoomToVar: ReactiveVar<string | undefined>
) {
  /**
   * Select a variable to zoom in (focus)
   * @param id Id of the node (id of the variable in the NodeData)
   */
  return (id: string): void => {
    zoomToVar(id);
  };
}
