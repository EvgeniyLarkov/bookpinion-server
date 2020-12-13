const { setupDB, populateDb, app, request, testData } = require('./test-setup')

const databaseName = 'user-test-db'
const asset = [...testData]
setupDB(databaseName)
populateDb()

describe('Test user get interface', () => {
  test.each(asset)('When requesting user it should response with user data and 200 status code', async (data) => {
    const response = await request(app).get(`/user?username=${data.username}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toHaveProperty('username', data.username)
  })
  test.each(asset)('When requesting user it should response with user data without password and with 200 status code', async (data) => {
    const response = await request(app).get(`/user?username=${data.username}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).not.toHaveProperty('password')
  })
  test.each(asset)('When requesting not existing user it should response with error and with 400 status code', async (data) => {
    const response = await request(app).get(`/user?username=${data.surname}`)

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('error')
  })
})

export default databaseName
