let selectedIngredients = [];

function addIngredient() {

    const input = document.getElementById("ingredientInput");

    const ingredient = input.value.trim().toLowerCase();

    if (ingredient === "") {
        return;
    }

    if (selectedIngredients.includes(ingredient)) {
        alert("You already added this ingredient!");
        return;
    }

    selectedIngredients.push(ingredient);

    displayIngredients();

    input.value = "";
}


function displayIngredients() {

    const list = document.getElementById("ingredientList");

    list.innerHTML = "";

    selectedIngredients.forEach((ingredient, index) => {

        const chip = document.createElement("span");

        chip.className = "ingredient-chip";

        chip.innerHTML = `
            ${ingredient}
            <button onclick="removeIngredient(${index})">
                ×
            </button>
        `;

        list.appendChild(chip);
    });
}


function removeIngredient(index) {

    selectedIngredients.splice(index, 1);

    displayIngredients();
}
const recipes = [

    {
        name: "Egg Fried Rice",
        ingredients: ["egg", "rice", "onion"],
        time: "15 mins",
        category: "Lunch",
        emoji: "🍳",
        steps: "Cook the rice. Scramble the eggs. Sauté onion and add the rice. Mix everything together and cook for a few minutes."
    },

    {
        name: "Tomato Pasta",
        ingredients: ["tomato", "pasta", "onion"],
        time: "20 mins",
        category: "Lunch",
        emoji: "🍝",
        steps: "Boil the pasta. Prepare tomato sauce with onion. Add the pasta and mix well."
    },

    {
        name: "French Toast",
        ingredients: ["bread", "egg", "milk"],
        time: "10 mins",
        category: "Breakfast",
        emoji: "🍞",
        steps: "Mix egg and milk. Dip the bread into the mixture and cook both sides until golden."
    },

    {
        name: "Lemon Rice",
        ingredients: ["rice", "lemon"],
        time: "15 mins",
        category: "Lunch",
        emoji: "🍋",
        steps: "Cook the rice. Prepare lemon seasoning and mix it with the cooked rice."
    },

    {
        name: "Omelette",
        ingredients: ["egg", "onion", "tomato"],
        time: "10 mins",
        category: "Breakfast",
        emoji: "🍳",
        steps: "Beat the eggs. Add chopped onion and tomato. Cook the mixture in a pan until ready."
    },

    {
        name: "Vegetable Sandwich",
        ingredients: ["bread", "tomato", "onion"],
        time: "10 mins",
        category: "Snacks",
        emoji: "🥪",
        steps: "Slice the vegetables. Place them between bread slices and toast until crispy."
    },

    {
        name: "Pancakes",
        ingredients: ["flour", "milk", "egg"],
        time: "20 mins",
        category: "Breakfast",
        emoji: "🥞",
        steps: "Mix flour, milk and egg into a smooth batter. Pour onto a hot pan and cook both sides."
    },

    {
        name: "Banana Smoothie",
        ingredients: ["banana", "milk"],
        time: "5 mins",
        category: "Drinks",
        emoji: "🍌",
        steps: "Add banana and milk to a blender. Blend until smooth and serve chilled."
    },

    {
        name: "Potato Fry",
        ingredients: ["potato", "onion"],
        time: "20 mins",
        category: "Snacks",
        emoji: "🥔",
        steps: "Cut the potatoes. Sauté onion and add potatoes. Cook until crispy and golden."
    },

    {
        name: "Vegetable Fried Rice",
        ingredients: ["rice", "carrot", "onion"],
        time: "20 mins",
        category: "Lunch",
        emoji: "🍚",
        steps: "Cook the vegetables. Add cooked rice and mix everything together. Add seasoning and stir well."
    },

    {
        name: "Bread Pizza",
        ingredients: ["bread", "tomato", "cheese"],
        time: "15 mins",
        category: "Snacks",
        emoji: "🍕",
        steps: "Spread tomato sauce on bread. Add cheese and toppings. Toast until the cheese melts."
    },

    {
        name: "Tomato Soup",
        ingredients: ["tomato", "onion"],
        time: "25 mins",
        category: "Dinner",
        emoji: "🍅",
        steps: "Cook tomatoes and onion until soft. Blend them into a smooth mixture and cook with seasoning."
    }

];

function findRecipes() {

    if (selectedIngredients.length === 0) {

        alert("Please add at least one ingredient!");

        return;
    }

    const matchingRecipes = recipes.filter(recipe =>

        recipe.ingredients.some(ingredient =>
            selectedIngredients.includes(ingredient)
        )

    );

    displayRecipes(matchingRecipes);
}

function displayRecipes(matchingRecipes) {

    const results = document.getElementById("recipeResults");
    const title = document.getElementById("resultTitle");

    results.innerHTML = "";

    if (matchingRecipes.length === 0) {

        title.textContent = "No Recipes Found 😔";

        results.innerHTML = `
            <p class="no-results">
                Try ingredients like
                <b>egg, rice, tomato or bread</b>.
            </p>
        `;

        return;
    }

    title.textContent = "Recipes You Can Make ✨";

    matchingRecipes.forEach((recipe) => {

        const card = document.createElement("div");

        card.className = "recipe-card";

        card.innerHTML = `
            <div class="food-image">${recipe.emoji}</div>

            <h3>${recipe.name}</h3>

            <p>⏱ ${recipe.time}</p>

            <span class="category-badge">
                ${recipe.category}
            </span>



            <button class="view-button"
                    onclick="viewRecipe('${recipe.name}')">
                View Recipe
            </button>
        `;

        results.appendChild(card);
    });
}


function viewRecipe(recipeName) {

    const recipe = recipes.find(
        recipe => recipe.name === recipeName
    );

    document.getElementById("modalEmoji").textContent =
        recipe.emoji;

    document.getElementById("modalTitle").textContent =
        recipe.name;

    document.getElementById("modalTime").textContent =
        "⏱ Cooking Time: " + recipe.time;

    const ingredientsList =
        document.getElementById("modalIngredients");

    ingredientsList.innerHTML = "";

    recipe.ingredients.forEach(ingredient => {

        const item = document.createElement("li");

        item.textContent = ingredient;

        ingredientsList.appendChild(item);
    });

    document.getElementById("modalSteps").textContent =
        recipe.steps;

    document.getElementById("recipeModal").style.display =
        "flex";
}


function closeRecipe() {

    document.getElementById("recipeModal").style.display =
        "none";
}
function clearIngredients() {

    selectedIngredients = [];

    displayIngredients();
}