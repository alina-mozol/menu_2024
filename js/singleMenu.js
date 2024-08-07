window.onload = function() {
    displayTitle();
    showMenu();
    showProductsList();
    document.getElementsByClassName("navItem")[2].style.color = "#ff914d";
}

async function getData(url) {
    return (await fetch(url)).json();
}

function displayTitle() {
    let title = localStorage.getItem("chosenMenu");
    let mainText = document.getElementById("mainText");
    let savedDate = new Date(Number(title)).toLocaleDateString();
    let savedTime = new Date(Number(title)).toLocaleTimeString();
    mainText.innerText = `Меню_${savedDate} ${savedTime}`;
}

// method to show the list of menus during on loading page
function showMenu() {
    getData('http://localhost:3000/getMenu').then((value) => {
        let breakfastDiv = document.getElementsByClassName("mealDiv")[0]; // show breakfast
        let title = localStorage.getItem("chosenMenu");
        let breakfastValue = value[`${title}`].breakfast;
        for (const prop in breakfastValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "menu-row";
            let unit;
            if (prop === "яйця") {
                unit = "шт";
            } else {
                unit = "гр";
            }
            menuRow.innerText = `${prop} ${breakfastValue[prop]} ${unit}`;
            breakfastDiv.appendChild(menuRow);
        }
        let breakfastRecipeName = document.createElement("div");
        breakfastRecipeName.className = "food-recipe-name";
        breakfastRecipeName.innerText = Object.keys(value[`${title}`].breakfastRecipe);
        breakfastDiv.appendChild(breakfastRecipeName);
        let breakfastRecipe = document.createElement("div");
        breakfastRecipe.className = "food-recipe";
        breakfastRecipe.innerText = Object.values(value[`${title}`].breakfastRecipe);
        breakfastDiv.appendChild(breakfastRecipe);

        let dinnerDiv = document.getElementsByClassName("mealDiv")[1]; // show dinner
        let dinnerValue = value[`${title}`].dinner;
        for (const prop in dinnerValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "menu-row";
            let unit;
            if (prop === "яйця") {
                unit = "шт";
            } else {
                unit = "гр";
            }
            menuRow.innerText = `${prop} ${dinnerValue[prop]} ${unit}`;
            dinnerDiv.appendChild(menuRow);
        }
        let dinnerRecipeName = document.createElement("div");
        dinnerRecipeName.className = "food-recipe-name";
        dinnerRecipeName.innerText = Object.keys(value[`${title}`].dinnerRecipe);
        dinnerDiv.appendChild(dinnerRecipeName);
        let dinnerRecipe = document.createElement("div");
        dinnerRecipe.className = "food-recipe";
        dinnerRecipe.innerText = Object.values(value[`${title}`].dinnerRecipe);
        dinnerDiv.appendChild(dinnerRecipe);

        let snackDiv = document.getElementsByClassName("mealDiv")[2]; // show snack
        let snackValue = value[`${title}`].snack;
        for (const prop in snackValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "menu-row";
            let unit;
            if (prop === "яйця") {
                unit = "шт";
            } else {
                unit = "гр";
            }
            menuRow.innerText = `${prop} ${snackValue[prop]} ${unit}`;
            snackDiv.appendChild(menuRow);
        }
        let snackRecipeName = document.createElement("div");
        snackRecipeName.className = "food-recipe-name";
        snackRecipeName.innerText = Object.keys(value[`${title}`].snackRecipe);
        snackDiv.appendChild(snackRecipeName);
        let snackRecipe = document.createElement("div");
        snackRecipe.className = "food-recipe";
        snackRecipe.innerText = Object.values(value[`${title}`].snackRecipe);
        snackDiv.appendChild(snackRecipe);

        let supperDiv = document.getElementsByClassName("mealDiv")[3]; // show supper
        let supperValue = value[`${title}`].supper;
        for (const prop in supperValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "menu-row";
            let unit;
            if (prop === "яйця") {
                unit = "шт";
            } else {
                unit = "гр";
            }
            menuRow.innerText = `${prop} ${supperValue[prop]} ${unit}`;
            supperDiv.appendChild(menuRow);
        }
        let supperRecipeName = document.createElement("div");
        supperRecipeName.className = "food-recipe-name";
        supperRecipeName.innerText = Object.keys(value[`${title}`].supperRecipe);
        supperDiv.appendChild(supperRecipeName);
        let supperRecipe = document.createElement("div");
        supperRecipe.className = "food-recipe";
        supperRecipe.innerText = Object.values(value[`${title}`].supperRecipe);
        supperDiv.appendChild(supperRecipe);
    })
}

