//securiter contre les attaque de force brute 
const raterLimit = require("express-rate-limit");

//configuration pour limiter le nombre de tentative infructueuse à 50 essai ,apres 50 essai il faudrait atendre 5 mn puis 60 puis 1000.
const limiter = raterLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 essais
});


module.exports = limiter;

