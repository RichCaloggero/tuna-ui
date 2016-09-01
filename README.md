# tuna-ui

## Purpose

I started this project to learn browserify.  Its also a fun little UI builder for a simple audio effects library called Tuna which runs in the browser using webaudio.

## What Does it Do

Build simple UI from tuna modules:
- extends parameter descriptions of Tuna modules via tunaModule.defaults 
	+all modules provide a bypass control, and a list of floating point parameters with min, max, step, controlType, and default value
	+ all parameters operable from either keyboard or mouse (use standard `input type="range"`, `type="checkbox"`, or `button` controls)
	+parameters can be grouped using group numbers in their description
- we use this list and a mustache template to build a simple and accessible UI
	+ changes to model cause UI to update
	+ changes in UI cause model to update

## Modifications to "tuna.js"

- expose `Super` as property on `Tuna` constructor
- exposed audio context as property of `Super`
- modified `Super.connect` and `Super.disconnect` to return target
- `activateCallback` is always called when `Super.activate` is called (argument reflects state of node)


## Tools

I've been experimenting with node-based development tools of late and will try and capture my thoughts here.

### Using NPM

`npm` is not useful only for node.js development; it is also useful when developing client-side browser-based apps.  It provides a rich set of modules and tools which help make those modules available in the browser.

#### Modules

There are multiple module systems in use across the javascript ecosystem:
- commonjs (developed for and used by node.js)
- AMD (asynchronous module definition) developed for the browser to provide similar functionality to commonjs in node
- universal module definition is a merging of these two patterns which work anywhere and provide similar functionality in both node.js and the browser
- javascript modules (not yet available everywhere, but should be standard as of ES7)

See this article for more details on the workings of each of these module systems:
http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/

#### Commonjs Everywhere

Commonjs is by far the simplest module system in use today and  Its widely used because of node.  Now using browserify, you can use it in the browser as well.

- use simple node.js style requires everywhere
- use module source files as written directly in node
- process source files with browserify to provide a single bundle which can then be included via script element in the browser
- use browserify transforms to make client side templating easier and more efficient (no need for ajax or fs.readFile in source)

Until modules become standard in the javascript language, tooling can provide the next best thing!

#### Javascript Native Module Support

The babel transpiler can give you this support now.
You can use it via browserify transform:
- https://github.com/babel/babelify
- http://babeljs.io/

If you want to use code from the huge `node / npm` ecosystem, then its likely you'd want to stick with commonjs. However, looking forward, js native module support will be standard in all browsers, so it will most likely be preferable at some point.  See the following for more:
https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20%26%20beyond/ch3.md

>##### Moving Forward
As of ES6, we no longer need to rely on the enclosing function and closure to provide us with module support. ES6 modules have first class syntactic and functional support.
Before we get into the specific syntax, it's important to understand some fairly significant conceptual differences with ES6 modules compared to how you may have dealt with modules in the past:

>- ES6 uses file-based modules, meaning one module per file. At this time, there is no standardized way of combining multiple modules into a single file.
That means that if you are going to load ES6 modules directly into a browser web application, you will be loading them individually, not as a large bundle in a single file as has been common in performance optimization efforts.
It's expected that the contemporaneous advent of HTTP/2 will significantly mitigate any such performance concerns, as it operates on a persistent socket connection and thus can very efficiently load many smaller files in parallel and interleaved with one another.

>- The API of an ES6 module is static. That is, you define statically what all the top-level exports are on your module's public API, and those cannot be amended later.
Some uses are accustomed to being able to provide dynamic API definitions, where methods can be added/removed/replaced in response to runtime conditions. Either these uses will have to change to fit with ES6 static APIs, or they will have to restrain the dynamic changes to properties/methods of a second-level object.

>- ES6 modules are singletons. That is, there's only one instance of the module, which maintains its state. Every time you import that module into another module, you get a reference to the one centralized instance. If you want to be able to produce multiple module instances, your module will need to provide some sort of factory to do it.

>- The properties and methods you expose on a module's public API are not just normal assignments of values or references. They are actual bindings (almost like pointers) to the identifiers in your inner module definition.
In pre-ES6 modules, if you put a property on your public API that holds a primitive value like a number or string, that property assignment was by value-copy, and any internal update of a corresponding variable would be separate and not affect the public copy on the API object.
With ES6, exporting a local private variable, even if it currently holds a primitive string/number/etc, exports a binding to the variable. If the module changes the variable's value, the external import binding now resolves to that new value.

>Importing a module is the same thing as statically requesting it to load (if it hasn't already). If you're in a browser, that implies a blocking load over the network. If you're on a server (i.e., Node.js), it's a blocking load from the filesystem.
However, don't panic about the performance implications. Because ES6 modules have static definitions, the import requirements can be statically scanned, and loads will happen preemptively, even before you've used the module.


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

- The `--debug` and `--verbose` options must be at the end of the watchify command; if not, bundle will not be completely built and failure is silent.

- Only one entry point need be specified; all other files reachable from this one via `require` will be found and included in the bundle.

- The transforms allow you to pre-process files. I'm using one to preprocess files which want to use client-side html templates. The transform turns `require ("template.someExtension")` into the instantiation of a javascript object with a `render` method which will render the template when called. If this were not done, then the template would need to be read from the file "template.someExtension" and then passed to the template engine as a string.
	+ _** important **_: if using browserify-hogan to render mustache templates, force to version 2 of the transform via `npm install browserify-hogan@^2`


## Further Reading

- Browserify handbook:
https://github.com/substack/browserify-handbook
- Articles about browserify, written by the community:
http://browserify.org/articles.html
- github page:
https://github.com/substack/node-browserify#browserify
- Babel : - http://babeljs.io/
- Excellent in-depth analysis of javascript, querks, strengths, and weaknesses explained
	+ You Don't Know Javascript: https://github.com/getify/You-Dont-Know-JS

_I can't say enough good things about the "You Don't Know Javascript" series of books_!! 


