/* =========================================
   PantryPal - Member 2 JavaScript
========================================= */

let selectedIngredients = [];

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

/* ---------- Ingredients ---------- */

function addIngredient() {
    const input = document.getElementById("ingredientInput");
    if (!input) return;

    const ingredient = input.value.trim().toLowerCase();

    if (!ingredient) {
        return;
    }

    if (selectedIngredients.includes(ingredient)) {
        alert("You already added this ingredient!");
        input.focus();
        return;
    }

    selectedIngredients.push(ingredient);
    input.value = "";
    displayIngredients();
    input.focus();
}

function displayIngredients() {
    const list = document.getElementById("ingredientList");
    if (!list) return;

    list.innerHTML = "";

    selectedIngredients.forEach((ingredient, index) => {
        const chip = document.createElement("span");
        chip.className = "ingredient-chip";

        const text = document.createElement("span");
        text.textContent = ingredient;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "×";
        removeButton.title = "Remove " + ingredient;
        removeButton.addEventListener("click", () => removeIngredient(index));

        chip.appendChild(text);
        chip.appendChild(removeButton);
        list.appendChild(chip);
    });
}

function removeIngredient(index) {
    selectedIngredients.splice(index, 1);
    displayIngredients();
}

function clearIngredients() {
    selectedIngredients = [];
    displayIngredients();
}

/* ---------- Recipe Matching ---------- */

function calculateMatchPercentage(recipe) {
    if (!selectedIngredients.length) return 0;

    const matched = recipe.ingredients.filter(ingredient =>
        selectedIngredients.includes(ingredient.toLowerCase())
    );

    return Math.round((matched.length / recipe.ingredients.length) * 100);
}

function findRecipes() {
    if (selectedIngredients.length === 0) {
        alert("Please add at least one ingredient!");
        return;
    }

    const matchingRecipes = recipes
        .map((recipe, index) => ({
            ...recipe,
            originalIndex: index,
            matchPercentage: calculateMatchPercentage(recipe)
        }))
        .filter(recipe => recipe.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

    displayRecipes(matchingRecipes);

    const title = document.getElementById("resultTitle");
    if (title) {
        title.textContent = "Recipes Matching Your Ingredients ✨";
    }
}

/* ---------- Recipe Display ---------- */

function displayRecipes(recipeList) {
    const results = document.getElementById("recipeResults");
    if (!results) return;

    results.innerHTML = "";

    if (recipeList.length === 0) {
        results.innerHTML = `
            <p class="no-results">
                No recipes found. Try egg, rice, tomato or bread.
            </p>
        `;
        return;
    }

    recipeList.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipe-card";

        const image = document.createElement("div");
        image.className = "food-image";
        image.textContent = recipe.emoji;

        const name = document.createElement("h3");
        name.textContent = recipe.name;

        const time = document.createElement("p");
        time.textContent = "⏱ " + recipe.time;

        const category = document.createElement("span");
        category.className = "category-badge";
        category.textContent = recipe.category;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "view-button";
        button.textContent = "View Recipe";
        button.addEventListener("click", () => viewRecipe(recipe.originalIndex));

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(time);
        card.appendChild(category);

        if (recipe.matchPercentage !== undefined) {
            const match = document.createElement("span");
            match.className = "match-percentage";
            match.textContent = recipe.matchPercentage + "% Match";
            card.appendChild(match);
        }

        card.appendChild(document.createElement("br"));
        card.appendChild(button);
        results.appendChild(card);
    });
}

/* ---------- Search + Category Filter ---------- */

function updateRecipeList() {
    const searchInput = document.getElementById("recipeSearch");
    const categoryFilter = document.getElementById("categoryFilter");

    const searchText = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "all";

    const filteredRecipes = recipes
        .map((recipe, index) => ({
            ...recipe,
            originalIndex: index
        }))
        .filter(recipe => {
            const matchesSearch =
                !searchText ||
                recipe.name.toLowerCase().includes(searchText) ||
                recipe.ingredients.some(ingredient =>
                    ingredient.toLowerCase().includes(searchText)
                );

            const matchesCategory =
                selectedCategory === "all" ||
                recipe.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

    displayRecipes(filteredRecipes);

    const title = document.getElementById("resultTitle");
    if (title) {
        title.textContent = filteredRecipes.length
            ? "Recipes You Can Explore 🍴"
            : "No Recipes Found 😔";
    }
}

function searchRecipes() {
    updateRecipeList();
}

function filterByCategory() {
    updateRecipeList();
}

/* ---------- Recipe Popup ---------- */

function viewRecipe(recipeIndex) {
    const recipe = recipes[recipeIndex];
    if (!recipe) return;

    const modal = document.getElementById("recipeModal");
    const modalEmoji = document.getElementById("modalEmoji");
    const modalTitle = document.getElementById("modalTitle");
    const modalTime = document.getElementById("modalTime");
    const ingredientsList = document.getElementById("modalIngredients");
    const modalSteps = document.getElementById("modalSteps");

    if (!modal) return;

    if (modalEmoji) modalEmoji.textContent = recipe.emoji;
    if (modalTitle) modalTitle.textContent = recipe.name;
    if (modalTime) modalTime.textContent = "⏱ Cooking Time: " + recipe.time;
    if (modalSteps) modalSteps.textContent = recipe.steps;

    if (ingredientsList) {
        ingredientsList.innerHTML = "";

        recipe.ingredients.forEach(ingredient => {
            const item = document.createElement("li");
            item.textContent = ingredient;
            ingredientsList.appendChild(item);
        });
    }

    modal.style.display = "flex";
}

function closeRecipe() {
    const modal = document.getElementById("recipeModal");
    if (modal) {
        modal.style.display = "none";
    }
}

/* ---------- Page Setup ---------- */

document.addEventListener("DOMContentLoaded", () => {
    const ingredientInput = document.getElementById("ingredientInput");

    if (ingredientInput) {
        ingredientInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                addIngredient();
            }
        });
    }

    const recipeResults = document.getElementById("recipeResults");

    if (recipeResults) {
        displayRecipes(
            recipes.map((recipe, index) => ({
                ...recipe,
                originalIndex: index
            }))
        );
    }

    const modal = document.getElementById("recipeModal");

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeRecipe();
            }
        });
    }
});
