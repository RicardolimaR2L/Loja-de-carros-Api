import { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../../midlewares/conectarMongoDb'
import { UsuarioModel } from '../../../models/UsuarioModel'
import md5 from 'md5'

export const CadastroDeUsuario = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { nome, email, senha } = req?.body

    if (!nome || nome.length < 5) {
      return res.status(400).json({ erro: 'Nome invalido' })
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ erro: 'Email invalido' })
    }
    if (!senha || senha.length < 6) {
      return res.status(400).json({ erro: 'Senha invalida' })
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
