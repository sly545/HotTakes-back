//mongosse me permet de me conecter a la base de donner

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URL,
{ useNewUrlParser: true,
  useUnifiedTopology: true })  
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

mongoose.export;
