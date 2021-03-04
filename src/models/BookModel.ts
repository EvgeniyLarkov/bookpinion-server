import mongoose, { model } from 'mongoose'

const { Schema } = mongoose

export interface BookInterface {
  authors: string[]
  title: string
}

export interface ExtendedBookInterface extends BookInterface {
  authors: string[]
  category?: string[]
  id: string
  title: string
  description: string
  imageLinks: { small: string, normal: string }
  link: string
}

const BookSchema = new Schema({
  authors: {
    type: Array,
    required: true
  },
  category: {
    type: Array
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageLinks: {
    small: {
      type: String,
      required: true
    },
    normal: {
      type: String,
      required: true
    }
  },
  link: {
    type: String,
    required: true
  }
})

const BookModel = model<ExtendedBookInterface & mongoose.Document>('Book', BookSchema)

export default BookModel
