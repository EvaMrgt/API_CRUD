const API_URL = 'http://127.0.0.1:3002/recipes';

// Fonction pour créer un élément de recette
function createRecipeElement(recipe, container) {
    if (!recipe) {
        displayError("Invalid recipe data");
        return;
    }
    try {
        const recipeArticle = document.createElement('article');
        recipeArticle.classList.add('bg-gray-800', 'rounded-lg', 'overflow-hidden', 'transition-transform', 'duration-300', 'hover:scale-105', 'relative');

        const imageElement = document.createElement('img');
        imageElement.src = recipe.image || "";
        imageElement.alt = recipe.title;
        imageElement.classList.add('w-full', 'h-48', 'object-cover');
        recipeArticle.appendChild(imageElement);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('p-4');

        const titleElement = document.createElement('h3');
        titleElement.classList.add('text-xl', 'font-semibold', 'mb-2', 'text-blue-300');
        titleElement.textContent = recipe.title;
        contentDiv.appendChild(titleElement);

        const infoElement = document.createElement('p');
        infoElement.classList.add('text-gray-300', 'text-sm', 'mb-2');
        infoElement.innerHTML = `
            <span class="font-bold">Prep:</span> ${recipe.timePreparation} min | 
            <span class="font-bold">Cook:</span> ${recipe.timeCooking} min | 
            <span class="font-bold">Difficulty:</span> ${recipe.Difficulty} | 
            <span class="font-bold">Category:</span> ${recipe.Category}
        `;
        contentDiv.appendChild(infoElement);

        const detailsElement = document.createElement('p');
        detailsElement.classList.add('details', 'text-blue-400', 'cursor-pointer', 'mt-2');
        detailsElement.textContent = "View Recipe";
        detailsElement.title = "Click to view full recipe";
        detailsElement.addEventListener('click', () => {
            // Vérifier si toutes les informations nécessaires sont présentes
            if (recipe.title && recipe.ingredients && recipe.instructions) {
                viewModal(recipe);
            } else {
                // Si les informations complètes ne sont pas disponibles, faire une requête pour les obtenir
                fetch(`/api/recipes/${recipe._id}`)
                    .then(response => response.json())
                    .then(fullRecipe => {
                        viewModal(fullRecipe);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des détails de la recette:', error);
                        alert('Impossible de charger les détails de la recette. Veuillez réessayer.');
                    });
            }
        });
        contentDiv.appendChild(detailsElement);

        // Bouton de modification
        const updateButton = document.createElement('button');
        updateButton.textContent = "Modifier";
        updateButton.classList.add('bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded', 'mr-2', 'mt-2');
        updateButton.addEventListener('click', () => openEditModal(recipe));
        contentDiv.appendChild(updateButton);

        // Bouton de suppression (croix)
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;'; // Croix HTML
        deleteButton.classList.add('absolute', 'top-2', 'right-2', 'bg-red-500', 'text-white', 'rounded-full', 'w-6', 'h-6', 'flex', 'items-center', 'justify-center', 'hover:bg-red-600');
        deleteButton.addEventListener('click', () => deleteRecipe(recipe._id));
        recipeArticle.appendChild(deleteButton);

        recipeArticle.appendChild(contentDiv);
        container.appendChild(recipeArticle);
    } catch (error) {
        displayError("Error displaying recipe. Please refresh the page.");
    }
}

// Fonction pour afficher les erreurs
function displayError(message) {
    const recettesDuJourDiv = document.getElementById('recettesDuJour');
    recettesDuJourDiv.innerHTML = `<p class="error text-red-500">${message}</p>`;
}

// Fonction pour récupérer les recettes depuis l'API
async function getRecipes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recipes = await response.json();
        return recipes;
    } catch (error) {
        console.error("Could not fetch recipes:", error);
        displayError("Failed to load recipes. Please try again later.");
        return [];
    }
}
async function displayRecipes() {
    const recipeContainer = document.querySelector(".grid");
    if (!recipeContainer) {
        console.error("Container for recipes not found");
        return;
    }

    recipeContainer.innerHTML = ''; // Clear existing content

    const recipes = await getRecipes();
    if (recipes.length === 0) {
        displayError("No recipes found.");
        return;
    }

    recipes.forEach(recipe => createRecipeElement(recipe, recipeContainer));
}

