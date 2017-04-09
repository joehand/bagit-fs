var path = require('path')
var mirror = require('mirror-folder')
var BagIt = require('..')

var src = path.join(__dirname, '..')
var outputDir = path.join(__dirname, 'bag')
var bag = BagIt(outputDir, {'Contact-Name': 'Joe Hand'})

console.log('starting mirror')
mirror(src, {name: '/', fs: bag}, {
  ignore: function (name) {
    name = path.relative(src, name)
    if (name.indexOf('.git') > -1) return true
    if (name.indexOf('node_modules') > -1) return true
    if (name.indexOf('example') > -1) return true
    return false
  }
}, function (err) {
  if (err) return console.error(err)
  console.log('done bagging, finalizing')
  bag.finalize(function (err) {
    if (err) return console.err(err)
    console.log('bag finalized')
  })
})
