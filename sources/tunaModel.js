module.exports = TunaModel;

function TunaModel (model) {

// public properties
this.model = model;

// public methods
this.set = set;


function set (name, value) {
if (model[name] !== value) {
model[name] = value;
console.log ("tunaModel.set: ", name, value);
if (this.onChange && this.onChange instanceof Function) this.onChange.call (this, name, value);
} // if changed
} // set

function isNumeric (n) {
return !Number.isNaN(n);
} // isNumeric

} // TunaModel