// Event listener pour charger les recettes quand le DOM est prêt
document.addEventListener('DOMContentLoaded', displayRecipes);
getRecipes();

//Créer une "liste" pour les instruction/ingredients
function createListItem(listId, addButtonClass, removeButtonClass) {
    const list = document.getElementById(listId);
    const newItem = document.createElement('div');
    newItem.className = 'flex items-center space-x-2';
    newItem.innerHTML = `
        <input type="text" class="flex-grow bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
        <button type="button" class="${addButtonClass} bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">+</button>
        <button type="button" class="${removeButtonClass} bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">-</button>
    `;
    list.appendChild(newItem);

    newItem.querySelector(`.${addButtonClass}`).addEventListener('click', () => createListItem(listId, addButtonClass, removeButtonClass));
    newItem.querySelector(`.${removeButtonClass}`).addEventListener('click', () => {
        if (list.children.length > 1) {
            list.removeChild(newItem);
        }
    });
}

document.querySelector('.add-ingredient').addEventListener('click', () => createListItem('ingredientsList', 'add-ingredient', 'remove-ingredient'));
document.querySelector('.add-instruction').addEventListener('click', () => createListItem('instructionsList', 'add-instruction', 'remove-instruction'));


function sendRecipe() {
    // Récupérer les ingrédients
    let ingredients = Array.from(document.querySelectorAll('#ingredientsList input')).map(input => input.value);

    // Récupérer les instructions
    let instructions = Array.from(document.querySelectorAll('#instructionsList input')).map(input => input.value);

    // Créer l'objet recette
    let recipe = {
        title: document.getElementById('title').value,
        ingredients: ingredients,
        instructions: instructions,
        timePreparation: document.getElementById('timePreparation').value,
        timeCooking: document.getElementById('timeCooking').value,
        Difficulty: document.getElementById('difficulty').value,
        Category: document.getElementById('category').value,
    };

    // Gérer l'image si elle est présente
    let imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        console.log("Image selected:", imageInput.files[0]);
    }

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then((data) => {
        console.log("Recette créée avec succès:", data);
        // Fonction pour afficher la nouvelle recette (à implémenter)
        displayRecipes(data);
    }).catch((error) => {
        console.error("Erreur lors de la création de la recette:", error);
        displayError("Échec de la création de la recette. Veuillez réessayer.");
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const createRecipeButton = document.querySelector('#createbtn');

    if (createRecipeButton) {
        createRecipeButton.addEventListener('click', function (event) {
            event.preventDefault(); // Empêche le formulaire de se soumettre normalement
            sendRecipe(); // Appelle la fonction sendRecipe
        });
    } else {
        console.error("Le bouton 'Créer une recette' n'a pas été trouvé.");
    }
});

//modifier la recette
function updateRecipe(id) {
    console.log(document.getElementById('title'));


    const updatedRecipe = {
        title: document.getElementById('updatetitle').value,
        ingredients: Array.from(document.querySelectorAll('#updateingredientsList input')).map(input => input.value).filter(Boolean),
        instructions: Array.from(document.querySelectorAll('#updateinstructionsList input')).map(input => input.value).filter(Boolean),
        timePreparation: document.getElementById('updatetimePreparation').value,
        timeCooking: document.getElementById('updatetimeCooking').value,
        Difficulty: document.getElementById('difficulty').value,
        Category: document.getElementById('category').value
    };

    console.log('Updating recipe:', updatedRecipe); // Pour le débogage

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Update success:', data);
            closeEditModal();
            displayRecipes(); // Rafraîchir l'affichage des recettes
        })
        .catch((error) => {
            console.error('Update error:', error);
        });
}

