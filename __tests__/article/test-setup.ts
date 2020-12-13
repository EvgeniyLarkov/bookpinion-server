import { ArticleInterface } from '../../src/models/ArticleModel'
import C from '../../src/config/constants'
import express from 'express'
import { articleCreateValidator, articleQueryValidator } from '../../src/validators/validation'
import ArticleController from '../../src/controllers/ArticleController'

const request = require('supertest')
const mongoose = require('mongoose')
const Chance = require('chance')

mongoose.set('useCreateIndex', true)
mongoose.promise = global.Promise

async function dropAllCollections (): Promise<void> {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running') === 1) return
      console.log(error.message)
    }
  }
}

async function removeAllCollections (): Promise<void> {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

const chance = new Chance()
const app = express()

app.use(express.json())

app.post('/article', articleCreateValidator, ArticleController.create)
app.get('/article', articleQueryValidator, ArticleController.get)

const testData: ArticleInterface[] = Array.from({ length: 20 }, () => ({
  username: chance.word(),
  title: chance.sentence({ words: 3 }),
  author: chance.name(),
  bookId: chance.fbid(),
  article: chance.paragraph({ sentences: 4 }),
  rating: chance.floating({ min: C.MIN_BOOK_RATING, max: C.MAX_BOOK_RATING }),
  createdAt: chance.date()
}))

module.exports = {
  setupDB (databaseName: string) {
    // Connect to Mongoose
    beforeAll(async () => {
      const url = `mongodb://127.0.0.1/${databaseName}`
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections()
      await mongoose.connection.close()
    })
  },
  populateDb () {
    beforeAll(async () => {
      const data = testData.map(item => request(app).post('/article').send(item))

      return Promise.all(data)
    })
  },
  refreshDb () {
    afterEach(async () => {
      await removeAllCollections()
    })
  },
  app,
  testData,
  request
}
