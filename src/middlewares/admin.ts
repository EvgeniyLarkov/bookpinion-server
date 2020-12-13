import { Response, Request, NextFunction } from 'express'

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
      .json({ status: 'authorization error', message: error.toString() })
  }
}
