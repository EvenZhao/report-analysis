const cheerio = require('cheerio');
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
};
