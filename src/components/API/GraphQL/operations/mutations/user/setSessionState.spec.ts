import { makeVar } from '@apollo/client';
import { SessionState } from '../../../../../../utilities/types';
import createSetSessionState from './setSessionState';

const mockSessionStateVar = makeVar<SessionState>(SessionState.INIT);
const setSessionState = createSetSessionState(mockSessionStateVar);

describe('Session state', () => {
  beforeEach(() => mockSessionStateVar(SessionState.INIT));

  it('Change session state', () => {
    const previousState = mockSessionStateVar();
    setSessionState(SessionState.LOGGED_IN);

    expect(mockSessionStateVar()).toEqual(SessionState.LOGGED_IN);
    expect(mockSessionStateVar()).not.toEqual(previousState);
  });
});
