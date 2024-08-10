async function getData(url) {
    return (await fetch(url)).json();
}

// block search one of the search checkbox
let searchCheckbox = document.querySelectorAll(".checkbox-search");
searchCheckbox.forEach((item, index) => {
    item.addEventListener('change', event => {
        for (let index = 0; index < searchCheckbox.length; index++) {
            if (item !== searchCheckbox[index]) {
                searchCheckbox[index].checked = false;
            }
            if (document.querySelector(".checkbox-search:checked") == document.querySelectorAll(".checkbox-search")[1]) {
                document.getElementById("searchField").placeholder = "Для пошуку інгредієнти розділяти комою";
                document.getElementById("searchField").value = "";
            } else {
                document.getElementById("searchField").placeholder = "Пошук ...";
                document.getElementById("searchField").value = "";
            }
        }
    })
})

// search recipes in the recipes.json
let searchField = document.getElementById("searchField");
searchField.addEventListener('input', event => {
    if (document.getElementById("theList")) { // delete the searched product from the input field and options
        let deleteDiv = document.getElementById("theList");
        let parent = deleteDiv.parentNode;
        parent.removeChild(deleteDiv);
    }

    if (document.querySelector(".checkbox-search:checked") == document.querySelectorAll(".checkbox-search")[0]) {
        searchByRecipeName();
    }
})

// search by recipe name
function searchByRecipeName() {
    let searchField = document.getElementById("searchField");
    getData('http://localhost:3000/get').then((value) => {
        let searchDatalist = document.createElement("datalist"); // create new datalist 
        searchDatalist.id = "theList";
        searchDatalist.style = "display: inline-block;";
        searchField.appendChild(searchDatalist);
        
        for (let i = 0; i < value.length; i++) {
            let recipeNameLowCase = (value[i].recipeName).toLowerCase();
            let enteredValueLowCase = (searchField.value).toLowerCase();
            if (recipeNameLowCase.includes(enteredValueLowCase)) {
                let option = document.createElement("option"); 
                option.className = "liList";
                option.value = value[i].recipeName;
                let createdList = document.getElementById("theList");
                createdList.appendChild(option);
            }
        }
    })
}

// find recipe on the page
function searchRecipe() {
    if (document.querySelector(".checkbox-search:checked") == document.querySelectorAll(".checkbox-search")[0]) { // for search by recipe name
        getData('http://localhost:3000/get').then((value) => {
            let searchField = document.getElementById("searchField").value;
            for (let i = 0; i < value.length; i++) {
                if (value[i].recipeName == searchField) {
                    let recipeDiv = document.getElementsByClassName("recipe")[i];
                    recipeDiv.scrollIntoView();
                }
            }
        })
    }

    if (document.querySelector(".checkbox-search:checked") == document.querySelectorAll(".checkbox-search")[1]) { // for search by products
        let searchValue = document.getElementById("searchField").value;
        let splitSearchValue = searchValue.split(',');
        
        getData('http://localhost:3000/get').then((value) => {
            let chosenRecipes = [];
            for (let i = 0; i < value.length; i++) {
                let matchedProducts = 0;
                for (let index = 0; index < splitSearchValue.length; index++) {

                    for (const prop in value[i].products) {
                        if (prop.includes(splitSearchValue[index].trim().toLowerCase())) {
                            matchedProducts += 1;
                        }
                    }
                    if (matchedProducts == splitSearchValue.length) {
                        chosenRecipes.push(value[i].recipeName);
                    }
                }
            }
            
            if (chosenRecipes.length > 0) {
                console.log("11111111111111", chosenRecipes)
                let mainText = "";
                for (let index = 0; index < chosenRecipes.length; index++) {
                    if (index == chosenRecipes.length - 1) {
                        mainText += `${chosenRecipes[index]}`;
                    } else {
                        mainText += `${chosenRecipes[index]}, `;
                    }
                }
                localStorage.setItem('foundRecipes', mainText);
                document.getElementById("mainText").innerText = "Результати пошуку:";
                document.getElementById("chosenRecipes").innerText = `"${searchValue}"`;
                document.getElementById("searchField").value = "";
            }
        })
    }
}