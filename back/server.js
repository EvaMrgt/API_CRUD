const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const recipeRouter = require('./routers/recipeRouter');
const userRouter = require('./routers/userRouter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(recipeRouter);
app.use(userRouter)
app.listen(3002, (err)=>{
    if(err) {
        console.log(err);
    }else {
        console.log('Server is running on port 3002');
    }
})

mongoose.connect('mongodb://localhost:27017/recipes')