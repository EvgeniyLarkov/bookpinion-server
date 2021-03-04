import { Response, Request, NextFunction } from 'express'
import { ErrorStatus } from '../controllers/types'
import BookModel from '../models/BookModel'

export function isArrayOf<T> (arr: unknown, condition: (item: unknown) => boolean): arr is T[] {
  return Array.isArray(arr) && arr.every(condition)
}

export function isArrayOfStrings (arr: unknown): arr is string[] {
  return isArrayOf<string>(arr, (item) => typeof item === 'string')
}

export default async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = req.query.category

    if (categories === undefined) {
      return next()
    }

    const parsedCategories = (Array.isArray(categories)) ? categories : [categories]

    if (!isArrayOfStrings(parsedCategories)) {
      throw new Error('Invalid data')
    }

    const booksIds = [...parsedCategories.map((item) => BookModel.find({ category: item }).select('id'))]

    return await Promise.all(booksIds)
      .then((ids) => ids[0].map(({ id }) => id))
      .then((ids) => { req.query.bookId = ids })
      .finally(() => next())
  } catch (error) {
    res
      .status(403)
      .json({ status: ErrorStatus.valerr, message: error.toString() })
  }
}
