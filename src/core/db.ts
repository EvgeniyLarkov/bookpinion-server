import { connect } from 'mongoose'
import CONFIG from '../config/'

/* const connectDB = async (): Promise<void> => {
  console.log('MongoDB connection initialisation')
  try {
    const mongoURI: string = CONFIG.DB_HOST
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
    await connect(mongoURI, options)
    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err.message)
    // Exit process with failure
    process.exit(1)
  }
} */

const connectDB = async (): Promise<void> => {
  console.log('MongoDB connection initialisation')
  try {
    const mongoURI = `mongodb+srv://admin_evgeniy:${CONFIG.DB_PASSWORD}@cluster0.aobpv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
    await connect(mongoURI, options)
    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err.message)
    // Exit process with failure
    process.exit(1)
  }
}

export default connectDB
