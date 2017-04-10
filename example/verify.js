var path = require('path')
var BagIt = require('..')

var bag = BagIt(path.join(__dirname, 'bag'))

// Verify file contents from an existing bag (run example/index.js first)
bag.readFile('README.md', 'utf-8', function (err, data) {
  if (err) return console.error(err)
  console.log(data)
})
