const Sauce = require("../models/sauces"); // j'importe le model des sauces

const fs = require("fs");

const { error } = require("console");

//logique pour affichez toute les sauces//

exports.getAllSauce = (req, res, next) => {

  console.log('Get All Sauces');

  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => res.status(400).json({ error }));
};


// Logique pour recup une sauce
exports.getOneSauce = (req, res, next) => {
  console.log('Get One Sauces');

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(sauce);
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(404).send(error));
};



// logique pour crée une sauce
// La fonction createSauce est exportée comme middleware pour la route POST /api/sauces
exports.createSauce = async (req, res, next) => {
  try {
    // Conversion de la chaîne de caractères JSON en objet JS
    const sauceObject = JSON.parse(req.body.sauce);
    // Récupération de l'ID utilisateur dans le token d'authentification
    const userId = req.auth.userId;
    // Vérification que l'utilisateur est autorisé à ajouter une sauce
    if (sauceObject.userId !== userId) {
      return res.status(403).json("unauthorized request");
    }
    // Création d'une nouvelle instance de Sauce avec les données de la requête
    const sauce = new Sauce({
      ...sauceObject, // Copie toutes les propriétés de sauceObject
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // Ajout de l'URL de l'image
      likes: 0, // Initialisation des likes à 0
      dislikes: 0, // Initialisation des dislikes à 0
      usersLiked: [], // Initialisation du tableau des utilisateurs ayant liké à vide
      usersDisliked: [], // Initialisation du tableau des utilisateurs ayant disliké à vide
      heat: Math.min(Math.max(sauceObject.heat, 0), 10), // Vérification de la validité de la valeur heat et initialisation à 0 si invalide
    });
    // Sauvegarde de la nouvelle sauce dans la base de données
    await sauce.save();
    // Renvoi de la réponse avec le code de statut 201 et un message de confirmation
    res.status(201).json({ message: "POST recorded sauce (FR)sauce enregistrée !" });
  } catch (error) {
    // Renvoi de la réponse avec le code de statut 400 et l'erreur rencontrée
    res.status(400).json({ error });
  }
};






// Si l'opération est réussie, elle renvoie un message indiquant que l'objet a été modifié 
exports.modifySauce = async (req, res, next) => {
  try {
    // Récupération de la sauce à modifier
    const sauce = await Sauce.findById(req.params.id);

    // Vérification que l'utilisateur a le droit de modifier la sauce
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json("unauthorized request");
    }

    // Création d'un objet immuable contenant les données à ne pas modifier
    const immuable = {
      userId: req.auth.userId,
      likes: sauce.likes,
      dislikes: sauce.dislikes,
      usersLiked: sauce.usersLiked,
      usersDisliked: sauce.usersDisliked,
    };

    // Création d'un objet représentant la nouvelle sauce
    const sauceObject = {
      ...req.body,
      ...immuable,
    };

    // Si une nouvelle image est incluse dans la requête, on la traite
    if (req.file) {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {});
      sauceObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }

    // Si la valeur de heat est invalide, on conserve l'ancienne valeur
    if (sauceObject.heat < 0 || sauceObject.heat > 10) {
      sauceObject.heat = sauce.heat;
      console.log("valeur heat invalide, ancienne valeur heat conservée");
    }

    // Mise à jour de la sauce dans la base de données
    await Sauce.updateOne({ _id: req.params.id }, sauceObject);

    res.status(201).json({ message: "modified sauce (FR)Objet modifié !" });
  } catch (error) {
    // En cas d'erreur, on supprime l'image si elle a été uploadée
    if (req.file) {
      fs.unlink(`images/${req.file.filename}`, () => {});
    }
    res.status(404).json({ error });
  }
};



 
//logique pour suprimer la sauces

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(Sauce => {
          if (Sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = Sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


/// LOGIQUE pour like et disliker les sauces

// Mettre à jour le nombre de likes et de dislikes pour une sauce donnée
exports.likeSauce = (req, res, next) => {
  const { id } = req.params;
  const { userId, like } = req.auth; // Récupérer les données d'authentification

  let incLikes = 0, incDislikes = 0;

  // Trouver la sauce correspondante dans la base de données
  Sauce.findOne({ _id: id }).then(sauce => {
    const usersLiked = sauce.usersLiked || [];
    const usersDisliked = sauce.usersDisliked || [];
    const userIndex = usersLiked.indexOf(userId);
    const userDislikedIndex = usersDisliked.indexOf(userId);

    // Mettre à jour les tableaux d'utilisateurs qui ont aimé ou n'ont pas aimé la sauce
    if (like === 1) {
      if (userIndex < 0) {
        usersLiked.push(userId);
        incLikes = 1;
      }
    } else if (like === -1) {
      if (userDislikedIndex < 0) {
        usersDisliked.push(userId);
        incDislikes = 1;
      }
    } else if (like === 0) {
      if (userIndex >= 0) {
        usersLiked.splice(userIndex, 1);
        incLikes = -1;
      } else if (userDislikedIndex >= 0) {
        usersDisliked.splice(userDislikedIndex, 1);
        incDislikes = -1;
      }
    }

    // Mettre à jour les données de la sauce dans la base de données
    Sauce.updateOne(
      { _id: id },
      {
        $inc: { likes: incLikes, dislikes: incDislikes },
        $set: { usersLiked: usersLiked, usersDisliked: usersDisliked }
      }
    )
      .then(() => res.status(201).json({ message: "Vous venez de voter" }))
      .catch((error) => {
        if (error) {
          console.log(error);
        }
      });
  })
  .catch((error) => res.status(404).json({ error }));
};
