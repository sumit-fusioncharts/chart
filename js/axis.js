function Axis(_canvas,_element){
	this.canvas  = _canvas;
	this.element = _element;
};
Axis.prototype.drawTicks = function(_lenTick,_width,_numTicks,_x,_y,_isVertical,_id,_posTicks){
	if(_numTicks<1){
		return;
	}
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		i,
		space = _width/_numTicks,
		posTicks = space*_posTicks,
		tmpSpace,
		lineId = _id,
		classname = _id+"Class",
		tickPos1,
		tickPos2;

	if(_isVertical){
		tickPos1 = _y-_lenTick;
		tickPos2 = _y;
		for(i = 0; i<_numTicks+1; i++){//y fixed x changes
			tmpSpace = space*i+posTicks;
			canvas.createLines(svg,tmpSpace,tickPos1,tmpSpace,tickPos2,classname,lineId);
		}
	}else{
		for(i = 0; i<_numTicks+1; i++){//x fixed y changes
			tickPos1 = _x-_lenTick;
			tickPos2 = _x;
			tmpSpace = space*i+posTicks;
			canvas.createLines(svg,tickPos1,tmpSpace,tickPos2,tmpSpace,classname,lineId);
		}
	}
	
};
Axis.prototype.drawLabels = function(_width,_textArr,_x,_y,_id,_posTexts,_pos,_rightToLeft){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		lenArr,
		textColor = "#000",
		fontSize = 17,
		id = _id+"Class",
		space,
		pos,
		textVal,
		i;

	if(Array.isArray(_textArr)==true && _width>0){//work with text array
		lenArr = _textArr.length;
		space = _width/lenArr;
		if(_rightToLeft){
			for(i =0; i< lenArr; i++){
				textVal = _textArr[i];
				pos = space * i + space * _pos;
				this.canvas.createText(svg,pos,_y,textVal,textColor,fontSize,_posTexts,id);
			}
		}else{//top to bottom
			for(i =0; i< lenArr; i++){
				textVal = _textArr[i];
				pos = space * i + space * _pos;
				this.canvas.createText(svg,_x,pos,textVal,textColor,fontSize,_posTexts,id);
			}
		}
		
	}else{//work for single text
		this.canvas.createText(svg,_x,_y,_textArr,textColor,fontSize,_posTexts,id);
	}
};
Axis.prototype.drawBoxes = function(_width,_height,_x,_y,_id){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		rectId = _id,
		rectClass = rectId+"class";
		return canvas.createrect(svg,_x,_y,_height,_width,);
};
Axis.prototype.drawLines = function(_width,_numTicks,_x,_y,_isVertical,_id,_posTicks){
	if(_numTicks<1){
		return;
	}
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		i,
		space = _width/_numTicks,
		posTicks = space*_posTicks,
		tmpSpace,
		lineId = _id,
		classname = _id+"Class",
		tickPos1,

	if(_isVertical){
		tickPos1 = _y;
		for(i = 0; i<_numTicks+1; i++){//y fixed x changes
			tmpSpace = space*i+posTicks;
			canvas.createLines(svg,tmpSpace,tickPos1,tmpSpace,tickPos1,classname,lineId);
		}
	}else{
		for(i = 0; i<_numTicks+1; i++){//x fixed y changes
			tickPos1 = _x;
			tmpSpace = space*i+posTicks;
			canvas.createLines(svg,tickPos1,tmpSpace,tickPos1,tmpSpace,classname,lineId);
		}
	}	
};