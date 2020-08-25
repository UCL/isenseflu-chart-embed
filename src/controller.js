import { chartConfiguration, createChart } from './chart-delegate'
import { processModelData } from './json-adapter'

const apiUrl = () => {
  let fetchUrl = process.env.API_URL || ''
  fetchUrl += fetchUrl.endsWith('/') ? '' : '/'
  const startDate = new Date(Date.now() - 31795200000).toISOString().substring(0, 10)
  return `${fetchUrl}scores?id=4&startDate=${startDate}`
}

const callApi = () => {
  const resp = fetch(apiUrl()).then((response) => {
    if (!response.ok) { throw Error('Cannot fetch scores from API') }
    return response.json()
  }).catch((error) => {
    console.log(error)
  })
  return resp
}

export const generateChart = async (domContext) => {
  const jsonResponse = await callApi()
  const data = processModelData(jsonResponse.model_data)
  const conf = chartConfiguration(data.modelData, jsonResponse.rate_thresholds)
  return createChart(domContext, conf)
}
