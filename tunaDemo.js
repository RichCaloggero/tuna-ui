var delta = 0.1;
var GraphicEqualizer = require ("./sources/graphicEqualizer");
var StereoSpread = require ("./sources/stereoSpread");
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


eq.set ("bypass", true);
spread.set ("bypass", true);
reverb.set ("bypass", true);

panner.set ("position", [0,0,-10]);
eq.set ("Q", 1.0);
reverb.set ("wetLevel", .3);

// keyboard control for position
$(".panner [data-name=position]").attr ("role", "application")
.on ("keydown", function (e) {
var key = e.key;

if (e.keyCode >= 35 && e.keyCode <= 40) {
console.log ("key:", e.key);

switch (key) {
case "ArrowUp": if (e.ctrlKey) increaseY (); else increaseZ ();
break;

case "ArrowDown": if (e.ctrlKey) decreaseY (); else decreaseZ ();
break;

case "ArrowLeft": decreaseX ();
break;

case "ArrowRight": increaseX ();
break;

case "Home": panner.set ("position", 0,0,0);
break;
} // switch

$(e.target).trigger ("change");
return false;
} // if

return true;

// -- X --
function increaseX () {
changePosition (panner, 0, 1, delta);
} // increaseX

function decreaseX () {
changePosition (panner, 0, -1, delta);
} // decreaseX

// -- y --
function increaseY () {
changePosition (panner, 1, 1, delta);
} // increaseY

function decreaseY () {
changePosition (panner, 1, -1, delta);
} // decreaseY

// -- Z --
function increaseZ () {
changePosition (panner, 2, 1, delta);
} // increaseZ

function decreaseZ () {
changePosition (panner, 2, -1, delta);
} // decreaseZ

function changePosition (node, coordinate, direction, delta) {
var p = node.getPosition ();
console.log (`changePosition: ${p} ${coordinate} ${Math.sign(direction)}`);
p[coordinate] += (Math.sign(direction)*delta);
console.log ("- to ", p);
node.set ("position", p);
} // changePosition
}); // arrow keys change position

// connect graph
source.connect (eq);
eq.connect (panner);
panner.connect (spread);
spread.connect (reverb);
reverb.connect (audio.destination);

// source.connect (audio.destination);
audioElement.play ();

$("#source").on ("change", function (e) {
$(audioElement).attr ("src", $(e.target).val());
return false;
});

$(audioElement).on ("error", function (e) {
alert ("audio error - " + e.message);
});
