const recipeRouter = require('express').Router()
const recipeModel = require('../models/recipeModel')

recipeRouter.post('/recipes', async (req, res) => { //tout chopper
    try {
        const recipeData = { ...req.body };
        if (!recipeData.image || recipeData.image.trim() === '') {
            delete recipeData.image;
        }
        const requiredFields = ['title', 'ingredients', 'instructions', 'timePreparation', 'timeCooking', 'Difficulty', 'Category'];
        for (let field of requiredFields) {
            if (!recipeData[field]) {
                return res.status(400).json({ error: `Le champ ${field} est requis.` });
            }
        }
        const newRecipe = new recipeModel(recipeData);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Erreur de validation', details: error.message });
        } else {
            res.status(500).json({ error: 'Erreur serveur lors de la création de la recette' });
        }
    }
});

recipeRouter.get('/recipes', async (req, res) => { //choper par le name
    try {
        const recipeName = req.query.name;
        let query = {};
        if (recipeName) {
            const cleanrecipeName = recipeName.replace(/^["']|["']$/g, '');
            query.title = new RegExp(cleanrecipeName, 'i');
        }
        const recipes = await recipeModel.find(query)
        console.log("from database", recipes);
        if (recipes.length > 0) {
            res.json(recipes);
        } else {
            res.status(404).json({ message: "Aucune recette n'a été trouvé" });
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des recettes" });
    }
});

recipeRouter.get('/recipes/:id', async (req, res) => { //choper par id
    try {
        const recipe = await recipeModel.findOne({ _id: req.params.id })
        res.json(recipe)
    } catch (error) {
        res.json(error)
    }
})

recipeRouter.put('/recipes/:id', async (req, res) => { //modifier
    try {
        await recipeModel.updateOne({ _id: req.params.id }, req.body)
        res.json({ message: "le recette a bien été modifiée" })
    } catch (error) {
        res.json(error)
    }
})

recipeRouter.delete('/recipes/:id', async (req, res) => { //delete
    try {
        await recipeModel.deleteOne({ _id: req.params.id })
        res.json({ message: "le recette a bien été supprimée" })
    } catch (error) {
        res.json(error)
    }
})

recipeRouter.get('/recipes', async (req, res) => {
    try {
        const { name, ingredient, category } = req.query;
        let query = {};

        if (name) {
            query.title = new RegExp(name.replace(/^["']|["']$/g, ''), 'i');
        }
        if (ingredient) {
            query.ingredients = new RegExp(ingredient, 'i');
        }
        if (category) {
            query.category = new RegExp(category, 'i');
        }

        const recipes = await recipeModel.find(query).select("title ingredients category");

        if (recipes.length > 0) {
            res.json(recipes);
        } else {
            res.status(404).json({ message: "Aucune recette n'a été trouvée" });
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des recettes" });
    }
});

recipeRouter.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await recipeModel.findById(req.params.id);
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: "Recette non trouvée" });
        }
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la recette" });
    }
});

module.exports = recipeRouter