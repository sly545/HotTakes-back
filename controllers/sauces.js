const Sauce = require("../models/sauces");

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
      )}/:images/defaut/imagedefaut.png`,
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



//logique pour modifier la sauces  //
//La fonction "modifySauce" utilise la méthode "findOne" pour trouver une entrée de sauce dans la base de données en utilisant l'ID fourni dans la requête (req.params.id).
exports.modifySauce = (req, res, next) => {
  
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Si une entrée de sauce est trouvée, la fonction requise si l'utilisateur qui envoie la requête (req.auth.userId) est le propriétaire de l'entrée de sauce. 
      let sauceBot;
      const heatAvant = sauce.heat;
      // Création d'un objet avec des propriétés non modifiables.
        const immuable = {
        userId: req.auth.userId,
        likes: sauce.likes,
        dislikes: sauce.dislikes,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
      };
      // Si la sauce n'appartient pas à l'utilisateur authentifié,pour le savoir on verifie si id de l'utilisateur est le meme que celui du token,
      //si c'est pas le memem on renvoie une erreur 403,
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json("unauthorized request");

      } else if (req.file) {
      //la fonction reguarde si un fichier est inclus dans la requête. 
       //Si c'est le cas, le fichier est vérifié pour vérifier s'il s'agit d'un format d'image valide (jpeg, png, jpg, etc.).
        if (
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
          //je nomme le non de l'encien fichier image
          const filename = sauce.imageUrl.split("/images/")[1];
          // si ce lui çi correspond à une partie du nom de l'image par defaut
          const testImage = 'defaut/imagedefaut.png';
           // si le nom de l'image ne correspont pas à l'image defaut
          if(testImage != filename){
            //on efface le fichier qu'on remplace garce à fs
          fs.unlink(`images/${filename}`, () => {});
          }

          //j'extrait la sauce de la requete avec parse dans et j'ajoute les infos de description et l'image.
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
            ...immuable,
          };

          sauceBot = sauceObject;


        } 
        // Si le fichier téléchargé n'est pas une image, utilise une image par défaut
        else {
          const filename = sauce.imageUrl.split("/images/")[1];
          
          const testImage = 'defaut/imagedefaut.png';
          if(testImage != filename){
          fs.unlink(`images/${filename}`, () => {});
          }
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
           
            imageUrl: `${req.protocol}://${req.get(
              "host"
            )}/images/defaut/imagedefaut.png`,
            ...immuable,
          };
          sauceBot = sauceObject;
        }
      } else {
        req.body.imageUrl = sauce.imageUrl;
        const sauceObject = {
          ...req.body,
          ...immuable,
        };
        sauceBot = sauceObject;
      }

      if (sauceBot.heat < 0 || sauceBot.heat > 10) {
        sauceBot.heat = heatAvant;
        console.log("valeur heat invalide, ancienne valeur heat conservée");
      }

      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceBot, _id: req.params.id }
      )
        .then(() =>
          res
            .status(201)
            .json({ message: "modified sauce (FR)Objet modifié !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      if (req.file) {
        
        fs.unlink(`images/${req.file.filename}`, () => {});
      }
      
      res.status(404).json({ error });
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

/// LOGIQUE pour like et disliker les sauces

exports.likeSauce = (req, res, next) => {
  
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let valeurVote;
      let votant = req.body.userId;
      let like = sauce.usersLiked;
      let unlike = sauce.usersDisliked;
      let bon = like.includes(votant);
      let mauvais = unlike.includes(votant);
      if (bon === true) {
        valeurVote = 1;
      } else if (mauvais === true) {
        valeurVote = -1;
      } else {
        valeurVote = 0;
      }
  
      if (valeurVote === 0 && req.body.like === 1) {
       
        sauce.likes += 1;
        
        sauce.usersLiked.push(votant);
      } else if (valeurVote === 1 && req.body.like === 0) {
        sauce.likes -= 1;
        const nouveauUsersLiked = like.filter((f) => f != votant);
        sauce.usersLiked = nouveauUsersLiked;
      } else if (valeurVote === -1 && req.body.like === 0) {
        sauce.dislikes -= 1;
      
        const nouveauUsersDisliked = unlike.filter((f) => f != votant);
        sauce.usersDisliked = nouveauUsersDisliked;
    
      } else if (valeurVote === 0 && req.body.like === -1) {
    
        sauce.dislikes += 1;
        sauce.usersDisliked.push(votant);
      } else {
        console.log("tentavive de vote illégal");
      }
      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
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

