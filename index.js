
const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const staticService = require('./src/middleWare/staticService');
const router = require('./src/controller/index');
// const dataProcessing = require('./src/middleWare/dataProcessing');

const app = new Koa();

app.listen(8080, () => {
	console.log('listen at 8080');
});

app.use(staticService);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
