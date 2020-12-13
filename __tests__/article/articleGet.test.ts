const { setupDB, app, request, populateDb, testData } = require('./test-setup')

const databaseName = 'article-get-test-db'
const assets = [...testData]

setupDB(databaseName)
populateDb()

describe('Test article get interface', () => {
  test('When requesting articles with no data it should response with 10 articles and 200 status code', async (done) => {
    const response = await request(app).get('/article')

    expect(response.body.message).toHaveLength(10)
    expect(response.body.status).toContain('success')
    expect(response.statusCode).toBe(200)
    done()
  })

  test('When requesting 4 articles it should response with 4 articles and 200 status code', async (done) => {
    const response = await request(app).get('/article?start=1&end=5')

    expect(response.body.message).toHaveLength(4)
    expect(response.body.status).toContain('success')
    expect(response.statusCode).toBe(200)
    done()
  })
  test.each(assets)('When requesting article with all available filters it should response with data and 200 status code', async (data) => {
    const query = encodeURIComponent(Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&'))
    const response = await request(app).get(`/article?${query}`)

    expect(response.body.status).toContain('success')
    expect(response.statusCode).toBe(200)
  })
})

export default databaseName
