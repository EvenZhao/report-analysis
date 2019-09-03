const cheerio = require('cheerio');

const http = require('http');
const fs = require('fs');
const Koa = require('koa');


const app = new Koa();
app.listen(8080, () => {
	console.log('listen at 8080');
});

app.use(async (ctx, next) => {
	await next();
});

app.use(async (ctx, next) => {
	const { request } = ctx;
	if (request.url === '/' && request.method === 'GET') {
		ctx.set({ 'Content-Type': 'text/html' });
		ctx.response.body = fs.readFileSync('./src/views/index.html');
	} else if (request.url === '/' && request.method === 'POST') {
		ctx.response.status = 400;
	} else if (request.url === '/src/views/index.jsx' && request.method === 'GET') {
		ctx.set({ 'Content-Type': 'application/x-javascript' });
		ctx.response.body = fs.readFileSync('./src/views/index.jsx');
	} else if (request.url.includes('getCompany') && request.method === 'GET') {
		let params = request.url;
		params = params.substring(params.indexOf('?') + 1);
		const arr = params.split('&');
		params = {};
		arr.forEach(item => {
			const _arr = item.split('=');
			/* eslint-disable */
			params[_arr[0]] = _arr[1];
			/* eslint-enable */
		});
		await new Promise((resolve, reject) => {
			http.get(`http://quotes.money.163.com/f10/zycwzb_${params.word},year.html`, (res) => {
				res.setEncoding('utf8');
				let rawData = '';
				res.on('data', (chunk) => { rawData += chunk; });
				res.on('end', async () => {
					try {
						const $ = cheerio.load(rawData);
						let fragment = $('.col_r table tr').eq(10).html();
						let datas = $('.col_r table tr').html();
						/* eslint-disable */
						fragment = fragment.replace(/,/g, '').replace(/\<td\>/g, '').split('</td>').slice(0, -1);
						datas = datas.replace(/,/g, '').replace(/\<th\>/g, '').split('</th>').slice(0, -1);
						/* eslint-enable */
						ctx.body = {
							fragment,
							datas,
						};
						resolve();
					} catch (e) {
						console.error(e.message);
						reject();
					}
				});
			});
		});
	} else if (request.url.includes('getStock') && request.method === 'GET') {
		let params = request.url;
		params = params.substring(params.indexOf('?') + 1);
		const arr = params.split('&');
		params = {};
		arr.forEach(item => {
			const _arr = item.split('=');
			/* eslint-disable */
			params[_arr[0]] = _arr[1];
			/* eslint-enable */
		});
		await new Promise((resolve, reject) => {
			http.get(`http://quotes.money.163.com/stocksearch/json.do?type=&count=5&word=${params.word}`, (res) => {
				res.setEncoding('utf8');
				let rawData = '';
				res.on('data', (chunk) => { rawData += chunk; });
				res.on('end', async () => {
					try {
						const index = rawData.indexOf('(');
						rawData = rawData.substring(index + 1, rawData.length - 1);
						rawData = JSON.parse(rawData);
						ctx.body = rawData;
						resolve();
					} catch (e) {
						console.error(e.message);
						reject();
					}
				});
			});
		});
	}
	await next();
});
