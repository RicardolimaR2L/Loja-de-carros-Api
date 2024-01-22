import { createBucketClient } from '@cosmicjs/sdk'
import multer from 'multer'

const { BUCKET_SLUG_CARROS, CHAVE_LEITURA_CARROS, CHAVE_DE_GRAVACAO_CARROS } =
  process.env

const cosmic = createBucketClient({
  bucketSlug: BUCKET_SLUG_CARROS as string,
  readKey: CHAVE_LEITURA_CARROS as string,
  writeKey: CHAVE_DE_GRAVACAO_CARROS as string
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadImagemCosmic = async (req: any) => {
  if (req?.file?.originalname) {
    if (
      !req.file.originalname.includes('.png') &&
      !req.file.originalname.includes('.jpg') &&
      !req.file.originalname.includes('.jpeg')
    ) {
      throw new Error('Extensao da imagem invalida')
    }

    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer
    }

    let folder = 'carros'
    if (req.url && req.url.includes('carros')) {
      folder = 'carros'
    }

    const response = await cosmic.media.insertOne({
      media: media_object,
      folder: folder
    })

    return response.media.url
  }
}

export { upload, uploadImagemCosmic }
