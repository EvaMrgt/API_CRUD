const API_URL_users = 'http://127.0.0.1:3002/users';

//connexion Modals
function connectionModal() {
    const modal = document.createElement('div');
    modal.id = 'connectionModal';
    modal.classList.add('fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'overflow-y-auto', 'h-full', 'w-full', 'flex', 'items-center', 'justify-center', 'z-50');

    modal.innerHTML = `
    <div class="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-2xl font-bold mb-6 text-white">Connexion</h2>
        <form id="loginForm" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" id="email" name="email" required class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-300">Mot de passe</label>
                <input type="password" id="password" name="password" required class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <button type="submit" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Se connecter
            </button>
        </form>
        <p class="mt-4 text-sm text-gray-400">
            Pas encore inscrit ? 
            <a href="#" id="openSignupModal" class="text-blue-400 hover:text-blue-300">Créer un compte</a>
        </p>
        <button id="closeConnectionModal" class="mt-4 w-full py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Fermer
        </button>
    </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('openSignupModal').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('connectionModal');
        signupModal();
    });
    document.getElementById('closeConnectionModal').addEventListener('click', () => closeModal('connectionModal'));
}

function signupModal() {
    const modal = document.createElement('div');
    modal.id = 'signupModal';
    modal.classList.add('fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'overflow-y-auto', 'h-full', 'w-full', 'flex', 'items-center', 'justify-center', 'z-50');

    modal.innerHTML = `
    <div class="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-2xl font-bold mb-6 text-white">Inscription</h2>
        <form id="signupForm" class="space-y-4">
            <div>
                <label for="signupEmail" class="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" id="signupEmail" name="email" required class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label for="signupPassword" class="block text-sm font-medium text-gray-300">Mot de passe</label>
                <input type="password" id="signupPassword" name="password" required class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <button type="submit" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                S'inscrire
            </button>
        </form>
        <p class="mt-4 text-sm text-gray-400">
            Déjà inscrit ? 
            <a href="#" id="openConnectionModal" class="text-blue-400 hover:text-blue-300">Se connecter</a>
        </p>
        <button id="closeSignupModal" class="mt-4 w-full py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Fermer
        </button>
        <button id="closeConnectionModal" class="absolute top-2 right-2 text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('openConnectionModal').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('signupModal');
        connectionModal();
    });
    document.getElementById('closeSignupModal').addEventListener('click', () => closeModal('signupModal'));
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('loginErrorMessage');

    // Réinitialiser le message d'erreur
    if (errorMessageElement) {
        errorMessageElement.textContent = '';
    }

    try {
        const response = await fetch('http://127.0.0.1:3002/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue lors de la connexion');
        }

        // Connexion réussie
        console.log('Connexion réussie:', data);

        // Stocker le token dans le localStorage
        localStorage.setItem('userToken', data.token);

        // Fermer la modal de connexion
        closeModal('connectionModal');

        // Mettre à jour l'interface utilisateur
        updateUIAfterLogin(data.user);

        // Optionnel : afficher un message de succès
        showNotification('Connexion réussie !', 'success');

    } catch (error) {
        console.error('Erreur de connexion:', error);

        // Afficher le message d'erreur dans la modal
        if (errorMessageElement) {
            errorMessageElement.textContent = error.message;
        } else {
            // Si l'élément n'existe pas, créer un nouvel élément pour afficher l'erreur
            const errorElement = document.createElement('p');
            errorElement.id = 'loginErrorMessage';
            errorElement.classList.add('text-red-500', 'text-sm', 'mt-2');
            errorElement.textContent = error.message;
            document.getElementById('loginForm').appendChild(errorElement);
        }

        // Optionnel : afficher une notification d'erreur
        showNotification('Échec de la connexion', 'error');
    }
}

function updateUIAfterLogin(user) {
    const connexionLink = document.getElementById('connexionLink');
    const userProfileElement = document.getElementById('userProfile');

    localStorage.setItem('isLoggedIn', 'true');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (connexionLink) {
        // Changer le texte et la fonction du bouton
        connexionLink.textContent = 'Déconnexion';
        connexionLink.removeEventListener('click', connectionModal);
        connexionLink.addEventListener('click', userLogout);
        connexionLink.id = 'deconnexionLink';

        // Ajouter le lien Utilisateur (User)
        const userLink = document.createElement('a');
        userLink.textContent = 'Utilisateur (User)';
        userLink.href = '#';
        userLink.classList.add('ml-4', 'text-white', 'hover:text-gray-300');
        userLink.addEventListener('click', (e) => {
            e.preventDefault();
            showUserRecipesModal(user);
        });
        connexionLink.parentNode.insertBefore(userLink, connexionLink.nextSibling);
    } else {
        console.error("Bouton de connexion non trouvé");
    }

    if (userProfileElement) {
        userProfileElement.textContent = `Bienvenue, ${user.email}`;
        userProfileElement.style.display = 'block';
    }

    localStorage.setItem('user', JSON.stringify(user));
}

