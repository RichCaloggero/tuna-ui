var GraphicEqualizer = require ("./sources/graphicEqualizer");
var StereoSpread = require ("./sources/stereoSpread");
var TunaUi = require ("./sources/tunaUi");
var $ = require ("jquery");

var audioElement = $("#player")[0];
var audio = new AudioContext ();
var tuna = new Tuna (audio);

var source = audio.createMediaElementSource (audioElement);

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


spread.set ("mix", 0.4);
eq.set ("Q", 1.0);
reverb.set ("wetLevel", .4);
eq.set (1024, 30);
eq.set (2048, 30);
eq.set ("reset");

// connect graph
source.connect (eq);
eq.connect (reverb);
reverb.connect (spread);
spread.connect (audio.destination);

// source.connect (audio.destination);
audioElement.play ();

$("#source").on ("change", function (e) {
$(audioElement).attr ("src", $(e.target).val());
return false;
});

$(audioElement).on ("error", function (e) {
alert ("audio error - " + e.message);
});
