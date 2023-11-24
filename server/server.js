// server.js
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors' // Import the cors middleware
import 'dotenv/config'

import { openai } from './openai.js'
import { moviesData } from './moviesData.js'
import { Document } from 'langchain/document'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const app = express()
const port = process.env.PORT || 3010

app.use(bodyParser.json())
app.use(cors()) // Enable CORS for all routes

const newMessage = async (history, message) => {
  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [...history, message],
    max_tokens: 2000
  })

  return result.choices[0].message
}

const formatMessage = (userInput) => ({ role: 'user', content: userInput })

const chat = async (req, res) => {
  const history = [
    {
      role: 'system',
      content:
        'You are an AI assistant, answer any questions to the best of your ability & helpfully.'
    }
  ]

  const start = async (userInput) => {
    const userMessage = formatMessage(userInput)
    const response = await newMessage(history, userMessage)

    history.push(userMessage, response)
    res.json({ sender: 'AI', text: response.content })
  }

  await start(req.body.message) // Use await to ensure asynchronous completion
}

const createStore = (q) =>
  MemoryVectorStore.fromDocuments(
    moviesData.map(
      (movie) =>
        new Document({
          pageContent: movie.description,
          metadata: { source: movie.id, title: movie.title, query: q }
        })
    ),
    new OpenAIEmbeddings()
  )

const movies = async (req, res) => {
  try {
    const store = await createStore(req.body.query)
    const { query } = req.body // Extract the query from the request body
    const count = req.body.count ? req.body.count : 1
    const result = await store.similaritySearch(query, count) // Assuming search is a function that searches for movies
    res.json(result)
  } catch (error) {
    console.error('Error searching for movies:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

app.post('/chat', chat)
app.post('/movies', movies)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
