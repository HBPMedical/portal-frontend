import { mount } from 'enzyme'
import * as React from 'react'
import { Experiment, ExperimentCreateInput } from '../../generated/graphql'
import Result2 from '../../../ExperimentResult/Result2'
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { TEST_PATHOLOGIES } from '../../UtiltyTests'
import { CreateTransientDocument } from '../../generated/graphql';

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GATEWAY_URL,
  cache: new InMemoryCache()
});

console.log(process.env.REACT_APP_GATEWAY_URL)


const modelSlug = `statistics-${Math.round(Math.random() * 10000)}`
const algorithmId = 'DESCRIPTIVE_STATS'

const input: ExperimentCreateInput = {
  name: 'Descriptive analysis',
  datasets: TEST_PATHOLOGIES.dementia.datasets
    .filter((d) => d.code !== 'fake_longitudinal')
    .map((d) => d.code),
  variables: [
    'lefthippocampus',
    'alzheimerbroadcategory'
  ],
  domain: TEST_PATHOLOGIES.dementia.code,
  filter: '',
  algorithm: 'DESCRIPTIVE_STATS',
}

// Test

describe('Integration Test for experiment API', () => {
  it(`create ${algorithmId}`, async () => {

    const { data: { createTransient: experiment } } = await apolloClient.mutate({
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
