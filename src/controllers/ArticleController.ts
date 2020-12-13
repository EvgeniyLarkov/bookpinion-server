import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ArticleModel, { ArticleInterface } from '../models/ArticleModel'

class Article {
  async byId (req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      const id = req.params.id

      if (typeof id !== 'string' || !errors.isEmpty()) {
        res.status(400).json({ status: 'error', message: errors ?? 'invalid data' })
        return
      }

      const article = await ArticleModel.findOne({ bookId: id }).select('-__v -_id')

      if (article === null) {
        throw new Error('Article not found')
      }

      res.status(200).json({ status: 'success', message: article })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.toString() })
    }
  }

  async index (req: Request, res: Response): Promise<void> {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ status: 'error', message: errors })
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

      res.status(200).json({ status: 'success', message: slicedArticles })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error })
    }
  }

  async create (req: Request, res: Response): Promise<void> {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ status: 'error', message: errors.array() })
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
      res.status(201).json({ status: 'success', message: 'article added' })
    } catch (err) {
      console.log(err)
      res.status(400).json({ status: 'error', message: err })
    }
  }
}

export default new Article()
