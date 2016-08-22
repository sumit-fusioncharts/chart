//column.js 
function Column(_jsonData){
	this.jsonData = _jsonData;
	this.plotPoints = [],
	console.log(this.jsonData);
}
Column.prototype.draw = function(){
		var column = this,
		jsonData = column && column.jsonData,
		data = jsonData && jsonData.data,
		svgDetails = jsonData && jsonData.svgDetails,
		model = jsonData && jsonData.model,
		axis = model && model.axis,
		info = jsonData && jsonData.chart,
		type = info.chartType,
		svgId = "svg",
		svgClass = svgId+"Class",
		svgW = svgDetails && svgDetails.svgWidth,
		svgH = svgDetails && svgDetails.svgHeight,
		chartDiv = info && info.chartDiv,
		svgAppend = document.getElementById(chartDiv),
		i,
		temp,
		svgLeft,
		flag = false,
		svgTop,
		divPosX,
		divPosY,
		dragable;
		//creating canvas element
		canvas = new Canvas();
		//creating div element and appending it to body
		dragable = document.createElement('div');
	    dragable.className = 'dragableDiv';
	    dragable.id = 'dragableDiv';
	    document.body.appendChild(dragable);

		for(i in data){
			svg = canvas.createSvg(svgW,svgH,svgId,svgClass,svgAppend);
        (function(svg, flag,divPosX, divPosY , i,dragable){
            svg.addEventListener("mousedown", function(event) {
                flag = true;
                divPosX = event.clientX;
                divPosY = event.clientY;
                column.drawDragableDiv(event, svg, flag);
            }, false);
            svg.addEventListener("mousemove", function(event) {
                if (flag) {
                    column.extendDiv(event, divPosX, divPosY, svg);
                }
            }, false);
            dragable.addEventListener("mousemove", function(event) {
                if (flag) {
                    column.extendDiv(event, divPosX, divPosY, svg);
                }
            }, false);
            dragable.addEventListener("mouseup", function(event) {
                flag = false;
                column.resetDiv(event, svg, dragable);
            }, false);
        })( svg, flag,divPosX, divPosY , i,dragable);

			xaxis = new Xaxis(canvas,svg);
			yaxis = new Yaxis(canvas,svg);
			column.drawHeader(data[i],svgDetails,yaxis);
			
			if(type == "crosstab"){
				column.drawBody(data[i],svgDetails,xaxis,yaxis,axis[data[i].product]);
				column.plotData(data[i],svgDetails,xaxis,axis[data[i].product]);
				column.drawFooter(data[i],svgDetails,yaxis,xaxis,axis[data[i].product]);
			}else{
				column.drawBody(data[i],svgDetails,xaxis,yaxis,axis);
				column.plotData(data[i],svgDetails,xaxis,axis[i]);
				column.drawFooter(data[i],svgDetails,yaxis,xaxis,axis);
			}	
		}
	};
