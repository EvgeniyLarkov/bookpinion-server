import { Request, Response } from 'express'
import { Document } from 'mongoose'
import C from '../config/constants'
import BookModel, { ExtendedBookInterface } from '../models/BookModel'
import { ErrorStatus, ServerErrorResponse, ServerSuccessResponse } from './types'

export interface metaResponse {
  categories: typeof C.AVAILABLE_CATEGORIES
  bookPreview: Array<ExtendedBookInterface & Document>
}

class MetaController {
  async getMetaData (_: Request, res: Response): Promise<void> {
    try {
      const bookPreview = await BookModel.find({}).select('id authors title -_id')

      if (bookPreview.length === 0) {
        throw new Error('Books not found')
      }

      const response: ServerSuccessResponse<metaResponse> = {
        status: 'success',
        message: {
          categories: C.AVAILABLE_CATEGORIES,
          bookPreview
        }
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
}

export default new MetaController()
