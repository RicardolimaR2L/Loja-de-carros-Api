import { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../../midlewares/conectarMongoDb'
import { UsuarioModel } from '../../../models/UsuarioModel'
import md5 from 'md5'

const CadastroDeUsuario = async (req: NextApiRequest, res: NextApiResponse) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const senhaRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[0-9a-zA-Z\W_]{8,}$/
  try {
    const { nome, email, senha } = req?.body

    if (!nome || nome.length < 5) {
      return res.status(400).json({
        erro: 'Nome invalido, o nome  precisar ter no minimo 5 caracteres'
      })
    }
    if (!email || !emailRegex.test(req?.body.email)) {
      return res
        .status(400)
        .json({ erro: 'Email invalido, o email deve conter @ e . ' })
    }
    if (!senha || !senhaRegex.test(req?.body?.senha)) {
      return res.status(400).json({
        erro: 'Senha invalida, a senha deve conter letras maiúsculas, minúsculas, números e símbolos'
      })
    }
    const UsuarioASerSalvo = {
      nome: req.body?.nome,
      email: req.body?.email,
      senha: md5(req.body?.senha),
      nivel: req.body?.nivel
    }
    await UsuarioModel.create(UsuarioASerSalvo)
    return res
      .status(200)
      .json({ sucesso: 'Cadastro de usuário realizado com sucesso' })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ erro: 'Não foi possível realizar o cadastro de usuário' })
  }
}
export default conectarMongoDB(CadastroDeUsuario)
