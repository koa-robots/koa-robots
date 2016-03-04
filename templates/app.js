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
app.use(logger(app, config.logger))
app.use(fresh())
app.use(compress())
app.use(favicon(`${staticPath}/favicon.ico`))
app.use(serve(staticPath, {index : '!.html'}))
app.use(jsonp())
app.use(session(Object.assign({}, {key : 'sessionId'}, config.session)))
app.use(parameter(app))

if(config.enableLiveReload){
    app.use(browsersync([staticPath]))
}

app.use(render(staticPath, Object.assign({}, config.render, {helpers : helpers})))
app.use(router('./controllers', {routes : routes}))
app.listen(config.port)
