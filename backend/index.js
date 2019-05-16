const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
let home = new Router();

home.get('/', async ( ctx )=>{
    ctx.body = {
        data: 1
    }
})
  
app.use(home.routes()).use(home.allowedMethods());
app.listen(8888);