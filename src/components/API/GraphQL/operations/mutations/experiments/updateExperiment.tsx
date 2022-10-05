import { ReactiveVar } from '@apollo/client';
import { Experiment } from '../../../types.generated';

export default function createUpdateExperiment(
  experimentVar: ReactiveVar<Experiment>
) {
  return (data: Partial<Experiment>): void => {
    experimentVar({ ...experimentVar(), ...data });
  };
}
