import test from 'ava'
import fetchMock from 'fetch-mock'
import { JSDOM } from 'jsdom'

import Chart from 'chart.js'

import { generateChart } from './controller'
import * as apidata from './api-data-stub.json'

test.cb('Creates an instance of Chart from the data returned by the API', t => {
  fetchMock.mock('/', {
    body: JSON.stringify(apidata),
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
  const { window } = new JSDOM(
    '<!DOCTYPE html><html><head></head><body><canvas id="chart"></canvas></body></html>'
  )
  global.window = window
  global.document = window.document
  const result = generateChart(document.getElementById('chart').getContext('2d'))
  t.plan(1)
  result.then(r => {
    t.true(r instanceof Chart)
    t.end()
  })
})
