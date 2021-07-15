
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const util = require('./utils/util')
const log4js = require('./utils/loggers')
const koajwt = require('koa-jwt')

require('./config/db')

const appRouter = require('koa-router')()
const index = require('./routes/index')
const userRoute = require('./routes/user')
const menuRoute = require('./routes/menu')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  log4js.info(`params:${JSON.stringify(ctx.request.query) || ctx.request.body}`)
  await next().catch(err => {
    if(err.status == '401') {
      ctx.status = 200;
      console.log('a', util)
      ctx.body = util.failAuth();
    }else{
      throw err
    }
  })
  // const ms = new Date() - start
  log4js.info(`log output`)
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(user.routes(), user.allowedMethods())

app.use(koajwt({ secret: '#$#E!' }).unless({
  path: [/^\/api\/user\/login/]
}))
appRouter.prefix('/api');
appRouter.use(userRoute.routes(), userRoute.allowedMethods())
appRouter.use(menuRoute.routes(), menuRoute.allowedMethods())
app.use(appRouter.routes(), appRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app
