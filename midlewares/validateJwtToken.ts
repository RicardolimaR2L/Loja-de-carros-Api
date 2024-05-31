import type { NextApiHandler, NextApiResponse, NextApiRequest } from 'next'
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { MiddlewareMessagesHelper } from './helpers/messageHelper'

export const validateJwtToken =
  (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
      try {
        const { JWT_KEY } = process.env

        if (!JWT_KEY) {
          return res.status(500).json({
            erro: MiddlewareMessagesHelper.ENV_JWT_NOT_INFORMED
          })
        }
        if (!req || !req.headers) {
          return res
            .status(401)
            .json({ erro: MiddlewareMessagesHelper.TOKEN_VALIDATION_ERROR })
        }

        if (req.method !== 'OPTIONS') {
          const authorization = req.headers['authorization']
          if (!authorization) {
            return res
              .status(401)
              .json({ erro: MiddlewareMessagesHelper.TOKEN_VALIDATION_ERROR })
          }

          const token = authorization.substring(7)

          if (!token) {
            return res
              .status(401)
              .json({ erro: MiddlewareMessagesHelper.TOKEN_VALIDATION_ERROR })
          }
          const decoded = jwt.verify(token, JWT_KEY) as JwtPayload
          if (!req.query) {
            req.query = {}
          }
          req.query.userId = decoded._id
        }
      } catch (error) {
        console.log(error)
        return res
          .status(401)
          .json({ erro: MiddlewareMessagesHelper.TOKEN_VALIDATION_ERROR })
      }

      return handler(req, res)
    }
