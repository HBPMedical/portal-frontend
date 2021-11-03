import { mount } from 'enzyme'
import * as React from 'react'
import Result2 from '../../../ExperimentResult/Result2'
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { TEST_PATHOLOGIES } from '../../UtiltyTests'
import { CreateTransientDocument } from '../../GraphQL/queries.generated';
import { ExperimentCreateInput } from '../../GraphQL/types.generated';
import { graphQLURL } from '../../RequestURLS';

const apolloClient = new ApolloClient({
  uri: graphQLURL,
  cache: new InMemoryCache()
});

const modelSlug = `statistics-${Math.round(Math.random() * 10000)}`
const algorithmId = 'DESCRIPTIVE_STATS'

const input: ExperimentCreateInput = {
  name: 'Descriptive Statistics',
  datasets: TEST_PATHOLOGIES.dementia.datasets
    .filter((d) => d.code !== 'fake_longitudinal')
    .map((d) => d.code),
  variables: [
    'lefthippocampus',
    'alzheimerbroadcategory'
  ],
  domain: TEST_PATHOLOGIES.dementia.code,
  filter: '',
  algorithm: {
    name: algorithmId,
    type: 'string'
  },
}

// Test

describe('Integration Test for experiment API', () => {
  it(`create ${algorithmId}`, async () => {

    const { data: { createExperiment: experiment } } = await apolloClient.mutate({
      variables: { data: { ...input } },
      mutation: CreateTransientDocument
    });

    expect(experiment).toBeTruthy();

    const wrapper = mount(<Result2 experiment={experiment} loading={false} />)
    expect(wrapper.find('.result')).toHaveLength(2);
    expect(
      wrapper
        .find('.result table tbody tr td')
        .at(2)
        .text()
    ).toEqual('474');
    // console.log(wrapper.debug())
  })
})
