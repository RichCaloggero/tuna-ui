Tuna.prototype.GraphicEqualizer = function GraphicEqualizer (properties) {
if (!properties) {
properties = this.getDefaults();
}

var userContext = Tuna.Super.context;
this.input = userContext.createGain ();
this.output = userContext.createGain ();
this.activateNode = this.inputGain = userContext.createGain();
this.outputGain = userContext.createGain ();
this.bypass = properties.bypass || false;

var bands = [];

bands = init.call (this);
this.input.connect (this.inputGain);
this.outputGain.connect (this.output);

// add properties to defaults for UI generator
bands.forEach (function (band) {
// the name of each band is its frequency (exposed as a numeric property)
this.defaults[band.frequency] = {
controlType: "range",
value: 0.0,
min: properties.bandMinGain || -30.0,
max: properties.bandMaxGain || 30.0,
step: 1.0,
orientation: 'orient="vertical"',
function: setBand.bind(this),
group: 1,
type: "float"
};
}, this);

console.log ("GraphicEqualizer initialized with ", bands.length, " bands");

// public methods

this.reset = reset;

// private methods

function reset () {
for (var band of bands) this.set(band.frequency, 0);
} // reset

function setBand (name, value) {
console.log ("want to set band ", name, " to ", value);
var band = bands.find (function (band) {return band.frequency === Number(name);});
if (! band) throw new Error (`invalid band: ${name}`);

if (band.gain !== value) {
console.log (`setting band ${name} to ${value}`);
band.gain = value;
band.filter.gain.value = value;
return true;
} // if

return false;
} // setBand

function init () {
var frequency = properties.minFrequency || 32;
var bandCount = properties.bandCount || 10;
this.Q = properties.Q || 1.0;
this.outputGain.gain.value = 1/bandCount;
console.log ("outputGain: ", this.output.gain.value);

if (! bands || bands.length === 0) {
bands = [];
for (var i=0; i<bandCount; i++) {
bands.push ({
frequency: frequency,
gain: 0.0
}); // band
frequency *= 2;
} // for
} // if

bands.forEach (function (band) {
var filter = userContext.createBiquadFilter ();
filter.type = "peaking";
filter.Q.value = this.Q;
filter.frequency.value = band.frequency;
filter.gain.value = band.gain;
this.inputGain.connect (filter);
filter.connect (this.outputGain);
band.filter = filter;
}, this); // map over bands

return bands;
} // init

}; // GraphicEqualizer constructor

Tuna.prototype.GraphicEqualizer.prototype = Object.create(Tuna.Super, {
name: {value: "GraphicEqualizer"},
defaults: {
writable: true,
value: {
reset: {
controlType: "button",
automatable: true,
function: this.reset,
}, // reset

bypass: {
controlType: "checkbox",
automatable: true,
function: this.bypass,
type: "boolean"
}, // bypass

q: {
controlType: "range",
value: 1.83,
min: 0.001,
max: 20.0,
step: 0.1,
automatable: true,
type: "float"
}, // Q defaults
} // defaults.value
}, // defaults

// actual instance properties

}); // GraphicEqualizer.prototype
