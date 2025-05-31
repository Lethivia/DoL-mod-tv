VER=$(shell cat boot.json | grep version | cut -d'"' -f4 | head -1)
MOD=$(shell basename ${PWD})

all:
	zip -r ../DoL-${MOD}-${VER}.zip . -x'.git/*' -xMakefile; cp ../DoL-${MOD}-${VER}.zip /tmp/
