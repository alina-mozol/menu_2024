const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const body = require("koa-bodyparser");
const cors = require("@koa/cors");
const { checkForWork, getData, getDataProducts, saveData, saveDataMenu } = require("../modules/storage.js");

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
router.get(`/getDataProducts`, fetch(getDataProducts));
// router.get(`/`, fetch(checkForWork));
router.post(`/save`, fetch(saveData));
router.post(`/saveMenu`, fetch(saveDataMenu));
// router.post(`/saveFullMenu`, fetch(saveNewMenu));
// router.post(`/updateMenu/:path`, fetch(updateMenu));
// router.post(`/saveProducrsList/:path`, fetch(saveProducrsList));
router.get(`/get`, fetch(getData));
// router.get(`/getMenu`, fetch(getDataMenu));
// router.get(`/getSavedMenu`, fetch(getSavedMenu));
// router.get(`/getSavedMenuList/:path`, fetch(getSavedMenuList));
// router.get(`/getChildrenSavedMenu`, fetch(getChildrenSavedMenu));
// router.get(`/getSavedList/:path`, fetch(getSavedList));
// =====================================================

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
console.log('Server started on port: 3000');
