var delta = 0.1;
var GraphicEqualizer = require ("./sources/graphicEqualizer");
var StereoSpread = require ("./sources/stereoSpread-delay");
var Panner = require ("./sources/panner");
var TunaUi = require ("./sources/tunaUi");
var $ = require ("jquery");


var audioElement = $("#player")[0];
var audio = new AudioContext ();
var tuna = new Tuna (audio);

var source = audio.createMediaElementSource (audioElement);

var monoMix = audio.createGain();
var splitter = audio.createChannelSplitter ();
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
eq.set ("Q", 2.0);
reverb.set ("wetLevel", .3);

// keyboard control for position
$(".panner [data-name=position]")
.attr ("role", "application")
.on ("keydown", function (e) {
var key = e.key;
var position = $(e.target).val().split(",").map ((x) => Number(x));

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

// -- X --
function increaseX (p) {
p[0] += delta;
return p;
} // increaseX

function decreaseX (p) {
p[0] -= delta;
return p;
} // decreaseX

// -- y --
function increaseY () {
p[1] += delta;
return p;
} // increaseY

function decreaseY () {
p[1] -= delta;
return p;
} // decreaseY

// -- Z --
function increaseZ () {
p[2] += delta;
return p;
} // increaseZ

function decreaseZ () {
p[2] -= delta;
return p;
} // decreaseZ

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
