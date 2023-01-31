const Sauce = require("../models/sauces");

const fs = require("fs");

const { error } = require("console");

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

//logique pour affichez toute les sauces//

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => res.status(400).json({ error }));
};


