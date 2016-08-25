console.log ("start...");
var GraphicEqualizer = require ("./sources/graphicEqualizer");
var StereoSpread = require ("./sources/stereoSpread");
var Panner = require ("./sources/panner");
var TunaUi = require ("./sources/tunaUi");
var $ = require ("jquery");
console.log ("modules loaded");



var audioElement = $("#player")[0];
var audio = new AudioContext ();
var tuna = new Tuna (audio);

var source = audio.createMediaElementSource (audioElement);
console.log ("audio context created", audio);

var panner = new tuna.Panner ();
console.log ("Panner node created");
var pannerUi = new TunaUi (panner, "3d Panner");
console.log ("PannerUi created");
pannerUi.render ( $(".panner") );
console.log ("PannerUi rendered");
console.log ("Panner created");


var spread = new tuna.StereoSpread ();
var spreadUi = new TunaUi (spread, "Stereo Spread");
spreadUi.render ( $(".spread") );
console.log ("spread created");

var eq = new tuna.GraphicEqualizer ();
var eqUi = new TunaUi (eq, "Equalizer");
eqUi.render ( $(".eq") );
console.log ("EQ created");

var reverb = new tuna.Convolver({impulse: "impulse2b.wav", bypass: false});

// hack to fix grouping
reverb.defaults.lowCut.group = reverb.defaults.highCut.group = 0;
reverb.defaults.dryLevel.group = reverb.defaults.wetLevel.group = 1;
reverb.defaults.level.group = 2;

var reverbUi = new TunaUi (reverb, "Reverb");
reverbUi.render ( $(".reverb") );
console.log ("reverb created");


spread.set ("mix", 0.4);
spread.set ("bypass", true);
eq.set ("Q", 1.0);
reverb.set ("wetLevel", .3);
eq.set (1024, 30);
eq.set (2048, 30);
eq.set ("reset");

// connect graph
source.connect (eq)
.connect (panner)
.connect (spread)
.connect (reverb)
.connect (audio.destination);

// source.connect (audio.destination);
audioElement.play ();

$("#source").on ("change", function (e) {
$(audioElement).attr ("src", $(e.target).val());
return false;
});

$(audioElement).on ("error", function (e) {
alert ("audio error - " + e.message);
});
