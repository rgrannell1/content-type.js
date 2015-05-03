
# mimetype [![Build Status](https://travis-ci.org/rgrannell1/mimetype.js.png)](https://travis-ci.org/rgrannell1/mimetype.js)


a (mostly) rfc-2045 compliant parser.

## Usage

```js

// node-js.
var mimetype = require('mimetype')

var contentType = mimetype.parse('text/html; charset=utf-8')
console.log(contentType)

{ type: 'text',
  subtype: 'html',
  params: { 'charset': 'utf-8' } }

```

## Why?


## Exceptions

### `.parse(contentType)`

* Throw a `TypeError` for non-string arguments.

* Throws an `Error` if a non-stardard type is used (after convertion to lowercase).

* Throws an exception if a non-standard character is used in the content-type.

### `.deparse(parsedContentType)`

* Throws a `TypeError` if the input is not an object.

* Throws a `TypeError` if the input does not have type, subtype, and params fields, each of type string.


## Corner-Cases

* both the type and subtypes are coerced to lower case, as per the standard.

`mimetype` does not strictly follow the above RFC, as many of the top-100 
websites do not either. 
