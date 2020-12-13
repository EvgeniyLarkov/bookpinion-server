const { setupDB, refreshDb, app, request, testData } = require('./test-setup')

const databaseName = 'article-create-test-db'
const asset = [...testData]
setupDB(databaseName)
refreshDb()

describe('Test article creation interface', () => {
  test.each(asset)('When sending new article it should create new article and response with 201 status code', async (data) => {
    const response = await request(app).post('/article').send(data)

    expect(response.body.message).toContain('article added')
    expect(response.statusCode).toBe(201)
  })
  test.each(asset)('When sending article with same data it should response with success and 201 status code', async (data) => {
    await request(app).post('/article').send(data)
    const response2 = await request(app).post('/article').send(data)

    expect(response2.body.message).toContain('article added')
    expect(response2.statusCode).toBe(201)
  })
  test.each(asset)('When sending invalid data it should response with error and 400 status code', async (data) => {
    const invalidData = {
      ...data,
      article: 'less then minimum chars'
    }
    const response = await request(app).post('/article').send(invalidData)

    expect(response.body.status).toContain('error')
    expect(response.statusCode).toBe(400)
  })
})

export default databaseName
