window.onload = function() {
    showProducts();
    showAddedRecipes();
}

async function getData(url) {
    return (await fetch(url)).json();
}

// method to show the list of daily products on the left sidebar during on loading page
async function showProducts() {
    await getData('http://localhost:3000/getDataProducts').then((value) => {
        let typesFood = document.getElementsByClassName("food");

        for (let i = 0; i < value.length; i++) {
            typesFood[i].innerText = Object.keys(value[i]);
        }
    })
}

let chosenProducts = [false, false, false, false, false, false, false, false, false, false, false, false, false];
let nextId;

// method to choose a products for recipe
async function moveFood(num) {
    let enter = false;
    if (chosenProducts[num] == false) { // to protect a double addition of one product       
        await getData('http://localhost:3000/getDataProducts').then((value) => {
            let productsDiv = document.querySelectorAll(".products-list-div");  // get all Recipe blocks via event listener
            let classIndex;
            productsDiv.forEach((item, index) => {
                item.addEventListener('click', event => {
                    if (enter == false) {
                        enter = true;
                        classIndex = index;
                            
                        let divFood = document.createElement("div"); // create a product div in the recipe block
                        let text = document.createElement("select");
                        let gram = document.createElement("input");
                        let gramText = document.createElement("div");
                        let percentage = document.createElement("input");
                        let percentText = document.createElement("div");
                        let close = document.createElement("div");

                        divFood.className = "productsList";
                        text.className = "products-select"
                        gram.className = "gram-food";
                        gramText.className = "gram-text";
                        percentage.className = "percentage-food";
                        percentText.className = "percent-text";
                        close.className = "close-btn";

                        if (nextId === undefined) {
                            nextId = 0;
                        } else {
                            nextId += 1; 
                        }
                        divFood.id = `createdFood_${nextId}`;
                        gram.id = `gram_${nextId}`;
                        percentage.id = `percentage_${nextId}`;
                        text.id = `text_${nextId}`;

                        gram.disabled = true; // disable input fields before choosing an option
                        percentage.disabled = true;

                        close.innerText = "X"; // add close button to delete the chosen product
                        close.setAttribute("onclick", `removeFood(${nextId}, ${num});`);
                        text.setAttribute("onclick", `changeOption(${num}, ${nextId});`);
                        gram.setAttribute("oninput", `changeGrams(${nextId}, ${num});`);
                        percentage.setAttribute("oninput", `changePercentage(${nextId}, ${num});`);

                        productsDiv[`${classIndex}`].appendChild(divFood);

                        let defaultOption = document.createElement("option"); // show default option to the product dropdown list
                        defaultOption.value = Object.keys(value[num]);
                        defaultOption.text = Object.keys(value[num]);
                        defaultOption.setAttribute("selected", "");
                        defaultOption.setAttribute("disabled", "");
                        text.appendChild(defaultOption);
                            
                        for (let i = 0; i < Object.values(value[num])[0].length; i++) { // show list of the options to the product dropdown list
                            let option = document.createElement("option");
                            option.value = i;
                            option.text = Object.keys(Object.values(value[num])[0][i]);
                            text.appendChild(option);
                        }

                        gramText.innerText = "гр ";
                        percentText.innerText = "% ";

                        divFood.appendChild(text);
                        divFood.appendChild(gram);
                        divFood.appendChild(gramText);
                        divFood.appendChild(percentage);
                        divFood.appendChild(percentText);
                        divFood.appendChild(close);
                    }
                })
            });
            let typesFood = document.getElementsByClassName("food-item")[num];
            typesFood.style = "background-color: #cccccc9e;";
            chosenProducts[num] = true;
        })
    }
}

