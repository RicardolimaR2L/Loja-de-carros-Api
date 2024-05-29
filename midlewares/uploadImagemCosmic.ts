import { createBucketClient } from '@cosmicjs/sdk'
import multer from 'multer'
import { MiddlewareMessagesHelper } from './helpers/messageHelper'

const {CAR_BUCKET_SLUG,CAR_READ_KEY,CAR_WRITE_KEY  } =
  process.env

const cosmic = createBucketClient({
  bucketSlug:CAR_BUCKET_SLUG as string,
  readKey: CAR_READ_KEY as string,
  writeKey: CAR_WRITE_KEY as string
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
      throw new Error(MiddlewareMessagesHelper.IMAGE_NOT_VALID)
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
