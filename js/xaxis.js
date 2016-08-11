//xaxis.js
function Xaxis(_canvas,_svg){
	Axis.call(this,_canvas,_svg);
}
Xaxis.prototype = Object.create(Axis.prototype);
Xaxis.prototype.constructor = Xaxis;
Xaxis.prototype.draw = function(_drawingObj){
	var xaxis = this,
		canvas = xaxis && xaxis.canvas,
		svg = xaxis && xaxis.svg,
		svgDetails = xaxis && xaxis.svgDetails,
		drawingObj = _drawingObj,
		i;
		//xaxis.drawTicks(_lenTick,_width,_numTicks,_x,_y,_isVertical,_id,_posTicks);
};