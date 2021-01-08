import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import UserModel from '../models/UserModel'
import C from '../config'
import { ErrorStatus, ServerErrorResponse, ServerSuccessResponse } from './types'

class AuthController {
  async login (req: Request, res: Response): Promise<void> {
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
      const { username, password } = req.body
      const user = await UserModel.findOne({ username })

      if (user === null) {
        throw new Error('Invalid data')
      }

      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        throw new Error('Invalid data')
      }

      const userData = {
        username: user.username,
        name: user.name,
        surname: user.surname
      }

      const payload: { username: string, isAdmin: boolean } = {
        username: user.username,
        isAdmin: user.isAdmin ?? false
      }

      jwt.sign(
        payload,
        C.JWT_SECRET,
        { expiresIn: C.JWT_EXPIRATION },
        (error, token) => {
          if (error !== null) throw error

          const response: ServerSuccessResponse<typeof userData> = {
            status: 'success',
            message: userData,
            token
          }

          res.status(200).json(response)
        }
      )
    } catch (error) {
      const response: ServerErrorResponse<ErrorStatus.sererr> = {
        status: ErrorStatus.sererr,
        errors: { msg: error.toString() }
      }

      res.status(400).json(response)
    }
  }
}

export default new AuthController()
