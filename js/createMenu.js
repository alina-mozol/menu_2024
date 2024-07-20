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
                        let text;
                        if (Object.keys(value[num]) == 'f) Vegetables and mushrooms' || Object.keys(value[num]) == 'l) Vegetables and mushrooms') {
                            text = document.createElement("textarea");
                            text.setAttribute("rows", 4);
                            text.placeholder = "Enter vegetables and mushrooms. Max quantity - 300 gramms";
                        } else {
                            text = document.createElement("select");
                            text.addEventListener("click", () => {
                                changeOption(num, divLength);
                            })
                        }
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

                        let divLength = document.getElementsByClassName("productsList").length; // get a next number for IDs of the created elements
                        if (divLength === undefined) {
                            divLength = 0;
                        } else {
                            divLength += 1; 
                        }
                        divFood.id = `createdFood_${divLength}`;
                        gram.id = `gram_${divLength}`;
                        percentage.id = `percentage_${divLength}`;
                        text.id = `text_${divLength}`;

                        gram.disabled = true; // disable input fields before choosing an option
                        percentage.disabled = true;

                        if (divLength > 3) { // increase a recipe block after adding a new product
                            let currentHeight = productsDiv[`${classIndex}`].clientHeight + 23;
                            productsDiv[`${classIndex}`].style = `height: ${currentHeight}px`; 
                        }

                        close.innerText = "X"; // add close button to delete the chosen product
                        close.setAttribute("onclick", `removeFood(${divLength}, ${num});`);

                        gram.addEventListener("input", function(){
                            listenEventsGram(divLength, num);
                        });

                        percentage.addEventListener("input", function(){
                            listenEventsPercentage(divLength, num);
                        });
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
            let typesFood = document.getElementsByClassName("food")[num];
            typesFood.style = "background-color: #cccccc9e;";
            chosenProducts[num] = true;
        })
    }
}

// method to display grams after choosing product option in dropdown list
async function changeOption(num, divLength) {
    document.getElementById(`gram_${divLength}`).disabled = false;
    document.getElementById(`percentage_${divLength}`).disabled = false;

    let selectedOptionValue = document.getElementById(`text_${divLength}`).value;

    await getData('http://localhost:3000/getDataProducts').then((value) => {
        let savedGram = Object.values(Object.values(value[num])[0][selectedOptionValue]);
        let gramInput = document.getElementById(`gram_${divLength}`);
        gramInput.value = savedGram;
        let percentageInput = document.getElementById(`percentage_${divLength}`);
        percentageInput.value = 100;
    })
}

// method to recalculate percents of product after changing grams of the product
async function listenEventsGram(divLength, num) {
    let selectedOptionValue = document.getElementById(`text_${divLength}`).value;

    await getData('http://localhost:3000/getDataProducts').then((value) => {
        let savedGram = Object.values(Object.values(value[num])[0][selectedOptionValue]);
        let gramInput = document.getElementById(`gram_${divLength}`).value;

        let percentageInput = document.getElementById(`percentage_${divLength}`);
        let newPercentage = gramInput / savedGram *100;

        percentageInput.value = newPercentage.toFixed(0);

        if (newPercentage > 100) {
            document.getElementById(`gram_${divLength}`).value = savedGram;
            percentageInput.value = 100;
        }
    })
}

// method to recalculate grams of product after changing percents of the product
async function listenEventsPercentage(divLength, num) {
    let selectedOptionValue = document.getElementById(`text_${divLength}`).value;

    await getData('http://localhost:3000/getDataProducts').then((value) => {
        let savedGram = Object.values(Object.values(value[num])[0][selectedOptionValue]);
        let gramInput = document.getElementById(`gram_${divLength}`);

        let percentageInput = document.getElementById(`percentage_${divLength}`);
        let newGram = percentageInput.value / 100 * savedGram;
        gramInput.value = newGram;

        if (percentageInput.value > 100) {
            document.getElementById(`gram_${divLength}`).value = savedGram;
            percentageInput.value = 100;
        }
    })
}

