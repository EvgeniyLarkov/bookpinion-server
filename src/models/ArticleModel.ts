import mongoose, { model } from 'mongoose'

const { Schema } = mongoose

export interface ArticleInterface {
  username: string
  title: string
  author: string
  bookId: string
  article: string
  rating: number
  createdAt: Date
}

const ArticleSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  article: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now }
})

const ArticleModel = model<ArticleInterface & mongoose.Document>('Article', ArticleSchema)

export default ArticleModel
