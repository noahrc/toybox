var fs = require('fs');
var resolve = require('path').resolve
var join = require('path').join
var cp = require('child_process')

// get library path
var root = resolve(__dirname, '../packages/')

var command = process.argv[3];

if(!command) return;

fs.readdirSync(root)
  .forEach(function (pkg) {
    var packagePath = join(root, pkg)
    // ensure path has package.json
    if (!fs.existsSync(join(packagePath, 'package.json'))) return

    // install folder
    cp.spawn(command, { env: process.env, cwd: packagePath, stdio: 'inherit' })
  });
