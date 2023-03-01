const mongoose = require('mongoose');
//je construi le shema selon les exigences fournir par les ressources
const saucesSchema = mongoose.Schema({
  userId: {type: String,required:true},
  name:{type:String,required:true},
  manufacturer:{type:String,required:true},
  description: {type: String, required: true},
  mainPepper:{type: String, required:true },
  imageUrl: {type: String, required: true},
  heat:{type : Number, required:true},
  likes:{type: Number},
  dislikes:{type:Number},
  usersLiked: {type:[String]},
  usersDisliked: {type:[String]},
});
//Et j'exporte le shema
module.exports = mongoose.model('sauces', saucesSchema);

