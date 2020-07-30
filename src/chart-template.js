/**
 * Extracts tne maximum score value in the time series (either score value or the upper limit
 * of the confidence interval if availeble)
 * @param  {Array} modeldata Array containing the model metadata and scores
 * @return {Number}           The maximum score value found in the time series
 */
export const getMaxScoreValue = (modeldata) => {
  if (modeldata === undefined) {
    return -Infinity
  }
  const res = modeldata.map(
    (m) => (
      {
        datapoints: m.datapoints,
        hasConfidenceInterval: (modeldata.length === 1) ? m.hasConfidenceInterval : false
      }
    )
  ).flatMap(
    (m) => (
      m.hasConfidenceInterval
        ? [...m.datapoints.map((d) => d.confidence_interval_upper)]
        : [...m.datapoints.map((d) => d.score_value)]
    )
  )
  return Math.max(...res)
}

/**
 * Generates a dataset object for chart.js populated with model score data
 * @param  {Array} modeldata Array containing the model metadata and scores
 * @return {Object}          The datasets to be passed to chart.js
 * @see {@link https://www.chartjs.org/docs/latest/charts/line.html#data-structure}
 */
export const generateChartData = (modeldata) => {
  const isAnArray = Array.isArray(modeldata)

  if (isAnArray && modeldata.length === 0) {
    return {}
  }

  if (isAnArray && modeldata.length === 1) {
    const template = {
      datasets: [
        {
          label: 'Model Scores',
          fill: false,
          borderColor: 'rgba(0, 123, 255, 1)',
          backgroundColor: 'rgba(63, 127, 191, 0.2)',
          data: [],
          pointStyle: 'line'
        }
      ]
    }
    if (modeldata[0].hasConfidenceInterval) {
      template.datasets.push(
        {
          label: 'Upper confidence interval',
          fill: false,
          borderColor: 'rgba(168, 198, 224, 1)',
          backgroundColor: 'rgba(63, 127, 191, 0.2)',
          data: [],
          pointStyle: 'line'
        },
        {
          label: 'Lower confidence interval',
          fill: 1,
          borderColor: 'rgba(168, 198, 224, 1)',
          backgroundColor: 'rgba(63, 127, 191, 0.2)',
          data: [],
          pointStyle: 'line'
        }
      )
    }
    modeldata[0].datapoints.slice().forEach((datapoint) => {
      const date = new Date(Date.parse(datapoint.score_date))
      template.datasets[0].data.push({ t: date, y: datapoint.score_value })
      if (modeldata[0].hasConfidenceInterval) {
        template.datasets[1].data.push({ t: date, y: datapoint.confidence_interval_upper })
        template.datasets[2].data.push({ t: date, y: datapoint.confidence_interval_lower })
      }
    })
    template.datasets[0].label = modeldata[0].name
    return template
  }

  return {}
}

const generateAnnotations = (thresholddata, maxvalue) => {
  if (thresholddata === undefined) {
    return []
  }
  const thresholdColours = {
    low_value: 'green',
    medium_value: 'yellow',
    high_value: 'orange',
    very_high_value: 'red'
  }
  const annotations = []
  Object.entries(thresholddata).forEach((entry) => {
    if (entry[1].value <= maxvalue) {
      annotations.push(
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: entry[1].value,
          borderColor: thresholdColours[entry[0]],
          borderWidth: 2,
          label: {
            backgroundColor: 'rgba(0,0,0,0.05)',
            fontColor: '#666',
            position: 'left',
            yAdjust: -10,
            enabled: true,
            content: entry[1].label
          }
        }
      )
    }
  })
  return annotations
}

/**
 * Generates object with configuration options for Chart.js, allowing the setting of annotations
 * which is used for drawing threshold lines
 * @param  {Object} thresholddata The set of thresholds valid for the dataset
 * @param  {Number} maxvalue      The meximum score value in the dataset
 * @return {Object}               The configuration options for chart.js
 * @see {@link https://www.chartjs.org/docs/latest/developers/updates.html#updating-options}
 */
export const generateChartOptions = (thresholddata, maxvalue) => (
  {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        fontSize: 14,
        usePointStyle: false,
        boxWidth: 15
      }
    },
    title: {
      display: false
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontSize: 14
          },
          scaleLabel: {
            display: true,
            labelString: 'Influenza-like illness rate per 100,000 people',
            fontSize: 16
          }
        }
      ],
      xAxes: [
        {
          type: 'time',
          time: {
            displayFormats: {
              day: 'D MMM'
            },
            tooltipFormat: 'Do of MMM, YYYY',
            stepSize: 7
          },
          ticks: {
            fontSize: 14
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: 'rgba(255,255,255,0.8)',
      bodyFontColor: '#666',
      bodyFontStyle: 'bold',
      titleFontColor: '#666'
    },
    annotation: {
      drawTime: 'afterDatasetsDraw',
      annotations: generateAnnotations(thresholddata, maxvalue)
    }
  }
)
