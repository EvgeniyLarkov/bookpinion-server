import C from '../config'
import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ErrorStatus } from '../controllers/types'

export default function (req: Request, res: Response, next: NextFunction): void {
  try {
    const token: string | undefined = req.body.token

    if (token === undefined) {
      throw new Error('No token, authorization denied')
    }

    jwt.verify(token, C.JWT_SECRET)

    const tokenData = jwt.decode(token)

    if (typeof tokenData !== 'object' || tokenData === null) {
      throw new Error('Token is not valid')
    }

    const username = tokenData.username
    const isAdmin = tokenData.isAdmin

    req.body.username = username
    req.body.isAdmin = isAdmin
    next()
  } catch (error) {
    res
      .status(401)
      .json({ status: ErrorStatus.autherr, message: error.toString() })
  }
}
