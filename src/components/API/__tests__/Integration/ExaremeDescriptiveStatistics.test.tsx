import { mount } from 'enzyme'
import * as React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { Experiment, ExperimentCreateInput } from '../../generated/graphql'
import Result2 from '../../../ExperimentResult/Result2'

import { TEST_PATHOLOGIES } from '../../UtiltyTests'

// const [
//   createTransientMutation,
//   { data, loading, error }
// ] = useCreateTransientMutation();

// config

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
  filter: 'query.filters',
  algorithm: 'DESCRIPTIVE_STATS',
}

const experiment: Experiment = {
  title: 'Descriptive analysis',
  results: [
    {
      groupBy: 'single',
      name: 'Left Hippocampus',
      data: [
        ['Left Hippocampus', '714', '474', '1000'],
        ['Datapoints', '714', '437', '920'],
        ['Nulls', '0', '37', '80'],
        [
          'std',
          '0.2918412933538098',
          '0.36386725810478093',
          '0.3874377685743167',
        ],
        ['max', '4.1781', '4.4519', '4.4519'],
        ['min', '2.37', '1.3047', '1.3047'],
        [
          'mean',
          '3.2104421568627446',
          '2.988286727688787',
          '2.990389673913044',
        ],
      ],
      metadatas: [
        { name: 'ppmi', type: 'string', __typename: 'MetaData' },
        { name: 'edsd', type: 'string', __typename: 'MetaData' },
        { name: 'desd-synthdata', type: 'string', __typename: 'MetaData' },
      ],
      __typename: 'TableResult',
    },
    {
      groupBy: 'single',
      name: 'Alzheimer Broad Category',
      data: [
        ['Alzheimer Broad Category', '714', '474', '1000'],
        ['Datapoints', '714', '368', '777'],
        ['Nulls', '0', '106', '223'],
        ['std', '', '', ''],
        ['max', '', '', ''],
        ['min', '', '', ''],
        ['mean', '', '', ''],
      ],
      metadatas: [
        { name: 'ppmi', type: 'string', __typename: 'MetaData' },
        { name: 'edsd', type: 'string', __typename: 'MetaData' },
        { name: 'desd-synthdata', type: 'string', __typename: 'MetaData' },
      ],
      __typename: 'TableResult',
    },
  ],
  __typename: 'Experiment',
}
const loading = false

// Test

describe('Integration Test for experiment API', () => {
  it(`create ${algorithmId}`, async () => {
    //expect(loading).toBeTruthy();

    // await createTransientMutation({
    //   variables: { data: input }
    // });

    //expect(error).toBeFalsy();

    // const results = data?.createTransient.results as TableResult[];
    // const singles = results?.filter(r => r.groupBy === 'single');
    // const models = results?.filter(r => r.groupBy === 'model');

    // expect(singles).toBeTruthy();

    const wrapper = mount(<Result2 experiment={experiment} loading={loading} />)
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
