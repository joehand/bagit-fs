#!/usr/bin/env node

var minimist = require('minimist')
var mirror = require('mirror-folder')
var BagIt = require('.')

var argv = minimist(process.argv.slice(2), {
  alias: {
    algo: 'a',
    watch: 'w'
  },
  boolean: ['watch']
})

var src = argv._[0] || process.cwd()
var dest = argv._[1] || 'bag'
var bag = BagIt(dest, argv.algo) // TODO: bag info

mirror(src, {name: '/', fs: bag}, {
  ignore: function (name) { },
  live: argv.watch
}, function (err) {
  if (err) throw err
  bag.finalize(function () {
    console.log('Bagged!')
  })
})
