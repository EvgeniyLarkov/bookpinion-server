import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import UserModel, { UserInterface } from '../models/UserModel'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import C from '../config'

class UserController {
  async get (req: Request, res: Response): Promise<void> {
    const username = req.params.username
    const errors = validationResult(req)

    if (typeof username !== 'string' || !errors.isEmpty()) {
      res.status(400).json({ status: 'error', message: 'invalid data' })
      return
    }

    try {
      const user = await UserModel.findOne({ username }).select(' -__v -_id -password')

      if (user === null) {
        res.status(404).json({ status: 'error', message: 'user not found' })
        return
      }

      res.status(200).json({ status: 'success', message: user })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error })
    }
  }

  async create (req: Request, res: Response): Promise<void> {
    const requestData: UserInterface = {
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      username: req.body.username
    }

    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'validation error', message: errors.array() })
        return
      }

      const existingUser = await UserModel.findOne({ username: requestData.username })

      if (existingUser !== null) {
        res.status(400).json({ status: 'error', message: 'user exist' })
        return
      }

      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(requestData.password, salt)

      const userData: UserInterface = {
        ...requestData,
        password: hashed,
        isAdmin: false
      }

      const user = await UserModel.create(userData)

      await user.save()

      const payload = {
        username: userData.username,
        isAdmin: false
      }

      jwt.sign(
        payload,
        C.JWT_SECRET,
        { expiresIn: C.JWT_EXPIRATION },
        (err, token) => {
          if (err !== null) throw err
          res.status(201).json({ status: 'successful', token, message: payload })
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

export default new UserController()