//champs pour modifier
function populateList(listId, items) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = `${listId === 'ingredientsList' ? 'ingredient' : 'instruction'}-line`;
        div.innerHTML = `
            <input type="text" name="${listId === 'ingredientsList' ? 'ingredients' : 'instructions'}[]" value="${item}" required>
            <button type="button" class="add-line" onclick="addLine('${listId}')">+</button>
            <button type="button" class="remove-line" onclick="removeLine(this)">-</button>
        `;
        list.appendChild(div);
    });
}

//supprimer la recette
function deleteRecipe(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                displayRecipes();
            })
            .catch(error => console.error('Error:', error));
    }
}
function openEditModal(recipe) {
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.classList.add('fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'overflow-y-auto', 'h-full', 'w-full');
    modal.innerHTML = `
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-900">
        <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-300 mb-4">Modifier la recette</h3>
            <form id="editForm" class="space-y-6">
                <input type="hidden" id="recipeId" value="${recipe._id}">
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-300">Titre</label>
                    <input type="text" id="updatetitle" name="title" value="${recipe.title}"
                        class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>

                <div>
                    <label for="ingredients" class="block text-sm font-medium text-gray-300 mb-2">Ingrédients</label>
                    <div id="updateingredientsList" class="space-y-2">
                        ${recipe.ingredients.map(ingredient => `
                            <div class="flex items-center space-x-2">
                                <input type="text" value="${ingredient}"
                                    class="flex-grow bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                                <button type="button" class="remove-ingredient bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">-</button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="add-ingredient mt-2 bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">+ Ajouter un ingrédient</button>
                </div>

                <div>
                    <label for="instructions" class="block text-sm font-medium text-gray-300 mb-2">Instructions</label>
                    <div id="updateinstructionsList" class="space-y-2">
                        ${recipe.instructions.map(instruction => `
                            <div class="flex items-center space-x-2">
                                <input type="text" value="${instruction}"
                                    class="flex-grow bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                                <button type="button" class="remove-instruction bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">-</button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="add-instruction mt-2 bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">+ Ajouter une instruction</button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="timePreparation" class="block text-sm font-medium text-gray-300">Temps de préparation (min)</label>
                        <input type="number" id="updatetimePreparation" name="timePreparation" value="${recipe.timePreparation}"
                            class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    </div>
                    <div>
                        <label for="timeCooking" class="block text-sm font-medium text-gray-300">Temps de cuisson (min)</label>
                        <input type="number" id="updatetimeCooking" name="timeCooking" value="${recipe.timeCooking}"
                            class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    </div>
                </div>

                <div>
                    <label for="difficulty" class="block text-sm font-medium text-gray-300">Difficulté</label>
                    <select id="difficulty" name="difficulty"
                        class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="Facile" ${recipe.Difficulty === 'Facile' ? 'selected' : ''}>Facile</option>
                        <option value="Moyen" ${recipe.Difficulty === 'Moyen' ? 'selected' : ''}>Moyen</option>
                        <option value="Difficile" ${recipe.Difficulty === 'Difficile' ? 'selected' : ''}>Difficile</option>
                    </select>
                </div>

                <div>
                    <label for="category" class="block text-sm font-medium text-gray-300">Catégorie</label>
                    <select id="category" name="category"
                        class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="Petit déjeuner" ${recipe.Category === 'Petit déjeuner' ? 'selected' : ''}>Petit déjeuner</option>
                        <option value="Entrée" ${recipe.Category === 'Entrée' ? 'selected' : ''}>Entrée</option>
                        <option value="Plat principal" ${recipe.Category === 'Plat principal' ? 'selected' : ''}>Plat principal</option>
                        <option value="Dessert" ${recipe.Category === 'Dessert' ? 'selected' : ''}>Dessert</option>
                        <option value="Boisson" ${recipe.Category === 'Boisson' ? 'selected' : ''}>Boisson</option>
                        <option value="Snack" ${recipe.Category === 'Snack' ? 'selected' : ''}>Snack</option>
                    </select>
                </div>

                <div class="flex space-x-4">
                    <button type="button" id="updateButton" onclick="updateRecipe('${recipe._id}')"
                        class="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        Mettre à jour
                    </button>
                    <button type="button" id="cancelButton"  onclick="closeEditModal()"
                        class="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    </div>
`;
    document.body.appendChild(modal);
    setTimeout(() => {
        setupIngredientButtons();
        setupInstructionButtons();
    }, 0);
}
function setupIngredientButtons() {
    const addIngredientButton = document.querySelector('#editModal .add-ingredient');
    const ingredientsList = document.querySelector('#editModal #updateingredientsList');

    if (addIngredientButton && ingredientsList) {
        addIngredientButton.addEventListener('click', () => {
            const newIngredient = document.createElement('div');
            newIngredient.className = 'flex items-center space-x-2';
            newIngredient.innerHTML = `
                <input type="text" class="flex-grow bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <button type="button" class="remove-ingredient bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">-</button>
            `;
            ingredientsList.appendChild(newIngredient);
            setupRemoveButtons();
        });
    }

    setupRemoveButtons();
}

function setupInstructionButtons() {
    const addInstructionButton = document.querySelector('#editModal .add-instruction');
    const instructionsList = document.querySelector('#editModal #updateinstructionsList');

    if (addInstructionButton && instructionsList) {
        addInstructionButton.addEventListener('click', () => {
            const newInstruction = document.createElement('div');
            newInstruction.className = 'flex items-center space-x-2';
            newInstruction.innerHTML = `
                <input type="text" class="flex-grow bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <button type="button" class="remove-instruction bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">-</button>
            `;
            instructionsList.appendChild(newInstruction);
            setupRemoveButtons();
        });
    }

    setupRemoveButtons();
}

function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('#editModal .remove-ingredient, #editModal .remove-instruction');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.remove();
        });
    });
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.remove();
}

