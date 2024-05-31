import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import mongoose from 'mongoose'
import { MiddlewareMessagesHelper } from './helpers/messageHelper'

export const connectMongoDB =
  (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      if (mongoose.connections[0].readyState) {
        return handler(req, res)
      }
      const { DB_CONNECTION_STRING } = process.env

      if (!DB_CONNECTION_STRING) {
        return res
          .status(500)
          .json({ erro: MiddlewareMessagesHelper.DB_CONNECTION_STRING_NOT_PROVIDED })
      }
      mongoose.connection.on('connected', () =>
        console.log(MiddlewareMessagesHelper.CONNECTED_DATABASE)
      )

      mongoose.connection.on('error', error =>
        console.log(MiddlewareMessagesHelper.CONNECTED_DATABASE_ERROR, error)
      )

      await mongoose.connect(DB_CONNECTION_STRING)
      return handler(req, res)
    }
