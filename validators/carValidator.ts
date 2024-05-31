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

export {nameValidation, brandValidation,  modelValidation,priceValidation}