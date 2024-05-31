import { NextApiRequest, NextApiResponse } from 'next'
import { CarModel } from '../../../../models/CarModel'
import { connectMongoDB } from '../../../../midlewares/connectMongoDB'
import { validateJwtToken } from '../../../../midlewares/validateJwtToken';
import {
  upload,
  uploadImagemCosmic
} from '../../../../midlewares/uploadImagemCosmic'
import nc from 'next-connect'
import { politicsCORS } from '../../../../midlewares/politicsCORS'
import { CarMessagesHelper } from './helpers/messageHelper'
import { nameValidation, brandValidation, modelValidation, priceValidation } from '../../../../validators/carValidator'


const handler = nc()
  .use(upload.single('file'))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { name, model, brand, price } = req.body

      if (!nameValidation(name)) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_NAME })
      }

      if (!modelValidation(model)) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_MODEL })
      }
      if (!brandValidation(brand)) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_BRAND })
      }
      if (!priceValidation(price)) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_PRICE })
      }
      const photo = await uploadImagemCosmic(req)

      if (!photo) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_PHOTO })
      }
      const newCar = {
        name: name,
        model: model,
        brand: brand,
        photo: photo,
        price: price
      }
      await CarModel.create(newCar)
      return res.status(200).json({ msg: CarMessagesHelper.CAR_REGISTER_SUCCESS })
    } catch (e: any) {
      console.log(e)
      return res.status(500).json({
        erro:
          CarMessagesHelper.CAR_REGISTER_FAILED +
          e.toString()
      })
    }
  })

  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = req?.body?.id
      if (!id) {
        return res
          .status(500)
          .json({ error: CarMessagesHelper.CAR_ID_NOT_PROVIDED })
      }
      const { name, model, brand, price } = req.body

      if (!nameValidation(name)) {

        return res.status(400).json({ erro: CarMessagesHelper.INVALID_NAME })
      }

      if (!modelValidation(model)) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_MODEL })
      }
      if (!brandValidation(brand)) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_BRAND })
      }
      if (!priceValidation(price)) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_PRICE })
      }

      const photo = await uploadImagemCosmic(req)

      if (!photo) {
        return res.status(400).json({ erro: CarMessagesHelper.INVALID_PHOTO })
      }

      const existingCar = await CarModel.findById(id)
      if (!existingCar) {
        return res.status(404).json({ error: CarMessagesHelper.CAR_NOT_FOUND })
      }

      existingCar.name = name
      existingCar.model = model
      existingCar.brand = brand
      existingCar.price = price

      const updatedCar = await CarModel.findByIdAndUpdate(
        id,
        {
          name,
          model,
          brand,
          price,
          ...(photo && { photo })
        },
        { new: true }
      )
      return res.status(200).json({ updatedCar })
    } catch (error) {
      return res.status(500).json({
        error: CarMessagesHelper.CAR_UPDATE_FAILED
      })
    }
  })

  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = req?.query?.id
      const CarToBedeleted = await CarModel.findById(id)
      if (!CarToBedeleted) {
        return res.status(404).json({ erro: CarMessagesHelper.CAR_NOT_FOUND })
      }
      const deletedCar = await CarModel.findByIdAndDelete(id)
      return res.status(200).json({ msg: CarMessagesHelper.CAR_DELETE_SUCCESS })
    } catch (error) {
      console.log(error)
      return res
        .status(401)
        .json({ erro: CarMessagesHelper.CAR_DELETE_FAILED })
    }
  })

export const config = {
  api: {
    bodyParser: false
  }
}

export default politicsCORS(validateJwtToken(connectMongoDB(handler)))
