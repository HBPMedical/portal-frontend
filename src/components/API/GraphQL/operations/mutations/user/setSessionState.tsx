import { ReactiveVar } from '@apollo/client';
import { SessionState } from '../../../../../../utilities/types';

export default function createSetSessionState(
  setSessionState: ReactiveVar<SessionState>
) {
  return (state: SessionState): void => {
    setSessionState(state);
  };
}
