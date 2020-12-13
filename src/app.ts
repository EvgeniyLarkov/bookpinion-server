import express from 'express'
import { article, auth, user, book } from './routes/api'

const app = express()

app.use(express.json())
app.set('query parser', 'simple')

app.set('debug', { shell: true })

app.use('/api/auth', auth)
app.use('/article', article)
app.use('/user', user)
app.use('/book', book)

export default app
