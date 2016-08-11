var template = require ("./tunaUi.mustache");
var $ = require ("jquery");
module.exports = TunaUi;

function TunaUi (model) {
var self = this;

var parameters = Object.keys(model.model.defaults).map (function (name) {
var parameter = model.model.defaults[name];
parameter.name = name;
//console.log ("- parameter: ", parameter);
return parameter;
});


self.render = function ($target) {
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
//return true;

}).on ("change", "[data-name]", function (e) {
var name = $(e.target).attr ("data-name");
var value = Number($(e.target).val());
if (name === "bypass") value = Boolean($(e.target).val());
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

} // TunaUi
