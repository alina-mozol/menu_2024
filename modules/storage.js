const fs = require("fs");
const DB_PATH = `${__dirname}/../db/recipes.json`;
const DB_PATH_PRODUCTS = `${__dirname}/../db/products.json`;
const DB_PATH_MENU = `${__dirname}/../db/menu.json`;
// const DB_PATH_MENU_CHILD = `${__dirname}/../db/menu_child.json`;
// const DB_PATH_LIST = `${__dirname}/../db/menu_list.json`;
// const DB_PATH_LIST_CHILDREN = `${__dirname}/../db/menu_list_children.json`;

const getDataProducts = async () => {
    const data = fs.readFileSync(DB_PATH_PRODUCTS);
    return JSON.parse(data);
}

const getData = async () => {
    const data = fs.readFileSync(DB_PATH);
    return JSON.parse(data);
}

const saveData = async ({
    request,
  }) => {
    const oldData = await getData();
    fs.writeFileSync(DB_PATH, JSON.stringify([ ...oldData, request.body ], null, 2));
    return { status: "Saved" };
}

const saveDataMenu = async ({
    request,
  }) => {
    fs.writeFileSync(DB_PATH_MENU, JSON.stringify(request.body, null, 2));
    return { status: "Saved" };
}

// const updateMenuList = async (num) => {
//     let menuList = JSON.parse(await fs.readFileSync(DB_PATH_LIST));
//     menuList = [ ...menuList, num ];

//     fs.writeFileSync(DB_PATH_LIST, JSON.stringify(menuList, null, 2));
//     return { status: "Saved" };   
// }

// const saveNewMenu = async ({
//     request,
//   }) => {
//     let num = Date.now();
//     await fs.writeFileSync(`${__dirname}/../db/menues/menu_${num}.json`, JSON.stringify(request.body, null, 2));
//     await fs.writeFileSync(`${__dirname}/../db/menues/menu_children${num}.json`, JSON.stringify(request.body, null, 2));
//     await updateMenuList(num);
//     return { status: "Saved" };   
// }

// const updateMenu = async ({
//     request,
//   }) => {
//     const { params: { path } } = request;
//     try {
//         await fs.writeFileSync(`${__dirname}/../db/menues/${path}`, JSON.stringify(request.body, null, 2));
//         return { status: "Saved" };   
//     } catch (err) {
//         console.log(err)
//         throw err;
//     }
// }

// const saveProducrsList = async ({
//     request,
//   }) => {
//     console.log(request)
//     const { params: { path } } = request;
//     try {
//         await fs.writeFileSync(`${__dirname}/../db/menues/lists/${path}`, JSON.stringify(request.body, null, 2));
//         return { status: "Saved" };   
//     } catch (err) {
//         console.log(err)
//         throw err;
//     }
// }

// const getData = async () => {
//     const data = fs.readFileSync(DB_PATH);
//     return JSON.parse(data);
// }

// const getDataMenu = async () => {
//     const data = fs.readFileSync(DB_PATH_MENU);
//     return JSON.parse(data);
// }

// const getSavedMenu = async () => {
//     const data = fs.readFileSync(DB_PATH_LIST);
//     return JSON.parse(data);
// }

// const getChildrenSavedMenu = async () => {
//     const data = fs.readFileSync(DB_PATH_LIST_CHILDREN);
//     return JSON.parse(data);
// }

// const getSavedMenuList = async (ctx) => {
//     const { params: { path } } = ctx;
//     try {
//         const data = fs.readFileSync(`${__dirname}/../db/menues/${path}`);
//         return JSON.parse(data);
//     } catch (err) {
//         console.log(err)
//         throw err;
//     }
// }

// const getSavedList = async (ctx) => {
//     const { params: { path } } = ctx;
//     try {
//         const data = fs.readFileSync(`${__dirname}/../db/menues/lists/${path}`);
//         return JSON.parse(data);
//     } catch (err) {
//         console.log(err)
//         throw err;
//     }
// }

const checkForWork = () => {
    return { status: "OK" };
}

module.exports = {
    getDataProducts,
    saveData,
    saveDataMenu,
    // saveNewMenu,
    // updateMenu,
    // saveProducrsList,
    // checkForWork,
    getData,
    // getDataMenu,
    // getSavedMenu,
    // getSavedMenuList,
    // getSavedList,
    // getChildrenSavedMenu
}
