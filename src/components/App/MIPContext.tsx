import { createContext } from 'react';

interface Context {
  showTutorial: boolean;
  forceShowTutorial: boolean;
  toggleTutorial?: (force?: boolean) => void;
}

const MIPContext = createContext<Context>({
  showTutorial: true,
  forceShowTutorial: false
});

export default MIPContext;
