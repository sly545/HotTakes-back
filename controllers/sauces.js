const Sauce = require("../models/sauces");

const fs = require("fs");

const { error } = require("console");

//logique pour affichez toute les sauces//

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => res.status(400).json({ error }));
};



exports.getOneSauce = (req, res, next) => {
  
  Sauce.findOne({ _id: req.params.id })
   
    .then((sauce) => res.status(200).json(sauce))
    
    .catch((error) => res.status(404).json({ error }));
};
// logique por crée  sauces


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const initialisation = {
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  };

  if (sauceObject.userId !== req.auth.userId) {
   
    return res.status(403).json("unauthorized request");
    
  } else if (
    req.file.mimetype === "image/jpeg" ||
    req.file.mimetype === "image/png" ||
    req.file.mimetype === "image/jpg" ||
    req.file.mimetype === "image/bmp" ||
    req.file.mimetype === "image/gif" ||
    req.file.mimetype === "image/ico" ||
    req.file.mimetype === "image/svg" ||
    req.file.mimetype === "image/tiff" ||
    req.file.mimetype === "image/tif" ||
    req.file.mimetype === "image/webp"
  ) {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      ...initialisation,
    });
    if (sauce.heat < 0 || sauce.heat > 10) {
      sauce.heat = 0;
      console.log("valeur heat invalide, heat initialisé");
    }
    sauce
      .save()
      .then(() =>
        res
          .status(201)
          .json({ message: "POST recorded sauce (FR)sauce enregistrée !" })
      )
      .catch((error) => res.status(400).json({ error }));
   
  } else {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get(
        "host"
      )}/images/defaut/imagedefaut.png`,
      ...initialisation, 
    });
    if (sauce.heat < 0 || sauce.heat > 10) {
      sauce.heat = 0;
      console.log("valeur heat invalide, heat initialisé");
    }
    sauce
      .save()
      .then(() =>
        res
          .status(201)
          .json({ message: "POST recorded sauce (FR)sauce enregistrée !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }
};



//logique pour modifier la sauces//

exports.modifySauce = (req, res, next) => {
  const SauceObject = req.file ? {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete SauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((Sauce) => {
          if (Sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...SauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
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


