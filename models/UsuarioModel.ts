import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  nivel: { type: String, default: 'user' }
})

UserSchema.methods.isAdmin = function () {
  return this.nivel === 'admin'
}

export const UsuarioModel =
  mongoose.models.usuarios || mongoose.model('usuarios', UserSchema)
