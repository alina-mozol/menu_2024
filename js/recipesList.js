window.onload = function() {
    showRecipes();
    showAddedRecipes();
}

async function getData(url) {
    return (await fetch(url)).json();
}

// display recipes according to food type: breakfast. dinner, supper
function displayRecipes(foodType) {
    let mainText = document.getElementById("mainText");
    mainText.innerText = foodType;
}

// method to show the list of daily products on the left sidebar during on loading page
async function showRecipes() {
    let allRecipeDiv = await document.getElementById("allRecipeDiv"); // delete div with previously shown recipes
    if (document.getElementById("allRecipeDiv")) {
        allRecipeDiv.remove();
    }

    let mainText = document.getElementById("mainText").innerText; 
    await getData('http://localhost:3000/get').then((value) => {
        let mainContainer = document.getElementById("mainRecipeContainer"); // create main content with all recipes
        let allRecipeDiv = document.createElement("div");
        allRecipeDiv.id = "allRecipeDiv";
        mainContainer.appendChild(allRecipeDiv);

        for (let i = 0; i < value.length; i++) {
            let allRecipeDiv = document.getElementById("allRecipeDiv");
            if (value[i].topic == mainText || mainText == "Рецепти") {
                let recipeDiv = document.createElement("div");
                recipeDiv.className = "recipe";
                allRecipeDiv.appendChild(recipeDiv);

                let upDiv = document.createElement("div");
                upDiv.className = "up-div";
                recipeDiv.appendChild(upDiv);
                
                let leftSide = document.createElement("div"); // create divs for left and right parts of added recipe
                let rightSide = document.createElement("div");
                leftSide.className = "left-recipe-side";
                rightSide.className = "right-recipe-side";
                upDiv.appendChild(leftSide);
                upDiv.appendChild(rightSide);

                let recipeImg = document.createElement("img"); // add image for recipe
                recipeImg.className = "img-recipe";
                recipeImg.setAttribute("src", value[i].imgData);
                leftSide.appendChild(recipeImg);

                let recipeName = document.createElement("div"); // add recipe name
                recipeName.className = "recipe-name";
                recipeName.innerText = value[i].recipeName;
                rightSide.appendChild(recipeName);

                let productsDiv = document.createElement("div"); // add products div
                productsDiv.className = "products-lists";
                rightSide.appendChild(productsDiv);
                let leftProductSide = document.createElement("div");
                let rightProductSide = document.createElement("div");
                leftProductSide.className = "products-lists-left";
                rightProductSide.className = "products-lists-right"
                productsDiv.appendChild(leftProductSide);
                productsDiv.appendChild(rightProductSide);

                let countProducts = 0;
                for (const prop in value[i].products) {
                    countProducts ++;
                    let productRow = document.createElement("li");
                    productRow.className = "list-row";
                    let unit;
                    if (prop === "яйця") {
                        unit = "шт";
                    } else {
                        unit = "гр";
                    }
                    productRow.innerText = `${prop} ${value[i].products[prop]} ${unit}`;
                    if (countProducts <= 6) { 
                        leftProductSide.appendChild(productRow);
                    } else {
                        rightProductSide.appendChild(productRow);
                    }
                }

                let downDiv = document.createElement("div");
                downDiv.className = "down-div";
                recipeDiv.appendChild(downDiv);

                let btnDiv = document.createElement("div");
                btnDiv.className = "linkDiv";
                rightSide.appendChild(btnDiv);

                let descriptionText = document.createElement("div"); // add recipe "description" link
                descriptionText.className = "description-text";
                btnDiv.appendChild(descriptionText);
                let descriptionLink = document.createElement("div"); // add recipe "description" link
                descriptionLink.className = "description-link";
                let recipesLength = document.getElementsByClassName("recipe").length;
                descriptionLink.innerText = "Як приготувати ⌵";
                descriptionLink.setAttribute("onclick", `expandRecipeDescription(${recipesLength - 1});`);
                descriptionText.appendChild(descriptionLink);

                let recipeBtnDiv = document.createElement("div"); // add button for choosing recipe
                recipeBtnDiv.className = "choose-recipe-div";
                btnDiv.appendChild(recipeBtnDiv);
                let recipeBtn = document.createElement("div");
                recipeBtn.className = "choose-recipe";
                recipeBtn.innerText = "Обрати рецепт";
                // recipeBtn.setAttribute("onclick", `addRecipe(${i});`);
                recipeBtn.setAttribute("onclick", `addRecipe("${value[i].recipeName}")`);
                recipeBtnDiv.appendChild(recipeBtn);

                let descriptionDiv = document.createElement("div"); // add recipe description
                descriptionDiv.className = "description-div";
                descriptionDiv.innerText = value[i].foodSummary;
                downDiv.appendChild(descriptionDiv);
            }
        }
    })
}

