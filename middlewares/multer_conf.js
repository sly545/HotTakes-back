const multer = require("multer");

// Liste des types MIME acceptés pour les fichiers image
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/bmp": "bmp",
  "image/gif": "gif",
  "image/x-icon": "ico",
  "image/svg+xml": "svg",
  "image/tiff": "tif",
  "image/tif": "tif",
  "image/webp": "webp",
};

// Fonction pour vérifier si le type MIME d'un fichier est accepté
const isAcceptedMimeType = (mimetype) => {
  return Object.keys(MIME_TYPES).includes(mimetype);
};

// Fonction pour générer le nom du fichier en utilisant son nom d'origine, la date actuelle et son extension
const generateFileName = (file) => {
  const name = file.originalname.split(" ").join("_");
  const extension = MIME_TYPES[file.mimetype];
  return name + Date.now() + "." + extension;
};

// Configuration de l'objet de stockage pour multer
const storage = multer.diskStorage({
  // Fonction pour déterminer le dossier de destination des fichiers téléchargés
  destination: (req, file, callback) => {
    // Si le type MIME du fichier est accepté, il est stocké dans le dossier 'images', sinon dans le dossier 'isole'
    callback(null, isAcceptedMimeType(file.mimetype) ? "images" : "isole");
  },
  // Fonction pour déterminer le nom du fichier téléchargé
  filename: (req, file, callback) => {
    if (isAcceptedMimeType(file.mimetype)) {
      // Si le type MIME du fichier est accepté, on utilise la fonction generateFileName pour générer son nom
      callback(null, generateFileName(file));
    } else {
      // Si le type MIME du fichier n'est pas accepté, on affiche un message d'erreur et on ajoute l'ID de l'utilisateur au nom du fichier
      console.log("fichier non accepté seul les images sont autoriser");
      callback(null, req.auth.userId + "_" + generateFileName(file));
    }
  },
});

// Export du middleware multer configuré avec l'objet de stockage créé précédemment
module.exports = multer({ storage }).single("image");
