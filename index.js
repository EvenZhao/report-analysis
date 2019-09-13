
const Koa = require('koa');
const staticService = require('./src/middleWare/staticService');
const controller = require('./src/controller/index');
const dataProcessing = require('./src/middleWare/dataProcessing');

const app = new Koa();

app.listen(8080, () => {
	console.log('listen at 8080');
});


app.use(staticService);
app.use(dataProcessing);
app.use(controller);
