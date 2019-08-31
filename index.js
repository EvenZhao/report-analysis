const http = require('http');
const fs = require('fs');
const Koa = require('koa');


const app = new Koa();
app.listen(8080, () => {
	console.log('listen at 8080');
});

app.use(async (ctx, next) => {
	http.get('http://quotes.money.163.com/stocksearch/json.do?type=&count=5&word=600519', (res) => {
		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
			try {
				const index = rawData.indexOf('(');
				rawData = rawData.substring(index + 1, rawData.length - 1);
				rawData = JSON.parse(rawData);
			} catch (e) {
				console.error(e.message);
			}
		});
	});
	await next();
});

app.use(async (ctx) => {
	console.log(ctx.request);
	const { request } = ctx;
	if (request.url === '/' && request.method === 'GET') {
		ctx.response.set('Content-Type', 'text/html');
		ctx.response.body = fs.readFileSync('./src/views/index.html');
	} else if (request.url === '/' && request.method === 'POST') {
		ctx.response.status = 400;
	}
});
