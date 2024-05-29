const nameValidation = (name: string): boolean => {
    if (!name) {
      return false;
    }
    return name.toString().length >= 2;
  };
 
  const emailValidation = (email: string): boolean => {
    if (!email) {
      return false;
    }
    return  email.length >= 5 && email.includes('@') && email.includes('.')
  };
  const passwordValidation = (password: string): boolean => {
    if (!password) {
      return false;
    }
    return password.toString().length >= 8;
  };
  
  export {nameValidation,emailValidation, passwordValidation}