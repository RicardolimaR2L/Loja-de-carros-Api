import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg'
import NextCors from 'nextjs-cors'
import { MiddlewareMessagesHelper } from './helpers/messageHelper'

export const politicsCORS =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      await NextCors(req, res, {
        origin: '*',
        method: ['GET', 'POST', 'PUT' ,'DELETE', 'OPTIONS', 'PATCH', 'HEAD'], 
        optionsSuccessStatus: 200 
      })

      return handler(req, res)
    } catch (e) {
      console.log(e)
      return res
        .status(500)
        .json({ erro: MiddlewareMessagesHelper.CORS_POLICY_ERROR })
    }
  }
