//Yaxis.js
function Yaxis(_canvas,_svg){
	Axis.call(this,_canvas,_svg);
}
Yaxis.prototype = Object.create(Axis.prototype);
Yaxis.prototype.constructor = Yaxis;
Yaxis.prototype.drawBox = function(_x,_y,_width,_height,_id,_isvertical,_rectColor){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		rectClass = _id+"Class",
		rect;

	if(_isvertical){
		rect = canvas.createRect(svg,_x,_y,(_x+_width),_height,_id,rectClass);
	}else{
		rect = canvas.createRect(svg,_x,_y,_height,(_width),_id,rectClass,_rectColor);
	}
};