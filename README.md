# tuna-ui

## Purpose

I started this project to learn browserify.  Its also a fun little UI builder for a simple audio effects library called Tuna which runs in the browser using webaudio.

# Tools

I've been experimenting with node-based development tools of late and will try and capture my thoughts here.

## Using NPM

`npm` is not useful only for node.js development; it is also useful when developing client-side browser-based apps.  It provides a rich set of modules and tools which help make those modules available in the browser.

### Modules

There are multiple module systems in use across the javascript ecosystem:
- commonjs (developed for and used by node.js)
- AMD (asynchronous module definition) developed for the browser to provide similar functionality to commonjs in node
- universal module definition is a merging of these two patterns which work anywhere and provide similar functionality in both node.js and the browser
- javascript modules (not yet available everywhere, but should be standard as of ES7)

See this article for more details on the workings of each of these module systems:
http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/

### Commonjs Everywhere

Commonjs is by far the simplest module system in use today and  Its widely used because of node.  Now using browserify, you can use it in the browser as well.

- use simple node.js style requires everywhere
- use module source files as written directly in node
- process source files with browserify to provide a single bundle which can then be included via script element in the browser
- use browserify transforms to make client side templating easier and more efficient (no need for ajax or fs.readFile in source)

Until modules become standard in the javascript language, tooling can provide the next best thing!

## Getting Started

- install node and npm
- install browserify
	+ `npm install -g browserify`
- install watchify (rebuilds when source files change)
	+ `npm install -g watchify`
- run (on command line)
	+ `browserify main.js [-t transformer arg -o output.bundle.js --debug`
	+ `watchify main.js [-t transformer arg -o output.bundle.js --verbose --debug`
- from the package.json file:
	
```
"scripts": {
"watch": "watchify main.js -t browserify-hogan ui.js -o main.bundle.js --verbose --debug"
},
```

Replace "watchify" with browserify to and remove the debug and verbose flags to build for production.




### Notes

The `--debug` and `--verbose` options must be at the end of the watchify command; if not, bundle will not be completely built and failure is silent.

Only one entry point need be specified; all other files reachable from this one via `require` will be found and included in the bundle.

The transforms allow you to pre-process files. I'm using one to preprocess files which want to use client-side html templates. The transform turns `require ("template.someExtension")` into the instantiation of a javascript object with a `render` method which will render the template when called. If this were not done, then the template would need to be read from the file "template.someExtension" and then passed to the template engine as a string.
- _** important **_: if using browserify-hogan to render mustache templates, force to version 2 of the transform via `npm install browserify-hogan@^2`


## Further Reading

- Browserify handbook:
https://github.com/substack/browserify-handbook
- Articles about browserify, written by the community:
http://browserify.org/articles.html
- github page:
https://github.com/substack/node-browserify#browserify



# What Does it Do

Build simple UI from tuna modules:
- all modules provide a bypass control, and a list of floating point parameters with min, max, and default value
	+ we use this list and a simple mustache template to build a simple and accessible UI
	+ all parameters operable from either keyboard or mouse (use standard `input type="range"` controls)
- bypass is a simple checkbox with label

## To Do

Extend this to apply to more general audio components constructed via web audio.  

