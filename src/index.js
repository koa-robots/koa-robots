import co from 'co'
import fs from 'co-fs'
import colors from 'colors'
import prompt from 'co-prompt'
import mkdirp from 'co-mkdirp'
import commander from 'commander'
import {join, isAbsolute, relative} from 'path'

let cwd, path, opts, logs

commander
    .version(require('../package.json').version)
    .usage('[path]')
    .parse(process.argv)

logs = []
path = join(__dirname, '..', 'templates')
cwd = process.argv.length === 2 ? process.cwd() : toAbsolutePath(process.argv[2])

co(function *() {
    yield mkdir(
        '/views',
        '/models',
        '/assets',
        '/resources',
        '/controllers'
    )

    yield copyFile(
        '/app.js',
        '/package.json',
        '/resources/config.js',
        '/resources/routes.js'
    )
}).then(() => {
    print()
}, (err) => {
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

    logs.push('      npm install\n'.red)
    logs.push('      npm start\n'.red)

    console.log(logs.join(''))
    process.stdin.pause()
}

function toAbsolutePath(path) {
    return isAbsolute(path) ? path : join(process.cwd(), path)
}
