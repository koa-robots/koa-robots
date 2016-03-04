'use strict';

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault(_coFs);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _coPrompt = require('co-prompt');

var _coPrompt2 = _interopRequireDefault(_coPrompt);

var _coMkdirp = require('co-mkdirp');

var _coMkdirp2 = _interopRequireDefault(_coMkdirp);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let cwd, path, opts, logs, currentNodeVersion, enginesNodeVersion;

_commander2.default.version(require('../package.json').version).usage('[path]').parse(process.argv);

logs = [];
currentNodeVersion = process.version;
path = (0, _path.join)(__dirname, '..', 'templates');
enginesNodeVersion = require('../package.json').engines.node;
cwd = (0, _path.normalize)((0, _path.resolve)(process.argv.length === 2 ? '.' : process.argv[2]));

if (!_semver2.default.satisfies(currentNodeVersion, enginesNodeVersion)) {
    console.log(`koa-robots will not run on the current node version, please upgrade your version node is ${ enginesNodeVersion }`);
    process.exit();
}

(0, _co2.default)(function* () {
    yield mkdir('/views', '/models', '/resources', '/controllers');

    yield copyFile('/app.js', '/package.json', '/resources/config.js', '/resources/routes.js', '/resources/helpers.js');

    print();
}).catch(err => {
    console.error(err);
});

function* mkdir() {
    for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
    }

    for (let item of paths) {
        yield (0, _coMkdirp2.default)((0, _path.join)(cwd, item));
        logs.push('   create : '.green + item.cyan + '\n');
    }
}

function* copyFile() {
    for (var _len2 = arguments.length, paths = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        paths[_key2] = arguments[_key2];
    }

    for (let item of paths) {
        let srcPath, distPath;

        distPath = (0, _path.join)(cwd, item);
        srcPath = (0, _path.join)(path, item);

        try {
            if ((yield _coFs2.default.stat(distPath)).isFile()) {
                let answer = yield (0, _coPrompt2.default)(`${ item } file already exists, whether or not covered [Y/N] : `.replace('/', ''));

                if (~['y', 'yes'].indexOf(answer.toLowerCase())) {
                    yield _coFs2.default.writeFile(distPath, (yield _coFs2.default.readFile(srcPath, 'utf-8')));
                    logs.push('   create : '.green + item.cyan + '\n');
                }
            }
        } catch (err) {
            if (~['ENOENT', 'ENAMETOOLONG'].indexOf(err.code)) {
                yield _coFs2.default.writeFile(distPath, (yield _coFs2.default.readFile(srcPath, 'utf-8')));
                logs.push('   create : '.green + item.cyan + '\n');
                continue;
            }

            throw err;
        }
    }
}

function print() {
    logs.push('\n   run app command:\n'.green);

    if (process.argv.length > 2) {
        logs.push(`      cd ${ (0, _path.relative)(process.cwd(), cwd) }\n`.red);
    }

    logs.push('      npm i\n'.red);
    logs.push('      npm start\n'.red);

    console.log(logs.join(''));
    process.stdin.pause();
}