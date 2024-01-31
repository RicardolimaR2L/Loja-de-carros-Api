import type { NextApiHandler, NextApiResponse, NextApiRequest } from 'next'
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const ValidarTokenJWT =
  (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
      try {
        const { MINHA_CHAVE_JWT } = process.env

        if (!MINHA_CHAVE_JWT) {
          return res.status(500).json({
            erro: 'Env de chave JWT não informada na execução do projeto'
          })
        }
        if (!req || !req.headers) {
          return res
            .status(401)
            .json({ erro: 'Não foi possivel validar o token de acesso' })
        }

        if (req.method !== 'OPTIONS') {
          const authorization = req.headers['authorization']
          if (!authorization) {
            return res
              .status(401)
              .json({ erro: 'Não foi possivel validar o token de acesso' })
          }

          const token = authorization.substring(7)

          if (!token) {
            return res
              .status(401)
              .json({ erro: 'Não foi possivel validar o token de acesso' })
          }
          const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload

          // if (!decoded || (decoded?.nivel !== 'admin' && req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE' && req.method !== 'POST')) {
          //   return res.status(401).json({
          //     erro: 'Esse recurso só pode ser acessado por administradores'
          //   })
          // }
          if (!req.query) {
            req.query = {}
          }
          req.query.userId = decoded._id
        }
      } catch (error) {
        console.log(error)
        return res
          .status(401)
          .json({ erro: 'Não foi possivel validar o token de acesso' })
      }

      return handler(req, res)
    }
