import koa from 'koa'
import gzip from 'koa-gzip'
import jsonp from 'koa-jsonp'
import fresh from 'koa-fresh'
import onerror from 'koa-onerror'
import serve from 'koa-robots-static'
import render from 'koa-robots-render'
import logger from 'koa-robots-logger'
import config from './resources/config'
import responseTime from 'koa-response-time'
import parameter from 'koa-robots-parameter'
import browsersync from 'koa-robots-browsersync'

let app = koa()

onerror(app)

app
    .use(responseTime())
    .use(logger(app, config.logger))
    .use(fresh())
    .use(gzip())
    .use(serve('./assets'))
    .use(jsonp())
    .use(parameter(app))
    .use(browsersync(['./assets', './views']))
    .use(render('./views'))
    .listen(config.port)
