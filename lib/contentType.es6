#!/usr/bin/env node

"use strict"






var zipKeys = function (colls) {

	var out = { }
	colls.forEach(pair => out[pair[0]] = pair[1])
	return out

}

var lastOf = function (coll) {
	return coll[coll.length - 1]
}






{

	let toState = state => char => [char, state]

	// -- the control ascii characters (inc. delete)
	let control   = [
		'\x00', '\x01', '\x02', '\x03', '\x04',
		'\x05', '\x06', '\x07', '\x08', '\x09',
		'\x0a', '\x0b', '\x0c', '\x0d', '\x0e', '\x0f',
		'\x10', '\x11', '\x12', '\x13', '\x14', '\x15',
		'\x16', '\x17', '\x18', '\x19', '\x1a', '\x1b',
		'\x1c', '\x1d', '\x1e', '\x1f',
		'\x7f'
	]

	// -- tspecials must be in quoted string to use in parametre value.
	let tspecials = ['(', ')', '<', '>', '@', ',', ';', ':', '\\', '"', "/", "[", "]", "?", "="]

	// -- all ascii characters.
	let ascii     = [

		'\x00', '\x01', '\x02', '\x03', '\x04',
		'\x05', '\x06', '\x07', '\x08', '\x09',
		'\x0a', '\x0b', '\x0c', '\x0d', '\x0e', '\x0f',
		'\x10', '\x11', '\x12', '\x13', '\x14', '\x15',
		'\x16', '\x17', '\x18', '\x19', '\x1a', '\x1b',
		'\x1c', '\x1d', '\x1e', '\x1f', "\x20", "\x21",
		"\x22", "\x23", "\x24", "\x25",
		"\x26", "\x27", "\x28", "\x29", "\x2a", "\x2b",
		"\x2c", "\x2d", "\x2e", "\x2f", "\x30", "\x31",
		"\x32", "\x33", "\x34", "\x35", "\x36", "\x37",
		"\x38", "\x39", "\x3a", "\x3b", "\x3c", "\x3d",
		"\x3e", "\x3f", "\x40", "\x41", "\x42", "\x43",
		"\x44", "\x45", "\x46", "\x47", "\x48", "\x49",
		"\x4a", "\x4b", "\x4c", "\x4d", "\x4e", "\x4f",
		"\x50", "\x51", "\x52", "\x53", "\x54", "\x55",
		"\x56", "\x57", "\x58", "\x59", "\x5a", "\x5b",
		"\x5c", "\x5d", "\x5e", "\x5f", "\x60", "\x61",
		"\x62", "\x63", "\x64", "\x65", "\x66", "\x67",
		"\x68", "\x69", "\x6a", "\x6b", "\x6c", "\x6d",
		"\x6e", "\x6f", "\x70", "\x71", "\x72", "\x73",
		"\x74", "\x75", "\x76", "\x77", "\x78", "\x79",
		"\x7a", "\x7b", "\x7c", "\x7d", "\x7e", '\x7f'
	]

	// -- all non-control ascii characters.
	let printable = ascii.filter(char => control.indexOf(char) === -1)

	// -- any ascii character except the tspecials, space, and the CTRL characters
	let tokenChar = printable.filter(char => char !== ' ' && tspecials.indexOf(char) === -1)








	// -- real states
	//
	// these states represent parts of the contentType,
	// such as the type, or attributes.


	// -- type
	// non whitespace tokens. exit when the first slash is reached.

	let type = zipKeys(
		[['/', '_SLASH']]
		.concat(
			tokenChar.map(
				toState('type')) )
	)

	// -- subtype
	// non whitespace tokens. exit when the semicolon is reached.

	let subtype = zipKeys(
		[[';','_SPACE']]
		.concat(
			tokenChar.map(
				toState('subtype')) )
	)

	// -- attribute
	// non whitespace tokens. exit when the '=' delimiter for that parametre is reached.

	let attribute = zipKeys(
		[['=', '_EQUAL']]
		.concat(
			tokenChar.map(
				toState('attribute')) )
	)

	// -- single-quoted
	// any printable ascii character except '.  exit when ' is reached.

	let singleQuoted = zipKeys(
		[["'", '_SPACE']]
		.concat(
			printable
			.filter(
				char => char !== "'")
			.map(
				toState('single-quoted')) )
	)

	// -- double-quoted
	// any printable ascii character except ". exit when " is reached

	let doubleQuoted = zipKeys(
		[['"', '_SPACE']]
		.concat(
			printable
			.filter(
				char => char !== '"')
			.map(
				toState('double-quoted')) )
	)

	// -- unquoted
	//

	let unquoted = zipKeys(
		[[';', '_SPACE']]
		.concat( tokenChar.map(
			toState('unquoted')) )
	)





	// -- virtual states
	//
	// these states represent delimiters between tokens.

	// -- _SLASH
	// transition immediately to the subtype definition.

	let _SLASH = zipKeys(
		tokenChar.map(toState('subtype'))
	)

	// -- _EQUAL
	// if the equal is succeeded by a quote, transition to a quoted attribute.
	// otherwise, transition to an unquoted parameter value.

	let _EQUAL = zipKeys(
		[
			['"',  'double-quoted'],
			["'",  'single-quoted']
		]
		.concat( tokenChar.map(char => [char, 'unquoted']) )
	)

	// -- _SPACE
	// multiple semicolon are supported.

	let _SPACE = zipKeys(
		[
			[';',  '_SPACE'],
			[' ',  '_SPACE'],
			['\t', '_SPACE'],
			['\n', '_SPACE']
		]
		.concat(
			tokenChar
			.filter(char => [';', ' ', '\t', '\n'].indexOf(char) === -1)
			.map(toState('attribute')) )
	)





	var grammar = {

		type,
		subtype,
		attribute,
		'single-quoted': singleQuoted,
		'double-quoted': doubleQuoted,
		unquoted,

		_SLASH,
		_EQUAL,
		_SPACE

	}

}




