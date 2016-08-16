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
Xaxis.prototype.drawCrossTabLines = function(top,left,_id,model,svgDetails){

	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		id = _id,
		classname = _id+"Class",
		products = model.products,
		subProducts = model.axis,
		svgDetails = svgDetails,
		barH = svgDetails.barHeight,
		barS = svgDetails.barSpace,
		svgW = svgDetails.svgWidth,
		i,num;

		for(i in products){
			num = subProducts[i].length*(2*barS+barH);
			top +=num;
			canvas.createLines(svg,left,top,svgW,top,classname,id);
		}
};