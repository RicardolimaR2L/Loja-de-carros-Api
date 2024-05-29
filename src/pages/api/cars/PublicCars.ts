import { NextApiRequest, NextApiResponse } from 'next'
import { CarModel } from '../../../../models/CarModel'
import { connectMongoDB } from '../../../../midlewares/connectMongoDB'
import nc from 'next-connect'
import { politicsCORS } from '../../../../midlewares/politicsCORS'
import { CarMessagesHelper } from './helpers/messageHelper'

const handler = nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req?.query?.id
    if (!id) {
      try {
        const allCars = await CarModel.find()
        return res.status(200).json(allCars)
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          error:
            CarMessagesHelper.CAR_NOT_FOUND
        })
      }
    }
    const foundCar = await CarModel.findById(id)
    if (!foundCar) {
      return res.status(404).json(CarMessagesHelper.CAR_NOT_FOUND)
    }
    res.status(200).json(foundCar)
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

export default politicsCORS(connectMongoDB(handler))
