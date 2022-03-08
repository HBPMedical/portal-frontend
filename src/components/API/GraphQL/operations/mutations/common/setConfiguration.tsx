import { ReactiveVar } from '@apollo/client';
import { Configuration } from '../../../types.generated';

export default function createSetConfiguration(
  configVar: ReactiveVar<Configuration>
) {
  /**
   * Configuration for the connector used in backend
   * @param config configuration
   */
  return (config: Configuration): void => {
    configVar(config);
  };
}
