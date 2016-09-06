"use strict";
// crosstalk cancelation using delay lines

Tuna.prototype.StereoSpread = function StereoSpread (properties) {
var self = this;
var mix, delay;
var invertLeft, invertRight, dLeft, dRight, passThrough, split, merge;
if (!properties) {
properties = this.getDefaults();
}

var audio = Tuna.Super.context;
this.input = audio.createGain ();
this.output = audio.createGain ();
this.activateNode = this.inputGain = audio.createGain();
this.outputGain = audio.createGain ();
this.bypass = properties.bypass || false;

this.input.connect (this.inputGain);
this.outputGain.connect (this.output);



// public methods
this.mix = setMix.bind(this);
this.delay = setDelay.bind(this);

init.call (this);
console.log ("stereoSpread initialized");

// private methods

function setMix (name, value) {
if (mix === value) return false;

mix = value;
invertLeft.gain.value = invertRight.gain.value = -1*mix;
self.outputGain.gain.value = 1 + 0.5*mix;
console.log (`setMix: ${mix} ${self.outputGain.gain.value} ${passThrough.gain.value} ${invertLeft.gain.value} ${invertRight.gain.value}`);
passThrough.gain.value = 1 + 0.5*mix;
console.log (`setMix: ${mix} ${passThrough.gain.value} ${invertLeft.gain.value} ${invertRight.gain.value}`);
return true;
} // setMix

function setDelay (name, value) {
if (value === delay) return false;
delay = value;
dLeft.delayTime.value = dRight.delayTime.value = delay;
console.log (`setDelay: ${dLeft.delayTime.value}`);
return true;
} // setDelay


function init () {
invertLeft = audio.createGain(-1.0);
invertRight = audio.createGain (-1.0);
passThrough = audio.createGain (0.6);

// create nodes
dLeft = audio.createDelay();
dRight = audio.createDelay();

split = audio.createChannelSplitter (2);
merge = audio.createChannelMerger (2);

// effect path
this.inputGain.connect (split);

split.connect (invertLeft, 0);
invertLeft.connect (dLeft).connect (merge, 0,1);

split.connect (invertRight, 1);
invertRight.connect (dRight).connect (merge, 0,0);

merge.connect (this.outputGain);

// dry (passThrough) path
this.inputGain.connect(passThrough).connect (this.outputGain);


// set default parameters
setMix ("mix", 0.4);
setDelay("delay", 0.000066); // seconds

} // init

}; // StereoSpread constructor

Tuna.prototype.StereoSpread.prototype = Object.create(Tuna.Super, {
name: {value: "StereoSpread"},
defaults: {
writable: true,
value: {
bypass: {
controlType: "checkbox",
automatable: true,
function: this.bypass,
type: "boolean"
}, // bypass

mix: {
controlType: "range",
value: 0.5,
min: 0.0,
max: 1.0,
step: 0.05,
automatable: true,
type: "float"
}, // mix defaults

delay: {
controlType: "range",
value: 0.001,
min: 0.000010,
max: 1.0,
step: 0.000010,
automatable: true,
type: "float"
}, // delay defaults

} // defaults.value
}, // defaults

// actual instance properties

}); // StereoSpread.prototype
