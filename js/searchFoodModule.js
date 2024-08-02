async function getData(url) {
    return (await fetch(url)).json();
}

// search recipes in the recipes.json
let searchField = document.getElementById("searchField");
searchField.addEventListener('input', event => {
    if (document.getElementById("theList")) { // delete the searched product from the input field and options
        let deleteDiv = document.getElementById("theList");
        let parent = deleteDiv.parentNode;
        parent.removeChild(deleteDiv);
    }

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
})

// find recipe on the page
function searchRecipe() {
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