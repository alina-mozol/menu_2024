window.onload = function() {
    showProducts();
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
            let productsDiv = document.querySelectorAll(".productsDiv");  // get all Recipe blocks via event listener
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
                        text.className = "productsSelect"
                        gram.className = "gramFood";
                        gramText.className = "gramText";
                        percentage.className = "percentageFood";
                        percentText.className = "percentText";
                        close.className = "closeBtn";

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

                        if (nextId > 3) { // increase a recipe block after adding a new product
                            let currentHeight = productsDiv[`${classIndex}`].clientHeight + 23;
                            productsDiv[`${classIndex}`].style = `height: ${currentHeight}px`; 
                        }

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

                        gramText.innerText = "gr ";
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
            let typesFood = document.getElementsByClassName("foodItem")[num];
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
        let currentPercent = document.getElementsByClassName("percentageFood"); // percent of current product

        let foodList = document.getElementsByClassName("food")[num].innerText; // name of current product
        let tailingsPercent = 0;
        for (let i = 0; i < usedProductLength.length; i++) {
            if (document.getElementsByClassName("productsSelect")[i][0].value == foodList) {
                tailingsPercent += Number(currentPercent[i].value);
            }
        }
        percentField.innerText = (100 - tailingsPercent).toFixed(0);

        if (percentField.innerText == 0) {
            let typesFood = document.getElementsByClassName("foodItem")[num];
            typesFood.style = "background-color: #cccccc9e;";
            chosenProducts[num] = true;
        }
    })
}

// method to recalculate grams of product after changing percents of the product
async function changePercentage(nextId, num) {
    let typesFood = document.getElementsByClassName("foodItem")[num];
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
    let typesFood = document.getElementsByClassName("foodItem")[num];
    typesFood.style = "background-color: #cccccc9e;";
    chosenProducts[num] = true;

    await getData('http://localhost:3000/getDataProducts').then((value) => {
        let selectedOptionValue = document.getElementById(`text_${nextId}`).value;
        let savedGram = Object.values(Object.values(value[num])[0][selectedOptionValue])[0]; // from api
        let currentGram = document.getElementById(`gram_${nextId}`).value; // grams of current product

        document.getElementById(`percentage_${nextId}`).value= (currentGram / savedGram * 100).toFixed(0);
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
            if (document.getElementsByClassName("productsSelect")[i][0].value == foodList) {
                tailingsPercent += Number(document.getElementsByClassName("percentageFood")[i].value);
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

        currentGram.value = (savedGram * currentPercent.value / 100).toFixed(0);;

        if (percentField.innerText != 0) {
            let typesFood = document.getElementsByClassName("foodItem")[num];
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

    let typesFood = document.getElementsByClassName("foodItem")[unblockNum];
    typesFood.style = "background-color: #FFF4E2;";
    chosenProducts[unblockNum] = false;

    let initialPercents = document.getElementsByClassName("foodPercent")[unblockNum];
    initialPercents.innerText = Number(initialPercents.innerText) + Number(deletedPercent);
}

// method to save ready menu
async function saveMenu() {
    document.getElementById("successMessage").innerText = "";
    let productsQuantity = [];
    for (let i = 0; i < 4; i++) {
        const myElement = document.getElementsByClassName("productsDiv")[i];
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

    let foodBreakfast = {};
    let foodDinner = {};
    let foodSnack = {};
    let foodSupper = {};
    for (let i = 0; i <  totalProductsQuantity; i++) {
        if (i < productsQuantity[0]) {
            let foodName = document.getElementsByClassName("productsSelect")[i];
            let food = foodName.options[foodName.selectedIndex].text;
            if (foodBreakfast[food]) {
                foodBreakfast[food] = Number(foodBreakfast[food]) + Number(document.getElementById(`gram_${i}`).value);
            } else {
                foodBreakfast[food] = document.getElementById(`gram_${i}`).value;
            }
        } else if (i >= productsQuantity[0] && i < (productsQuantity[0] + productsQuantity[1])) {
                let foodName = document.getElementById(`text_${i}`);
                let food = foodName.options[foodName.selectedIndex].text;
                if (foodDinner[food]) {
                    foodDinner[food] = Number(foodDinner[food]) + Number(document.getElementById(`gram_${i}`).value);
                } else {
                    foodDinner[food] = document.getElementById(`gram_${i}`).value;
                }
        } else if (i >= (productsQuantity[0] + productsQuantity[1]) && (i < productsQuantity[0] + productsQuantity[1] + productsQuantity[2])) {
            let foodName = document.getElementById(`text_${i}`);
            let food = foodName.options[foodName.selectedIndex].text;
            if (foodSnack[food]) {
                foodSnack[food] = Number(foodSnack[food]) + Number(document.getElementById(`gram_${i}`).value);
            } else {
                foodSnack[food] = document.getElementById(`gram_${i}`).value;
            }
        } else if (i >= (productsQuantity[0] + productsQuantity[1] + productsQuantity[2])) {
            let foodName = document.getElementById(`text_${i}`);
            let food = foodName.options[foodName.selectedIndex].text;
            if (foodSupper[food]) {
                foodSupper[food] = Number(foodSupper[food]) + Number(document.getElementById(`gram_${i}`).value);
            } else {
                foodSupper[food] = document.getElementById(`gram_${i}`).value;
            }
        }    
    }

    let timestamp = Date.now();

    let foods = {
        "breakfast": foodBreakfast,
        "dinner": foodDinner,
        "snack": foodSnack,
        "supper": foodSupper
    }

    await getData('http://localhost:3000/getMenu').then((value) => {
        value[`${timestamp}`] = foods;
        const saveOp = fetch('http://localhost:3000/saveMenu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(value),
        });
    })

    document.getElementById("successMessage").innerText = "The menu is saved";
}