// method to display grams after choosing product option in dropdown list
async function changeOption(num, nextIdNumber) {
    document.getElementById(`gram_${nextIdNumber}`).disabled = false;
    document.getElementById(`percentage_${nextIdNumber}`).disabled = false;
    let selectedOptionValue = document.getElementById(`text_${nextIdNumber}`).value;

    await getData('http://localhost:3000/getDataProducts').then((value) => {
        let savedGram = Object.values(Object.values(value[num])[0][selectedOptionValue]);
        let percentField = document.getElementsByClassName("foodPercent")[num];
        let percentageInput = document.getElementById(`percentage_${nextIdNumber}`);
        if (percentField.innerText == 0) {
            percentageInput.value = document.getElementById(`percentage_${nextIdNumber}`).value;
        } else {
            percentageInput.value = percentField.innerText;
        }
            
        let gramInput = document.getElementById(`gram_${nextIdNumber}`);
        gramInput.value = (savedGram * percentageInput.value / 100).toFixed(0);
        
        let usedProductLength = document.getElementsByClassName("productsList"); // all chosen products
        let currentPercent = document.getElementsByClassName("percentage-food"); // percent of current product

        let foodList = document.getElementsByClassName("food")[num].innerText; // name of current product
        let tailingsPercent = 0;
        for (let i = 0; i < usedProductLength.length; i++) {
            if (document.getElementsByClassName("products-select")[i][0].value == foodList) {
                tailingsPercent += Number(currentPercent[i].value);
            }
        }
        percentField.innerText = (100 - tailingsPercent).toFixed(0);

        if (percentField.innerText == 0) {
            let typesFood = document.getElementsByClassName("food-item")[num];
            typesFood.style = "background-color: #cccccc9e;";
            chosenProducts[num] = true;
        }
    })
}

// method to recalculate grams of product after changing percents of the product
async function changePercentage(nextId, num) {
    let typesFood = document.getElementsByClassName("food-item")[num];
    typesFood.style = "background-color: #cccccc9e;";
    chosenProducts[num] = true;

    await getData('http://localhost:3000/getDataProducts').then((value) => {
        let selectedOptionValue = document.getElementById(`text_${nextId}`).value;
        let savedGram = Object.values(Object.values(value[num])[0][selectedOptionValue])[0]; // from api
        let currentPercent = document.getElementById(`percentage_${nextId}`).value; // percent of current product

        document.getElementById(`gram_${nextId}`).value = (savedGram * currentPercent / 100).toFixed(0);
        recalculateUsedProductPercent(nextId, num);
    })
}

// method to recalculate percents of product after changing grams of the product
async function changeGrams(nextId, num) {
    let typesFood = document.getElementsByClassName("food-item")[num];
    typesFood.style = "background-color: #cccccc9e;";
    chosenProducts[num] = true;

    await getData('http://localhost:3000/getDataProducts').then((value) => {
        let selectedOptionValue = document.getElementById(`text_${nextId}`).value;
        let savedGram = Object.values(Object.values(value[num])[0][selectedOptionValue])[0]; // from api
        let currentGram = document.getElementById(`gram_${nextId}`).value; // grams of current product

        document.getElementById(`percentage_${nextId}`).value= (currentGram / savedGram * 100).toFixed(1);
        recalculateUsedProductPercent(nextId, num);
    })
}

// for recalculating quantity of the non-used grams 
function recalculateUsedProductPercent(nextId, num) {
    getData('http://localhost:3000/getDataProducts').then((value) => {
        let selectedOptionValue = document.getElementById(`text_${nextId}`).value;
        let savedGram = Object.values(Object.values(value[num])[0][selectedOptionValue])[0]; // from api
        let percentField = document.getElementsByClassName("foodPercent")[num]; // percent at left sidebar
        let usedProductLength = document.getElementsByClassName("productsList"); // all chosen products
        let currentGram = document.getElementById(`gram_${nextId}`); // grams of current product
        let currentPercent = document.getElementById(`percentage_${nextId}`); // percent of current product

        let foodList = document.getElementsByClassName("food")[num].innerText; // name of current product
        let tailingsPercent = 0;

        for (let i = 0; i < usedProductLength.length; i++) {
            if (document.getElementsByClassName("products-select")[i][0].value == foodList) {
                tailingsPercent += Number(document.getElementsByClassName("percentage-food")[i].value);
            }
        }

        if (tailingsPercent > 100) {
            currentPercent.value = (currentPercent.value - (tailingsPercent - 100)).toFixed(0);
            percentField.innerText = 0;
        } else if (tailingsPercent < 100) {
            percentField.innerText = (100 - tailingsPercent).toFixed(0);
        } else if (tailingsPercent == 100) {
            percentField.innerText = 0;
        }

        currentGram.value = (savedGram * currentPercent.value / 100).toFixed();;

        if (percentField.innerText != 0) {
            let typesFood = document.getElementsByClassName("food-item")[num];
            typesFood.style = "background-color: #FFF4E2;";
            chosenProducts[num] = false;
        }
    })
}

