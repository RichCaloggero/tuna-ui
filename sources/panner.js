var epsilon = Number.EPSILON;
var pannerOptions = {
panningModel: "HRTF",
distanceModel: "linear",
refDistance: 10,
maxDistance: 100,
rolloffFactor: .1
}; // pannerOptions

Tuna.prototype.Panner = function Panner () {
var panner, listener, position = [0,0,0];
var audio = Tuna.Super.context;
this.input = audio.createGain ();
this.output = audio.createGain ();
this.activateNode = audio.createGain();
this.inputGain = audio.createGain();
this.outputGain = audio.createGain ();

this.input.connect (this.activateNode);
this.activateNode.connect (this.inputGain);
this.outputGain.connect (this.output);



// public methods
this.position = setPosition.bind (this);
this.getPosition = getPosition.bind (this);

init.bind (this)();
console.log ("Panner initialized");


// private methods

function getPosition () {return position;}

function setPosition (name, value) {
console.log ("setting position ", value, position, distance(position,value));
if (distance (position,  value) < epsilon) return false;

position = value;
panner.setPosition.apply (panner, position);
console.log (`setPosition: ${position}`);
return true;
} // setPosition


function init () {
panner = audio.createPanner ();
for (var option in pannerOptions) {
panner[option] = pannerOptions[option];
} // for
listener = audio.listener;
listener.setPosition (0, epsilon, 0);
listener.setOrientation (0,0,1, 0,1,0);
this.inputGain.connect (panner);
panner.connect (this.outputGain);
setPosition ("position", [0,0,0]);

} // init

function distance (p1, p2) {
var dx = p2[0]-p1[0];
var dy = p2[1]-p1[1];
var dz = p2[2]-p1[2];

return Math.sqrt (dx*dx + dy*dy + dz*dz);
} // distance

function randomFloat (min, max) {
return (Math.random() * (max - min)) + min;
} // randomFloat

function randomInt (min, max) {
return Math.floor(Math.random() * (max - min) + min) + min;
} // randomInt

} // Panner

Tuna.prototype.Panner.prototype = Object.create(Tuna.Super, {
name: {value: "Panner"},
defaults: {
writable: true,
value: {
bypass: {
controlType: "checkbox",
automatable: true,
function: this.bypass,
type: "boolean"
}, // bypass

position: {
controlType: "text",
value: [0,0,0],
automatable: true,
type: "float"
}, // position defaults
} // defaults.value
}, // defaults

// actual instance properties

}); // Panner.prototype
