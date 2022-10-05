import { makeVar } from '@apollo/client';
import { Configuration } from '../../../types.generated';
import createSetConfiguration from './setConfiguration';
import { initialConfig } from '../../../cache';

const mockConfigurationVar = makeVar<Configuration>(initialConfig);
const setConfiguration = createSetConfiguration(mockConfigurationVar);

describe('Set configuration', () => {
  it('Update configuration', () => {
    const configuration: Configuration = {
      ...initialConfig,
      hasGalaxy: true,
      connectorId: 'dummy-id',
    };
    setConfiguration(configuration);
    expect(mockConfigurationVar()).toBe(configuration);
  });
});
