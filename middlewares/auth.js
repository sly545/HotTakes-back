//j'appelle jsonwebtoken pour cre un token d'identification

const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    //j'utilise le header de la requette pour recuperrer Bearer Token en utiliser la mehtode split
       const token = req.headers.authorization.split(' ')[1];
       //on compare le token avec la celf  
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       //et on recupere le user id grace JWT
       const userId = decodedToken.userId;
           req.auth = {
           userId: userId
       };
       if (req.body.userId && (req.body.userId !== userId)) {
        
        throw error;
       
      } 
      else {
        next();
      }
   } catch(error) {
       res.status(401).json({ error });
   }
};
