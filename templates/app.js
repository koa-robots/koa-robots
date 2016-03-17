import koa from 'koa'
import jsonp from 'koa-jsonp'
import fresh from 'koa-fresh'
import favicon from 'koa-favicon'
import onerror from 'koa-onerror'
import compress from 'koa-compress'
import serve from 'koa-robots-static'
import render from 'koa-robots-render'
import router from 'koa-robots-router'
import logger from 'koa-robots-logger'
import config from './resources/config'
import routes from './resources/routes'
import helpers from './resources/helpers'
import session from 'koa-generic-session'
import responseTime from 'koa-response-time'
import parameter from 'koa-robots-parameter'
import browsersync from 'koa-robots-browsersync'

let app, staticPath

app = koa()

staticPath = './views'
app.keys = ["koa-robots"]

onerror(app)
app.use(responseTime())
    .use(logger(app, config.logger))
    .use(fresh())
    .use(compress())
    .use(favicon(`${staticPath}/favicon.ico`))
    .use(serve(staticPath))
    .use(jsonp())
    .use(session(Object.assign({key : 'sessionId'}, config.session)))
    .use(parameter(app))
    .use(browsersync([staticPath]))
    .use(render(staticPath, Object.assign(config.render, {helpers : helpers})))
    .use(router('./controllers', {routes : routes}))
    .listen(config.port)
