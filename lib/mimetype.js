#!/usr/bin/env node
"use strict";

var zipKeys = function zipKeys(colls) {

	var out = {};
	colls.forEach(function (pair) {
		return out[pair[0]] = pair[1];
	});
	return out;
};

var lastOf = function lastOf(coll) {
	return coll[coll.length - 1];
};

{
	var grammar;

	(function () {

		var ascii = [" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "\t"];

		var tspecials = ["(", ")", "<", ">", "@", ",", ";", ":", "\\", "\"", "/", "[", "]", "?", "="];
		var tokenChar = ascii.filter(function (char) {
			return tspecials.indexOf(char) === -1;
		});
		var spaces = [" ", "\t"];

		grammar = {

			type: zipKeys([["/", "_SLASH"]].concat(tokenChar.map(function (char) {
				return [char, "type"];
			}))),

			subtype: zipKeys([[";", "_SPACE"]].concat(tokenChar.map(function (char) {
				return [char, "subtype"];
			}))),

			attribute: zipKeys([["=", "_EQUAL"]].concat(tokenChar.filter(function (char) {
				return spaces.indexOf(char) === -1;
			}).map(function (char) {
				return [char, "attribute"];
			}))),

			"single-quoted": zipKeys([["'", "_SPACE"]].concat(tokenChar.filter(function (char) {
				return char != "'";
			}).map(function (char) {
				return [char, "single-quoted"];
			}))),

			"double-quoted": zipKeys([["\"", "_SPACE"]].concat(tokenChar.filter(function (char) {
				return char != "\"";
			}).map(function (char) {
				return [char, "double-quoted"];
			}))),

			unquoted: zipKeys([[";", "_SPACE"]].concat(tokenChar.map(function (char) {
				return [char, "unquoted"];
			}))),

			_SLASH: zipKeys(tokenChar.map(function (char) {
				return [char, "subtype"];
			})),

			_EQUAL: zipKeys([["\"", "double-quoted"], ["'", "single-quoted"]].concat(tokenChar.map(function (char) {
				return [char, "unquoted"];
			}))),

			_SPACE: zipKeys([[";", "_SPACE"], [" ", "_SPACE"], ["\t", "_SPACE"], ["\n", "_SPACE"]].concat(tokenChar.filter(function (char) {
				return char !== ";" && char !== " " && char !== "\t" && char !== "\n";
			}).map(function (char) {
				return [char, "attribute"];
			})))

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

		if (typeof grammar[state][char] !== "undefined") {
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

		if (tokens.length > 0 && lastOf(lastOf(tokens))[1] === state[1]) {
			lastOf(tokens).push(state);
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

	parse.precond(contentType);

	return parseLexeme(label(lex(contentType)));
};

parse.precond = function (contentType) {

	var argClass = Object.prototype.toString.call(contentType);

	if (argClass !== "[object String]") {
		throw TypeError("contentType must be a string: actual " + argClass);
	}
};

var deparse = function (_ref) {
	var type = _ref.type;
	var subtype = _ref.subtype;
	var params = _ref.params;

	deparse.precond(type, subtype, params);

	var paramString = Object.keys(params).map(function (name) {
		return "; " + name + "=" + params[name];
	}).join("");

	return "" + type + "/" + subtype + "" + paramString;
};

deparse.precond = function (_ref) {
	var type = _ref.type;
	var subtype = _ref.subtype;
	var params = _ref.params;

	var typeClass = Object.prototype.toString.call(type);
	var subtypeClass = Object.prototype.toString.call(subtype);
	var paramsClass = Object.prototype.toString.call(params);

	if (typeClass !== "[object String]") {
		throw TypeError("type must be a string: actual " + typeClass);
	}

	if (subtypeClass !== "[object String]") {
		throw TypeError("subtype must be a string: actual " + subtypeClass);
	}

	if (paramsClass !== "[object Object]") {
		throw TypeError("params must be a string: actual " + paramsClass);
	}

	Object.keys(params).forEach(function (param, ith) {

		var paramClass = Object.prototype.toString.call(params[param]);

		if (paramClass !== "[object String]") {
			throw TypeError("parameter number " + ith + " must be a string: actual " + paramClass);
		}
	});
};

module.exports = {
	parse: parse,
	deparse: deparse
};
