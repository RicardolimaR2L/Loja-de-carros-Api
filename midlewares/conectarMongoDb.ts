import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import mongoose from 'mongoose'

export const conectarMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (mongoose.connections[0].readyState) {
      return handler(req, res)
    }
    const { DB_CONEXAO_STRING } = process.env

    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ erro: 'ENV de configuraçao do banco, nao informada' })
    }
    mongoose.connection.on('connected', () =>
      console.log('Banco de dados conectado')
    )

    mongoose.connection.on('error', error =>
      console.log(`ocorreu um erro ao conectar no banco: ${error}`)
    )

    await mongoose.connect(DB_CONEXAO_STRING)
    return handler(req, res)
  }
