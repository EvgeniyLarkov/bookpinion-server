import C from '../config'
import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ErrorStatus } from '../controllers/types'

export default function (req: Request, res: Response, next: NextFunction): void {
  try {
    const tokenData = req.headers.authorization

    if (tokenData === undefined) {
      throw new Error('No token, authorization denied')
    }

    const token = tokenData.replace('Bearer ', '')

    jwt.verify(token, C.JWT_SECRET)

    const decodedData = jwt.decode(token)

    if (typeof decodedData !== 'object' || decodedData === null) {
      throw new Error('Token is not valid')
    }

    const username = decodedData.username

    req.body.username = username

    next()
  } catch (error) {
    res
      .status(401)
      .json({ status: ErrorStatus.autherr, message: error.toString() })
  }
}
