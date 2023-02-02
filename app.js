const express = require('express');
const app = express();


const helmet = require("helmet");

// Middleware helmet pour sécuriser les en-têtes HTTP
// ça me bloquai les photos ils faut le configurer comme ça
app.use(helmet.contentSecurityPolicy({
  directives: {
    'img-src': [`'self'`],
    'default-src': [`'self'`]
  }
}))

//?? je sais plus ç'est que çe truc
const path = require("path");



// Variables d'environnements
require("dotenv").config();

// Connexion DB
require("./db/connection");

// Middleware d'authentification
const auth =require("./middlewares/auth");

// Import des routers
const saucesRouter = require("./routes/sauces");
const usersRouter = require("./routes/user");

 
// CORS
app.use((req, res, next) => {
  // Autorise les requêtes depuis tous les domaines
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Autorise certains en-têtes
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  // Autorise les méthodes HTTP
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});




// Middleware de body parsing
app.use(express.json());




// Middleware express-rate-limit pour bloquer les brute forces


// Route de test
app.get('/', (req, res) => {
  res.send('HotTakes API is running !');
});


// Sauces router
app.use('/api/sauces', saucesRouter);
// User router
app.use('/api/auth', usersRouter);
app.use('/images',express.static(path.join(__dirname,'images')));


module.exports = app;