// method to show the list of products during on loading page
function showProductsList() {
    getData('http://localhost:3000/getMenu').then((value) => {
        let productsDiv = document.getElementById("products-list-div");
        let title = localStorage.getItem("chosenMenu");
        let breakfastValue = value[`${title}`].breakfast;

        for (const prop in breakfastValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "list-row";
            let unit;
            if (prop === "яйця") {
                unit = "шт";
            } else {
                unit = "гр";
            }

            let alreadyAdded = false;
            let listRow = document.getElementsByClassName("list-row");
            for (let i = 0; i < document.getElementsByClassName("list-row").length; i++) {
                let textProduct = listRow[i].innerText;
                let sliceTextProduct = textProduct.split(' ');
                if (sliceTextProduct[0] == prop ) {
                    alreadyAdded = true;
                    let updatedUnit = Number(sliceTextProduct[1]) + Number(breakfastValueValue[prop]);
                    listRow[i].innerHTML = `${prop} ${updatedUnit} ${unit}`;
                }
            }
            if (alreadyAdded == false ) {
                menuRow.innerText = `${prop} ${breakfastValue[prop]} ${unit}`;
                productsDiv.appendChild(menuRow);
            } else {
                alreadyAdded = false;
            }
        }
    
        let dinnerValue = value[`${title}`].dinner;
        for (const prop in dinnerValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "list-row";
            let unit;
            if (prop === "яйця") {
                unit = "шт";
            } else {
                unit = "гр";
            }

            let alreadyAdded = false;
            let listRow = document.getElementsByClassName("list-row");
            for (let i = 0; i < document.getElementsByClassName("list-row").length; i++) {
                let textProduct = listRow[i].innerText;
                let sliceTextProduct = textProduct.split(' ');
                if (sliceTextProduct[0] == prop ) {
                    alreadyAdded = true;
                    let updatedUnit = Number(sliceTextProduct[1]) + Number(dinnerValue[prop]);
                    listRow[i].innerHTML = `${prop} ${updatedUnit} ${unit}`;
                }
            }
            if (alreadyAdded == false ) {
                menuRow.innerText = `${prop} ${dinnerValue[prop]} ${unit}`;
                productsDiv.appendChild(menuRow);
            } else {
                alreadyAdded = false;
            }
        }

        let snackValue = value[`${title}`].snack;
        for (const prop in snackValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "list-row";
            let unit;
            if (prop === "яйця") {
                unit = "шт";
            } else {
                unit = "гр";
            }

            let alreadyAdded = false;
            let listRow = document.getElementsByClassName("list-row");
            for (let i = 0; i < document.getElementsByClassName("list-row").length; i++) {
                let textProduct = listRow[i].innerText;
                let sliceTextProduct = textProduct.split(' ');
                if (sliceTextProduct[0] == prop ) {
                    alreadyAdded = true;
                    let updatedUnit = Number(sliceTextProduct[1]) + Number(snackValue[prop]);
                    listRow[i].innerHTML = `${prop} ${updatedUnit} ${unit}`;
                }
            }
            if (alreadyAdded == false ) {
                menuRow.innerText = `${prop} ${snackValue[prop]} ${unit}`;
                productsDiv.appendChild(menuRow); 
            } else {
                alreadyAdded = false;
            }  
        }

        let supperValue = value[`${title}`].supper;
        for (const prop in supperValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "list-row";
            let unit;
            if (prop === "яйця") {
                unit = "шт";
            } else {
                unit = "гр";
            }

            let alreadyAdded = false;
            let listRow = document.getElementsByClassName("list-row");
            for (let i = 0; i < document.getElementsByClassName("list-row").length; i++) {
                let textProduct = listRow[i].innerText;
                let sliceTextProduct = textProduct.split(' ');
                if (sliceTextProduct[0] == prop ) {
                    alreadyAdded = true;
                    let updatedUnit = Number(sliceTextProduct[1]) + Number(supperValue[prop]);
                    listRow[i].innerHTML = `${prop} ${updatedUnit} ${unit}`;
                }
            }
            if (alreadyAdded == false ) {
                menuRow.innerText = `${prop} ${supperValue[prop]} ${unit}`;
                productsDiv.appendChild(menuRow); 
            } else {
                alreadyAdded = false;
            }
        }
    })
}