import mongoose, { Schema } from 'mongoose'

const car = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  photo: { type: String, required: true },
  price: { type: String, required: false }
})

export const CarModel =
  mongoose.models.cars || mongoose.model('cars', car)
