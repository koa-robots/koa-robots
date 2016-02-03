import koa from 'koa'
import gzip from 'koa-gzip'
import jsonp from 'koa-jsonp'
import fresh from 'koa-fresh'
import favicon from 'koa-favicon'
import onerror from 'koa-onerror'
import serve from 'koa-robots-static'
import render from 'koa-robots-render'
import router from 'koa-robots-router'
import logger from 'koa-robots-logger'
import config from './resources/config'
import routes from './resources/routes'
import session from 'koa-generic-session'
import responseTime from 'koa-response-time'
import parameter from 'koa-robots-parameter'
import browsersync from 'koa-robots-browsersync'
import tplHelpers from './resources/tpl-helpers'

let app, favPath, staticFilePath, tplPath, actionPath

app = koa()
onerror(app)

tplPath = './views'
staticFilePath = './assets'
actionPath = './controllers'
favPath = './resources/favicon.ico'
app.keys = config.signedCookieKeys

app
    .use(responseTime())
    .use(logger(app, config.logger))
    .use(fresh())
    .use(gzip())
    .use(favicon(favPath))
    .use(serve(staticFilePath))
    .use(jsonp())
    .use(session(Object.assign({key : 'sessionId'}, config.session)))
    .use(parameter(app))
    .use(browsersync([staticFilePath, tplPath]))
    .use(render(tplPath, Object.assign(config.render, {helpers : tplHelpers})))
    .use(router(actionPath, {routes : routes}))
    .listen(config.port)
