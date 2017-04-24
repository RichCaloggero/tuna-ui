Tuna.prototype.parametricEqualizer = function parametricEqualizer (properties) {
if (!properties) {
properties = this.getDefaults();
}

var userContext = Tuna.Super.context;
var parameters = {
type: "peaking",
active: false,
frequency: 1000.0,
Q: 1.0,
gain: 0.0
}; // band
var controlTypeMap = {
number: "range",
boolean: "checkbox",
string: "list"
};
var ranges = {
frequency: [20.0, 20000.0],
gain: [0.0, 30.0],
Q: [.01, 16.0]
}; // ranges

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
bands.forEach (function (band, index) {
this.defaults[band.name] = {
controlType: controlTypeMap[band.type],
value: 0.0,
min: properties.bandMinGain || -30.0,
max: properties.bandMaxGain || 30.0,
step: 1.0,
orientation: "vertical", // not currently used
orient: 'orient="vertical"', // for firefox
function: setBand.bind(this),
group: i+1,
type: "float"
};
}, this);

console.log ("parametricEqualizer initialized with ", bands.length, " bands");

// public methods

this.reset = reset.bind(this);
this.Q = setQ.bind(this);

// private methods

function reset () {
for (var band of bands) this.set(band.frequency, 0);
return true;
} // reset

function setQ (name, value) {
console.log ("parametricEqualizer: setting Q to ", value);
for (var band of bands) band.filter.Q.value = value;
return true;
} // setQ

function setBand (name, value) {
console.log ("parametricEqualizer: request to set band ", name, " to ", value);
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
var bandCount = properties.bandCount || 4;
this.outputGain.gain.value = 1/bandCount;
console.log ("outputGain: ", this.output.gain.value);

if (! bands || bands.length === 0) {
bands = [];
for (var i=0; i<bandCount; i++) {
bands.push ({
name: `band ${i+1}`,
type: "peaking",
active: false,
frequency: 1000.0,
Q: 1.0,
gain: 0.0
}); // band
} // for
} // if

bands.forEach (function (band) {
var filter = userContext.createBiquadFilter ();
filter.type = band.type;
filter.Q.value = band.Q;
filter.frequency.value = band.frequency;
if (band.type === "lowshelf" || band.type === "highshelf" || band.type === "peaking")
filter.gain.value = band.gain;
this.inputGain.connect (filter);
filter.connect (this.outputGain);
band.filter = filter;
}, this); // map over bands

return bands;
} // init

}; // GraphicEqualizer constructor

Tuna.prototype.GraphicEqualizer.prototype = Object.create(Tuna.Super, {
name: {value: "parametricEqualizer"},
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
} // bypass

band1type: {
group: 1,
controlType: "list",
type: "string",
values: ["allpass", "lowshelf", "highshelf", "lowpass", "highpass", "bandpass", "notch", "peaking"]
},

band1frequency: {
group: 1,
controlType: range,
type: "float",
automatable: true,
min: 20.0, max: 20000.0, step: 10.0
},

band1gain: {
group: 1,
controlType: range,
type: "float",
automatable: true,
min: -30.0, max: 30.0, step: 10.0
},

band1Q: {
group: 1,
controlType: range,
type: "float",
automatable: true,
min: 0.01, max: 16.0, step: 0.1
},


} // defaults.value
}, // defaults

// actual instance properties

}); // GraphicEqualizer.prototype