// method to remove chosen product from recipe
async function removeFood(deleteNum, unblockNum) {
    let percentSidebar = document.getElementsByClassName("foodPercent")[unblockNum]; // sidebar
    percentSidebar.innerText = Number(percentSidebar.innerText);
    let deletedPercent = document.getElementById(`percentage_${deleteNum}`).value;

    let deleteDiv = document.getElementById(`createdFood_${deleteNum}`);
    let parent = deleteDiv.parentNode;
    parent.removeChild(deleteDiv);

    let typesFood = document.getElementsByClassName("food-item")[unblockNum];
    typesFood.style = "background-color: #FFF4E2;";
    chosenProducts[unblockNum] = false;

    let initialPercents = document.getElementsByClassName("foodPercent")[unblockNum];
    initialPercents.innerText = Number(initialPercents.innerText) + Number(deletedPercent);
}

// show already chosen recipes
function showAddedRecipes() {
    getData('http://localhost:3000/getSavedRecipes').then((value) => {
        for (let index = 0; index < value.length; index++) {
            let rightSidebarDiv = document.getElementById("rightSidebarDiv");
            let addedRecipeDiv = document.createElement("div"); // create new div with recipe 
            addedRecipeDiv.className = "added-recipe-div";
            rightSidebarDiv.appendChild(addedRecipeDiv);

            let nameRecipeDiv = document.createElement("div"); // create common div for name and button 
            nameRecipeDiv.className = "name-recipe-div";
            addedRecipeDiv.appendChild(nameRecipeDiv);
        
            let addedRecipe = document.createElement("div"); // create new recipe name
            addedRecipe.className = "added-recipe";
            let recipeName = value[index].recipeName;
            addedRecipe.setAttribute("onclick", `expandRecipe("${recipeName}");`);
            addedRecipe.innerText = recipeName;
            nameRecipeDiv.appendChild(addedRecipe);

            let closeBtn = document.createElement("div"); // add close button to delete chosen recipe
            closeBtn.className = "close-btn";
            closeBtn.setAttribute("onclick", `removeRecipe("${recipeName}");`);
            nameRecipeDiv.appendChild(closeBtn);       
            let closeImg = document.createElement("img");
            closeImg.className = "close-img";
            closeImg.setAttribute("src", "../img/close.png");
            closeBtn.appendChild(closeImg);     
        }
    })
}

// show full information of the chosen recipe
function expandRecipe(recipe) {
    let addedRecipes = document.getElementsByClassName("added-recipe");
    for (let index = 0; index < addedRecipes.length; index++) {
        if (recipe == addedRecipes[index].innerText) {
            let allRecipeDiv = document.getElementsByClassName("products-recipe-div")[0]; // delete div with previously shown recipes
            if (allRecipeDiv) {
                allRecipeDiv.remove();
            } else {
                let addedRecipesDiv = document.getElementsByClassName("added-recipe-div")[index];
                getData('http://localhost:3000/getSavedRecipes').then((value) => {
                    let nameRecipeDiv = document.getElementsByClassName("name-recipe-div")[index]; // create common div for name and button
                    if (nameRecipeDiv.childNodes.length <= 2) {
                        let copyBtn = document.createElement("div"); // add copy button to copy chosen recipe
                        copyBtn.className = "copy-btn";
                        copyBtn.setAttribute("onclick", `copyRecipe("${recipe}");`);
                        nameRecipeDiv.appendChild(copyBtn);
                        let copyImg = document.createElement("img"); // add copy button to copy chosen recipe
                        copyImg.className = "copy-img";
                        copyImg.setAttribute("src", "../img/copy.svg");
                        copyBtn.appendChild(copyImg);
                    }
                    
                    let productsRecipeDiv = document.createElement("div"); // create new div with recipe description 
                    productsRecipeDiv.className = "products-recipe-div";
                    addedRecipesDiv.appendChild(productsRecipeDiv);
                    
                    let productsRecipeList = document.createElement("div"); // create new products div
                    productsRecipeList.className = "products-recipe-list";
                    productsRecipeDiv.appendChild(productsRecipeList);

                    for (const prop in value[index].products) { // add products into products div
                        let productRow = document.createElement("li");
                        productRow.className = "list-row";
                        let unit;
                        if (prop === "яйця") {
                            unit = "шт";
                        } else {
                            unit = "гр";
                        }
                        productRow.innerText = `${prop} ${value[index].products[prop]} ${unit}`;
                        productsRecipeList.appendChild(productRow);
                    }
                    
                    let descriptionDiv = document.createElement("div"); // add recipe description
                    descriptionDiv.className = "description-recipe";
                    descriptionDiv.innerText = value[index].foodSummary; 
                    productsRecipeDiv.appendChild(descriptionDiv);            
                })
            }
        }
    }
}

