Tuna.prototype.StereoSpread = function StereoSpread (properties) {
var self = this;
var mix, frequency, Q;
var invertLeft, invertRight, fLeft, fRight, passThrough, split, merge;
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

// add properties to defaults for UI generator


// public methods
this.mix = setMix.bind(this);
this.frequency = setFrequency.bind(this);
this.Q = setQ.bind(this);

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

function setFrequency (name, value) {
if (value === frequency) return false;
frequency = value;
fLeft.frequency.value = fRight.frequency.value = frequency;
console.log (`setFrequency: ${fLeft.frequency.value} ${fRight.frequency.value}`);
return true;
} // setFrequency

function setQ (name, value) {
if (value === Q) return false;
Q = value;
fLeft.Q.value = fRight.Q.value = Q;
console.log (`setQ: ${fLeft.Q.value} ${fRight.Q.value}`);
return true;
} // setQ

function init () {
invertLeft = audio.createGain(-1.0);
invertRight = audio.createGain (-1.0);
passThrough = audio.createGain (0.6);

// create nodes
fLeft = audio.createBiquadFilter();
fRight = audio.createBiquadFilter();
fLeft.type = fRight.type = "allpass";

split = audio.createChannelSplitter (2);
merge = audio.createChannelMerger (2);

// effect path
this.inputGain.connect (split);

split.connect (invertLeft, 0);
invertLeft.connect (fLeft).connect (merge, 0,1);

split.connect (invertRight, 1);
invertRight.connect (fRight).connect (merge, 0,0);

merge.connect (this.outputGain);

// dry (passThrough) path
this.inputGain.connect(passThrough).connect (this.outputGain);


// set default parameters
setMix ("mix", 0.4);
setFrequency ("frequency", 1000.0);
setQ ("Q", 1.0);

function randomFloat (min, max) {
return (Math.random() * (max - min)) + min;
} // randomFloat

function randomInt (min, max) {
return Math.floor(Math.random() * (max - min) + min) + min;
} // randomInt
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

Q: {
controlType: "range",
value: 1.83,
min: 0.1,
max: 20.0,
step: 0.1,
automatable: true,
type: "float"
}, // Q defaults

frequency: {
controlType: "range",
value: 1000.0,
min: 20.0,
max: 20000.0,
step: 100.0,
automatable: true,
type: "float"
}, // frequency defaults

} // defaults.value
}, // defaults

// actual instance properties

}); // StereoSpread.prototype