// method to remove chosen product from recipe
async function removeFood(deleteNum, unblockNum) {
    let deleteDiv = document.getElementById(`createdFood_${deleteNum}`);
    let parent = deleteDiv.parentNode;
    parent.removeChild(deleteDiv);

    let typesFood = document.getElementsByClassName("food")[unblockNum];
    typesFood.style = "background-color: #FFF4E2;";
    chosenProducts[unblockNum] = false;
}

// method to save ready menu
async function saveMenu() {
    document.getElementById("successMessage").innerText = "";
    let productsQuantity = [];
    for (let i = 0; i < 4; i++) {
        const myElement = document.getElementsByClassName("productsDiv")[i];
        let countProducts = [0, 0, 0, 0];
        
        for (const child of myElement.children) {
            countProducts[i] += 1;
        }
        productsQuantity.push(countProducts[i])
    }

    let totalProductsQuantity = 0;
    for (let i = 0; i <  4; i++) {
        totalProductsQuantity += productsQuantity[i];
    }

    let foodBreakfast = {};
    let foodDinner = {};
    let foodSnack = {};
    let foodSupper = {};
    for (let i = 1; i <  totalProductsQuantity + 1; i++) {
        if (i < productsQuantity[0] + 1) {
            let foodName = document.getElementById(`text_${i}`);
            if (foodName.placeholder == 'Enter vegetables and mushrooms. Max quantity - 300 gramms') {
                foodBreakfast[foodName.value] = "300";
            } else {
                let food = foodName.options[foodName.selectedIndex].text;
                if (foodBreakfast[food]) {
                    foodBreakfast[food] = Number(foodBreakfast[food]) + Number(document.getElementById(`gram_${i}`).value);
                } else {
                    foodBreakfast[food] = document.getElementById(`gram_${i}`).value;
                }
            }
        } else if (i >= (productsQuantity[0] + 1) && i < (productsQuantity[0] + productsQuantity[1] + 1)) {
                let foodName = document.getElementById(`text_${i}`);
                if (foodName.placeholder == 'Enter vegetables and mushrooms. Max quantity - 300 gramms') {
                    foodDinner[foodName.value] = "300";
                } else {
                    let food = foodName.options[foodName.selectedIndex].text;
                    if (foodDinner[food]) {
                        foodDinner[food] = Number(foodDinner[food]) + Number(document.getElementById(`gram_${i}`).value);
                    } else {
                        foodDinner[food] = document.getElementById(`gram_${i}`).value;
                    }
                }
        } else if (i >= (productsQuantity[0] + productsQuantity[1] + 1) && (i < productsQuantity[0] + productsQuantity[1] + productsQuantity[2] + 1)) {
            let foodName = document.getElementById(`text_${i}`);
            if (foodName.placeholder == 'Enter vegetables and mushrooms. Max quantity - 300 gramms') {
                console.log(i, foodName)
                foodSnack[foodName.value] = "300";
            } else {
                let food = foodName.options[foodName.selectedIndex].text;
                if (foodSnack[food]) {
                    foodSnack[food] = Number(foodSnack[food]) + Number(document.getElementById(`gram_${i}`).value);
                } else {
                    foodSnack[food] = document.getElementById(`gram_${i}`).value;
                }
            }
        } else if (i >= (productsQuantity[0] + productsQuantity[1] + productsQuantity[2] + 1)) {
            let foodName = document.getElementById(`text_${i}`);
            if (foodName.placeholder == 'Enter vegetables and mushrooms. Max quantity - 300 gramms') {
                foodSupper[foodName.value] = "300";
            } else {
                let food = foodName.options[foodName.selectedIndex].text;
                if (foodSupper[food]) {
                    foodSupper[food] = Number(foodSupper[food]) + Number(document.getElementById(`gram_${i}`).value);
                } else {
                    foodSupper[food] = document.getElementById(`gram_${i}`).value;
                }
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
    console.log(foods)

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