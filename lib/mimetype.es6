#!/usr/bin/env node

"use strict"






Object.defineProperty(Array.prototype, 'zipKeys', {

	enumerable: false,
	value:      function ( ) {

		var out = { }
		this.forEach(pair => out[pair[0]] = pair[1])
		return out

	}
})

Object.defineProperty(Array.prototype, 'lastOf', {

	enumerable: false,
	value:      function ( ) {
		return this[this.length - 1]
	}
})








{

	let ascii = [
		" ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0",
		"1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A",
		"B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
		"S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c",
		"d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
		"u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "\	"
	]

	let tspecials = ['(', ')', '<', '>', '@', ',', ';', ':', '\\', '"', "/", "[", "]", "?", "="]
	let tokenChar = ascii.filter(char => {
		return tspecials.indexOf(char) === -1
	})





	var grammar = {

		'type':
			[['/', '_SLASH']]
			.concat(
				tokenChar.map(char => [char, 'type']) )
			.zipKeys( ),

		'subtype':
			[[';','_SPACE']]
			.concat(
				tokenChar.map(char => [char, 'subtype']) )
			.zipKeys( ),

		'attribute':
			[['=', '_EQUAL']]
			.concat( tokenChar.map(char => [char, 'attribute']) )
			.zipKeys( ),




		'single-quoted':
			[["'", '_SPACE']]
			.concat(
				tokenChar
				.filter(char => char != "'")
				.map(char => [char, 'single-quoted']) )
			.zipKeys( ),

		'double-quoted':
			[['"', '_SPACE']]
			.concat(
				tokenChar
				.filter(char => char != '"')
				.map(char => [char, 'double-quoted']) )
			.zipKeys( ),





		'unquoted':
			[[';', '_SPACE']]
			.concat( tokenChar.map(char => [char, 'unquoted']) )
			.zipKeys( ),





		'_SLASH':
			tokenChar.map(
				char => [char, 'subtype'])
			.zipKeys( ),

		'_EQUAL':
			[
				['"',  'double-quoted'],
				["'",  'single-quoted']]
			.concat( tokenChar.map(char => [char, 'unquoted']) )
			.zipKeys( ),






		'_SPACE':
			[
				[';',  '_SPACE'],
				[' ',  '_SPACE'],
				['\t', '_SPACE'],
				['\n', '_SPACE']
			]
			.concat( tokenChar.map(char => [char, 'attribute']) )
			.zipKeys( )

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

		if (grammar[state][char]) {
			transitions.push( [char, grammar[state][char]] )
		} else {
			throw Error(`"${char}" not allowed in content-type header (${state})`)
		}

	}

	return transitions.filter(trans => trans[1][0] !== '_')

}





var label = lexeme => {

	var tokens = [ ]

	lexeme.forEach((state, ith) => {

		if (tokens.length > 0 && tokens.lastOf( ).lastOf( )[1] === state[1]) {
			tokens.lastOf( ).push(state)
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





var parseLexeme = lexeme => {

	var labels = label(lexeme)
	var types  = [
		'application', 'audio', 'example', 'image',
		'message', 'model', 'multipart', 'text', 'video']

	if (types.indexOf(labels[0][0].toLowerCase( )) === -1) {
		throw Error(`invalid content type ${labels[0][0].toLowerCase( )}`)
	}

	var params  = { }
	var options = labels.slice(2)

	for (let ith = 0; ith < options.length; ith += 2) {
		params[options[ith][0]] = options[ith + 1][0]
	}

	return {
		type:    labels[0][0].toLowerCase( ),
		subtype: labels[1][0].toLowerCase( ),
		params:  params
	}

}






var parse = contentType => {

	parse.precond(contentType)

	return parseLexeme( label(lex(contentType)) )

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

deparse.precond = ({type, subtype, params}) => {

	var typeClass    = Object.prototype.toString.call(type)
	var subtypeClass = Object.prototype.toString.call(subtype)
	var paramsClass  = Object.prototype.toString.call(params)





	if (typeClass !== '[object String]') {
		throw TypeError(`type must be a string: actual ${typeClass}`)
	}

	if (subtypeClass !== '[object String]') {
		throw TypeError(`subtype must be a string: actual ${subtypeClass}`)
	}

	if (paramsClass !== '[object Object]') {
		throw TypeError(`params must be a string: actual ${paramsClass}`)
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

