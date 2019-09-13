const http = require('http');

module.exports = (ctx) => new Promise((resolve, reject) => {
	http.get(`http://quotes.money.163.com/stocksearch/json.do?type=&count=5&word=${ctx.query.word}`, (res) => {
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
