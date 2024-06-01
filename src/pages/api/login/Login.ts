import { NextApiRequest, NextApiResponse } from 'next'
import { connectMongoDB } from '../../../midlewares/connectMongoDB'
import { UserModel } from '../../../models/UserModel'
import Jwt from 'jsonwebtoken'
import md5 from 'md5'
import { RespostaPadraoMsg } from '../../../types/RespostaPadraoMsg'
import { LoginResposta } from '../../../types/LoginResposta'
import { politicsCORS } from '../../../midlewares/politicsCORS'
import { LoginMessagesHelper } from './helpers/messageHelper'

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {
  const { JWT_KEY } = process.env
  if (!JWT_KEY) {
    return res.status(500).json({ erro: LoginMessagesHelper.ENV_JWT_NOT_INFORMED })
  }

  if (req.method === 'POST') {
    const { login, password } = req?.body
    const userFound = await UserModel.find({
      email: login,
      password: md5(password)
    })
    if (userFound && userFound.length > 0) {
      const user = userFound[0]

      const token = Jwt.sign(
        { _id: user._id, nivel: user?.nivel },
        JWT_KEY
      )
      return res
        .status(200)
        .json({ name: user.name, email: user.email, token })
    }
    return res.status(405).json({ erro: LoginMessagesHelper.USER_OR_PASSWORD_NOT_FOUND})
  }
  return res.status(405).json({ erro:LoginMessagesHelper.METHOD_NOT_VALID })
}
export default politicsCORS(connectMongoDB(endpointLogin))