// show already chosen recipes
function showAddedRecipes() {
    getData('http://localhost:3000/getSavedRecipes').then((value) => {
        for (let index = 0; index < value.length; index++) {
            let rightSidebarRecipeDiv = document.getElementById("rightSidebarRecipeDiv");
            let addedRecipeDiv = document.createElement("div"); // create new div with recipe 
            addedRecipeDiv.className = "chosen-recipe-div";
            rightSidebarRecipeDiv.appendChild(addedRecipeDiv);
        
            let addedRecipe = document.createElement("div"); // create new recipe name
            addedRecipe.className = "added-recipe";
            let recipeName = value[index].recipeName;
            addedRecipe.innerText = recipeName;
            addedRecipeDiv.appendChild(addedRecipe);
        
            let closeBtn = document.createElement("div"); // add close button to delete the chosen recipe
            closeBtn.className = "close-btn";
            closeBtn.setAttribute("onclick", `removeRecipe("${recipeName}");`);
            addedRecipeDiv.appendChild(closeBtn);  
            let closeImg = document.createElement("img"); // add copy button to copy chosen recipe
            closeImg.className = "close-img";
            closeImg.setAttribute("src", "../img/close.png");
            closeBtn.appendChild(closeImg);          
        }
    })
}

// show recipe description
function expandRecipeDescription(index) {
    let recipe = document.getElementsByClassName("recipe")[index];
    let descriptionDiv = document.getElementsByClassName("description-div")[index];
    if (descriptionDiv.style.display == "") {
        descriptionDiv.style = "display: block;";
        let divHeight = descriptionDiv.offsetHeight;
        recipe.style.padding = `0 0 ${divHeight}px 0`;
    } else if (descriptionDiv.style.display == "block") {
        descriptionDiv.style = "display: '';";
        recipe.style.padding = 0;
    }    
}

// add recipe to the right side of the page
function addRecipe(recipeName) {
    if (document.getElementById("recipeMessage")) {
        let shownMessage = document.getElementById("recipeMessage"); // remove shown message
        shownMessage.remove();
    }

    console.log(111, "recipeName")
    if (document.getElementById("recipeMessage")) {
        let shownMessage = document.getElementById("recipeMessage"); // remove shown message
        shownMessage.remove();
    }

    let num;
    let recipeDiv = document.getElementsByClassName("recipe-name");
    for (let i = 0; i < recipeDiv.length; i++) {
        if (recipeName == recipeDiv[i].innerText) {
            num = i;
        }
    }
    console.log(222, num)
    let addedRecipes = document.getElementsByClassName("added-recipe");
    let alreadyAdded = false;
    for (let index = 0; index < addedRecipes.length; index++) {
        if (document.getElementsByClassName("recipe-name")[num].innerText == addedRecipes[index].innerText) {
            alreadyAdded = true;
        }
    }

    if (alreadyAdded === false) {
        let rightSidebarRecipeDiv = document.getElementById("rightSidebarRecipeDiv");
        let addedRecipeDiv = document.createElement("div"); // create new div with recipe 
        addedRecipeDiv.className = "chosen-recipe-div";
        rightSidebarRecipeDiv.appendChild(addedRecipeDiv);

        let addedRecipe = document.createElement("div"); // create new recipe name
        addedRecipe.className = "added-recipe";
        let recipeName = document.getElementsByClassName("recipe-name")[num].innerText;
        addedRecipe.innerText = recipeName;
        addedRecipeDiv.appendChild(addedRecipe);

        getData('http://localhost:3000/get').then((value) => {
            for (let index = 0; index < value.length; index++) {
                if (value[index].recipeName == recipeName) {
                    getData('http://localhost:3000/getSavedRecipes').then((recipesValue) => {
                        recipesValue.push(value[index]);
                        const saveOp = fetch('http://localhost:3000/saveChosenRecipes', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(recipesValue),
                        });
                    })
                }
            }
        })

        let closeBtn = document.createElement("div"); // add close button to delete the chosen recipe
        closeBtn.className = "close-btn";
        closeBtn.setAttribute("onclick", `removeRecipe("${recipeName}");`);
        addedRecipeDiv.appendChild(closeBtn);
        let closeImg = document.createElement("img"); // add copy button to copy chosen recipe
        closeImg.className = "close-img";
        closeImg.setAttribute("src", "../img/close.png");
        closeBtn.appendChild(closeImg);
    }

    let message = document.createElement("div"); // add message after added recipe to the Chosen recipes
    message.id = "actionMessage";
    if (alreadyAdded === false) {
        message.innerText = "Рецепт додан в обране";
    } else {
        message.innerText = "Рецепт вже додан";
    }
    message.setAttribute("onclick", `recipeMessage();`);
    let chosenRecipe = document.getElementsByClassName("choose-recipe-div")[num];
    chosenRecipe.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 4000);
}

// remove message about adding recipe
function recipeMessage() {
    let shownMessage = document.getElementById("actionMessage"); // remove shown message
    shownMessage.remove();
}

// remove added recipe from the right side of the page
async function removeRecipe(name) {
    let rightSidebarRecipeDiv = document.getElementById("rightSidebarRecipeDiv");
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
            
            let parent = await document.getElementsByClassName("chosen-recipe-div");
            rightSidebarRecipeDiv.removeChild(parent[index]);
        }   
    }
}