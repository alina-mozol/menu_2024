const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const body = require("koa-bodyparser");
const cors = require("@koa/cors");
const { getData, getDataProducts, getDataMenu, getSavedRecipes, saveData, saveDataMenu, saveChosenRecipes } = require("../modules/storage.js");

app.use(body());
app.use(cors());

const fetch = (handler) => {
    return async (ctx, next) => {
        try {
            ctx.status = 200;
            ctx.body = await handler(ctx);
            await next();
        } catch (err) {
            ctx.throw(err, 400);
        }
    };
};

// ROUTERS =============================================
router.get(`/get`, fetch(getData));
router.get(`/getMenu`, fetch(getDataMenu));
router.get(`/getSavedRecipes`, fetch(getSavedRecipes));
router.get(`/getDataProducts`, fetch(getDataProducts));
router.post(`/save`, fetch(saveData));
router.post(`/saveMenu`, fetch(saveDataMenu));
router.post(`/saveChosenRecipes`, fetch(saveChosenRecipes));
// =====================================================

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
console.log('Server started on port: 3000');
