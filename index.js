var assert = require('assert')
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var mkdirp = require('mkdirp')
var count = require('count-files')
var pretty = require('prettier-bytes')
var constants = require('./lib/const')

module.exports = BagIt

function BagIt (dir, algo, opts) {
  if (!(this instanceof BagIt)) return new BagIt(dir, algo, opts)
  assert.equal(typeof dir, 'string', 'bagit-fs: directory required')
  if (typeof algo !== 'string') {
    opts = algo
    algo = null
  }
  if (!opts) opts = {}

  this.dir = dir
  this.algo = algo || 'sha256'
  this.manifest = path.join(dir, 'manifest-' + this.algo + '.txt')
  this.dataDir = path.join(dir, 'data')
  this.bagInfo = opts

  // TODO: create dir only on first write
  mkdirp.sync(this.dataDir)
}

BagIt.prototype.finalize = function (cb) {
  var self = this
  self._writeDeclaration(function (err) {
    if (err) return cb(err)
    var info = self.bagInfo
    count(self.dataDir, function (err, stats) {
      if (err) return cb(err)
      info['Bagging-Date'] = new Date().toISOString().split('T')[0]
      info['Bag-Size'] = pretty(stats.bytes)
      self._writeBagInfo(info, cb)
    })
  })
}

BagIt.prototype._writeDeclaration = function (opts, cb) {
  if (typeof opts === 'function') return this._writeDeclaration({}, opts)
  if (!opts) opts = {}

  var self = this
  var version = opts.version || constants.DECLARATION.version
  var encoding = opts.encoding || constants.DECLARATION.encoding
  var data = [
    `BagIt-Version: ${version}`,
    `Tag-File-Character-Encoding: ${encoding}`
  ].join('\n')

  fs.writeFile(path.join(self.dir, constants.DECLARATION.name), data, cb)
}

BagIt.prototype._writeBagInfo = function (opts, cb) {
  if (typeof opts === 'function') return this._writeBagInfo(null, opts)

  var info = opts || this.bagInfo
  if (!info) return cb(new Error('Bag Info required'))

  var self = this
  var data = Object.keys(info).map(function (key) {
    return `${key}: ${info[key]}`
  }).join('\n')
  fs.writeFile(path.join(self.dir, 'bag-info.txt'), data, cb)
}

BagIt.prototype.createReadStream = function (name, opts) {
  var self = this
  return fs.createReadStream(path.join(self.dataDir, name), opts)
}

BagIt.prototype.createWriteStream = function (name, opts) {
  // TODO: support writing to fetch.txt + manifest but not data/
  // TODO: make sure it's ready

  var self = this
  var filePath = path.join(self.dataDir, name)
  var hash = null
  var digest = crypto.createHash(self.algo)

  var ws = fs.createWriteStream(filePath, opts)
  ws.on('data', function (data) {
    digest.update(data)
  })
  ws.on('finish', function () {
    hash = digest.digest('hex')
    // TODO: check if old file hash is in manifest
    var data = `${hash} data${name}\n`
    fs.appendFileSync(self.manifest, data)
  })

  return ws
}

BagIt.prototype.stat = function (name, cb) {
  var self = this
  return fs.stat(path.join(self.dataDir, name), cb)
}

BagIt.prototype.lstat = function (name, cb) {
  var self = this
  return fs.lstat(path.join(self.dataDir, name), cb)
}

BagIt.prototype.readdir = function (name, cb) {
  var self = this
  return fs.lstat(path.join(self.dataDir, name), cb)
}

BagIt.prototype.mkdir = function (name, opts, cb) {
  var self = this
  return fs.mkdir(path.join(self.dataDir, name), opts, cb)
}

BagIt.prototype.unlink = function (name, cb) {
  var self = this
  return fs.unlink(path.join(self.dataDir, name), cb)
}

BagIt.prototype.rmdir = function (name, cb) {
  var self = this
  return fs.rmdir(path.join(self.dataDir, name), cb)
}
