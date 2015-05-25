#!/usr/bin/env node
"use strict";

var fs = require("fs");
var should = require("should");
var mimetype = require("../lib/mimetype");
var assert = require("assert");

var known = function (contentType, _ref, deparsed) {
	var type = _ref.type;
	var subtype = _ref.subtype;
	var params = _ref.params;

	return {
		contentType: contentType,
		parsed: {
			type: type,
			subtype: subtype,
			params: params
		},
		deparsed: deparsed
	};
};

var knowResults = [known("text/html; charset=utf-8", {
	type: "text",
	subtype: "html",
	params: {
		charset: "utf-8"
	}
}, "text/html; charset=utf-8"), known("application/java-archive", {
	type: "application",
	subtype: "java-archive",
	params: {}
}, "application/java-archive"), known("text/html; charset=windows-874", {
	type: "text",
	subtype: "html",
	params: {
		charset: "windows-874"
	}
}, "text/html; charset=windows-874"), known("application/xhtml+xml; charset=utf-8", {
	type: "application",
	subtype: "xhtml+xml",
	params: {
		charset: "utf-8"
	}
}, "application/xhtml+xml; charset=utf-8"), known("application/xml; charset=ISO-8859-1", {
	type: "application",
	subtype: "xml",
	params: {
		charset: "ISO-8859-1"
	}
}, "application/xml; charset=ISO-8859-1"), known("application/xhtml+xml; charset=utf-8", {
	type: "application",
	subtype: "xhtml+xml",
	params: {
		charset: "utf-8"
	}
}, "application/xhtml+xml; charset=utf-8"), known("application/x-web-app-manifest+json", {
	type: "application",
	subtype: "x-web-app-manifest+json",
	params: {}
}, "application/x-web-app-manifest+json"), known("text/html;", {
	type: "text",
	subtype: "html",
	params: {}
}, "text/html"), known("text/html; charset=utf-8", {
	type: "text",
	subtype: "html",
	params: {
		charset: "utf-8"
	}
}, "text/html; charset=utf-8"), known("text/html; charset=UTF-8", {
	type: "text",
	subtype: "html",
	params: {
		charset: "UTF-8"
	}
}, "text/html; charset=UTF-8"), known("text/html;charset=utf-8", {
	type: "text",
	subtype: "html",
	params: {
		charset: "utf-8"
	}
}, "text/html; charset=utf-8"), known("text/html; charset=ISO-8859-1", {
	type: "text",
	subtype: "html",
	params: {
		charset: "ISO-8859-1"
	}
}, "text/html; charset=ISO-8859-1"), known("text/html;charset=UTF-8", {
	type: "text",
	subtype: "html",
	params: {
		charset: "UTF-8"
	}
}, "text/html; charset=UTF-8"), known("text/html; charset=GB2312", {
	type: "text",
	subtype: "html",
	params: {
		charset: "GB2312"
	}
}, "text/html; charset=GB2312"), known("text/html; charset=ISO-8859-1", {
	type: "text",
	subtype: "html",
	params: {
		charset: "ISO-8859-1"
	}
}, "text/html; charset=ISO-8859-1"), known("text/html; charset=windows-1251", {
	type: "text",
	subtype: "html",
	params: {
		charset: "windows-1251"
	}
}, "text/html; charset=windows-1251"), known("text/html; charset=Shift_JIS", {
	type: "text",
	subtype: "html",
	params: {
		charset: "Shift_JIS"
	}
}, "text/html; charset=Shift_JIS"), known("text/html;;charset=utf-8", {
	type: "text",
	subtype: "html",
	params: {
		charset: "utf-8"
	}
}, "text/html; charset=utf-8"), known("text/html; charset=GBK", {
	type: "text",
	subtype: "html",
	params: {
		charset: "GBK"
	}
}, "text/html; charset=GBK"), known("text/html; charset=utf8", {
	type: "text",
	subtype: "html",
	params: {
		charset: "utf8"
	}
}, "text/html; charset=utf8"), known("text/html; charset=EUC-JP", {
	type: "text",
	subtype: "html",
	params: {
		charset: "EUC-JP"
	}
}, "text/html; charset=EUC-JP"), known("text/html; charset=ISO-8859-15", {
	type: "text",
	subtype: "html",
	params: {
		charset: "ISO-8859-15"
	}
}, "text/html; charset=ISO-8859-15"), known("text/vnd.wap.wml", {
	type: "text",
	subtype: "vnd.wap.wml",
	params: {}
}, "text/vnd.wap.wml"), known("text/html; charset=gbk", {
	type: "text",
	subtype: "html",
	params: {
		charset: "gbk"
	}
}, "text/html; charset=gbk"), known("text/html; charset=iso-8859-1", {
	type: "text",
	subtype: "html",
	params: {
		charset: "iso-8859-1"
	}
}, "text/html; charset=iso-8859-1"), known("text/html; charset=ISO-8859-2", {
	type: "text",
	subtype: "html",
	params: {
		charset: "ISO-8859-2"
	}
}, "text/html; charset=ISO-8859-2"), known("text/plain; charset=\"utf-7\"", {
	type: "text",
	subtype: "plain",
	params: {
		charset: "\"utf-7\""
	}
}, "text/plain; charset=\"utf-7\""), known("TEXT/plain; charset='iso-8859-15'", {
	type: "TEXT",
	subtype: "plain",
	params: {
		charset: "'iso-8859-15'"
	}
}, "TEXT/plain; charset='iso-8859-15'"), known("MESSAGE/rfc2045", {
	type: "MESSAGE",
	subtype: "rfc2045",
	params: {}
}, "MESSAGE/rfc2045"), known("text/plain; name*=n%41me", {
	type: "text",
	subtype: "plain",
	params: {
		"name*": "n%41me"
	}
}, "text/plain; name*=n%41me"), known("text/plain; charset=\"UTF-8\"", {
	type: "text",
	subtype: "plain",
	params: {
		charset: "\"UTF-8\""
	}
}, "text/plain; charset=\"UTF-8\""), known("text/plain ; foo=bar; charset=\"UTF-8\"", {
	type: "text",
	subtype: "plain",
	params: {
		foo: "bar",
		charset: "\"UTF-8\""
	}
}, "text/plain; foo=bar; charset=\"UTF-8\""), known("text/plain; bar=\"; charset='UTF-8'\"", {
	type: "text",
	subtype: "plain",
	params: {
		bar: "\"; charset='UTF-8'\""
	}
}, "text/plain; bar=\"; charset='UTF-8'\"")];

