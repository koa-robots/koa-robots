import koa from 'koa'
import gzip from 'koa-gzip'
import jsonp from 'koa-jsonp'
import fresh from 'koa-fresh'
import onerror from 'koa-onerror'
import serve from 'koa-robots-static'
import config from './resources/config'
import responseTime from 'koa-response-time'
import parameter from 'koa-robots-parameter'

let app = koa()

onerror(app)

app
    .use(responseTime())
    .use(fresh())
    .use(gzip())
    .use(serve('./assets'))
    .use(jsonp())
    .use(parameter(app))
    .listen(config.port)
