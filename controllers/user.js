const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

// Fonction pour gérer l'inscription d'un utilisateur
exports.signup = (req, res, next) => {
  // On utilise bcrypt pour hasher le mot de passe de l'utilisateur
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // On crée un nouvel utilisateur avec l'email et le mot de passe hashé
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // On enregistre l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Fonction pour gérer la connexion d'un utilisateur
exports.login = (req, res, next) => {
  // On cherche l'utilisateur dans la base de données en utilisant son email
  User.findOne({ email: req.body.email })
    .then(user => {
      // Si l'utilisateur n'est pas trouvé, on renvoie une erreur
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // On utilise bcrypt pour comparer le mot de passe entré par l'utilisateur avec le mot de passe hashé stocké dans la base de données
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Si la comparaison échoue, on renvoie une erreur
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // Si la comparaison réussit, on renvoie un token JWT signé contenant l'ID de l'utilisateur et une durée de validité de 24 heures
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};