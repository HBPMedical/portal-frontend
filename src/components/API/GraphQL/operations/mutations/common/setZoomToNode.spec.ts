import { makeVar } from '@apollo/client';
import createSetZoomToNode from './setZoomToNode';

const mockZoomVar = makeVar<string | undefined>(undefined);
const setZoomToNode = createSetZoomToNode(mockZoomVar);

describe('Set zoom to node', () => {
  it('Selected node to zoom', () => {
    const idNode = 'test';
    setZoomToNode(idNode);
    expect(mockZoomVar()).toBe(idNode);
  });
});
