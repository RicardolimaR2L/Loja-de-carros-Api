import { NextApiRequest, NextApiResponse } from 'next'
import { CarrosModel } from '../../../models/CarroModel'
import { conectarMongoDB } from '../../../midlewares/conectarMongoDb'
import { ValidarTokenJWT } from '../../../midlewares/validarTokenJwt'
import {
  upload,
  uploadImagemCosmic
} from '../../../midlewares/uploadImagemCosmic'
import nc from 'next-connect'
import { politicaCORS } from '../../../midlewares/politicaCors'

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      console.log(req.body)
      const { nome, modelo, marca, preco } = req.body
      if (!nome || nome.length < 3) {
        return res.status(400).json({ erro: 'Nome invalido' })
      }
      if (!modelo || modelo.length < 3) {
        return res.status(400).json({ erro: 'Modelo invalido' })
      }
      if (!marca || marca.length < 3) {
        return res.status(400).json({ erro: 'Marca invalida' })
      }
      if (!preco || preco.length < 5) {
        return res.status(400).json({ erro: 'preço invalido' })
      }
      const foto = await uploadImagemCosmic(req)

      if (!foto) {
        return res.status(400).json({ erro: 'Foto invalida' })
      }
      const CarroASerSalvo = {
        nome: nome,
        modelo: modelo,
        marca: marca,
        foto: foto,
        preco: preco
      }
      await CarrosModel.create(CarroASerSalvo)
      return res.status(200).json({ msg: 'Carro cadastrado com sucesso' })
    } catch (e: any) {
      console.log(e)
      return res.status(500).json({
        erro:
          'Não  foi possivel realizar o cadastro, verifique os dados enviados ' +
          e.toString()
      })
    }
  })

  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = req?.body?.id
      if (!id) {
        return res
          .status(500)
          .json({ error: 'Não foi possível localizar o carro' })
      }
      const { nome, modelo, marca, preco } = req.body
      if (!nome || nome.length < 3) {
        return res.status(401).json({
          erro: 'Nome invalido, o nome precisa ter no mínimo 3 caracteres'
        })
      }
      if (!modelo || modelo.length < 4) {
        return res.status(401).json({
          erro: 'Modelo invalido, o modelo precisa ter no mínimo 4 caracteres'
        })
      }
      if (!marca || marca.length < 3) {
        return res.status(401).json({
          erro: 'Marca invalida,  a marca precisa ter no mínimo 3 caracteres'
        })
      }
      if (!preco || preco.length < 5) {
        return res.status(401).json({
          erro: 'preço invalido, o preço precisa ter no mínimo 5 caracteres'
        })
      }
      const foto = await uploadImagemCosmic(req)
      console.log(foto)
      
      
      
      const carroExistenteNoBanco = await CarrosModel.findById(id)
      console.log(carroExistenteNoBanco)
      
      if (!carroExistenteNoBanco) {
        return res.status(404).json({ error: 'Carro não encontrado' })
      }
      
      carroExistenteNoBanco.nome = nome
      carroExistenteNoBanco.modelo = modelo
      carroExistenteNoBanco.marca = marca
      carroExistenteNoBanco.preco = preco
      
      const carroAtualizado = await CarrosModel.findByIdAndUpdate(
        id,
        {
          nome,
          modelo,
          marca,
          preco,
          ...(foto && { foto })
        },
        { new: true }
        )
        console.log(carroAtualizado)

      return res.status(200).json({ carroAtualizado })
    } catch (error) {
      return res.status(500).json({
        error: 'Não foi possível atualizar as informações do carro solicitado'
      })
    }
  })

  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = req?.query?.id
      const CarroASerdeletado = await CarrosModel.findById(id)
      if (!CarroASerdeletado) {
        return res.status(404).json({ erro: 'Carro nao encontrado' })
      }
      const carroDeletado = await CarrosModel.findByIdAndDelete(id)
      return res.status(200).json({ msg: 'Carro excluído com sucesso' })
    } catch (error) {
      console.log(error)
      return res
        .status(401)
        .json({ erro: 'Não foi possicel excluir o carro solicitado' })
    }
  })

export const config = {
  api: {
    bodyParser: false
  }
}

export default politicaCORS(ValidarTokenJWT(conectarMongoDB(handler)))
