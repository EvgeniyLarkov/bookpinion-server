import mongoose, { model } from 'mongoose'

const { Schema } = mongoose

export interface UserInterface {
  name: string
  surname: string
  password: string
  username: string
  isAdmin?: boolean
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

const UserModel = model<UserInterface & mongoose.Document>('User', UserSchema)

export default UserModel
