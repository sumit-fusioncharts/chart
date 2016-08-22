//xaxis.js
function Xaxis(_canvas,_svg){
	Axis.call(this,_canvas,_svg);
	this.arr = [];
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
Xaxis.prototype.drawPlottedData = function(dataset,radius,arr){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		xy = dataset.split(" "),
		xyCor,
		pathstr = "",
		i,
   		xyCorlen = xy.length-1,
   		circleElement;

	//canvas.createPoly(svg,dataset);

	for(i=0;i<xyCorlen;i++){
	    xyCor = xy[i].split(',');
	    if(i==0){
	    	pathstr +="M"+xyCor[0]+","+xyCor[1]+" ";
	    }else{
	    	pathstr +="L"+xyCor[0]+","+xyCor[1]+" ";
	    }
	} 
	
	canvas.createPath(svg,pathstr);
	for(i=0;i<xyCorlen;i++){
	    xyCor = xy[i].split(',');	    
	    circleElement = canvas.createCirles(svg,xyCor[0],xyCor[1],radius);
	    axis.arr.push({
	    	point:xyCor[0],
	    	pointy:xyCor[1],
	    	element:circleElement,
	    	data:arr[i]
	    });
	}
	return axis.arr;
	
};
Xaxis.prototype.drawColumnData = function(dataset,width,arr){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		xy = dataset.split(" "),
		width = (typeof width === "undefined")? 10 : width,
		xyCor,
		barElement,
		i,
		id = "bar",
		rectClass = id+"Class",
		xyCorlen = xy.length-1;
        for(i=0;i<xyCorlen;i++){
            xyCor = xy[i].split(',');
            barElement = canvas.createRect(svg,xyCor[0],xyCor[1],xyCor[2],width,id,rectClass,"#096AB5");
           	axis.arr.push({
		    	point:xyCor[0],
		    	pointy:xyCor[1],
		    	width:width,
		    	pointy2:xyCor[1],
		    	pointx2:xyCor[3],
		    	element:barElement,
		    	data:arr[i]
		    });
   		}

   		return axis.arr;
};
Xaxis.prototype.drawHairLine = function(x,y1,y2,id){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		classname = id+"Class",
		hairline = canvas.createLines(svg,x,y1,x,(y1+y2),classname,id);
		hairline.setAttribute("visibility","hidden");
		return hairline;
};