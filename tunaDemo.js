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


/*panner.set ("bypass", true);
spread.set ("mix", 0.4);
spread.set ("bypass", true);

eq.set ("Q", 1.0);
eq.set (1024, 30);
eq.set (2048, 30);
eq.set ("bypass", true);

reverb.set ("wetLevel", .3);
reverb.set ("bypass", true);
*/

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