Column.prototype.drawFooter = function(data,svgDetails,yaxis,xaxis,axis){
	var svgW = svgDetails && svgDetails.svgWidth,
		svgH = svgDetails && svgDetails.svgHeight,
		chartW = svgDetails && svgDetails.chartWidth,
		chartH = svgDetails && svgDetails.chartHeight,
		upperLimit = data.newMaxMin[0],
		lowerLimit = data.newMaxMin[1],
		numOfyaxisTicks = yaxis.calculateTicksNum(upperLimit,lowerLimit),
		numOfData = axis.length,
		divisiony = chartH / numOfyaxisTicks,//height per segment
		divisionx = chartW / numOfData,//width per segment
		marginx = svgDetails && svgDetails.marginx,
		marginy = svgDetails && svgDetails.marginy,
		_width = chartW - marginx,
		_height = chartH - marginy;
		
		xaxis.drawTicks(5,_width,numOfData-1,marginx,chartH+5,true,"yaxisTicks",1);
		xaxis.drawLabels(chartW,axis,marginx/2,chartH+20,"yaxisLabel","middle",1,true,14);
}
Column.prototype.drawHeader = function(data,svgDetails,yaxis){
	var title = data.title,
		svgW = svgDetails && svgDetails.svgWidth,
		svgH = svgDetails && svgDetails.svgHeight,
		chartW = svgDetails && svgDetails.chartWidth,
		chartH = svgDetails && svgDetails.chartHeight,
		marginx = svgDetails && svgDetails.marginx,
		marginy = svgDetails && svgDetails.marginy,
		_width = chartW-marginx;

		yaxis.drawBox(marginx,5,_width,40,"titleBox",false);
		yaxis.drawLabels(0,title,svgW/1.75,30,"titleText","middle",1,true,16);

};
Column.prototype.drawBody = function(data,svgDetails,xaxis,yaxis,axis,_type){
	var upperLimit = data.newMaxMin[0],
		lowerLimit = data.newMaxMin[1],
		numOfyaxisTicks = yaxis.calculateTicksNum(upperLimit,lowerLimit),
		numOfData = axis.length,
		svgW = svgDetails && svgDetails.svgWidth,
		svgH = svgDetails && svgDetails.svgHeight,
		chartW = svgDetails && svgDetails.chartWidth,
		chartH = svgDetails && svgDetails.chartHeight,
		divisiony = chartH / numOfyaxisTicks,//height per segment
		divisionx = chartW / numOfData,//width per segment
		marginx = svgDetails && svgDetails.marginx,
		marginy = svgDetails && svgDetails.marginy,
		_width = chartW - marginx,
		_height = chartH - marginy,
		i,
		temp,
		yaxisLabel,
		tempArr = [],
		calculationY;

		//draw y axis ticks
		yaxis.drawTicks(5,_height,numOfyaxisTicks,marginx,marginy,false,"yaxisTicks");
		
		//adding labels
		for(i = 0;i <= numOfyaxisTicks; i++){
			yaxisLabel = (upperLimit - (((upperLimit-lowerLimit)/numOfyaxisTicks)*i));
        	yaxisLabel =  yaxis.sortedTitle(yaxisLabel);
        	tempArr.push(yaxisLabel);
		}

		yaxis.drawInsideBox(marginx,marginy,_width,_height,numOfyaxisTicks,"backgroundBox",false);

		yaxis.drawLabels(_height,tempArr,marginx-8,marginy,"yaxisLabel","end",0.06,false,14);
		
		//plot data	
};
Column.prototype.plotData = function(data,svgDetails,xaxis,axis){
	var column = this,
		newmax = data.newMaxMin[0],
		newmin = data.newMaxMin[1],
		datasetStr="",
		dataValues = "",
		svgW = svgDetails && svgDetails.svgWidth,
		svgH = svgDetails && svgDetails.svgHeight,
		chartW = svgDetails && svgDetails.chartWidth,
		chartH = svgDetails && svgDetails.chartHeight,
		marginx = svgDetails && svgDetails.marginx,
		marginy = svgDetails && svgDetails.marginy,
		numOfData = data.dataArr.length,
		divisionx = chartW / numOfData,
		dataArray = data.dataArr,
		dataArrayLen =data.dataArr.length,
		y,
		x2,
		y2,
		xcord,
		ycord,box,
		_width = chartW - marginx,
		_height = chartH - marginy,
		barHight,
		tempArr = [],
		gap = 5,
		w,
		divisionx,
		xaxisticks = axis.length,//****
		plotRatio = (chartH-marginx)/(newmax-newmin);
		
	for(var i=0;i<dataArrayLen;i++){
		 
		w = -2*gap;     
	    if(typeof dataArray[i]!="undefined" && dataArray[i] != null){
	        y = Number(dataArray[i]);	       	         
	        xcord= (divisionx*i)+marginx;
	        barHight = ((y-newmin)*plotRatio); 
            ycord = (chartH - barHight);
            if(barHight<1){
            	barHight=1;
            	ycord=ycord-1;
            }
            tempArr.push(y);
            datasetStr += (xcord+gap)+","+ycord+","+(barHight)+","+(divisionx+w)+" ";

	    }
    }//successfully displaying Data String for plotting
    
    x2 = marginx + chartH;
    y2 = marginy + chartH;
    column.plotPoints.push({
        dataArr: xaxis.drawColumnData(datasetStr,w,tempArr),
        tooltip: {
            tooltipBox: yaxis.drawBox(-90, -90, 30, 30, "tooltip", false),
            tooltipText: yaxis.drawSingleText(-90, -90, "", "tooltipTextClass", "middle", 14)
        },
        rect: { x2, y2 }
    });

    box = yaxis.drawBox(marginx,marginy,_width,_height,"container",false);
		column.eventHaircolumn(box, marginx);
};
Column.prototype.drawDragableDiv = function(e, svg, flag) {
    var startX = event.pageX,
        startY = event.pageY,
        dragable = document.getElementById("dragableDiv");
    dragable.style.visibility = "visible";
    dragable.style.cursor = "default";
    dragable.style.top = (startY + scrY +5) + "px";
    dragable.style.left = (startX +5) + "px";
};
Column.prototype.resetDiv = function(e, s, d) {
    dragable = document.getElementById("dragableDiv");
    dragable.style.visibility = "hidden";
    dragable.style.width = "0px";
    dragable.style.height = "0px";
    dragable.style.top = "0px";
    dragable.style.left = "0px";
    s.removeEventListener("mousemove", column.extendDiv, false);
    d.removeEventListener("mousemove", column.extendDiv, false);
};
Column.prototype.extendDiv = function(event, x, y, svg) {
    var line = this,
        currentPosX = event.pageX,
        currentPosY = event.pageY,
        w = currentPosX - x,
        h = (currentPosY) - y,
        x1,
        y1,
        x2,
        y2,
        d = document.getElementById("dragableDiv");

    if (w < 0 && h < 0) {
        y = (currentPosY);
        h *= 1;
        x = currentPosX;
        w *= -1;
    }
    if (w >= 0 && h < 0) {
        y = (currentPosY);
        h *= -1;
    }
    if (w < 0 && h >= 0) {
        x = currentPosX;
        w *= -1;
    }
    y1 = (y + scrY);
    x1 = (x + scrX);
    
    var svgLeft = svg.getBoundingClientRect().left,
         svgTop = svg.getBoundingClientRect().top;
    
    x2 = currentPosX - svgLeft;
    y2 = currentPosY - svgTop - scrY;
    d.style.top = y1 + "px";
    d.style.left = x1 + "px";
    d.style.width = (w - scrX) + "px";
    d.style.height = (h - scrY) + "px";
    
    x1 -= svgLeft;
    y1 -= (svgTop+scrY); 
    
    column.highLightPoints(x1, y1, x2, y2);

};
Column.prototype.highLightPoints = function(left, top, currentPosX, currentPosY) {
	    var line = this,
        _plotPoints = line && line.plotPoints,
        x,
        y,
        x1,
        x2,
        y1,
        element,
        i,
        j;
        
     for (i in _plotPoints) {
         for (j in _plotPoints[i].dataArr) {
    		x1 = Number(_plotPoints[i].dataArr[j].point);
            x2 = Number(_plotPoints[i].dataArr[j].pointx2)+x1;
            y1 = Number(_plotPoints[i].dataArr[j].pointy);
            y2 = Number(_plotPoints[i].dataArr[j].pointy2);
            element = _plotPoints[i].dataArr[j].element;
            //if(i=="0" && j=="0")console.log(left,top,currentPosX, currentPosY,x1,x2,y1,y2)
            if(left<x2 && currentPosX>x1 && top >= y1){
            	
            	element.setAttribute("style", "stroke:#00FF00");
            }else{
            	element.setAttribute("style", "stroke:#096AB5");
            }
         }
     }
};
Column.prototype.eventHairLine = function(box, marginx) {
    var line = this,
        hairline = line.lineArr,
        rectLeft = box.getBoundingClientRect().left;
    box.addEventListener("mousemove", function(event) {
        OnAddEventListener((event.pageX - rectLeft + marginx), rectLeft, box);
    }, false);
    //box.addEventListener("mouseonelement", line.moveCrosshair, false);
    box.addEventListener("mouseout", function() {
        line.hideCrossHair();
    }, false);
    box.addEventListener("mouseonelement", function(event) {
        line.moveCrosshair(event);
    }, false);
};
Column.prototype.eventHaircolumn = function(box, marginx){
	var column = this,
	rectLeft = box.getBoundingClientRect().left;;
	box.addEventListener("mousemove", function(event) {
        OnAddEventListener((event.pageX - rectLeft + marginx), event.pageY, box);
    }, false);
    box.addEventListener("mouseonelement", function(event) {
        column.highLightCol(event);
    }, false);
    
};
Column.prototype.highLightCol = function(e){
	var column = this,
        _plotPoints = column && column.plotPoints,
        temp,
        temp2,
        temp3,
        currentPosX,
        currentPosY,
        tooltip,
        i,
        j;
    for (i in _plotPoints) {
    	    	box = _plotPoints[i].tooltip.tooltipBox; 
                text = _plotPoints[i].tooltip.tooltipText;
                box.setAttribute("style","visibility:hidden");
                text.setAttribute("style","visibility:hidden");
        for (j in _plotPoints[i].dataArr) {
            temp = Number(_plotPoints[i].dataArr[j].point);
            temp2 = Number(_plotPoints[i].dataArr[j].pointx2);
            temp3 = Number(_plotPoints[i].dataArr[j].pointy);
            tooltip = _plotPoints[i].tooltip;
            element = _plotPoints[i].dataArr[j].element;
            if (e.detail.x >= (temp) && e.detail.x <= (temp+temp2) && e.detail.top >= temp3) {
            	data = _plotPoints[i].dataArr[j].data;
            	
            	currentPosX = e.detail.x;
            	 rect = _plotPoints[i].rect;
            	 currentPosY = temp3;
            	if (e.detail.x > rect.x2 - rect.x2/5) {
                    currentPosX -= 90;
                } else {
                    currentPosX += 10;
                }
                
                if (temp3 >( rect.x2 - rect.x2/2)) {
                    currentPosY -= 35;
                }
            	column.manageTooltip(data, currentPosX, currentPosY, tooltip);
            	
            	element.setAttribute("style", "fill:#AA3939");
            }
            else{

            	
            	element.setAttribute("style", "fill:#096AB5");
            }
        }
    }

};

Column.prototype.manageTooltip = function(data, x, y, tooltip) {
    var box = tooltip.tooltipBox,
        text = tooltip.tooltipText;

    box.setAttribute("style", "visibility:visible");
    text.setAttribute("style", "visibility:visible");

    box.setAttribute("x", x);
    box.setAttribute("y", y);

    text.innerHTML = data;
    text.setAttribute("x", x + 40);
    text.setAttribute("y", y + 20);
};