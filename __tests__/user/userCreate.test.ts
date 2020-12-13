const Chance = require('chance')
const { setupDB, refreshDb, app, request, testData } = require('./test-setup')

const chance = new Chance()
const databaseName = 'user-test-db'
const asset = [...testData]
setupDB(databaseName)
refreshDb()

describe('Test user registration interface', () => {
  test.each(asset)('When sending correct data it should create new unique user and response with 201 status code', async (data) => {
    const response = await request(app).post('/user').send(data)

    expect(response.statusCode).toBe(201)
  })

  test.each(asset)('When sending same data 2 times it should response with error and 400 status code', async (data) => {
    await request(app).post('/user').send(data)
    const response2 = await request(app).post('/user').send(data)

    expect(response2.statusCode).toBe(400)
    expect(response2.body.status).toContain('error')
  })

  test.each(asset)('When sending invalid data it should response with validation error and 400 status code', async (data) => {
    const userData = {
      ...data,
      name: chance.date()
    }

    const response = await request(app).post('/user').send(userData)

    expect(response.statusCode).toBe(400)
  })
})

export default databaseName
