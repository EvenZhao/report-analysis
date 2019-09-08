const http = require('http');

module.exports = (ctx) => {
	let params = ctx.request.url;
	params = params.substring(params.indexOf('?') + 1);
	const arr = params.split('&');
	params = {};
	arr.forEach(item => {
		const _arr = item.split('=');
		/* eslint-disable */
		params[_arr[0]] = _arr[1];
		/* eslint-enable */
	});
	return new Promise((resolve, reject) => {
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
};
