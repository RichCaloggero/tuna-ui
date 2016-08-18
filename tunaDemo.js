var GraphicEqualizer = require ("./sources/graphicEqualizer");
var TunaUi = require ("./sources/tunaUi");
var $ = require ("jquery");

var audioElement = $("#player")[0];
var audio = new AudioContext ();
var tuna = new Tuna (audio);

var source = audio.createMediaElementSource (audioElement);

var reverb = new tuna.Convolver({impulse: "impulse2b.wav"});
var reverbUi = new TunaUi (reverb, "Reverb");

var eq = new tuna.GraphicEqualizer ();
var eqUi = new TunaUi (eq, "Equalizer");


reverbUi.render ( $(".reverb") );
eqUi.render ( $(".eq") );

reverb.set ("wetLevel", .4);
eq.set (1024, 30);
eq.set (2048, 30);
eq.set ("reset");

source.connect (eq);
eq.connect (reverb);
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
