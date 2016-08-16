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
Xaxis.prototype.drawPlottedData = function(dataset,radius){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		xy = dataset.split(" "),
		xyCor,
		i,
   		xyCorlen = xy.length-1;

	canvas.createPoly(svg,dataset);

	for(i=0;i<xyCorlen;i++){
	    xyCor = xy[i].split(',');
	    canvas.createCirles(svg,xyCor[0],xyCor[1],radius);
	} 
	
};
Xaxis.prototype.drawColumnData = function(dataset,width){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		xy = dataset.split(" "),
		width = (typeof width === "undefined")? 10 : width,
		xyCor,
		i,
		id = "bar",
		rectClass = id+"Class",
		xyCorlen = xy.length-1;
        for(i=0;i<xyCorlen;i++){
            xyCor = xy[i].split(',');
            canvas.createRect(svg,xyCor[0],xyCor[1],xyCor[2],width,id,rectClass,"#0000ff");
			//paintB.createRect(this.svgGraph,xyCor[0],xyCor[1],xyCor[2],this.divisionX-60,"columnRect","columnRectClass",xyCor[3],Number(xyCor[4]),this.chartWidth,this.ofsetx,this.ofsety);
		}
};