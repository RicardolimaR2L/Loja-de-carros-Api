import { NextApiRequest, NextApiResponse } from 'next'
import { CarrosModel } from '../../../../models/CarroModel'
import { conectarMongoDB } from '../../../../midlewares/conectarMongoDb'
import nc from 'next-connect'
import { politicaCORS } from '../../../../midlewares/politicaCors'
import { CarMessagesHelper } from './helpers/messageHelper'

const handler = nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req?.query?.id
    if (!id) {
      try {
        const allCars = await CarrosModel.find()
        return res.status(200).json(allCars)
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          error:
            CarMessagesHelper.CAR_NOT_FOUND
        })
      }
    }
    const carFound = await CarrosModel.findById(id)
    if (!carFound) {
      return res.status(404).json(CarMessagesHelper.CAR_NOT_FOUND)
    }
    res.status(200).json(carFound)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: CarMessagesHelper.CAR_NOT_FOUND })
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default politicaCORS(conectarMongoDB(handler))
