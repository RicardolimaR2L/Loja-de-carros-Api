import { NextApiRequest, NextApiResponse } from 'next'
import { CarrosModel } from '../../../models/CarroModel'
import { conectarMongoDB } from '../../../midlewares/conectarMongoDb'
import nc from 'next-connect'

const handler = nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req?.query?.id
    if (!id) {
      try {
        const todosOsCarros = await CarrosModel.find()
        return res.status(200).json(todosOsCarros)
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          error:
            'Não foi possível localizar carros cadastrados, verifique os dados de busca.'
        })
      }
    }
    const CarroEncontrado = await CarrosModel.findById(id)
    if (!CarroEncontrado) {
      return res.status(404).json('Carro não encontrado')
    }
    res.status(200).json(CarroEncontrado)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Não foi possível localizar o carro' })
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default conectarMongoDB(handler)
