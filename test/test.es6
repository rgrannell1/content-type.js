
var should   = require('should')
var mimetype = require('../lib/mimetype')
var assert   = require('assert')





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
	'text/html;charset=utf-8'),

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
	'text/html;charset=UTF-8'),

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
	"text/html;charset=ISO-8859-1",
	{
		type:    'text',
		subtype: 'html',
		params:  {
			charset: 'ISO-8859-1'
		}
	},
	'text/html;charset=ISO-8859-1'),

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
	'text/html;;charset=utf-8'),

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
		type:    'text',
		subtype: 'plain',
		params:  {
			charset: "'iso-8859-15'"
		}
	},
	"TEXT/plain; charset='iso-8859-15'"),

	known(
	"MESSAGE/rfc2045",
	{
		type:    'message',
		subtype: 'rfc2045',
		params:  {

		}
	},
	"message/rfc2045"),

	known(
	"text/plain; name*=n%41me",
	{
		type:    'text',
		subtype: 'plain',
		params:  {
			'name*': 'n%41me'
		}
	},
	"text/plain; name*=n%41me")

]





describe('mimetype', ( ) => {

	describe('.parse', ( ) => {

		it('should never have parametres with spaces', ( ) => {

			knowResults.forEach(test => {

				var params = mimetype.parse(test.contentType).params

				Object.keys(params).forEach(param => {
					param.trim( ).should.eql(param)
				})

			})

		})

		it('should match known test cases', ( ) => {

			knowResults.forEach(test => {
				assert.deepEqual(mimetype.parse(test.contentType), test.parsed)
			})

		})

	})

	describe('.deparse', ( ) => {
		it('should match known test cases', ( ) => {

			knowResults.forEach(test => {

				assert.deepEqual(
					mimetype.deparse(
						mimetype.parse(test.contentType)),
					test.deparsed)

			})

		})

	})

	it('should be an identity pair when iterated more than twice', ( ) => {

		knowResults.forEach(test => {

			var pair = contentType => {
				return mimetype.deparse(mimetype.parse(contentType))
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


