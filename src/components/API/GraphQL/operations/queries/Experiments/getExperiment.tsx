import {
  GetExperimentQueryResult,
  useGetExperimentQuery
} from '../../../queries.generated';

export default function createGetExperiment() {
  /**
   * Get an experiment
   * @param id id of the experiment
   * @param waitForResult if true polling experiment finished (no more pending), false one time call
   * @returns loading state, experiment data and error state
   */
  return (
    id: string,
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
