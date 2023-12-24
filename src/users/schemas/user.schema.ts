import * as mongoose from 'mongoose'

export const UsersSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
})

UsersSchema.pre('save', function(next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }
  }
  catch (err) {
    return next(err)
  }
})