var template = require ("./tunaUi.mustache");
var $ = require ("jquery");
module.exports = TunaUi;

/* function to set a property:
- if its a function on the object, call it with name and value
- if the default property definition contains a function property, use its value instead
- otherwise, we assume its just a normal object property to which one can assign a value
*/

Tuna.Super.set = function (name, value) {
var setter = (this.defaults[name] && this.defaults[name].function)
|| (this[name]);
console.log ("setter: ", name, value, setter);
if (setter && setter instanceof Function) {
console.log ("- calling ", setter);
if (setter.call (this, name, value)) {
if (this.onChange && this.onChange instanceof Function) this.onChange.call (this, name, value);
console.log ("- change callback fired...");
} // if changed
return;
} // if

if (this[name] !== value) {
this[name] = value;
console.log ("- set property ", name, value);
if (this.onChange && this.onChange instanceof Function) this.onChange.call (this, name, value);
} // if changed
}; //             function


function TunaUi (model, title) {
var self = this;
var group = 0, groups = [];

console.log (title, Object.keys(model.defaults));

// add bypass if not present
if (! model.defaults.bypass) model.defaults.bypass = {
name: "bypass", controlType: "checkbox", type: "boolean",
function: model.bypass
};


var parameters = Object.keys(model.defaults).map (function (name) {
var parameter = model.defaults[name];
parameter.name = name;
parameter.group = parameter.group || 0;
if (parameter.type === "float") parameter.step = parameter.step || .1;
if (! parameter.type) parameter.type = "string";
if (! parameter.controlType) {
if (parameter.type == "float" || !Number.isNaN(parameter.value)) {parameter.controlType = "range";}
else if (parameter.type === "boolean") {parameter.controlType = "checkbox";}
else if (parameter.type === "string") {parameter.controlType = "text";}
} // if
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
console.log (`rendered ${title}, ${parameters.length} parameters in ${groups.length} groups`);

// add event handlers
$target.on ("keydown", "[type=range]", function (e) {
var key = e.keyCode;

if (e.key === "0" || (key >= 35 && key <= 40)) {
if (e.key == "0") $(e.target).val (0);

setTimeout (function () {
$(e.target).trigger ("change");
//alert ("triggering change...");
}, 50);
return false;
} // if
return true;

}).on ("keydown", "[type=text][data-type=float]", function (e) {
var key = e.keyCode;

/*if (e.key === "0"
 //|| (key >= 35 && key <= 40)
) {
if (e.key == "0") $(e.target).val ("[0,0,0]");

switch (key) {

} // switch key

setTimeout (function () {
$(e.target).trigger ("change");
//alert ("triggering change...");
}, 50);
return false;
} // if
*/

return true;

}).on ("click", "button, [type=button]", function (e) {
var name = $(e.target).attr ("data-name");
console.log ("click button: ", name);
model.set (name, undefined);
return true;

}).on ("click", "[type=checkbox]", function (e) {
var name = $(e.target).attr ("data-name");
console.log ("click checkbox: ", name);
model.set (name, e.target.checked);
return true;

}).on ("change", "[type=range][data-name]", function (e) {
var $parameter = $(e.target);
var name = $(e.target).attr ("data-name");
var value = Number($parameter.val());

console.log ("requested numberic value change: ", name, value);
model.set (name, value);
return true;

}).on ("change", "[type=text][data-name]", function (e) {
var $parameter = $(e.target);
var name = $(e.target).attr ("data-name");
var value = getUiValue (name, $parameter.val());

console.log ("requested text value change: ", name, value);
model.set (name, value);
return true;

}); // events

// register callback for changes to model
model.onChange = function (name, value) {
console.log ("responding to model change: ", name, value);
var $parameter = $target.find (`[data-name=${name}]`);

if ($parameter.attr("type") === "checkbox") {
if ($parameter.prop("checked") !== !!value) {
$parameter.prop ("checked", !!value);
console.log ("set checkbox ", name, !!value);
} // if

} else {
if (Number($parameter.val()) !== value) {
$parameter.val (value);
//$parameter.trigger ("change");
console.log ("set ui parameter ", name, value);
} // if
} // if

return value;
}; // change

return $target;


function getUiValue (name, value) {
var parameter = parameters.find ((x) => x.name && x.name === name);
var type = (parameter)? parameter.type : "string";
console.log (`getUiValue: ${name} ${type}`);

value = value.trim();

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
