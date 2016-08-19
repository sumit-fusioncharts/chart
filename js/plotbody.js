function PlotBody(_canvas,_svg){
	Axis.call(this,_canvas,_svg);
}
PlotBody.prototype = Object.create(Axis.prototype);
PlotBody.prototype.constructor = PlotBody;
PlotBody.prototype.draw = function(first_argument) {
	
};
PlotBody.prototype.calculation = function(first_argument) {
	// body...
};
PlotBody.prototype.drawCircles =  function(){
	//
};
PlotBody.prototype.drawBoxes = function(_bwidth,_bheight,_bx,_by,_id,_numOfBoxes,_width,_isVertical){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		rectId = _id,
		rectClass = rectId+"class",
		i,
		space;
	if(_numOfBoxes<1){
		return;
	}else if (_numOfBoxes == 1){
		return canvas.createrect(svg,_bx,_by,_bheight,_bwidth,_id);
	}else{
		space = _width/_numOfBoxes;
		if(_isVertical){ //shift y
			for(i = 0;i<_numOfBoxes; i++){
				_by = _by + space * i;
				return canvas.createrect(svg,_bx,_by,_bheight,_bwidth,_id);
			}
		}else{// shift x
			_bx = _bx + space * i;
			for(i = 0;i<_numOfBoxes; i++){
				return canvas.createrect(svg,_bx,_by,_bheight,_bwidth,_id);
			}
		}
	}
};