// remove added recipe from the right side of the page
async function removeRecipe(name) {
    let rightSidebarDiv = document.getElementById("rightSidebarDiv");
    let addedRecipes = document.getElementsByClassName("added-recipe");

    for (let index = 0; index < addedRecipes.length; index++) {
        if (name == addedRecipes[index].innerText) {
            await getData('http://localhost:3000/getSavedRecipes').then((value) => {
                const deleteValue = value.slice(index);
                let updateValue = [];
                for (let i = 0; i < value.length; i++) {
                    if (value[i] != deleteValue[0]) {
                        updateValue.push(value[i]);
                    }
                }
                const saveOp = fetch('http://localhost:3000/saveChosenRecipes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateValue)
                });
            })
            
            let parent = await document.getElementsByClassName("added-recipe-div");
            rightSidebarDiv.removeChild(parent[index]);
        }   
    }
}

// go to Recipes page
function chooseRecipe() {
    location.href = "recipesList.html";
}

// copy chosen recipe to created menu
function copyRecipe(recipeName) {
    let productsDiv = document.querySelectorAll(".recipe-list-input");
    let classIndex;
    productsDiv.forEach((item, index) => {
        item.addEventListener('click', event => {
            classIndex = index;
            let copiedValue;
            let addedRecipes = document.getElementsByClassName("added-recipe");
            for (let index = 0; index < addedRecipes.length; index++) {
                if (recipeName == addedRecipes[index].innerText) {
                    getData('http://localhost:3000/getSavedRecipes').then((value) => {
                        copiedValue = value[index].recipeName + "\n";
                        for (const prop in value[index].products) {
                            let unit;
                            if (prop === "яйця") {
                                unit = "шт";
                            } else {
                                unit = "гр";
                            }
                            let product = "    • " + `${prop} ${value[index].products[prop]} ${unit}`;
                            copiedValue += product + "\n"; 
                        }
                        copiedValue += value[index].foodSummary;
                        productsDiv[`${classIndex}`].value = copiedValue;
                    })
                }
            }
        })
    })    
}

