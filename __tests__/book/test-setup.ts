import express from 'express'
import { bookParamValidator, bookQueryValidator } from '../../src/validators/validation'
import { ExtendedBookInterface } from '../../src/models/BookModel'
import BookController from '../../src/controllers/BookController'

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

app.post('/', [], BookController.populate)
app.get('/', bookQueryValidator, BookController.index)
app.get('/:id', bookParamValidator, BookController.getOne)

const testData: ExtendedBookInterface[] = Array.from({ length: 20 }, () => ({
  id: chance.fbid(),
  username: chance.word(),
  title: chance.sentence({ words: 3 }),
  authors: [chance.name()],
  bookId: chance.fbid(),
  description: chance.paragraph({ sentences: 4 }),
  imageLinks: {
    normal: chance.url(),
    small: chance.url()
  },
  link: chance.url()
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
      const data = testData.map(item => request(app).post('/').send(item))

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
