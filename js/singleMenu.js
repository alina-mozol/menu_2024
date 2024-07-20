window.onload = function() {
    displayTitle();
    showMenu();
    showProductsList();
}

async function getData(url) {
    return (await fetch(url)).json();
}

function displayTitle() {
    let title = localStorage.getItem("chosenMenu");
    let mainText = document.getElementById("mainText");
    let savedDate = new Date(Number(title)).toLocaleDateString();
    let savedTime = new Date(Number(title)).toLocaleTimeString();
    mainText.innerText = `Menu_${savedDate} ${savedTime}`;
}

// method to show the list of menus during on loading page
function showMenu() {
    getData('http://localhost:3000/getMenu').then((value) => {
        let breakfastDiv = document.getElementsByClassName("mealDiv")[0]; // show breakfast
        let title = localStorage.getItem("chosenMenu");
        let breakfastValue = value[`${title}`].breakfast;
        for (const prop in breakfastValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "menuRow";
            let unit;
            if (prop === "eggs") {
                unit = "pieces";
            } else {
                unit = "gramms";
            }
            menuRow.innerText = `${prop} ${breakfastValue[prop]} ${unit}`;
            breakfastDiv.appendChild(menuRow);
        }
        let dinnerDiv = document.getElementsByClassName("mealDiv")[1]; // show dinner
        let dinnerValue = value[`${title}`].dinner;
        for (const prop in dinnerValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "menuRow";
            let unit;
            if (prop === "eggs") {
                unit = "pieces";
            } else {
                unit = "gramms";
            }
            menuRow.innerText = `${prop} ${dinnerValue[prop]} ${unit}`;
            dinnerDiv.appendChild(menuRow);
        }
        let snackDiv = document.getElementsByClassName("mealDiv")[2]; // show snack
        let snackValue = value[`${title}`].snack;
        for (const prop in snackValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "menuRow";
            let unit;
            if (prop === "eggs") {
                unit = "pieces";
            } else {
                unit = "gramms";
            }
            menuRow.innerText = `${prop} ${snackValue[prop]} ${unit}`;
            snackDiv.appendChild(menuRow);
        }
        let supperDiv = document.getElementsByClassName("mealDiv")[3]; // show supper
        let supperValue = value[`${title}`].supper;
        for (const prop in supperValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "menuRow";
            let unit;
            if (prop === "eggs") {
                unit = "pieces";
            } else {
                unit = "gramms";
            }
            menuRow.innerText = `${prop} ${supperValue[prop]} ${unit}`;
            supperDiv.appendChild(menuRow);
        }
    })
}

// method to show the list of products during on loading page
function showProductsList() {
    getData('http://localhost:3000/getMenu').then((value) => {
        let productsDiv = document.getElementById("productsDiv");
        let title = localStorage.getItem("chosenMenu");
        let breakfastValue = value[`${title}`].breakfast;

        for (const prop in breakfastValue) {
            let menuRow = document.createElement("li");
            menuRow.className = "listRow";
            let unit;
            if (prop === "eggs") {
                unit = "pieces";
            } else {
                unit = "gramms";
            }

            let alreadyAdded = false;
            let listRow = document.getElementsByClassName("listRow");
            for (let i = 0; i < document.getElementsByClassName("listRow").length; i++) {
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
            menuRow.className = "listRow";
            let unit;
            if (prop === "eggs") {
                unit = "pieces";
            } else {
                unit = "gramms";
            }

            let alreadyAdded = false;
            let listRow = document.getElementsByClassName("listRow");
            for (let i = 0; i < document.getElementsByClassName("listRow").length; i++) {
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
            menuRow.className = "listRow";
            let unit;
            if (prop === "eggs") {
                unit = "pieces";
            } else {
                unit = "gramms";
            }

            let alreadyAdded = false;
            let listRow = document.getElementsByClassName("listRow");
            for (let i = 0; i < document.getElementsByClassName("listRow").length; i++) {
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
            menuRow.className = "listRow";
            let unit;
            if (prop === "eggs") {
                unit = "pieces";
            } else {
                unit = "gramms";
            }

            let alreadyAdded = false;
            let listRow = document.getElementsByClassName("listRow");
            for (let i = 0; i < document.getElementsByClassName("listRow").length; i++) {
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