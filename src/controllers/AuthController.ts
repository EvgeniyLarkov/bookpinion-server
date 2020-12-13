import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import UserModel from '../models/UserModel'
import C from '../config'

class AuthController {
  async login (req: Request, res: Response): Promise<void> {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ status: 'error', message: errors.array() })
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
          res.status(200).json({ status: 'success', message: 'Login successful', token })
        }
      )
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.toString()
      })
    }
  }
}

export default new AuthController()
