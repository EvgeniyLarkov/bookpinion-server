import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ArticleModel, { ArticleInterface } from '../models/ArticleModel'
import { ErrorStatus, ServerErrorResponse, ServerSuccessResponse } from './types'

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
        username: req.query.username ?? null,
        title: req.query.title ?? null,
        author: req.query.author ?? null
      }
      const start: number = (req.query.start !== undefined) ? +req.query.start : 0
      const end: number = (req.query.end !== undefined) ? +req.query.end : 10

      const parsedData = Object.entries(data).reduce((acc, val) => (val[1] === null) ? acc : { ...acc, [val[0]]: val[1] }, {})

      const articles = await ArticleModel.find({ ...parsedData }).select('-__v -_id')

      if (articles.length === 0) {
        res.status(200).json({ status: 'error', message: 'articles not found' })
        return
      }

      const slicedArticles = articles.slice(start, end)

      const response: ServerSuccessResponse<typeof slicedArticles> = {
        status: 'success',
        message: slicedArticles
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
      const reqData: ArticleInterface = {
        username: req.body.username,
        title: req.body.title,
        author: req.body.author,
        bookId: req.body.bookId,
        article: req.body.article,
        rating: req.body.rating,
        createdAt: req.body.createdAt ?? new Date()
      }

      const article = await ArticleModel.create({ ...reqData })

      await article.save()

      const response: ServerSuccessResponse<string> = {
        status: 'success',
        message: 'article added'
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
}

export default new Article()
