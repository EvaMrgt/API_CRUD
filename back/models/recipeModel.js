const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "le titre est requis"]
    },
    ingredients: {
        type: [String],
    },
    instructions: {
        type: [String],
    },
    timePreparation: {
        type: String,
        required: [true, "le temps de préparation est requis"]
    },
    timeCooking: {
        type: String,
        required: [true, "le temps de cuisson est requis"]
    },
    Difficulty: {
        type: String,
        require: [true, "La difficulté est requise"]
    },
    Category: {
        type: String,
        require: [true, "La catégorie est requise"]
    },
    image: {
        type: String, //multer pour les pictures
    },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'users',
    //     required: [true, "L'identifiant de l'utilisateur est requis"]
    // }
})
const recipeModel = mongoose.model('recipes', recipeSchema);
module.exports = recipeModel