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

	return rect;
};

Yaxis.prototype.drawLabels = function(area,data,x,y,id,_textPos,extra,isVertical,_fontSize,_textColor){
		var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		className = id+"Class",
		textPos = _textPos,
		textColor = (typeof _textColor === "undefined")? "#000000" : _textColor,
		fontSize = (typeof _fontSize === "undefined")? 16 : _fontSize,
		division,
		startingPoint,
		i,	
		tickPos1,
		tickPos2,
		plotPointX,
		dataLength,
		plotPointY;

		if(Array.isArray(data)==true){
			dataLength = data.length;
			division = area/(dataLength-1);
			if(isVertical){
				startingPoint = x;
				for(i = 0;i <dataLength;i++){
					plotPointX = startingPoint + i*division + extra*division;
					canvas.createText(svg,plotPointX,y,data[i],textColor,fontSize,textPos,id);
				}
			}else{
				startingPoint = y;
				for(i = 0;i <dataLength;i++){
					plotPointY = startingPoint + i*division + extra*division;
					canvas.createText(svg,x,plotPointY,data[i],textColor,fontSize,textPos,id);
				}
			}
		}else{
			canvas.createText(svg,x,y,data,textColor,fontSize,textPos,id);
		}
};

Yaxis.prototype.drawInsideBox = function(x,y,width,height,numOfRects,id,isVertical){
	var axis = this,
		svg = axis && axis.element,
		canvas = axis && axis.canvas,
		classname = id+"Class",
		division,
		startingPoint,
		plotPointX,
		plotPointY,
		i;

		if(numOfRects==1){//draw one rect
			if(isVertical){
				rect = canvas.createRect(svg,x,y,height,width,id,classname);
			}else{
				rect = canvas.createRect(svg,x,y,width,height,id,classname);
			}
		}else{
			if(isVertical){
				startingPoint = x;
				division = height/(numOfRects);
				for(i = 0;i<numOfRects;i++){
					if(i % 2 != 0 && i != numOfRects){
						plotPointX = startingPoint + i*division;
						rect = canvas.createRect(svg,plotPointX,y,height,division,id,classname);
					}				}
			}else{
				startingPoint = y;
				division = height/(numOfRects);
				for(i = 0;i<numOfRects;i++){
					if(i % 2 != 0 && i != numOfRects){
						plotPointY = startingPoint + i*division;
						rect = canvas.createRect(svg,x,plotPointY,division,width,id,classname);
					}
				}
			}
		}
};