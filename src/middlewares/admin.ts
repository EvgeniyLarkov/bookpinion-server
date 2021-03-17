import { Response, Request, NextFunction } from 'express'
import { ErrorStatus } from '../controllers/types'
import UserModel from '../models/UserModel'

export default async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const username = req.body.username

    const user = await UserModel.findOne({ username }).select('isAdmin')

    if (user === null) {
      throw new Error('User not found')
    }

    const adminStatus = user.isAdmin

    if (adminStatus === undefined || !adminStatus) {
      throw new Error('Permission denied')
    }

    next()
  } catch (error) {
    res
      .status(403)
      .json({ status: ErrorStatus.autherr, message: error.toString() })
  }
}
