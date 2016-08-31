var changeDelay = 0; // milliseconds
var template = require ("./tunaUi.mustache");
var $ = require ("jquery");
module.exports = TunaUi;

function isFunction (f) {
return f && (f instanceof Function);
} // isFunction

function hasChanged ($parameter, modelValue) {
var type = $parameter.attr("type") || "text";

switch (type) {
case "text": return $parameter.val().toString() !== modelValue.toString();

case "checkbox": return ($parameter.prop("checked") !== !!value);

case "range": return (Number($parameter.val()) !== Number(modelValue));

default: console.log ("unsupported type: ", type);
return false;
} // switch

console.error ("should never get here");
return false;
} // hasChanged

/* function to set a property:
- if its a function on the object, call it with name and value
- if the default property definition contains a function property, use its value instead
- otherwise, we assume its just a normal object property to which one can assign a value
*/

Tuna.Super.set = function (name, value) {
var parameters = this.defaults[name];
var setter = (
(isFunction (parameters.function) && parameters.function)
|| (isFunction (this[name]) && this[name])
);

/*var setter = (
(this.defaults[name] && this.defaults[name].function)
|| (this[name])
);
*/

//console.log ("setter: ", name, value, setter);

if (isFunction (setter)) {
//console.log ("- calling ", setter);

if (setter.call (this, name, value)) {

if (isFunction (this.onChange)) {
this.onChange.call (this, name, value);
//console.log ("- change callback fired...");
} // if onChange

return true;
} // if model changed

return false;
} // if setter is a function 

// now try name
if (this[name] !== value) {
this[name] = value;
//console.log ("- set property ", name, value);
if (isFunction (this.onChange)) this.onChange.call (this, name, value);
return true;
} // if changed

return false;
}; //             Tuna.Super.set


function TunaUi (model, title) {
var self = this;
var group = 0, groups = [];
var changeTimeout = null;

//console.log (title, Object.keys(model.defaults));

// add bypass if not present
if (! model.defaults.bypass) model.defaults.bypass = {
name: "bypass", controlType: "checkbox", type: "boolean",
function: model.bypass
};


var parameters = Object.keys(model.defaults).map (function (name) {
var parameter = model.defaults[name];
parameter.name = name;
parameter.group = parameter.group || 0;
if (! parameter.type) parameter.type = "string";

if (! parameter.controlType) {
if (parameter.type == "float" || !Number.isNaN(parameter.value)) {parameter.controlType = "range";}
else if (parameter.type === "boolean") {parameter.controlType = "checkbox";}
else if (parameter.type === "string") {parameter.controlType = "text";}
} // if

if (parameter.type === "float" && parameter.controlType === "range") parameter.step = parameter.step || .1;
//console.log (`- parameter ${parameter.name} in group ${parameter.group}`);
return parameter;
});

parameters.forEach ((p) => {
var g = p.group;
if (! groups[g]) groups[g] = {parameters: []};
groups[g].parameters.push (p);
});

groups[group].parameters.sort ((a,b) => compareStrings(a.name, b.name));



self.render = function ($target) {
$target.empty ();
if (! $target.attr("role")) $target.attr ("role", "region");
if (title && !$target.attr("aria-label") && !$target.attr("aria-labelledby")) $target.attr ("aria-label", title);

$target.html (template.render({
groups: groups.filter((x) => typeof(x) !== "undefined")
}));
//console.log (`rendered ${title}, ${parameters.length} parameters in ${groups.length} groups`);

// add event handlers
$target.on ("keydown", "[type=range]", function (e) {
var key = e.keyCode;

if (e.key === "0" || (key >= 35 && key <= 40)) {
if (e.key === "0") $(e.target).val (0);

setTimeout (function () {
$(e.target).trigger ("change");
//alert ("triggering change...");
}, 80);
return true;
} // if
return true;

}).on ("click", "button, [type=button]", function (e) {
var name = $(e.target).attr ("data-name");
//console.log ("click button: ", name);
model.set (name, undefined);
return false;

}).on ("click", "[type=checkbox]", function (e) {
var name = $(e.target).attr ("data-name");
//console.log ("click checkbox: ", name);
model.set (name, e.target.checked);
return true;

}).on ("change", "[type=range]", function (e) {
var $parameter = $(e.target);
var name = $parameter.attr ("data-name");
var value = Number($parameter.val());

//console.log ("requested numeric value change: ", name, value);
model.set (name, value);
return false;

}).on ("change", "[type=text]", function (e) {
var $parameter = $(e.target);
var name = $(e.target).attr ("data-name");
var value = processUiStringValue (name, $parameter.val());

//console.log ("requested text value change: ", name, value);
model.set (name, value);
return false;

}); // events

// register callback for changes to model
model.onChange = function (name, value) {
var $parameter = $target.find (`[data-name=${name}]`);
var type = ($parameter.attr("type"))? $parameter.attr("type") : "text";

//if (changeTimeout) {
//clearTimeout (changeTimeout);
//changeTimeout = null;
//} // if

//changeTimeout = setTimeout (function () {
console.log ("responding to model change: ", name, value, type, $parameter.val());

if (type === "text" && $parameter.val() !== value.toString()) {
$parameter.val(value.toString());
console.log ("set string UI parameter", name, value);
return true;
} // if

if (type === "checkbox" && $parameter.prop("checked") !== !!value) {
$parameter.prop ("checked", !!value);
console.log ("set checkbox ", name, !!value);
return true;
} // if

if (type === "range"  && Number($parameter.val()) !== Number(value)) {
$parameter.val (Number(value));
console.log ("set numeric ui parameter ", name, value);
return true;
} // if

return false;
//}, changeDelay);

return value;
}; // onChange

return $target;


function processUiStringValue (name, value) {
if (! name) throw new Error("getUiValue: name is null");
var parameter = parameters.find ((x) => x.name && x.name === name);
var type = (parameter)? parameter.type : "string";
//console.log (`getUiValue: ${name} ${type}`);

return maybeGetArray (value, type);
} // getUiValue

function maybeGetArray (value, type) {
value = value.trim();
if (value.slice(0,1) === "[" && value.slice(-1,1) === "]") value = value.slice(1, -2);
if (value.indexOf(",") >= 0) value = value.split(",");
else if (value.indexOf(" ") >= 0) value = value.split(" ");

if (value instanceof Array) {
value = value.map ((x) => x.trim());

if (type === "float") value = value.map ((x) => Number(x));
} // if array

return value;
} // maybeGetArray

}; // self.render

function compareStrings (s1, s2) {
s1 = s1.toLowerCase();
s2 = s2.toLowerCase();
if (s1>s2) return 1;
if (s1<s2) return -1;
return 0;
} // compareStrings


} // TunaUi
