const Router = require('koa-router');

const handleGetCompany = require('../router/getCompany');
const handleGetStock = require('../router/getStock');

const router = new Router();

router.get('/api/getCompany', async (ctx, next) => {
	await handleGetCompany(ctx);
	await next();
});
router.get('/api/getStock', async (ctx, next) => {
	await handleGetStock(ctx);
	await next();
});

module.exports = router;
