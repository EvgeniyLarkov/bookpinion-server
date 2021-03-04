import { Response, Request, NextFunction } from 'express'
import { ErrorStatus } from '../controllers/types'

export default function (req: Request, res: Response, next: NextFunction): void {
  try {
    const adminStatus: boolean | undefined = req.body.isAdmin

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
