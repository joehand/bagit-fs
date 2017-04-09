var path = require('path')
var hyperdrive = require('hyperdrive')
var mirror = require('mirror-folder')
var ram = require('random-access-memory')
var BagIt = require('..')

var src = path.join(__dirname, '..')
var outputDir = path.join(__dirname, 'bag')

var archive = hyperdrive(ram)
dirToArchive()

function dirToArchive () {
  console.log('mirroring src to archive')
  mirror(src, {name: '/', fs: archive}, {
    ignore: function (name) {
      name = path.relative(src, name)
      if (name.indexOf('.git') > -1) return true
      if (name.indexOf('node_modules') > -1) return true
      if (name.indexOf('example') > -1) return true
      return false
    }
  }, function (err) {
    if (err) throw err
    console.log('archive created, bagging')
    archiveToBag()
  })
}

function archiveToBag() {
  var bag = BagIt(outputDir, {'Contact-Name': 'Joe Hand'})
  mirror({name: '/', fs: archive}, {name: '/', fs: bag}, function (err) {
    if (err) return console.error(err)
    console.log('done bagging, finalizing')
    bag.finalize(function (err) {
      if (err) return console.err(err)
      console.log('bag finalized')
    })
  })
}