var commonHTML = ["text/html", "text/html; charset=utf-8", "text/html; charset=UTF-8", "text/html; charset=iso-8859-1", "text/html;charset=UTF-8", "text/html;charset=utf-8", "text/html; charset=utf8", "application/octet-stream", "text/html; charset=EUC-JP", "text/html; charset=ISO-8859-1", "text/html; charset=Shift_JIS", "text/html; charset=ISO-8859-15", "text/html;;charset=utf-8", "text/html; charset=GB2312", "text/html;", "text/html;charset=ISO-8859-1", "text/html; charset=ISO-8859-2", "text/html; charset=GBK", "text/html; charset=windows-1251", "text/html; charset=Big5", "text/html; charset=shift_jis", "text/html; charset=gbk"];

var knownFailures = ["text; html;", "texthtml", "text/plain; charset = UTF-8", "/", "application/x-bytecode.elisp (compiled elisp)", // -- are these really errors?
"application/x-bytecode.elisp(compiledelisp)", // -- are these really errors?,
"text/xml; subtype=gml/3.1.1", " ", "null", "undefined", "/", "text / plain", "text/;plain", "text/\"plain\"", "text/p£ain", "text/(plain)", "text/@plain", "text/plain,wrong"];

var commonMimetypes = JSON.parse(fs.readFileSync("" + __dirname + "/utils/common-content-types.json").toString()).map(function (type) {
	return Object.keys(type)[0];
}).filter(function (type) {
	return Object.prototype.toString.call(type) === "[Object String]";
});

describe("mimetype", function () {

	describe(".parse", function () {

		it("should never have parametres with spaces", function () {

			knowResults.forEach(function (test) {

				var params = mimetype.parse(test.contentType).params;

				Object.keys(params).forEach(function (param) {
					param.trim().should.eql(param);
				});
			});
		});

		it("should match known test cases", function () {

			knowResults.forEach(function (test) {
				assert.deepEqual(mimetype.parse(test.contentType), test.parsed);
			});
		});

		it("should fail for known failing cases", function () {

			knownFailures.forEach(function (contentType) {
				assert.throws(function () {
					return mimetype.parse(contentType);
				}, Error);
			});
		});

		it("should work for common mimetypes", function () {

			commonHTML.forEach(function (contentType) {

				assert.doesNotThrow(function () {
					return mimetype.parse(contentType);
				}, "failed for " + contentType);
			});

			commonMimetypes.forEach(function (contentType) {

				if (knownFailures.indexOf(contentType) !== -1) {
					return;
				}

				assert.doesNotThrow(function () {
					return mimetype.parse(contentType);
				}, "failed for " + contentType);
			});
		});
	});

	describe(".deparse", function () {
		it("should match known test cases", function () {

			knowResults.forEach(function (test) {

				assert.deepEqual(mimetype.deparse(mimetype.parse(test.contentType)), test.deparsed);
			});
		});
	});

	it("should be an identity pair when iterated more than twice", function () {

		knowResults.forEach(function (test) {

			var pair = function (contentType) {

				var parsed = mimetype.parse(contentType);
				return mimetype.deparse(parsed);
			};

			var iterate = function (num, fn) {
				return function (val) {

					for (var ith = 0; ith < num; ++ith) {
						val = fn(val);
					}

					return val;
				};
			};

			var expected = iterate(2, pair)(test.contentType);

			for (var ith = 2; ith < 100; ++ith) {

				assert.deepEqual(expected, iterate(ith, pair)(test.contentType), "failed on iteration " + ith);
			}
		});
	});
});
