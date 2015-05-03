#!/usr/bin/env node
"use strict";

Object.defineProperty(Array.prototype, "zipKeys", {

	enumerable: false,
	value: function value() {

		var out = {};
		this.forEach(function (pair) {
			return out[pair[0]] = pair[1];
		});
		return out;
	}
});

Object.defineProperty(Array.prototype, "lastOf", {

	enumerable: false,
	value: function value() {
		return this[this.length - 1];
	}
});

{
	var grammar;

	(function () {

		var ascii = [" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "\t"];

		var tspecials = ["(", ")", "<", ">", "@", ",", ";", ":", "\\", "\"", "/", "[", "]", "?", "="];
		var tokenChar = ascii.filter(function (char) {
			return tspecials.indexOf(char) === -1;
		});

		grammar = {

			type: [["/", "_SLASH"]].concat(tokenChar.map(function (char) {
				return [char, "type"];
			})).zipKeys(),

			subtype: [[";", "_SPACE"]].concat(tokenChar.map(function (char) {
				return [char, "subtype"];
			})).zipKeys(),

			attribute: [["=", "_EQUAL"]].concat(tokenChar.map(function (char) {
				return [char, "attribute"];
			})).zipKeys(),

			"single-quoted": [["'", "_SPACE"]].concat(tokenChar.filter(function (char) {
				return char != "'";
			}).map(function (char) {
				return [char, "single-quoted"];
			})).zipKeys(),

			"double-quoted": [["\"", "_SPACE"]].concat(tokenChar.filter(function (char) {
				return char != "\"";
			}).map(function (char) {
				return [char, "double-quoted"];
			})).zipKeys(),

			unquoted: [[";", "_SPACE"]].concat(tokenChar.map(function (char) {
				return [char, "unquoted"];
			})).zipKeys(),

			_SLASH: tokenChar.map(function (char) {
				return [char, "subtype"];
			}).zipKeys(),

			_EQUAL: [["\"", "double-quoted"], ["'", "single-quoted"]].concat(tokenChar.map(function (char) {
				return [char, "unquoted"];
			})).zipKeys(),

			_SPACE: [[";", "_SPACE"], [" ", "_SPACE"], ["\t", "_SPACE"], ["\n", "_SPACE"]].concat(tokenChar.map(function (char) {
				return [char, "attribute"];
			})).zipKeys()

		};
	})();
}

var lex = function (contentType) {

	var state = "type";
	var transitions = [];
	var chars = contentType.split("");

	for (var ith = 0; ith < chars.length; ++ith) {

		var char = chars[ith];

		if (transitions.length > 0) {
			state = transitions[transitions.length - 1][1];
		}

		if (grammar[state][char]) {
			transitions.push([char, grammar[state][char]]);
		} else {
			throw Error("\"" + char + "\" not allowed in content-type header (" + state + ")");
		}
	}

	return transitions.filter(function (trans) {
		return trans[1][0] !== "_";
	});
};

var label = function (lexeme) {

	var tokens = [];

	lexeme.forEach(function (state, ith) {

		if (tokens.length > 0 && tokens.lastOf().lastOf()[1] === state[1]) {
			tokens.lastOf().push(state);
		} else {
			tokens.push([state]);
		}
	});

	return tokens.map(function (token) {

		var label = token[0][1];
		var text = token.map(function (state) {
			return state[0];
		}).join("");

		if (label === "double-quoted") {
			text += "\"";
		} else if (label === "single-quoted") {
			text += "'";
		}

		return [label, text];
	});
};

var parseLexeme = function (lexeme) {

	var labels = label(lexeme);
	var types = ["application", "audio", "example", "image", "message", "model", "multipart", "text", "video"];

	if (types.indexOf(labels[0][0].toLowerCase()) === -1) {
		throw Error("invalid content type " + labels[0][0].toLowerCase());
	}

	var params = {};
	var options = labels.slice(2);

	for (var ith = 0; ith < options.length; ith += 2) {
		params[options[ith][0]] = options[ith + 1][0];
	}

	return {
		type: labels[0][0].toLowerCase(),
		subtype: labels[1][0].toLowerCase(),
		params: params
	};
};

var parse = function (contentType) {
	return parseLexeme(label(lex(contentType)));
};

var deparse = function (_ref) {
	var type = _ref.type;
	var subtype = _ref.subtype;
	var params = _ref.params;

	var paramString = Object.keys(params).map(function (name) {
		return "; " + name + "=" + params[name];
	}).join("");

	return "" + type + "/" + subtype + "" + paramString;
};

module.exports = {
	parse: parse,
	deparse: deparse
};
