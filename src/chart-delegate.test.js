import test from 'ava'

import { chartConfiguration } from './chart-delegate'
import { processModelData } from './json-adapter'
import * as apidata from './api-data-stub.json'

test('Minimum configuration for chart to include datasets and type', t => {
  const data = processModelData(apidata.model_data)
  const conf = chartConfiguration(data.modelData, apidata.rate_thresholds)
  t.is(conf.type, 'line', 'Chart must be of line type')
  t.is(conf.data.datasets.length, 3, 'Chart to contain 3 datasets')
})
