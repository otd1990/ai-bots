// server.js
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors' // Import the cors middleware
import 'dotenv/config'

import { openai } from './openai.js'
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
    temperature: 2,
    max_tokens: 20
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

const moviesData = [
  {
    id: 1,
    title: 'Stepbrother',
    description: `Comedic journey full of adult humor and awkwardness.`
  },
  {
    id: 2,
    title: 'The Matrix',
    description: `Deals with alternate realities and questioning what's real.`
  },
  {
    id: 3,
    title: 'Shutter Island',
    description: `A mind-bending plot with twists and turns.`
  },
  {
    id: 4,
    title: 'Memento',
    description: `A non-linear narrative that challenges the viewer's perception.`
  },
  {
    id: 5,
    title: 'Doctor Strange',
    description: `Features alternate dimensions and reality manipulation.`
  },
  {
    id: 6,
    title: 'Paw Patrol',
    description: `Children's animated movie where a group of adorable puppies save people from all sorts of emergencies.`
  },
  {
    id: 7,
    title: 'Interstellar',
    description: `Features futuristic space travel with high stakes`
  }
]

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
  console.log("In movies query ", req.body, " count ", 1);
  try {
    const store = await createStore(req.body.query)
    const { query } = req.body; // Extract the query from the request body
    const count = req.body.count ? req.body.count : 1;
    const result = await store.similaritySearch(query, count); // Assuming search is a function that searches for movies
    res.json(result);
  } catch (error) {
    console.error('Error searching for movies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

app.post('/chat', chat)
app.post('/movies', movies)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
