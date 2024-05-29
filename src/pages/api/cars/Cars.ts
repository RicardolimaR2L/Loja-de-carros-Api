import { NextApiRequest, NextApiResponse } from 'next'
import { CarrosModel } from '../../../../models/CarroModel'
import { conectarMongoDB } from '../../../../midlewares/conectarMongoDb'
import { ValidarTokenJWT } from '../../../../midlewares/validarTokenJwt'
import {
  upload,
  uploadImagemCosmic
} from '../../../../midlewares/uploadImagemCosmic'
import nc from 'next-connect'
import { politicaCORS } from '../../../../midlewares/politicaCors'
import { CarMessagesHelper } from './helpers/messageHelper'
import { nameValidation, brandValidation, modelValidation, priceValidation } from '../../../../validators/validator'


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
        nome: name,
        modelo: model,
        marca: brand,
        foto: photo,
        preco: price
      }
      await CarrosModel.create(newCar)
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
          .json({ error: CarMessagesHelper.CAR_NOT_FOUND })
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

      const existingCar = await CarrosModel.findById(id)
      if (!existingCar) {
        return res.status(404).json({ error: CarMessagesHelper.CAR_NOT_FOUND })
      }

      existingCar.nome = name
      existingCar.modelo = model
      existingCar.marca = brand
      existingCar.preco = price

      const updatedCar = await CarrosModel.findByIdAndUpdate(
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
      const CarToBedeleted = await CarrosModel.findById(id)
      if (!CarToBedeleted) {
        return res.status(404).json({ erro: CarMessagesHelper.CAR_NOT_FOUND })
      }
      const deletedCar = await CarrosModel.findByIdAndDelete(id)
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

export default politicaCORS(ValidarTokenJWT(conectarMongoDB(handler)))
