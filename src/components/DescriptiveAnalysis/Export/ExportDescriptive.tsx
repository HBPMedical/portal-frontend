import React from 'react';
import { useActiveUserQuery } from '../../API/GraphQL/queries.generated';
import { Experiment } from '../../API/GraphQL/types.generated';
import ExportExperiment from '../../UI/Export/ExportExperiment';

type Props = {
  draftExperiment: Experiment;
};

const ExportDescriptive = ({ draftExperiment }: Props) => {
  const { data, loading } = useActiveUserQuery();
  const experiment: Experiment = {
    ...draftExperiment,
    name: 'Descriptive analysis',
    createdAt: new Date().toISOString(),
    author: {
      fullname: data?.user.fullname,
      username: data?.user.username,
    },
    algorithm: {
      name: 'DESCRIPTIVE_STATS',
      parameters: [],
    },
  };

  if (loading || !experiment) return <></>;

  return <ExportExperiment experiment={experiment} allowJSON={false} />;
};

export default ExportDescriptive;
