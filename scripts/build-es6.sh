#!/usr/bin/env sh





function buildES6 {

	for file in $1
	do

		filename="$(
			echo $file |
			sed "s/es6/js/"
		)
		"
		echo $file "->" $filename

		babel $file --out-file $filename

	done

}






buildES6 lib/*.es6
buildES6 test/*.es6

echo "done."
