import mongoose, { model } from 'mongoose'

const { Schema } = mongoose

interface SessionInterface {
  username: string
  userID: string
  refreshToken: string
  fingerprint: string
  ip: string
  expiresAt: Date
  createdAt?: Date
}

const SessionSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  fingerprint: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const SessionModel = model<SessionInterface & mongoose.Document>('Api/auth', SessionSchema)

export default SessionModel
