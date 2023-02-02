let passwordValidator = require('password-validator');
let passwordSchema = new passwordValidator();
// le modèle du mot de passe
passwordSchema
.is().min(8)
.is().max(20)
.has().uppercase(1)
.has().lowercase()
.has().symbols(1)
.has().digits(1)
.is().not(/[\]()[{}<>@]/)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = passwordSchema;
console.log("---<CONTENU passwordScema");
console.log(passwordSchema);

/* module.exports = (req ,res,next) => {
  if (passwordSchema.validate(req.body.passwordSchema)){
   next();
  }else{
    return res.status(400).json({error:`le mots de passe n'est pas assez fort ${passwordSchema.validate('req.body.password',{ list: true})}`})
  }
} */