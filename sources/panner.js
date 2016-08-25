var epselon = 2 * Number.EPSILON;

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
if (distance (position,  value) < epselon) return false;

position = value;
panner.setPosition.apply (this, position);
console.log (`setPosition: ${position}`);
return true;
} // setPosition


function init () {
panner = audio.createPanner ();
panner.panningModel = "HRTF";
listener = audio.listener;
listener.setPosition (0, epselon, 0);
this.inputGain.connect (panner);
panner.connect (this.outputGain);
setPosition ("position", [0,22,-10]);

} // init

function distance (p1, p2) {
return Math.sqrt (
Math.pow (p2[0]-p1[0], 2)
+ Math.pow (p2[1]-p1[1], 2)
+ Math.pow (p2[2]-p1[2], 2)
);
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
