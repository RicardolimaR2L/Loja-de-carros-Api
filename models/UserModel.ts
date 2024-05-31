import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  nivel: { type: String, default: 'user' }
})

UserSchema.methods.isAdmin = function () {
  return this.nivel == 'admin'
}

export const UserModel =
  mongoose.models.users || mongoose.model('users', UserSchema)
