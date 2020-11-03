import { createContext } from 'react';

interface Context {
  showTutorial: boolean;
  toggleTutorial?: (force?: boolean) => void;
}

const MIPContext = createContext<Context>({
  showTutorial: true
});

export default MIPContext;