// method to save ready menu
async function saveMenu() {
    document.getElementById("successMessage").innerText = "";
    document.getElementById("errorMessage").innerText = "";

    let productsQuantity = [];
    for (let i = 0; i < 4; i++) {
        const myElement = document.getElementsByClassName("products-list-div")[i];
        let chosenProductsProducts = [0, 0, 0, 0];
        
        for (const child of myElement.children) {
            chosenProductsProducts[i] += 1;
        }
        productsQuantity.push(chosenProductsProducts[i])
    }

    let totalProductsQuantity = 0;
    for (let i = 0; i <  4; i++) {
        totalProductsQuantity += productsQuantity[i];
    }
    let addedRecipe = document.getElementsByClassName("recipe-list-input");

    let foodBreakfast = {};
    let breakfastRecipe = {};
    let foodDinner = {};
    let dinnerRecipe = {};
    let foodSnack = {};
    let snackRecipe = {};
    let foodSupper = {};
    let supperRecipe = {};
    for (let i = 0; i <  totalProductsQuantity; i++) {
        if (i < productsQuantity[0]) {
            console.log(totalProductsQuantity, productsQuantity[0], productsQuantity[1], productsQuantity[2], productsQuantity[3])
            let foodName = document.getElementsByClassName("products-select")[i];
            let food = foodName.options[foodName.selectedIndex].text;
            if (foodBreakfast[food]) {
                foodBreakfast[food] = Number(foodBreakfast[food]) + Number(document.getElementsByClassName("gram-food")[i].value);
            } else {
                foodBreakfast[food] = document.getElementsByClassName("gram-food")[i].value;
            }
        } else if (i >= productsQuantity[0] && i < (productsQuantity[0] + productsQuantity[1])) {
            let foodName = document.getElementsByClassName("products-select")[i];
            let food = foodName.options[foodName.selectedIndex].text;
            if (foodDinner[food]) {
                foodDinner[food] = Number(foodDinner[food]) + Number(document.getElementsByClassName("gram-food")[i].value);
            } else {
                foodDinner[food] = document.getElementsByClassName("gram-food")[i].value;
            }
        } else if (i >= (productsQuantity[0] + productsQuantity[1]) && (i < productsQuantity[0] + productsQuantity[1] + productsQuantity[2])) {
            let foodName = document.getElementsByClassName("products-select")[i];
            let food = foodName.options[foodName.selectedIndex].text;
            if (foodSnack[food]) {
                foodSnack[food] = Number(foodSnack[food]) + Number(document.getElementsByClassName("gram-food")[i].value);
            } else {
                foodSnack[food] = document.getElementsByClassName("gram-food")[i].value;
            }
        } else if (i >= (productsQuantity[0] + productsQuantity[1] + productsQuantity[2])) {
            let foodName = document.getElementsByClassName("products-select")[i];
            let food = foodName.options[foodName.selectedIndex].text;
            if (foodSupper[food]) {
                foodSupper[food] = Number(foodSupper[food]) + Number(document.getElementsByClassName("gram-food")[i].value);
            } else {
                foodSupper[food] = document.getElementsByClassName("gram-food")[i].value;
            }
        }
    }

    breakfastRecipe["Рецепт"] = addedRecipe[0].value; // save recipes
    dinnerRecipe["Рецепт"] = addedRecipe[1].value;
    snackRecipe["Рецепт"] = addedRecipe[2].value;
    supperRecipe["Рецепт"] = addedRecipe[3].value;

    let timestamp = Date.now();

    let foods = {
        "breakfast": foodBreakfast,
        "breakfastRecipe": breakfastRecipe,
        "dinner": foodDinner,
        "dinnerRecipe": dinnerRecipe,
        "snack": foodSnack,
        "snackRecipe": snackRecipe,
        "supper": foodSupper,
        "supperRecipe": supperRecipe
    }

    let message = document.createElement("div"); // add message after saved recipe
    if (Object.keys(foodBreakfast).length === 0 && breakfastRecipe["Рецепт"] != "") {
        message.innerText = "Рецепт додан без додавання інгредієнтів";
        message.className = "errorMessage";
    } else if (Object.keys(foodDinner).length === 0 && dinnerRecipe["Рецепт"] != "") {
        message.innerText = "Рецепт додан без додавання інгредієнтів";
        message.className = "errorMessage";
    } else if (Object.keys(foodSnack).length === 0 && snackRecipe["Рецепт"] != "") {
        message.innerText = "Рецепт додан без додавання інгредієнтів";
        message.className = "errorMessage";
    } else if (Object.keys(foodSupper).length === 0 && supperRecipe["Рецепт"] != "") {
        message.innerText = "Рецепт додан без додавання інгредієнтів";
        message.className = "errorMessage";
    } else {
        message.innerText = "Меню збережено";
        message.className = "successMessage";

        await getData('http://localhost:3000/getMenu').then((value) => {
            value[`${timestamp}`] = foods;
            const saveOp = fetch('http://localhost:3000/saveMenu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(value),
            });
        })
    }
    let chosenRecipe = document.getElementById("mainContentPage");
    chosenRecipe.appendChild(message);
    setTimeout(() => location.reload(), 5000);
}