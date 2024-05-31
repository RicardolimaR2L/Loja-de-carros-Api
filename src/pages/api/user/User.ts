import { NextApiRequest, NextApiResponse } from 'next'
import { connectMongoDB } from '../../../midlewares/connectMongoDB'
import { UserModel } from '../../../models/UserModel'
import md5 from 'md5'
import { politicsCORS } from '../../../midlewares/politicsCORS'
import { UserMessagesHelper } from './helpers/messageHelper'
import {emailValidation, nameValidation, passwordValidation} from '../../../validators/userValidator'

const UserRegister = async (req: NextApiRequest, res: NextApiResponse) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[0-9a-zA-Z\W_]{8,}$/
    
  try {
    const { name, email, password } = req?.body

    if (nameValidation(name)) {
      return res.status(400).json({
        erro: UserMessagesHelper.NAME_NOT_VALID
      })
    }
    if (!emailValidation(email)|| !emailRegex.test(req?.body.email)) {
      return res
        .status(400)
        .json({ erro:  UserMessagesHelper.EMAIL_NOT_VALID})
    }
    if (!passwordValidation(password) || !passwordRegex.test(req?.body?.password)) {
      return res.status(400).json({
        erro: UserMessagesHelper.PASSWORD_NOT_VALID
      })
    }
    const savedUser = {
      name: req.body?.name,
      email: req.body?.email,
      password: md5(req.body?.password),
      nivel: req.body?.nivel
    }

    await UserModel.create(savedUser)
    return res
      .status(200)
      .json({ sucesso:  UserMessagesHelper.USER_REGISTER_SUCCESS })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ erro:  UserMessagesHelper.USER_REGISTER_FAILED })
  }
}
export default politicsCORS(connectMongoDB(UserRegister))
