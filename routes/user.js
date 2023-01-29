const express = require("express");
const router = express.Router();
const saucesControl = require("../controllers/user");

// POST inscription
router.post("/signup", (req, res) => {
  res.status(200).json({ "user": "Utilisateur bien enregistré" });
});


// on exporte router
module.exports = router;
