import express from 'express'
import path from 'path'
import fs from 'fs'

const server = express()
const port = 8000
const __dirname = path.resolve()

server.use(express.static(path.join(__dirname, 'dist')))

server.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/index.html'))
})

server.get('/api/scores', (request, response) => {
  const jsonPath = path.join(__dirname, 'src/api-data-year-stub.json')
  fs.readFile(jsonPath, 'utf-8', (err, data) => {
    if (err) throw err
    response.send(JSON.parse(data))
  })
})

server.listen(port, () => {
  console.log(`Example server listening at http://localhost:${port}`)
})
