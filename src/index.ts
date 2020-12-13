import config from './config'
import app from './app'
import connectDB from './core/db'

const PORT = config.PORT

void connectDB()

app.listen(PORT, (): void => {
  console.log(`Server is working on port: ${PORT}`)
})
