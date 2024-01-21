import mongoose, { Schema } from 'mongoose'

const car = new Schema({
  nome: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  foto: { type: String, required: true },
  preco: { type: String, required: false }
})

export const CarrosModel =
  mongoose.models.carros || mongoose.model('carros', car)
