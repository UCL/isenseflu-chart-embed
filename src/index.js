import { generateChart } from './controller'

document.addEventListener('DOMContentLoaded', (event) => {
  const ctx = document.getElementById('chart').getContext('2d')
  generateChart(ctx)
})
