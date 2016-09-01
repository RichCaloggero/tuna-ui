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

spread.set ("mix", 0.55);
spread.set ("delay", 0.00024);

panner.set ("position", [31.2,0,-24.3]);


// stop any panimations
$(audioElement).on ("ended", function () {if (path) path = clearInterval (path);});

// keyboard control for position
$(".panner [data-name=position]")
.attr ("role", "application")
.on ("keydown", function (e) {
var key = e.key;
var position = $(e.target).val().split(",").map ((x) => Number(x));

if (e.key.toLowerCase() === "c") {
if (e.shiftKey && path) path = clearInterval (path);
else if (! path) path = circle (100);

return false;
} // if circle

if (e.keyCode >= 35 && e.keyCode <= 40) {
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

$(e.target).val (position.map((x) => Math.round(100 * x)/100).join(","));
setTimeout (function () {
$(e.target).trigger ("change");
}, 50);

return false;
} // if

return true;

function circle () {
var x,y,z, r,a,deltaA;

a = 0;
r = 25;
deltaA = .02;
y = 0;

return setInterval (function () {
x = r * Math.cos(a);
z = r * Math.sin(a);
panner.position ("position", [x,y,z]);
a += deltaA;
if (a > Math.PI*2) a -= Math.PI*2;

}, 10);

} // circle

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
