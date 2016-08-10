module.exports = TunaModel;

function TunaModel (model) {

// public properties
this.model = model;

// public methods
this.set = set;


function set (name, value) {
model[name] = value;
if (this.onChange && this.onChange instanceof Function) this.onChange.call (this, name, value);
} // set

} // TunaModel

