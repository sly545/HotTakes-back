//j'appelle jsonwebtoken pour crée un token d'identification

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const like = req.body.like; // Ajouter cette ligne pour récupérer la valeur de like

    req.auth = {
      userId: userId,
      like: like // Ajouter cette ligne pour stocker la valeur de like
    };

    if (req.body.userId && (req.body.userId !== userId)) {
      throw error;
    } else {
      next();
    }
  } catch(error) {
    res.status(401).json({ error });
  }
};
