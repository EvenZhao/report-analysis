module.exports = async (ctx, next) => {
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
	ctx.params = params;
	await next();
};
