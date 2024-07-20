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

let count = [false, false, false, false, false, false, false, false, false, false, false, false, false];

// method to choose a products for recipe
async function moveFood(num) {
    if (count[num] == false) { // to protect a double addition of one product
        let typesFood = document.getElementsByClassName("food")[num];
        typesFood.style = "background-color: #cccccc9e;";
        count[num] = true;
        
        await getData('http://localhost:3000/getDataProducts').then((value) => {
            let productsDiv = document.getElementById("productsDiv");  // get recipe block

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

            if (divLength > 4) { // increase a recipe block after adding a new product
                let currentHeight = productsDiv.clientHeight + 20;
                productsDiv.style = `height: ${currentHeight}px`; 
            }

            close.innerText = "X"; // add close button to delete the chosen product
            close.addEventListener('click', function(e) {
                let typesFood = document.getElementsByClassName("food")[num];
                typesFood.style = "background-color: #FFF4E2;";
                count[num] = false;

                close.parentNode.remove();
            })

            gram.addEventListener("input", function(){
                listenEventsGram(divLength, num);
            });
            
            percentage.addEventListener("input", function(){
                listenEventsPercentage(divLength, num);
            });

            productsDiv.appendChild(divFood);

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

// method to save ready recipe
async function saveRecipe() {
    document.getElementById("successMessage").innerText = "";

    let topic = document.getElementById("selectFoodType").value;
    let recipeName = document.getElementById("foodName").value;
	let imgLink = document.getElementById("img").value;
    let foodSummary = document.getElementById("foodSummary").value;
    let food = document.getElementsByClassName("productsSelect");

    if (topic === "Обрати тему" || recipeName === "" || imgLink === 0 || foodSummary === "") {
    	document.getElementById("errorMessage").innerText = "Fill the required fields!"
    } else {
        document.getElementById("errorMessage").innerText = "";

        let foodObj = {};
        for (let i = 1; i < food.length + 1; i++) {
            let foodName = document.getElementById(`text_${i}`);
            if (foodName.placeholder == 'Enter vegetables and mushrooms. Max quantity - 300 gramms') {
                foodObj[foodName.value] = 300;
            } else {
                let food = foodName.options[foodName.selectedIndex].text;
                foodObj[food] = document.getElementById(`gram_${i}`).value;
            }
        }

        let foods = {
            topic: topic,
            recipeName: recipeName,
            imgData: imgLink,
            products: foodObj, 
            foodSummary: foodSummary
        }
        const saveOp = fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foods),
        });

        document.getElementById("successMessage").innerText = "The recipe is saved";
    }
}