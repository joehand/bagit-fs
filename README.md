# bagit-fs

node fs implementation for the [bagit spec](https://tools.ietf.org/html/draft-kunze-bagit-14).

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

## Install

```
npm install bagit-fs
```

## Usage

```js
var BagIt = require('bagit-fs')

var bag = BagIt('/put/my/bag/here', 'sha256', {'Contact-Name': 'Joe Hand'})

// write files to bag's data folder
fs.createReadStream('readme.md').pipe(bag.createWriteStream('/readme.md'))

// ... LATER after all files are written
bag.finalize(function () {
  console.log('finalized')
})
```

See `example/index.js` for an example usage with [mirror-folder](https://github.com/mafintosh/mirror-folder).

## API

### `var bag = BagIt(dest, algorithm, [bagInfo])`

* `dest` is the destination directory for the bag
* `algorithm` is a string specifying which checksum algorithms to use. Default is `sha256`.
* `bagInfo` is a object with data to be written to `bag-info.txt`, e.g. `bagInfo = {'Contact-Name': 'Joe Hand'}`. See below for details on `bag-info.txt`.

### `bag.finalize(cb)`

Finalize the bag, writing `bag-info.txt` and `bagit.txt`. Date and size are automatically written to the info. This should only be called when the bag is complete.

### `fs` API

Several of the node `fs` functions are implemented allowing you to create or read from bags like the fs. Most of these just wrap the `fs` calls to act on the bag's `data` folder.

* `bag.createWriteStream(name, opts, cb)` - writes file to `bagDir/data` and the checksum hash to the manifest.
* `bag.mkdir(name, opts, cb)` - make a dir in the `data/` folder.
* `bag.createReadStream(name, opts, cb)`
* `bag.mkdir(name, cb)`
* `bag.stat(name, cb)`
* `bag.lstat(name, cb)`
* `bag.readdir(name, cb)`
* `bag.unlink(name, cb)`
* `bag.rmdir(name, cb)`

## BagIt Spec Support

`bagit-fs` is a fully compliant implementation of the specification but there are some optional parts not yet implemented.

### TODO:

* [Tags + Tag Manifest](https://tools.ietf.org/html/draft-kunze-bagit-14#section-2.2.1)
* [Fetch file](https://tools.ietf.org/html/draft-kunze-bagit-14#section-2.2.3)
* Support creating bag with multiple checksum algorithms

### Bag Info

[bag-info spec](https://tools.ietf.org/html/draft-kunze-bagit-14#section-2.2.2)

> The "bag-info.txt" file is a tag file that contains metadata elements describing the bag and the payload.  The metadata elements contained in the "bag-info.txt" file are intended primarily for human readability.  All metadata elements are optional and MAY be repeated.

`Bagging-Date` and `Bag-Size` are written automatically on `bag.finalize()`.

Here is an example "bag-info.txt" file:

```
Source-Organization: Spengler University
Organization-Address: 1400 Elm St., Cupertino, California, 95014
Contact-Name: Edna Janssen
Contact-Phone: +1 408-555-1212
Contact-Email: ej@spengler.edu
External-Description: Uncompressed greyscale TIFF images from the
    Yoshimuri papers colle...
Bagging-Date: 2008-01-15
External-Identifier: spengler_yoshimuri_001
Bag-Size: 260 GB
Payload-Oxum: 279164409832.1198
Bag-Group-Identifier: spengler_yoshimuri
Bag-Count: 1 of 15
Internal-Sender-Identifier: /storage/images/yoshimuri
Internal-Sender-Description: Uncompressed greyscale TIFFs created
    from microfilm and are...
```

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/bagit-fs.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/bagit-fs
[travis-image]: https://img.shields.io/travis/joehand/bagit-fs.svg?style=flat-square
[travis-url]: https://travis-ci.org/joehand/bagit-fs
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
