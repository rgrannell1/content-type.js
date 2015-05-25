#!/usr/bin/env node

var fs          = require('fs')
var should      = require('should')
var contentType = require('../lib/contentType')
var assert      = require('assert')





var known = (contentType, {type, subtype, params}, deparsed) => {

	return {
		contentType,
		parsed: {
			type,
			subtype,
			params
		},
		deparsed
	}

}




var knowResults = [
	known(
	"text/html; charset=utf-8",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'utf-8'
		}
	},
	'text/html; charset=utf-8'),

	known(
	"application/java-archive",
	{
		type:    'application',
		subtype: 'java-archive',
		params:  {

		}
	},
	'application/java-archive'),

	known(
	"text/html; charset=windows-874",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'windows-874'
		}
	},
	'text/html; charset=windows-874'),

	known(
	"application/xhtml+xml; charset=utf-8",
	{
		type:    'application',
		subtype: 'xhtml+xml',
		params:  {
			charset: 'utf-8'
		}
	},
	'application/xhtml+xml; charset=utf-8'),

	known(
	"application/xml; charset=ISO-8859-1",
	{
		type:    'application',
		subtype: 'xml',
		params:  {
			charset: 'ISO-8859-1'
		}
	},
	'application/xml; charset=ISO-8859-1'),

	known(
	"application/xhtml+xml; charset=utf-8",
	{
		type:    'application',
		subtype: 'xhtml+xml',
		params:  {
			charset: 'utf-8'
		}
	},
	'application/xhtml+xml; charset=utf-8'),

	known(
	"application/x-web-app-manifest+json",
	{
		type:    'application',
		subtype: 'x-web-app-manifest+json',
		params:  {

		}
	},
	"application/x-web-app-manifest+json"),

	known(
	"text/html;",
	{
		type:    'text',
		subtype: 'html',
		params:  {

		}
	},
	'text/html'),

	known(
	"text/html; charset=utf-8",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'utf-8'
		}
	},
	'text/html; charset=utf-8'),

	known(
	"text/html; charset=UTF-8",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'UTF-8'
		}
	},
	'text/html; charset=UTF-8'),

	known(
	"text/html;charset=utf-8",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'utf-8'
		}
	},
	'text/html; charset=utf-8'),

	known(
	"text/html; charset=ISO-8859-1",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'ISO-8859-1'
		}
	},
	'text/html; charset=ISO-8859-1'),

	known(
	"text/html;charset=UTF-8",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'UTF-8'
		}
	},
	'text/html; charset=UTF-8'),

	known(
	"text/html; charset=GB2312",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'GB2312'
		}
	},
	'text/html; charset=GB2312'),

	known(
	"text/html; charset=ISO-8859-1",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'ISO-8859-1'
		}
	},
	'text/html; charset=ISO-8859-1'),

	known(
	"text/html; charset=windows-1251",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'windows-1251'
		}
	},
	'text/html; charset=windows-1251'),

	known(
	"text/html; charset=Shift_JIS",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'Shift_JIS'
		}
	},
	'text/html; charset=Shift_JIS'),

	known(
	"text/html;;charset=utf-8",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'utf-8'
		}
	},
	'text/html; charset=utf-8'),

	known(
	"text/html; charset=GBK",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'GBK'
		}
	},
	'text/html; charset=GBK'),

	known(
	"text/html; charset=utf8",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'utf8'
		}
	},
	'text/html; charset=utf8'),

	known(
	"text/html; charset=EUC-JP",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'EUC-JP'
		}
	},
	'text/html; charset=EUC-JP'),

	known(
	"text/html; charset=ISO-8859-15",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'ISO-8859-15'
		}
	},
	'text/html; charset=ISO-8859-15'),

	known(
	"text/vnd.wap.wml",
	{
		type:    'text',
		subtype: 'vnd.wap.wml',
		params:  {

		}
	},
	'text/vnd.wap.wml'),

	known(
	"text/html; charset=gbk",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'gbk'
		}
	},
	'text/html; charset=gbk'),

	known(
	"text/html; charset=iso-8859-1",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'iso-8859-1'
		}
	},
	'text/html; charset=iso-8859-1'),

	known(
	"text/html; charset=ISO-8859-2",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'ISO-8859-2'
		}
	},
	'text/html; charset=ISO-8859-2'),

	known(
	'text/plain; charset="utf-7"',
	{
		type:    'text',
		subtype: 'plain',
		params:  {
			charset: '"utf-7"'
		}
	},
	'text/plain; charset="utf-7"'),

	known(
	"TEXT/plain; charset='iso-8859-15'",
	{
		type:    'TEXT',
		subtype: 'plain',
		params:  {
			charset: "'iso-8859-15'"
		}
	},
	"TEXT/plain; charset='iso-8859-15'"),

	known(
	"MESSAGE/rfc2045",
	{
		type:    'MESSAGE',
		subtype: 'rfc2045',
		params:  {

		}
	},
	"MESSAGE/rfc2045"),

	known(
	"text/plain; name*=n%41me",
	{
		type:    'text',
		subtype: 'plain',
		params:  {
			'name*': 'n%41me'
		}
	},
	"text/plain; name*=n%41me"),

	known(
		'text/plain; charset="UTF-\8"',
		{
			type:    'text',
			subtype: 'plain',
			params:  {
				'charset': '"UTF-\8"'
			}
		},
		'text/plain; charset="UTF-\8"'),

	known(
		'text/plain ; foo=bar; charset="UTF-8"',
		{
			type:    'text',
			subtype: 'plain',
			params:  {
				foo:     'bar',
				charset: '"UTF-8"'
			}
		},
		'text/plain; foo=bar; charset="UTF-\8"'),

	known(
		'text/plain; bar="; charset=\'UTF-8\'"',
		{
			type:    'text',
			subtype: 'plain',
			params:  {
				bar: '"; charset=\'UTF-8\'"'
			}
		},
		'text/plain; bar="; charset=\'UTF-8\'"')

]





