import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
import fetchBooks, { RawBookDataInterface } from '../core/fetch'
import BookModel, { ExtendedBookInterface } from '../models/BookModel'

class BookController {
  async byId (req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      const id = req.params.id

      if (typeof id !== 'string' || !errors.isEmpty()) {
        res.status(400).json({ status: 'error', message: errors ?? 'invalid data' })
        return
      }

      const book = await BookModel.findOne({ id }).select('-__v -_id')

      if (book === null) {
        throw new Error('Book not found')
      }

      res.status(200).json({ status: 'success', message: book })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.toString() })
    }
  }

  async index (req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'validation error', message: errors })
        return
      }

      const data = {
        authors: req.query.authors ?? null,
        title: req.query.title ?? null
      }
      const start: number = (req.query.start !== undefined) ? +req.query.start : 0
      const end: number = (req.query.end !== undefined) ? +req.query.end : 10

      const parsedData = Object.entries(data).reduce((acc, val) => (val[1] === null) ? acc : { ...acc, [val[0]]: val[1] }, {})

      const books = await BookModel.find(parsedData).select('-__v -_id')

      const result = books.slice(start, end)

      if (result.length === 0) {
        throw new Error('Books not found')
      }

      res.status(200).json({ status: 'success', message: result })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.toString() })
    }
  }

  async populate (_: Request, res: Response): Promise<void> {
    try {
      const data: RawBookDataInterface = await fetchBooks()

      const parsedData: ExtendedBookInterface[] = data.items.map((book) => ({
        id: book.id,
        authors: book.volumeInfo.authors,
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        imageLinks: {
          small: book.volumeInfo.imageLinks.smallThumbnail,
          normal: book.volumeInfo.imageLinks.thumbnail
        },
        link: book.volumeInfo.previewLink
      }))

      const books = await BookModel.insertMany(parsedData, { ordered: false })

      res.status(200).json({ status: 'success', message: books })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error })
    }
  }
}

export default new BookController()
