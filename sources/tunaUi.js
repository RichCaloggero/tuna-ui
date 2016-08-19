var template = require ("./tunaUi.mustache");
var $ = require ("jquery");
module.exports = TunaUi;

Tuna.Super.set = function (name, value) {
var setter = (this.defaults[name] && this.defaults[name].function)
|| (this[name]);
console.log ("setter: ", name, setter);
if (setter && setter instanceof Function) {
if (setter.call (this, name, value)) {
if (this.onChange && this.onChange instanceof Function) this.onChange.call (this, name, value);
} // if changed
return;
} // if

if (this[name] !== value) {
this[name] = value;
console.log ("tunaModel.set: ", name, value);
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
parameter.step = parameter.step || .1;
if (! parameter.controlType) {
if (! parameter.type) {parameter.controlType = "text";}
else if (parameter.type == "float" || !Number.isNaN(parameter.value)) {parameter.controlType = "range"}
else if (parameter.type === "boolean") {parameter.controlType = "checkbox"}
} // if
//console.log (`- parameter ${parameter.name} in group ${parameter.group}`);
return parameter;
});
console.log (`${parameters.length} parameters found`);

parameters.forEach ((p) => {
var g = p.group;
if (! groups[g]) groups[g] = {parameters: []};
groups[g].parameters.push (p);
});
console.log (`${parameters.length} parameters in ${groups.length} groups`);

groups[group].parameters.sort ((a,b) => compareStrings(a.name, b.name));
console.log ("- sorted by name...");


console.log (`done, groups =
//${JSON.stringify(groups)}
//${groups.map((p) => p.name)}
`);


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
} // if
return true;

}).on ("click", "button, [type=button]", function (e) {
var name = $(e.target).attr ("data-name");
console.log ("click: ", name);
model.set (name, undefined);
return true;

}).on ("click", "[type=checkbox]", function (e) {
var name = $(e.target).attr ("data-name");
console.log ("click checkbox: ", name);
model.set (name, e.target.checked);
return true;

}).on ("change", "[type=range][data-name]", function (e) {
var name = $(e.target).attr ("data-name");
var value = Number($(e.target).val());
console.log ("requested change: ", name, value);
model.set (name, value);
return true;

/*}).on ("change", "[data-name=bypass]", function (e) {
model.bypass = e.target.checked;
console.log ("bypass is ", e.target.checked);
return true;
*/

}); // events

// register callback for changes to model
model.onChange = function (name, value) {
console.log ("responding to model change: ", name, value);
var $parameter = $target.find (`[data-name=${name}]`);

if (Number($parameter.val()) !== value) {
$parameter.val (value);
//$parameter.trigger ("change");
console.log ("set ui parameter ", name, value);
} // if


return value;
}; // change

return $target;
}; // self.render
console.log ("self.render defined");

function compareStrings (s1, s2) {
if (s1>s2) return 1;
if (s1<s2) return -1;
return 0;
} // compareStrings

} // TunaUi
