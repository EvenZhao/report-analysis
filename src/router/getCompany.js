const cheerio = require('cheerio');
const http = require('http');


const require1 = (ctx) => new Promise((resolve, reject) => {
	let data = {};
	http.get(`http://quotes.money.163.com/f10/zycwzb_${ctx.query.word},year.html`, (res) => {
		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', async () => {
			try {
				const $ = cheerio.load(rawData);
				let fragment = $('.col_r table tr').eq(10).html();
				let datas = $('.col_r table tr').html();
				/* eslint-disable */
						fragment = fragment.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						datas = datas.replace(/,/g, '').replace(/\<th\>/g, '').split('</th>').slice(0, -1);
						/* eslint-enable */
				// ctx.body = {
				// 	fragment,
				// 	datas,
				// };
				data = {
					fragment,
					datas,
				};
				resolve(data);
			} catch (e) {
				console.error(e.message);
				reject();
			}
		});
	});
});

const require2 = (ctx) => new Promise((resolve, reject) => {
	let data = {};
	http.get(`http://quotes.money.163.com/f10/zcfzb_${ctx.query.word}.html?type=year`, (res) => {
		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', async () => {
			try {
				const $ = cheerio.load(rawData);
				if ($('.scr_table tr').html() !== null) {
					console.log(2);
					const trs = $('.scr_table tr');
					// 时间
					let time = trs.eq(0).html();
					// 货币资金（万元）
					let hbzj = trs.eq(3).html();
					// 应收票据（万元）
					let yspj = trs.eq(8).html();
					// 存货 （万元）
					let ch = trs.eq(22).html();
					// 短期借款（万元）
					let dqjk = trs.eq(58).html();
					// 长期借款 (万元)
					let cqjk = trs.eq(92).html();
					// 长期应收款（万元）
					let cqysk = trs.eq(32).html();
					// 其他应收款（万元）
					let qtysk = trs.eq(16).html();
					// 预收款
					let ysk = trs.eq(66).html();
					// 预付款
					let yfk = trs.eq(10).html();
					/* eslint-disable */
						time = time.replace(/,/g, '').replace(/\<th\>/g, '').split('</th>').slice(0, -1);
						hbzj = hbzj.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						yspj = yspj.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						dqjk = dqjk.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						cqjk = cqjk.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						ch = ch.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						cqysk = cqysk.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						qtysk = qtysk.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						ysk = ysk.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						yfk = yfk.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						/* eslint-enable */
					data = {
						time,
						hbzj,
						yspj,
						dqjk,
						cqjk,
						ch,
						cqysk,
						qtysk,
						ysk,
						yfk,
					};
				}
				resolve(data);
			} catch (e) {
				console.error(e.message);
				reject();
			}
		});
	});
});

const require3 = (ctx) => new Promise((resolve, reject) => {
	let data = {};
	http.get(`http://quotes.money.163.com/f10/lrb_${ctx.query.word}.html?type=year`, (res) => {
		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', async () => {
			try {
				const $ = cheerio.load(rawData);
				if ($('.scr_table tr').html() !== null) {
					console.log(1);
					const trs = $('table.scr_table tr');
					// 营业收入
					let yysr = trs.eq(3).html();
					// 利息支出
					let lxzc = trs.eq(10).html();
					// 净利润
					let jlr = trs.eq(40).html();
					/* eslint-disable */
						yysr = yysr.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						lxzc = lxzc.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);
						jlr = jlr.replace(/,/g, '').replace(/\<td\>/g, '').replace(/\-\-/g,0).split('</td>').slice(0, -1);

						/* eslint-enable */
					data = {
						yysr,
						lxzc,
						jlr,
					};
				}
				resolve(data);
			} catch (e) {
				console.error(e.message);
				reject();
			}
		});
	});
});

module.exports = (ctx) => Promise.all([require1(ctx), require2(ctx), require3(ctx)]).then(value => {
	const xjdjw = [];
	const yxfz = [];
	const yingsk = [];
	const {
		hbzj, yspj, cqjk, dqjk, cqysk, qtysk, ch, ysk, yfk, time,
	} = value[1];
	const { yysr, lxzc, jlr } = value[2];
	try {
		hbzj.forEach((ele, i) => {
			xjdjw.push(Number(ele) + Number(yspj[i]));
			yxfz.push(Number(cqjk[i]) + Number(dqjk[i]));
			yingsk.push(Number(cqysk[i]) + Number(qtysk[i]));
		});
	} catch (err) {
		ctx.status = 500;
		console.log('第三方数据错误', err);
		return;
	}
	const data = {
		xjdjw,
		yxfz,
		lxzc,
		ch,
		yysr,
		jlr,
		yingsk,
		ysk,
		yfk,
		time,
	};
	ctx.body = data;
});
// .then(() => {

// });
