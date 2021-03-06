import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
import googleBooks from '../config/googleBooks'
import fetchBooksByCategory from '../core/fetch'
import { isArrayOfStrings } from '../middlewares/withFilter'
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

      const response: ServerSuccessResponse<{data: Array<typeof book>, totalBooks: number}> = {
        status: 'success',
        message: {
          data: [book],
          totalBooks: 1
        }
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
        id: req.query.id ?? null,
        authors: req.query.authors ?? null,
        title: req.query.title ?? null,
        category: req.query.category ?? null
      }

      const start: number = (req.query.start !== undefined) ? +req.query.start : 0
      const end: number = (req.query.end !== undefined) ? +req.query.end : 10

      const parsedData = Object.entries(data).reduce((acc: { [x: string]: typeof data.id | Array<{[x: string]: typeof data.id}> }, val) => {
        if (val[1] === null) return acc
        if (isArrayOfStrings(val[1])) return { ...acc, $or: [...val[1].map((item) => ({ [val[0]]: item }))] }
        return { ...acc, [val[0]]: val[1] }
      }, {})

      const books = await BookModel.find(parsedData).select('-__v -_id')

      const result = books.slice(start, end)

      if (result.length === 0) {
        throw new Error('Books not found')
      }

      const response: ServerSuccessResponse<{ data: typeof result, totalBooks: number }> = {
        status: 'success',
        message: {
          data: result,
          totalBooks: books.length
        }
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
      const ids = googleBooks.ids
      const resMessage = []

      for (const id of ids) {
        const data = await fetchBooksByCategory(id)

        const parsedData: ExtendedBookInterface[] = data.map((book) => ({
          id: book.id,
          authors: book.volumeInfo.authors,
          title: book.volumeInfo.title,
          description: book.volumeInfo.description,
          category: googleBooks.data[id],
          imageLinks: {
            small: book.volumeInfo.imageLinks.smallThumbnail,
            normal: book.volumeInfo.imageLinks.thumbnail
          },
          link: book.volumeInfo.previewLink
        }))

        const books = await BookModel.insertMany(parsedData, { ordered: false })

        resMessage.push(books)
      }

      const response: ServerSuccessResponse<typeof resMessage> = {
        status: 'success',
        message: resMessage
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

  async update (req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id
      const data: ExtendedBookInterface = req.body
      console.log(data)
      const result = await BookModel.update({ id }, data)

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
}

export default new BookController()
