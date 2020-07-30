import Chart from 'chart.js'
import { generateChartData, getMaxScoreValue, generateChartOptions } from './chart-template'

export const chartConfiguration = (data, thresholds) => ({
  type: 'line',
  data: generateChartData(data),
  options: generateChartOptions(
    thresholds,
    getMaxScoreValue(data)
  )
})

export const createChart = (context, configuration) => {
  return new Chart(context, configuration)
}
