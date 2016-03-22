# koa-robots

Koa MVC generator

#### Usage

```javascript
sudo npm i koa-robots -g

koa-robots demo
cd demo
npm i
npm start
```

#### Support Features

- [x] response time
- [x] logger (based of log4j)
- [x] fresh
- [x] serve
- [x] gzip
- [x] jsonp
- [x] proxy
- [x] session
- [x] filter xss
- [x] error Page
- [x] hot reload
- [x] auto router
- [x] parse GET & POST parameter
- [x] template render (based of art-template)
- [ ] restful
- [ ] CRSF
- [ ] database
- [x] mock
- [x] plugins
- [ ] webSocket

#### Plugins

browserSync

```javascript
npm i koa-robots-plugin-browsersync

//config.js
"plugins" : ["browsersync"]
```
