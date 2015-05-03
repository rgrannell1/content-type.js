#!/usr/bin/env sh



docco $(find lib/ -name '*.js')
pandoc --read=markdown_github -o README.html README.md