var commonHTML = [
	'text/html',
	'text/html; charset=utf-8',
	'text/html; charset=UTF-8',
	'text/html; charset=iso-8859-1',
	'text/html;charset=UTF-8',
	'text/html;charset=utf-8',
	'text/html; charset=utf8',
	'application/octet-stream',
	'text/html; charset=EUC-JP',
	'text/html; charset=ISO-8859-1',
	'text/html; charset=Shift_JIS',
	'text/html; charset=ISO-8859-15',
	'text/html;;charset=utf-8',
	'text/html; charset=GB2312',
	'text/html;',
	'text/html;charset=ISO-8859-1',
	'text/html; charset=ISO-8859-2',
	'text/html; charset=GBK',
	'text/html; charset=windows-1251',
	'text/html; charset=Big5',
	'text/html; charset=shift_jis',
	'text/html; charset=gbk'
]





var knownFailures = [
	'text; html;',
	'texthtml',
	'text/plain; charset = UTF-8',
	'/',
	'application/x-bytecode.elisp (compiled elisp)',  // -- are these really errors?
	'application\/x-bytecode.elisp(compiledelisp)',    // -- are these really errors?,
	'text/xml; subtype=gml/3.1.1',
	' ',
	'null',
	'undefined',
	'/',
	'text / plain',
	'text/;plain',
	'text/"plain"',
	'text/p£ain',
	'text/(plain)',
	'text/@plain',
	'text/plain,wrong'
]




var commonMimetypes =
	JSON.parse(
		fs.readFileSync(`${__dirname}/utils/common-content-types.json`).toString( ))
	.map(
		type => Object.keys(type)[0])
	.filter(
		type => Object.prototype.toString.call(type) === '[Object String]')





describe('contentType', ( ) => {

	describe('.parse', ( ) => {

		it('should never have parametres with spaces', ( ) => {

			knowResults.forEach(test => {

				var params = contentType.parse(test.contentType).params

				Object.keys(params).forEach(param => {
					param.trim( ).should.eql(param)
				})

			})

		})

		it('should match known test cases', ( ) => {

			knowResults.forEach(test => {
				assert.deepEqual(contentType.parse(test.contentType), test.parsed)
			})

		})

		it('should fail for known failing cases', ( ) => {

			knownFailures.forEach(contentType => {
				assert.throws(( ) => contentType.parse(contentType), Error)
			})

		})

		it('should work for common contentTypes', ( ) => {

			commonHTML.forEach(contentType => {

				assert.doesNotThrow(
					( ) => contentType.parse(contentType),
					`failed for ${contentType}`)

			})

			commonMimetypes.forEach(contentType => {

				if (knownFailures.indexOf(contentType) !== -1) {
					return
				}

				assert.doesNotThrow(
					( ) => contentType.parse(contentType),
					`failed for ${contentType}`)

			})

		})

	})







	describe('.deparse', ( ) => {
		it('should match known test cases', ( ) => {

			knowResults.forEach(test => {

				assert.deepEqual(
					contentType.deparse(
						contentType.parse(test.contentType)),
					test.deparsed)

			})

		})

	})

	it('should be an identity pair when iterated more than twice', ( ) => {

		knowResults.forEach(test => {

			var pair = contentType => {

				var parsed = contentType.parse(contentType)
				return contentType.deparse(parsed)

			}

			var iterate = (num, fn) => {
				return val => {

					for (let ith = 0; ith < num; ++ ith) {
						val = fn(val)
					}

					return val
				}
			}

			var expected = iterate(2, pair)(test.contentType)

			for (let ith = 2; ith < 100; ++ith) {

				assert.deepEqual(
					expected,
					iterate(ith, pair)(test.contentType),
					`failed on iteration ${ith}`)

			}

		})

	})

})


