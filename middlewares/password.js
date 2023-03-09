//j'importe passorwd validator pour securiser les mots passe avec les bonnes pratique de securiter
const passwordSchema = require('../models/password');

//model avec ajout de passorwd validator
module.exports = (req ,res,next) => {
  if (passwordSchema.validate(req.body.password)){
   next();
  }else{
    console.log(`le mots de passe n'est pas assez fort ${passwordSchema.validate('req.body.password',{ list: true})}`);
    return res.status(400).json({error:`le mots de passe n'est pas assez fort ${passwordSchema.validate('req.body.password',{ list: true})}`})
  }
} 
