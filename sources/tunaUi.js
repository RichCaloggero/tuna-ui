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

console.log (title, Object.keys(model.defaults));
var parameters = Object.keys(model.defaults).filter (key => key !== "bypass").map (function (name) {
var parameter = model.defaults[name];
parameter.name = name;
//console.log ("- parameter: ", parameter);
return parameter;
});


self.render = function ($target) {
$target.empty ();
if (! $target.attr("role")) $target.attr ("role", "region");
if (title && !$target.attr("aria-label") && !$target.attr("aria-labelledby")) $target.attr ("aria-label", title);

$target.html (template.render({
parameters: parameters

}));

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

}).on ("change", "[type=range][data-name]", function (e) {
var name = $(e.target).attr ("data-name");
var value = Number($(e.target).val());
if (name === "bypass") value = Boolean($(e.target).prop("checked"));
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
//console.log ("self.render defined");


} // TunaUi
