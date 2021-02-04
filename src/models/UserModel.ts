import mongoose, { model } from 'mongoose'

const { Schema } = mongoose

export interface UserInterface {
  name: string
  surname: string
  password: string
  username: string
  isAdmin?: boolean
  location?: string
  regDate?: { type: Date }
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  location: String,
  regDate: { type: Date, default: Date.now }
})

UserSchema.set('toJSON', {
  transform: (_: unknown, response: mongoose.Document) => {
    const { _id, ...data } = response
    if (_id === null) {
      return response
    }
    return {
      ...data,
      id: _id
    }
  }
})

const UserModel = model<UserInterface & mongoose.Document>('User', UserSchema)

export default UserModel
