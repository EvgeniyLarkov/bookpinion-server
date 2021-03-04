import express from 'express'
import { article, auth, user, book, meta } from './routes/api'

const cors = require('cors')
const app = express()

app.use(cors())
app.options('*', cors())

app.use(express.json())
app.set('query parser', 'simple')

app.set('debug', { shell: true })

app.use('/api/auth', auth)
app.use('/api/meta', meta)
app.use('/article', article)
app.use('/user', user)
app.use('/book', book)

export default app
