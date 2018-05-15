module.exports = {
  include: [
    'bin/*',
    'dist/*.js',
    'package.json',
    'yarn.lock'
  ],
  exclude: [
  ],
  postScript: [
    'cd "[dir]" && yarn --production',
    '[dir]/bin/files2text . -e node_modules -e .git'
  ]
}
