
import { uploadImagemCosmic } from "@/midlewares/uploadImagemCosmic";
import { CarMessagesHelper } from "@/pages/api/cars/helpers/messageHelper";
import { NextApiRequest, NextApiResponse } from "next";


const nameValidation = (name: string): boolean => {
  if (!name) {
    return false;
  }
  return name.toString().length >= 3;
};
const brandValidation = (brand: string): boolean => {
  if (!brand) {
    return false;
  }
  return brand.toString().length >= 3;
};
const modelValidation = (model: string): boolean => {
  if (!model) {
    return false;
  }
  return model.toString().length >= 4;
};
const priceValidation = (price: string): boolean => {
  if (!price) {
    return false;
  }
  return price.toString().length >= 5;
};

const validateCar = (req: NextApiRequest, res: NextApiResponse) => {
  const { name, model, brand, price } = req.body

  if (!nameValidation(name)) {
    return res.status(400).json({ erro: CarMessagesHelper.INVALID_NAME })
  }

  if (!modelValidation(model)) {
    return res.status(400).json({ erro: CarMessagesHelper.INVALID_MODEL })
  }
  if (!brandValidation(brand)) {
    return res.status(400).json({ erro: CarMessagesHelper.INVALID_BRAND })
  }
  if (!priceValidation(price)) {
    return res.status(400).json({ erro: CarMessagesHelper.INVALID_PRICE })
  }
}

const validatePhoto = async (req: NextApiRequest, res: NextApiResponse) => {
  const { file } = req.body
  if (file) {
    const photo = await uploadImagemCosmic(req);
    if (!photo) {

      return;
      
    }
    return photo
  }
}


export { nameValidation, brandValidation, modelValidation, priceValidation, validateCar, validatePhoto }