export const processModelData = (modelDataJson) => {
  const datesList = []
  const activeModels = []
  const modelData = []
  modelDataJson.forEach((item) => {
    datesList.push(item.data_points.map((p) => p.score_date))
    activeModels.push(item.id)
    modelData.push(
      {
        id: item.id,
        name: item.name,
        hasConfidenceInterval: item.has_confidence_interval,
        averageScore: item.average_score,
        datapoints: item.data_points
      }
    )
  })
  const startDate = new Date(Math.min.apply(null, datesList.flat().map((e) => new Date(e))))
  const endDate = new Date(Math.max.apply(null, datesList.flat().map((e) => new Date(e))))
  return {
    modelData,
    startDate: startDate.toISOString().substring(0, 10),
    endDate: endDate.toISOString().substring(0, 10),
    activeModels,
    allDates: [...new Set(datesList.flat())]
  }
}
