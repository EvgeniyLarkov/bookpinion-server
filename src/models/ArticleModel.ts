import mongoose, { model } from 'mongoose'

const { Schema } = mongoose

export interface ArticleInterface {
  username: string
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
  article: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now }
})

ArticleSchema.set('toJSON', {
  transform: (_: unknown, response: mongoose.Document) => {
    const { _id, ...data } = response
    if (_id === null) {
      return response
    }
    return {
      ...data,
      id: _id
    }
  }
})

const ArticleModel = model<ArticleInterface & mongoose.Document>('Article', ArticleSchema)

export default ArticleModel
