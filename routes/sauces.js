const express = require("express");
const router = express.Router();
const saucesController = require("../controllers/sauces");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer_conf");

// GET /api/sauces/
// Recup la liste des sauces
router.get('/', (req, res) => {
  res.status(200).json({ "sauces": "La tableau des sauces" });
});


// POST /api/sauces/
// Enregistre une sauce en DB
router.post('/', (req,res) => {
  res.status(200).json({"sauces": "sauce bien enregister"})
});

// GET /api/sauces/:id
// Recup une sauce par son id
router.get('/:id', (req, res) => {
  res.status(200).json({ "sauces": "Voici la sauce que vous avez demandés" });
});


router.put('/:id', (req, res) => {
  res.status(200).json({ "sauces": "sauces modifier" });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ "sauces": "sauces suprimer" });
});



router.post ('/:id/like',(req,res)=> {
  res.status(200).json({"sauces": "votre like est ajouter" })
});

// on exporte router
module.exports = router;
