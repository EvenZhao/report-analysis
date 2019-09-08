const handleGetCompany = require('../router/getCompany');
const handleGetStock = require('../router/getStock');


module.exports = async (ctx, next) => {
	const { request } = ctx;
	const router = {
		getCompany: handleGetCompany(ctx),
		getStock: handleGetStock(ctx),
	};
	const route = Object.keys(router).find(key => request.url.includes(key));

	if (request.method === 'GET') {
		await router[route];
	} else {
		ctx.status = 405;
	}
	await next();
};
