import { ErrorStatus } from "../../src/controllers/types"

const { setupDB, app, request, populateDb, testData } = require('./test-setup')
const Chance = require('chance')

const chance = new Chance()
const databaseName = 'book-get-test-db'
const assets = [...testData]

setupDB(databaseName)
populateDb()

describe('Test book get interface', () => {
  test('When requesting books with no data it should response with 10 books and 200 status code', async (done) => {
    const response = await request(app).get('/')

    expect(response.body.message).toHaveLength(10)
    expect(response.body.status).toContain('success')
    expect(response.statusCode).toBe(200)
    done()
  })

  test('When requesting 4 books it should response with 4 books and 200 status code', async (done) => {
    const response = await request(app).get('/?start=1&end=5')

    expect(response.body.message).toHaveLength(4)
    expect(response.body.status).toContain('success')
    expect(response.statusCode).toBe(200)
    done()
  })

  test('When requesting books out of range it should response with error and 400 status code', async (done) => {
    const response = await request(app).get('/?start=100&end=105')

    expect(response.body.status).toContain(ErrorStatus.sererr)
    expect(response.statusCode).toBe(400)
    done()
  })

  test('When requesting books with invalid id it should response with error and 400 status code', async (done) => {
    const response = await request(app).get(`/${chance.guid()}`)

    expect(response.body.status).toContain(ErrorStatus.sererr)
    expect(response.statusCode).toBe(400)
    done()
  })

  test.each(assets)('When requesting books with all available filters it should response with data and 200 status code', async (data) => {
    const query = encodeURIComponent(Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&'))
    const response = await request(app).get(`/?${query}`)

    expect(response.body.status).toContain('success')
    expect(response.statusCode).toBe(200)
  })
})

export default databaseName
