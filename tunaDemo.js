var TunaModel = require ("./sources/tunaModel");
var TunaUi = require ("./sources/tunaUi");
var $ = require ("jquery");

var audioElement = $("#player")[0];
var audio = new AudioContext ();
var tuna = new Tuna (audio);

var source = audio.createMediaElementSource (audioElement);
var reverb = new TunaModel (new tuna.Convolver({impulse: "impulse2b.wav"}));
ui = new TunaUi (reverb);
ui.render ($(".tuna"));
reverb.set ("wetLevel", .1);

source.connect (reverb.model);
reverb.model.connect (audio.destination);
source.connect (audio.destination);
audioElement.play ();

$("#source").on ("change", function (e) {
$(audioElement).attr ("src", $(e.target).val());
return false;
});

$(audioElement).on ("error", function (e) {
alert ("audio error - " + e.message);
});