//pour eviter de tout réinitialiser
document.querySelectorAll('#editForm input, #editForm select').forEach(element => {
    element.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});
function searchRecipes() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(recipes => {
            let searchResults;

            if (searchTerm.startsWith('id:')) {
                // Recherche par _id
                const idSearchTerm = searchTerm.slice(3).trim(); // Enlève 'id:' du début
                searchResults = recipes.filter(recipe =>
                    recipe._id.toLowerCase() === idSearchTerm
                );
            } else {
                // Recherche normale
                searchResults = recipes.filter(recipe =>
                    recipe._id.toLowerCase().includes(searchTerm) ||
                    recipe.title.toLowerCase().includes(searchTerm) ||
                    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm)) ||
                    recipe.Category.toLowerCase().includes(searchTerm) ||
                    recipe.Difficulty.toLowerCase().includes(searchTerm) ||
                    recipe.timePreparation.toString().toLowerCase().includes(searchTerm)
                );
            }

            displaySearchResults(searchResults);
        })
        .catch(error => {
            console.error('Error:', error);
            displaySearchResults([]);
        });
}

function displaySearchResults(results) {
    const searchResultSection = document.getElementById('searchResultSection');
    searchResultSection.classList.remove('hidden');
    const searchResultsContainer = document.getElementById('searchResult');
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-6');

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p class="col-span-full text-center text-gray-400">Aucun résultat trouvé.</p>';
    } else {
        results.forEach(recipe => {
            const recipeElement = document.createElement('article');
            recipeElement.classList.add('bg-gray-800', 'rounded-xl', 'overflow-hidden', 'shadow-lg', 'transition-all', 'duration-300', 'hover:shadow-2xl', 'hover:scale-105', 'relative');

            const imageElement = document.createElement('img');
            imageElement.src = recipe.image || "";
            imageElement.alt = recipe.title;
            imageElement.classList.add('w-full', 'h-48', 'object-cover', 'object-center');
            recipeElement.appendChild(imageElement);

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('p-5');

            const titleElement = document.createElement('h3');
            titleElement.classList.add('text-xl', 'font-bold', 'mb-2', 'text-blue-400', 'truncate');
            titleElement.textContent = recipe.title;
            contentDiv.appendChild(titleElement);

            const infoElement = document.createElement('p');
            infoElement.classList.add('text-gray-400', 'text-sm', 'mb-3');
            infoElement.innerHTML = `
                <span class="font-semibold">Prep:</span> ${recipe.timePreparation} min | 
                <span class="font-semibold">Cook:</span> ${recipe.timeCooking} min<br>
                <span class="font-semibold">Difficulty:</span> ${recipe.Difficulty} | 
                <span class="font-semibold">Category:</span> ${recipe.Category}
            `;
            contentDiv.appendChild(infoElement);

            const detailsElement = document.createElement('p');
            detailsElement.classList.add('text-blue-500', 'hover:text-blue-400', 'cursor-pointer', 'mt-2', 'font-semibold', 'text-sm');
            detailsElement.textContent = "View Recipe";
            detailsElement.title = "Click to view full recipe";
            detailsElement.addEventListener('click', () => {
                // Vérifier si toutes les informations nécessaires sont présentes
                if (recipe.title && recipe.ingredients && recipe.instructions) {
                    viewModal(recipe);
                } else {
                    // Si les informations complètes ne sont pas disponibles, faire une requête pour les obtenir
                    fetch(`/api/recipes/${recipe._id}`)
                        .then(response => response.json())
                        .then(fullRecipe => {
                            viewModal(fullRecipe);
                        })
                        .catch(error => {
                            console.error('Erreur lors de la récupération des détails de la recette:', error);
                            alert('Impossible de charger les détails de la recette. Veuillez réessayer.');
                        });
                }
            });
            contentDiv.appendChild(detailsElement);

            recipeElement.appendChild(contentDiv);
            searchResultsContainer.appendChild(recipeElement);
        });
    }
    const searchInput = document.getElementById('searchInput');
    if (searchInput.value.trim().toLowerCase().startsWith('id:')) {
        const searchMessage = document.createElement('p');
        searchMessage.classList.add('col-span-full', 'text-center', 'text-gray-400', 'mt-4');
        searchMessage.textContent = "Recherche effectuée par ID";
        searchResultsContainer.appendChild(searchMessage);
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchButton = document.getElementById('searchButton');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchRecipes();
    });

    searchButton.addEventListener('click', searchRecipes);
});

