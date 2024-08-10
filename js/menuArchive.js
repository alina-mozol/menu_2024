window.onload = function() {
    showMenus();
    document.getElementsByClassName("navItem")[2].style.color = "#ff914d";
}

async function getData(url) {
    return (await fetch(url)).json();
}

// method to show the list of menus during on loading page
function showMenus() {
    getData('http://localhost:3000/getMenu').then((value) => {
        let menuList = document.getElementById("menuDivList");
        
        for (let i = 0; i < Object.keys(value).length; i++) {
            let menuRow = document.createElement("div");
            let menuLink = document.createElement("a");
            let deleteDiv = document.createElement("div");

            menuRow.className = "menu-row-list";
            menuLink.className = "menu-item";
            deleteDiv.className = "delete-btn";

            let savedDate = new Date(Number(Object.keys(value)[i])).toLocaleDateString();
            let savedTime = new Date(Number(Object.keys(value)[i])).toLocaleTimeString();
            menuLink.innerText = `Меню_${savedDate} ${savedTime}`;
            menuLink.setAttribute("href", "./singleMenu.html");
            menuLink.setAttribute("onclick", `openedPage(${Object.keys(value)[i]})`);
            menuRow.setAttribute("value", `${Object.keys(value)[i]}`);
            deleteDiv.innerText = "X";
            let name = menuLink.innerText;
            deleteDiv.addEventListener('click', function() {
                let quantityRows = document.getElementsByClassName("menu-row-list");
                let nameDeletedRecipe = document.getElementsByClassName("menu-item");

                for (let index = 0; index < quantityRows.length; index++) {
                    if (nameDeletedRecipe[index].innerText == name) {
                        quantityRows[index].remove();
                        delete value[Number(Object.keys(value)[index])];
                        const saveOp = fetch('http://localhost:3000/saveMenu', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(value),
                        });
                    }
                }
            });
            menuList.appendChild(menuRow);
            menuRow.appendChild(menuLink);
            menuRow.appendChild(deleteDiv);
        }
    })
}

function openedPage(data) {
    localStorage.setItem("chosenMenu", data);
}