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

		// -- the control ascii characters (inc. delete)
		var control = ["\u0000", "\u0001", "\u0002", "\u0003", "\u0004", "\u0005", "\u0006", "\u0007", "\b", "\t", "\n", "\u000b", "\f", "\r", "\u000e", "\u000f", "\u0010", "\u0011", "\u0012", "\u0013", "\u0014", "\u0015", "\u0016", "\u0017", "\u0018", "\u0019", "\u001a", "\u001b", "\u001c", "\u001d", "\u001e", "\u001f", ""];

		// -- tspecials must be in quoted string to use in parametre value.
		var tspecials = ["(", ")", "<", ">", "@", ",", ";", ":", "\\", "\"", "/", "[", "]", "?", "="];

		// -- the printable ascii characters.
		var ascii = [" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"];

		// -- any ascii character except the tspecials, space, and the CTRL characters
		var tokenChar = ascii.filter(function (char) {
			return tspecials.indexOf(char) === -1 && char !== " " && control.indexOf(char) === -1;
		});

		grammar = {

			type: zipKeys([["/", "_SLASH"]].concat(tokenChar.map(function (char) {
				return [char, "type"];
			}))),

			subtype: zipKeys([[";", "_SPACE"]].concat(tokenChar.map(function (char) {
				return [char, "subtype"];
			}))),

			attribute: zipKeys([["=", "_EQUAL"]].concat(tokenChar.filter(function (char) {
				return control.indexOf(char) === -1;
			}).map(function (char) {
				return [char, "attribute"];
			}))),

			"single-quoted": zipKeys([["'", "_SPACE"]].concat(tokenChar.concat(tspecials).concat(" ").filter(function (char) {
				return char != "'";
			}).map(function (char) {
				return [char, "single-quoted"];
			}))),

			"double-quoted": zipKeys([["\"", "_SPACE"]].concat(tokenChar.concat(tspecials).concat(" ").filter(function (char) {
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

			var current = transitions.map(function (pair) {
				return pair[0];
			}).join("");
			throw Error("unexpected \"" + char + "\" in content-type header: " + current);
		}
	}

	// -- drop the temporary transitions.
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
		type: labels[0][0],
		subtype: labels[1][0],
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

deparse.precond = function (type, subtype, params) {

	var typeClass = Object.prototype.toString.call(type);
	var subtypeClass = Object.prototype.toString.call(subtype);
	var paramsClass = Object.prototype.toString.call(params);

	var input = JSON.stringify({ type: type, subtype: subtype, params: params });

	if (typeClass !== "[object String]") {
		throw TypeError("type must be a string: actual " + typeClass + ", input " + input);
	}

	if (subtypeClass !== "[object String]") {
		throw TypeError("subtype must be a string: actual " + subtypeClass + ", input " + input);
	}

	if (paramsClass !== "[object Object]") {
		throw TypeError("params must be a string: actual " + paramsClass + ", input " + input);
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
