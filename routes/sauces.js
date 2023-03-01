const express = require("express");
const router = express.Router();
const saucesController = require("../controllers/sauces");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer_conf");



// GET /api/sauces/
// Recup la liste des sauces
router.get('/',auth,saucesController.getAllSauce,(req, res) => {
  res.status(200).json({ "sauces": "La tableau des sauces" });
});


// POST /api/sauces/
// Enregistre une sauce en DB
router.post('/',auth,multer,saucesController.createSauce,(req,res) => {
  res.status(200).json({ "sauces": "sauce bien enregistrer" });
});

// GET /api/sauces/:id
// Recup une sauce par son id
router.get('/:id',auth,saucesController.getOneSauce,(req, res) => {
  res.status(200).json({ "sauces": "Voici la sauce que vous avez demandés" });
});

//route pour modifier les sauces
router.put('/:id',auth,multer,saucesController.modifySauce,(req, res) => {
  res.status(200).json({ "sauces": "sauces modifier" });
});

//route pour suprimer les sauces
router.delete('/:id',auth,saucesController.deleteSauce,(req, res) => {
  res.status(200).json({ "sauces": "sauces suprimer" });
});


//route pour liker les sauces
router.post ('/:id/like',auth,saucesController.likeSauce,(req,res)=> {
  res.status(200).json({"sauces": "votre like est ajouter" })
});

// on exporte router
module.exports = router;
