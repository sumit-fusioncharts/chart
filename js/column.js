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
		i,temp;

		canvas = new Canvas();

		for(i in data){
			svg = canvas.createSvg(svgW,svgH,svgId,svgClass,svgAppend);

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

		//adjustment



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
        for (j in _plotPoints[i].dataArr) {
            temp = Number(_plotPoints[i].dataArr[j].point);
            temp2 = Number(_plotPoints[i].dataArr[j].pointx2);
            temp3 = Number(_plotPoints[i].dataArr[j].pointy);
            tooltip = _plotPoints[i].tooltip;
            if (e.detail.x > (temp) && e.detail.x < (temp+temp2) && e.detail.top > temp3) {
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
            	element = _plotPoints[i].dataArr[j].element;
            	element.setAttribute("style", "fill:red");
            }
            else{

            	element = _plotPoints[i].dataArr[j].element;
            	element.setAttribute("style", "fill:blue");
            }
        }
    }

};
Column.prototype.hideToolTip = function(tooltip){
	var box = tooltip.tooltipBox,
		text = tooltip.tooltipText;
	    box.setAttribute("style", "visibility:hidden");
	    text.setAttribute("style", "visibility:hidden");
};
Column.prototype.resetCol = function() {
    var column = this,
        _plotPoints = column && column.plotPoints,
        box,j,
        i;
    for (i in _plotPoints) {
    	for (j in _plotPoints[i].dataArr) {
	        box = _plotPoints[i].dataArr[j].element;
			box.setAttribute("style", "fill:green");
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