var lex = contentType => {

	var state       = 'type'
	var transitions = [ ]
	var chars       = contentType.split('')

	for (let ith = 0; ith < chars.length; ++ith) {

		var char = chars[ith]

		if (transitions.length > 0) {
			state = transitions[transitions.length - 1][1]
		}

		if (typeof grammar[state][char] !== 'undefined') {
			transitions.push( [char, grammar[state][char]] )
		} else {

			var current = transitions.map(pair => pair[0]).join('')
			throw Error(`${contentType}: unexpected "${char}" in content-type header near '${current}' (state = '${state}')`)

		}

	}

	// -- drop the temporary transitions.
	return transitions.filter(trans => trans[1][0] !== '_')

}





var label = lexeme => {

	var tokens = [ ]

	lexeme.forEach((state, ith) => {

		if (tokens.length > 0 && lastOf(lastOf(tokens))[1] === state[1]) {
			lastOf(tokens).push(state)
		} else {
			tokens.push([state])
		}

	})

	return tokens.map(token => {

		var label = token[0][1]
		var text  = token.map(state => state[0]).join('')

		if (label === 'double-quoted') {
			text += '"'
		} else if (label === 'single-quoted') {
			text += "'"
		}

		return [label, text]

	})

}





var parseLexeme = (contentType, lexeme) => {

	var labels = label(lexeme)

	if (labels.length < 2) {
		throw Error(`invalid contentType; must contain type and subtype (${contentType})`)
	}

	var types  = [
		'application', 'audio', 'example', 'image',
		'message', 'model', 'multipart', 'text', 'video']

	try {

		if (types.indexOf(labels[0][0].toLowerCase( )) === -1) {
			throw Error(`invalid content type ${labels[0][0].toLowerCase( )}`)
		}

		var params  = { }


		var options = labels.slice(2)

		if (options.length % 2 !== 0) {
			throw Error('parsing failed: odd number of tokens.')
		}

		for (let ith = 0; ith < options.length; ith += 2) {
			params[options[ith][0]] = options[ith + 1][0]
		}

		return {
			type:    labels[0][0],
			subtype: labels[1][0],
			params:  params
		}

	} catch (err) {

		var labelString = JSON.stringify(labels)
		throw Error(`failed to parse content-type tokens: ${err.message}, ${labelString}`)

	}

}






var parse = (contentType) => {

	parse.precond(contentType)

	return parseLexeme( contentType, label(lex(contentType)) )

}

parse.precond = contentType => {

	var argClass = Object.prototype.toString.call(contentType)

	if (argClass !== '[object String]') {
		throw TypeError(`contentType must be a string: actual ${argClass}`)
	}

}





var deparse = ({type, subtype, params}) => {

	deparse.precond(type, subtype, params)

	var paramString =
		Object.keys(params)
		.map(
			name => `; ${name}=${params[name]}` )
		.join('')

	return `${type}/${subtype}${paramString}`

}

deparse.precond = (type, subtype, params) => {

	var typeClass    = Object.prototype.toString.call(type)
	var subtypeClass = Object.prototype.toString.call(subtype)
	var paramsClass  = Object.prototype.toString.call(params)

	var input = JSON.stringify({type, subtype, params})



	if (typeClass !== '[object String]') {
		throw TypeError(`type must be a string: actual ${typeClass}, input ${ input }`)
	}

	if (subtypeClass !== '[object String]') {
		throw TypeError(`subtype must be a string: actual ${subtypeClass}, input ${ input }`)
	}

	if (paramsClass !== '[object Object]') {
		throw TypeError(`params must be a string: actual ${paramsClass}, input ${ input }`)
	}





	Object.keys(params).forEach((param, ith) => {

		var paramClass = Object.prototype.toString.call(params[param])

		if (paramClass !== '[object String]') {
			throw TypeError(`parameter number ${ith} must be a string: actual ${paramClass}`)
		}

	})

}





module.exports = {
	parse,
	deparse
}

