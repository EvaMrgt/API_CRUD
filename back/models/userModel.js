const mongoose= require('mongoose');
const userModel= new mongoose.Schema({
    email:{
        type:String,
        required:[true,"l'email est requis"],
        unique:[true]
    },
    password:{
        type:String,
        required:[true,"le mot de passe est requis"]
    }
})

const usermodel=mongoose.model('users', userModel);
module.exports=usermodel