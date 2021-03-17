import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ArticleModel, { ArticleInterface } from '../models/ArticleModel'
import { ErrorStatus, ServerErrorResponse, ServerSuccessResponse } from './types'
import BookModel from '../models/BookModel'
import { isArrayOfStrings } from '../middlewares/withFilter'

// TO-DO
// Исправить $or в методе index, добавить ошибку при невалидной категории

class Article {
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

      const article = await ArticleModel.findOne({ bookId: id }).select('-__v -_id')

      if (article === null) {
        throw new Error('Article not found')
      }

      const response: ServerSuccessResponse<typeof article> = {
        status: 'success',
        message: article
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
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const response: ServerErrorResponse<ErrorStatus.valerr> = {
        status: ErrorStatus.valerr,
        errors: errors.array()
      }

      res.status(400).json(response)
      return
    }

    try {
      const data = {
        bookId: req.query.bookId ?? null,
        username: req.query.username ?? null
      }

      const start: number = (req.query.start !== undefined) ? +req.query.start : 0
      const end: number = (req.query.end !== undefined) ? +req.query.end : start + 10

      const searchData = Object.entries(data).reduce((acc, val) => {
        if (val[1] === null) return acc
        if (isArrayOfStrings(val[1])) return { ...acc, $or: val[1].map((item) => ({ [val[0]]: item })) }
        return { ...acc, [val[0]]: val[1] }
      }, {})

      const articles = await ArticleModel.find({ ...searchData }).select('-__v')

      const result = articles.slice(start, end)

      if (result.length === 0) {
        throw new Error('No articles found')
      }

      const response: ServerSuccessResponse<{ data: typeof result, totalArticles: number }> = {
        status: 'success',
        message: {
          data: result,
          totalArticles: articles.length
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

  async create (req: Request, res: Response): Promise<void> {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const response: ServerErrorResponse<ErrorStatus.valerr> = {
        status: ErrorStatus.valerr,
        errors: errors.array()
      }

      res.status(400).json(response)
      return
    }

    try {
      const reqData = {
        username: req.body.username,
        bookId: req.body.bookId,
        article: req.body.article,
        rating: req.body.rating,
        createdAt: req.body.createdAt ?? new Date()
      }

      const book = await BookModel.findOne({ id: reqData.bookId })

      if (book === null) {
        throw new Error(`Book with id: ${reqData.bookId as string} not found`)
      }

      const article = await ArticleModel.create(reqData)

      await article.save()

      const response: ServerSuccessResponse<typeof article> = {
        status: 'success',
        message: article
      }

      res.status(201).json(response)
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
      const data: ArticleInterface = req.body

      const result = ArticleModel.update({ id }, data)

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

export default new Article()
