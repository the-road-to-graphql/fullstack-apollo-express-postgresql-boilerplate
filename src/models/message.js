import mongoose from 'mongoose'

const Message = mongoose.model('Message', new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
}))
export default Message;