const fs = require('fs');

module.exports = async (ctx, next) => {
	const map = {
		'.js': 'application/javascript',
		'.jsx': 'application/javascript',
		'.jpeg': 'image/jpeg',
	};

	const { request } = ctx;
	const _index = request.url.lastIndexOf('.');
	const str = request.url.substring(_index);
	if (request.url === '/' && request.method === 'GET') {
		ctx.set({ 'Content-Type': 'text/html' });
		ctx.response.body = fs.readFileSync('./src/views/index.html');
		return;
	}
	if (request.url === '/' && request.method === 'POST') {
		ctx.response.status = 400;
		return;
	}

	if (request.url.includes('views') && request.method === 'GET') {
		// ctx.set({ 'Content-Type': 'application/x-javascript' });
		ctx.set({ 'Content-Type': map[str] });
		ctx.response.body = fs.readFileSync(`.${request.url}`);
		return;
	}
	await next();
};
