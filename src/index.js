import co from 'co'
import fs from 'co-fs'
import semver from 'semver'
import colors from 'colors'
import prompt from 'co-prompt'
import mkdirp from 'co-mkdirp'
import commander from 'commander'
import {join, normalize, resolve, relative} from 'path'

let cwd, path, opts, logs, currentNodeVersion, enginesNodeVersion

commander
    .version(require('../package.json').version)
    .usage('[path]')
    .parse(process.argv)

logs = []
currentNodeVersion = process.version
path = join(__dirname, '..', 'templates')
enginesNodeVersion = require('../package.json').engines.node
cwd = normalize(resolve(process.argv.length === 2 ? '.' : process.argv[2]))

if(!semver.satisfies(currentNodeVersion, enginesNodeVersion)){
    console.log(`koa-robots will not run on the current node version, please upgrade your version node is ${enginesNodeVersion}`)
    process.exit()
}

co(function *() {
    yield mkdir(
        '/views',
        '/models',
        '/resources',
        '/controllers'
    )

    yield copyFile(
        '/app.js',
        '/package.json',
        '/resources/config.js',
        '/resources/routes.js',
        '/resources/helpers.js'
    )

    print()
}).catch((err) => {
    console.error(err)
})

function *mkdir(...paths) {
    for (let item of paths) {
        yield mkdirp(join(cwd, item))
        logs.push('   create : '.green + item.cyan + '\n')
    }
}

function *copyFile(...paths) {
    for (let item of paths) {
        let srcPath, distPath

        distPath = join(cwd, item)
        srcPath = join(path, item)

        try {
            if ((yield fs.stat(distPath)).isFile()) {
                let answer = yield prompt(`${item} file already exists, whether or not covered [Y/N] : `.replace('/', ''))

                if (~['y', 'yes'].indexOf(answer.toLowerCase())) {
                    yield fs.writeFile(distPath, yield fs.readFile(srcPath, 'utf-8'))
                    logs.push('   create : '.green + item.cyan + '\n')
                }
            }
        } catch (err) {
            if (~['ENOENT', 'ENAMETOOLONG'].indexOf(err.code)) {
                yield fs.writeFile(distPath, yield fs.readFile(srcPath, 'utf-8'))
                logs.push('   create : '.green + item.cyan + '\n')
                continue
            }

            throw err
        }
    }
}

function print() {
    logs.push('\n   run app command:\n'.green)

    if(process.argv.length > 2){
        logs.push(`      cd ${relative(process.cwd(), cwd)}\n`.red)
    }

    logs.push('      npm i\n'.red)
    logs.push('      npm start\n'.red)

    console.log(logs.join(''))
    process.stdin.pause()
}
