import app from '../src/app'
import { ErrorStatus } from '../src/controllers/types'
import { UserInterface } from '../src/models/UserModel'
const request = require('supertest')
const { setupDB } = require('./test-setup')
const Chance = require('chance')

const databaseName = 'auth-test-db'

const chance = new Chance()

setupDB(databaseName)

const userData: UserInterface[] = []

for (let i = 0; i < 10; i++) {
  userData[i] = {
    name: chance.first({ nationality: 'en' }),
    surname: chance.last({ nationality: 'en' }),
    username: chance.word(),
    password: chance.string()
  }
}

describe('Test the user registration interface', () => {
  test.each(userData)('When login with valid data it should response with token and 201 status code', async (data) => {
    const response = await request(app).post('/user').send(data)

    expect(response.statusCode).toBe(201)
    expect(response.body.token).toBeTruthy()

    const token: string | undefined = response.body.token

    const response2 = await request(app).post('/api/auth').send({ ...data, token })

    expect(response2.body.status).toContain('success')
    expect(response2.body.token).toBeTruthy()
    expect(response2.statusCode).toBe(200)
  })

  test.each(userData)('When login with invalid data it should response with 400 status code', async (data) => {
    const response = await request(app).post('/user').send(data)

    expect(response.statusCode).toBe(201)
    expect(response.body.token).toBeTruthy()

    const token: string | undefined = response.body.token
    const invalidData: UserInterface = { ...data, password: chance.string() }

    const response2 = await request(app).post('/api/auth').send({ ...invalidData, token })

    expect(response2.body.status).toContain(ErrorStatus.sererr)
    expect(response2.body.token).toBeUndefined()
    expect(response2.statusCode).toBe(400)
  })
})
