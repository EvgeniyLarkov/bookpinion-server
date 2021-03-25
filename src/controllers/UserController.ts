import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import UserModel, { UserInterface } from '../models/UserModel'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import C from '../config'
import { ErrorStatus, ServerErrorResponse, ServerSuccessResponse } from './types'

class UserController {
  async get (req: Request, res: Response): Promise<void> {
    const username = req.params.username
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
      const user = await UserModel.findOne({ username }).select(' -__v -_id -password')

      if (user === null) {
        throw new Error('User not found')
      }

      const response: ServerSuccessResponse<typeof user> = {
        status: 'success',
        message: user
      }

      res.status(200).json(response)
    } catch (error) {
      const response: ServerErrorResponse<ErrorStatus.sererr> = {
        status: ErrorStatus.sererr,
        errors: { msg: error.toString() }
      }

      res.status(400).json(response)
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
        const response: ServerErrorResponse<ErrorStatus.valerr> = {
          status: ErrorStatus.valerr,
          errors: errors.array()
        }

        res.status(400).json(response)
        return
      }

      const existingUser = await UserModel.findOne({ username: requestData.username })

      if (existingUser !== null) {
        throw new Error('User exists')
      }

      const salt = await bcrypt.genSalt(+C.SALT_ROUNDS)
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
        isAdmin: userData.isAdmin
      }

      const userResponseData = {
        ...userData,
        password: ''
      }

      jwt.sign(
        payload,
        C.JWT_SECRET,
        { expiresIn: C.JWT_EXPIRATION },
        (err, token) => {
          if (err !== null) throw err

          const response: ServerSuccessResponse<typeof userResponseData> = {
            status: 'success',
            message: userResponseData,
            token
          }

          res.status(201).json(response)
        })
    } catch (error) {
      const response: ServerErrorResponse<ErrorStatus.sererr> = {
        status: ErrorStatus.sererr,
        errors: { msg: error.toString() }
      }

      res.status(400).json(response)
    }
  }
}

export default new UserController()
