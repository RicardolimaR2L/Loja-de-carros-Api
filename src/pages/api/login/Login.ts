import { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../../../midlewares/conectarMongoDb'
import { UsuarioModel } from '../../../../models/UsuarioModel'
import Jwt from 'jsonwebtoken'
import md5 from 'md5'
import { RespostaPadraoMsg } from '../../../../types/RespostaPadraoMsg'
import { LoginResposta } from '../../../../types/LoginResposta'
import { politicaCORS } from '../../../../midlewares/politicaCors'
import { LoginMessagesHelper } from './helpers/messageHelper'

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {
  const { MINHA_CHAVE_JWT } = process.env
  if (!MINHA_CHAVE_JWT) {
    return res.status(500).json({ erro: LoginMessagesHelper.ENV_JWT_NOT_INFORMED })
  }

  if (req.method === 'POST') {
    const { login, senha } = req?.body
    const usuarioEncontrado = await UsuarioModel.find({
      email: login,
      senha: md5(senha)
    })
    if (usuarioEncontrado && usuarioEncontrado.length > 0) {
      const usuario = usuarioEncontrado[0]

      const token = Jwt.sign(
        { _id: usuario._id, nivel: usuario?.nivel },
        MINHA_CHAVE_JWT
      )
      return res
        .status(200)
        .json({ nome: usuario.nome, email: usuario.email, token })
    }
    return res.status(405).json({ erro: LoginMessagesHelper.USER_OR_PASSWORD_NOT_FOUND})
  }
  return res.status(405).json({ erro:LoginMessagesHelper.METHOD_NOT_VALID })
}
export default politicaCORS(conectarMongoDB(endpointLogin))
