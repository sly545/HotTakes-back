//j'importe dans le paquet password validator pour securiser l'authentificatin du mots de passe
let passwordValidator = require('password-validator');
//et je l'inscrie dans une variable.
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
.is().not().oneOf(['Passw0rd', 'Password123']); // les blackliste pour eviter qu'un utilisateur metre des mots de passe faibles

module.exports = passwordSchema;

