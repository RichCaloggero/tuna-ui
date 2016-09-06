"use strict";
var delta = 0.1;
var path = null;
var GraphicEqualizer = require ("./sources/graphicEqualizer");
var StereoSpread = require ("./sources/stereoSpread-delay");
var Panner = require ("./sources/panner");
var TunaUi = require ("./sources/tunaUi");
var $ = require ("jquery");


var audioElement = $("#player")[0];
var audio = new AudioContext ();
var tuna = new Tuna (audio);

var source = audio.createMediaElementSource (audioElement);

var panner = new tuna.Panner ();
var pannerUi = new TunaUi (panner, "3d Panner");
pannerUi.render ( $(".panner") );

var spread = new tuna.StereoSpread ();
var spreadUi = new TunaUi (spread, "Stereo Spread");
spreadUi.render ( $(".spread") );

var eq = new tuna.GraphicEqualizer ();
var eqUi = new TunaUi (eq, "Equalizer");
eqUi.render ( $(".eq") );

var reverb = new tuna.Convolver({impulse: "impulse2b.wav", bypass: false});
// hack to fix grouping
reverb.defaults.lowCut.group = reverb.defaults.highCut.group = 0;
reverb.defaults.dryLevel.group = reverb.defaults.wetLevel.group = 1;
reverb.defaults.level.group = 2;
var reverbUi = new TunaUi (reverb, "Reverb");
reverbUi.render ( $(".reverb") );

// set parameters
eq.set ("bypass", true);
eq.set ("Q", 1.8);

reverb.set ("bypass", true);
reverb.set ("wetLevel", .3);

spread.set ("bypass", true);
spread.set ("mix", 0.55);
spread.set ("delay", 0.00024);

panner.set ("position", [31.2,0,-24.3]);


// stop any panimations
$(audioElement).on ("ended", function () {if (path) path = clearInterval (path);});

// keyboard control for position
$(".panner [data-name=position]")
.attr ("role", "application")
.on ("keydown", function (e) {
var key = e.key.toLowerCase();
var commands = {
delete: function () {if (path) path = clearInterval(path);},

c: circle,
s: sphere,
y: cylinder
}; // commands

var value;

if (e.ctrlKey && key in commands) {
value = $(e.target).val().split(",");
if (value.length === 3 && value.indexOf(":") === -1) value = value.map ((x) => Number(x));
else value = new Function ("return {" + value.join(',') + "};") ();

console.log ("value: ", value);
console.log ("command: ", e.key, e.ctrlKey);

if (value instanceof Array) panner.position ("position", value);
else path = commands[key] (value);
return false;
} // if

/*if (e.key.toLowerCase() === "c") {
if (e.shiftKey && path) path = clearInterval (path);
else if (! path) path = circle (100);

return false;
} // if circle

if (e.key.toLowerCase() === "y") {
if (e.shiftKey && path) path = clearInterval (path);
else if (! path) path = cylinder (100, 50);

return false;
} // if cylinder

if (e.key.toLowerCase() === "s") {
if (e.shiftKey && path) path = clearInterval (path);
else if (! path) path = sphere (100);

return false;
} // if sphere
*/

/*if (e.keyCode >= 35 && e.keyCode <= 40) {
console.log ("change position:", e.key, position);

switch (key) {
case "ArrowUp":
if (e.ctrlKey) position[1] += delta;
else position[2] += delta;
break;

case "ArrowDown":
if (e.ctrlKey) position[1] -= delta;
else position[2] -= delta;
break;

case "ArrowRight":
position[0] += delta;
break;

case "ArrowLeft":
position[0] -= delta;
break;

case "Home": panner.set ("position", 0,0,0);
break;
} // switch

$(e.target).val (position.map((x) => round(x,2)).join(","));
setTimeout (function () {
$(e.target).trigger ("change");
}, 50);

return false;
} // if
*/

return true;

function circle (options) {
var x,y,z, r,a,deltaA;

a = 0;
r = options.r || 25;
deltaA = options.deltaA || .02;
y = options.y || 0;

return setInterval (function () {
x = r * Math.cos(a);
z = r * Math.sin(a);
panner.position ("position", [x,y,z]);
a += deltaA;
if (a > Math.PI*2) a -= Math.PI*2;

}, options.t || 10);

} // circle

function cylinder (options) {
var x,y,z, r,h, a,deltaA;
var twoPi = 2 * Math.PI;
var pointCount = 0;
console.log ("initializing cylinder");

r = options.r || 33.33;
h = options.h || 50;
a = 0;
deltaA = options.deltaA || .02;
y = -h/2;

return setInterval (function () {
x = r * Math.cos(a);
z = r * Math.sin(a);
//debug(`- cylinder: ${round (2, deltaA, a, x,y,z)}`);

panner.position ("position", [x,y,z]);


// update
a += deltaA;
if (a > twoPi) {
a -= twoPi;
y += delta;
if (y > h/2) y = -h/2;
} // if
}, options.t || 10);

} // cylinder

function sphere (options) {
var x,y,z, r,r0, a,a0,deltaA;
var twoPi = 2 * Math.PI;
console.log ("initializing cylinder");

r = options.r || 33.33;
deltaA = options.deltaA || .02;
a = deltaA;
y = -r;
r0 = r * Math.sin (a);

return setInterval (function () {
x = r0 * Math.cos(a);
z = r0 * Math.sin(a);

panner.position ("position", [x,y,z]);

// update
a += deltaA;
if (a > twoPi) {
a -= twoPi;
y = r * Math.sin(a);
if (y > r) y = -r;
} // if
}, options.t || 10);

} // sphere


}); // arrow keys change position

// connect graph
source.connect (eq)
.connect (panner)
.connect (spread)
.connect (reverb)
.connect (audio.destination);
/*source.connect (eq);
eq.connect (panner);
panner.connect (spread);
spread.connect (reverb);
reverb.connect (audio.destination);
*/

// source.connect (audio.destination);
audioElement.play ();

$("#source").on ("change", function (e) {
$(audioElement).attr ("src", $(e.target).val());
return false;
});

$(audioElement).on ("error", function (e) {
alert ("audio error - " + e.message);
});

/// utilities

function round (n) {
var results = [];
for (var i=1; i<arguments.length; i++) results.push (_round(arguments[i], n));
return results;
} // round

function _round (x,n) {
var m = Math.pow(10,n);
return Math.round(x*m) / m;
} // round

