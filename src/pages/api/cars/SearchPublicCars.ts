import { NextApiRequest, NextApiResponse } from 'next'
import { CarModel } from '../../../models/CarModel'
import { connectMongoDB } from '../../../midlewares/connectMongoDB'
import nc from 'next-connect'
import { politicsCORS } from '../../../midlewares/politicsCORS'
import { CarMessagesHelper } from './helpers/messageHelper'
import { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg'

const searchCar = nc().get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {
  try {
    const { filter } = req.query
    if (!filter || filter.length < 2) {
      return res.status(400).json({
        erro: CarMessagesHelper.FILTER_NOT_VALID
      })
    }
    const findCarsByFilter = await CarModel.find({ //filtro para pesquisa de carros
      $or: [
        { name: { $regex: filter, $options: 'i' } },
        { brand: { $regex: filter, $options: 'i' } },
        { model: { $regex: filter, $options: 'i' } },
        { price: { $regex: filter, $options: 'i' } }

      ]
    })
    return res.status(200).json(findCarsByFilter);

  } catch (error) {
    console.error(error)
    return res.status(500).json({ erro: CarMessagesHelper.CAR_NOT_FOUND })
  }
})




export default politicsCORS(connectMongoDB(searchCar))