//viewModal 
function viewModal(recipe) {
    const modal = document.createElement('div');
    modal.id = 'viewModal';
    modal.classList.add('fixed', 'inset-0', 'bg-gray-900', 'bg-opacity-95', 'overflow-y-auto', 'h-full', 'w-full', 'z-50');

    const imageHtml = recipe.image
        ? `<img src="${recipe.image}" alt="${recipe.title}" class="w-full h-64 object-cover rounded-lg mb-6">`
        : '';

    modal.innerHTML = `
    <div class="relative top-10 mx-auto p-8 border border-gray-700 w-11/12 max-w-4xl shadow-lg rounded-lg bg-gray-800 text-gray-100">
        <button onclick="closeViewModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>

        <h1 class="text-3xl font-bold mb-6">${recipe.title}</h1>
        
        ${imageHtml}
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <h2 class="text-lg font-semibold mb-2">Temps de préparation</h2>
                <p class="text-2xl">${recipe.timePreparation} min</p>
            </div>
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <h2 class="text-lg font-semibold mb-2">Temps de cuisson</h2>
                <p class="text-2xl">${recipe.timeCooking} min</p>
            </div>
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <h2 class="text-lg font-semibold mb-2">Difficulté</h2>
                <p class="text-2xl">${recipe.Difficulty}</p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 class="text-2xl font-bold mb-4">Ingrédients</h2>
                <ul class="list-disc list-inside space-y-2">
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            
            <div>
                <h2 class="text-2xl font-bold mb-4">Instructions</h2>
                <ol class="list-decimal list-inside space-y-4">
                    ${recipe.instructions.map((instruction, index) => `
                        <li><span class="font-bold">Étape ${index + 1}:</span> ${instruction}</li>
                    `).join('')}
                </ol>
            </div>
        </div>

        <div class="mt-8">
            <p class="text-lg"><span class="font-semibold">Catégorie:</span> ${recipe.Category}</p>
        </div>
    </div>
    `;

    document.body.appendChild(modal);
}

function closeViewModal() {
    const modal = document.getElementById('viewModal');
    if (modal) {
        modal.remove();
    }
}