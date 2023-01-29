const express = require("express");
const router = express.Router();
const saucesControl = require("../controllers/user");

//Hachage du mot de passe
//de l'utilisateur, ajout de
//l'utilisateur à la base de
//données//
router.post("/signup", (req, res) => {
  res.status(200).json({ "user": "Utilisateur bien enregistré" });
});

//Vérification des
//token: string }
//informations d'identification
//de l'utilisateur,
//renvoie l _id de l'utilisateur
//depuis la base de données
//et un token web JSON signé
//(contenant également l'_id
//de l'utilisateur).
router.post("/login", (req, res) => {
  res.status(200).json({ "user": "Utilisateur bien conécter" });
});

// on exporte router
module.exports = router;
