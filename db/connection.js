const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sylvain:ROMbibamb01@cluster0.hne8jxc.mongodb.net/test',
{ useNewUrlParser: true,
  useUnifiedTopology: true })  
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

mongoose.export;