function showUserRecipesModal(user) {
    const modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'overflow-y-auto', 'h-full', 'w-full', 'flex', 'items-center', 'justify-center', 'z-50');

    modal.innerHTML = `
        <div class="bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg w-full">
            <h2 class="text-2xl font-bold mb-6 text-white">Recettes de ${user.email}</h2>
            <div id="userRecipesList" class="space-y-4 max-h-96 overflow-y-auto">
                <!-- Les recettes seront ajoutées ici -->
            </div>
            <button id="closeUserRecipesModal" class="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Fermer
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Charger les recettes de l'utilisateur
    loadUserRecipes(user.id);

    document.getElementById('closeUserRecipesModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

async function loadUserRecipes(userId) {
    try {
        const response = await fetch(`${API_URL}/user/${userId}/recipes`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des recettes');
        }
        const recipes = await response.json();
        displayUserRecipes(recipes);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('userRecipesList').innerHTML = '<p class="text-red-500">Erreur lors du chargement des recettes.</p>';
    }
}

function displayUserRecipes(recipes) {
    const recipesList = document.getElementById('userRecipesList');
    if (recipes.length === 0) {
        recipesList.innerHTML = '<p class="text-gray-400">Vous n\'avez pas encore créé de recettes.</p>';
        return;
    }

    recipesList.innerHTML = recipes.map(recipe => `
        <div class="bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-white">${recipe.title}</h3>
            <p class="text-gray-300">${recipe.Category} - ${recipe.Difficulty}</p>
            <p class="text-gray-400 text-sm">Préparation: ${recipe.timePreparation} min, Cuisson: ${recipe.timeCooking} min</p>
        </div>
    `).join('');
}

//déconnexion
function userLogout() {
    // Supprimer les informations de l'utilisateur du localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');

    const deconnexionLink = document.getElementById('deconnexionLink');
    const userProfileElement = document.getElementById('userProfile');

    if (deconnexionLink) {
        // Remettre le bouton dans son état initial
        deconnexionLink.textContent = 'Connexion';
        deconnexionLink.removeEventListener('click', userLogout);
        deconnexionLink.addEventListener('click', connectionModal);
        
        // Remettre l'ID original
        deconnexionLink.id = 'connexionLink';
    } else {
        console.error("Bouton de déconnexion non trouvé");
    }

    if (userProfileElement) {
        userProfileElement.textContent = '';
        userProfileElement.style.display = 'none';
    }

    // Supprimer la section des recettes de l'utilisateur si elle existe
    const userRecipesSection = document.getElementById('userRecipes');
    if (userRecipesSection) {
        userRecipesSection.remove();
    }

    // Afficher une notification de déconnexion réussie
    showNotification('Déconnexion réussie', 'success');
}

function showNotification(message, type = 'info') {
    // Créer un élément de notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('fixed', 'top-4', 'right-4', 'p-4', 'rounded', 'text-white', 'z-50');

    // Ajouter une classe basée sur le type de notification
    if (type === 'success') {
        notification.classList.add('bg-green-500');
    } else if (type === 'error') {
        notification.classList.add('bg-red-500');
    } else {
        notification.classList.add('bg-blue-500');
    }

    // Ajouter la notification au body
    document.body.appendChild(notification);

    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function handleSignup(e) {
    e.preventDefault();

    // Récupération des éléments du formulaire
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const errorMessage = document.getElementById('signupError');
    const submitButton = document.getElementById('signupSubmit');

    // Récupération des valeurs
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validation basique
    if (!email || !password) {
        displayError("Veuillez remplir tous les champs.");
        return;
    }

    if (!isValidEmail(email)) {
        displayError("Veuillez entrer une adresse email valide.");
        return;
    }

    if (password.length < 8) {
        displayError("Le mot de passe doit contenir au moins 8 caractères.");
        return;
    }

    try {
        // Appel à l'API
        const response = await fetch(API_URL_users, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Inscription réussie
            console.log('Inscription réussie:', data.user);
            closeModal(); // Fermer la modal (fonction à implémenter)
            updateUI(data.user); // Mettre à jour l'interface utilisateur (fonction à implémenter)
        } else {
            // Erreur lors de l'inscription
            displayError(data.message || "Une erreur est survenue lors de l'inscription.");
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        displayError("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
    }
}

function isValidEmail(email) {
    // Expression régulière simple pour la validation d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayError(message) {
    const errorMessage = document.getElementById('signupError');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function updateUI(user) {
    // Code pour mettre à jour l'interface utilisateur après une inscription réussie
    console.log("Interface utilisateur mise à jour pour:", user);
}

//EventListener
document.addEventListener('DOMContentLoaded', function () {
    const connexionLink = document.getElementById('connexionLink');

    if (connexionLink) {
        connexionLink.addEventListener('click', function (e) {
            e.preventDefault(); // Empêche la navigation par défaut
            connectionModal();
        });
    }
});