const mongoose = require('mongoose');
//j'importe mongoose unique validator pour eviter que 2 perssone utilise le même mail
const uniqueValidator = require('mongoose-unique-validator');
//création du du shema utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
//j'exporte le shema
module.exports = mongoose.model('users', userSchema);


