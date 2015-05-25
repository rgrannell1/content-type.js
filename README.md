
# content-type [![Build Status](https://travis-ci.org/rgrannell1/content-type.js.png)](https://travis-ci.org/rgrannell1/mimetype.js)

a (mostly) rfc-2045, rfc-7231 compliant parser.

## Usage

```js

// node-js.
var contentType = contentType('mimetype')

console.log( contentType.parse('text/html; charset=utf-8') )

{ type: 'text',
  subtype: 'html',
  params: { 'charset': 'utf-8' } }

```

## Why?

This library is a straight port from similar code I wrote in Python. I finished the port before I found an existing
[content-type](https://www.npmjs.com/package/content-type) parser for node. You should probably use the linked library, but  if that fails you for some reason this might help.




## Exceptions

### `.parse(contentType)`

* Throw a `TypeError` for non-string arguments.

* Throws an `Error` if a non-stardard type is used (after convertion to lowercase).

* Throws an exception if a non-standard character is used in the content-type.

### `.deparse(parsedContentType)`

* Throws a `TypeError` if the input is not an object.

* Throws a `TypeError` if the input does not have type, subtype, and params fields, each of type string.


## Corner-Cases

* The casing of the content type is preserved in the parsed output. 

`content-type` does not strictly follow the above RFC, as many of the top-100 
websites do not either. 

* multiple semicolons are accepted: `text/plain;; char=10` will parse.

## License


The MIT License

Copyright (c) 2015 Ryan Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
