import UserModel from './user';
import MessageModel from './message';
import mongoose from 'mongoose';


export function connectDb () {
  if(process.env.DATABASE_URL) {
    return mongoose.connect(process.env.DATABASE_URL)
  }
  if (process.env.TEST_DATABASE) {
    return mongoose.connect(`mongodb://localhost:27017/${process.env.TEST_DATABASE}`)
  }
/*   if(process.env.DATABASE_USER && process.env.DATABASE_PASSWORD) {
    return mongoose.connect(`mongodb:${process.env.DATABASE_USER}@${process.env.DATABASE_PASSWORD}//localhost:27017/${process.env.DATABASE}`)
  } */
  return mongoose.connect(process.env.MongoUri)
}

export default {
  User: UserModel,
  Message: MessageModel
};
