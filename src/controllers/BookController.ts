import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
import fetchBooks, { RawBookDataInterface } from '../core/fetch'
import BookModel, { ExtendedBookInterface } from '../models/BookModel'
import { ErrorStatus, ServerErrorResponse, ServerSuccessResponse } from './types'

class BookController {
  async byId (req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      const id = req.params.id

      if (!errors.isEmpty()) {
        const response: ServerErrorResponse<ErrorStatus.valerr> = {
          status: ErrorStatus.valerr,
          errors: errors.array()
        }

        res.status(400).json(response)
        return
      }

      const book = await BookModel.findOne({ id }).select('-__v -_id')

      if (book === null) {
        throw new Error('Book not found')
      }

      const response: ServerSuccessResponse<typeof book> = {
        status: 'success',
        message: book
      }

      res.status(200).json(response)
    } catch (error) {
      const response: ServerErrorResponse<ErrorStatus.sererr> = {
        status: ErrorStatus.sererr,
        errors: { msg: error.toString() }
      }

      res.status(400).json(response)
    }
  }

  async index (req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const response: ServerErrorResponse<ErrorStatus.valerr> = {
          status: ErrorStatus.valerr,
          errors: errors.array()
        }

        res.status(400).json(response)
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

      const response: ServerSuccessResponse<typeof result> = {
        status: 'success',
        message: result
      }

      res.status(200).json(response)
    } catch (error) {
      const response: ServerErrorResponse<ErrorStatus.sererr> = {
        status: ErrorStatus.sererr,
        errors: { msg: error.toString() }
      }

      res.status(400).json(response)
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

      const response: ServerSuccessResponse<typeof books> = {
        status: 'success',
        message: books
      }

      res.status(200).json(response)
    } catch (error) {
      const response: ServerErrorResponse<ErrorStatus.sererr> = {
        status: ErrorStatus.sererr,
        errors: { msg: error.toString() }
      }

      res.status(400).json(response)
    }
  }

  async preview (_: Request, res: Response): Promise<void> {
    try {
      const books = await BookModel.find({}).select('_id authors title')

      if (books.length === 0) {
        throw new Error('Books not found')
      }

      const response: ServerSuccessResponse<typeof books> = {
        status: 'success',
        message: books
      }

      res.status(200).json(response)
    } catch (error) {
      const response: ServerErrorResponse<ErrorStatus.sererr> = {
        status: ErrorStatus.sererr,
        errors: { msg: error.toString() }
      }

      res.status(400).json(response)
    }
  }
}

export default new BookController()
