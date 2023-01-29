const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_USER_MDP}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_COLLECTION}`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })  
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

mongoose.export;