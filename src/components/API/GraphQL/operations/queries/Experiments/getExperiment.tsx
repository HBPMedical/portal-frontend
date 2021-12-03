import { ReactiveVar } from '@apollo/client';
import {
  GetExperimentQueryResult,
  useGetExperimentQuery
} from '../../../queries.generated';
import { Experiment } from '../../../types.generated';

export default function createGetExperiment(
  selectedExperimentVar: ReactiveVar<Experiment | undefined>,
  draftExperimentVar: ReactiveVar<Experiment>
) {
  return (
    id: string,
    isGlobal = false,
    waitForResult = false
  ): Pick<GetExperimentQueryResult, 'loading' | 'data' | 'error'> => {
    const {
      loading,
      data,
      error,
      stopPolling,
      startPolling
    } = useGetExperimentQuery({
      variables: { id },
      onCompleted: data => {
        if (isGlobal) {
          selectedExperimentVar(data.experiment as Experiment);
          draftExperimentVar(
            JSON.parse(JSON.stringify(selectedExperimentVar())) as Experiment
          ); // simple deep copy (should be optimized if the copy method is slow)
        }

        if (waitForResult && data.experiment.status === 'pending') {
          startPolling(500);
        } else {
          stopPolling();
        }
      }
    });

    return { loading, data, error };
  };
}
