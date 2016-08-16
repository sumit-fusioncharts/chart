//line.js
function Line(_jsonData){
	this.jsonData = _jsonData;
	console.log(this.jsonData);
}
Line.prototype.draw = function() {
	//init will draw the outer svg
	var line = this,
		jsonData = line && line.jsonData,
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
			line.drawHeader(data[i],svgDetails,yaxis);
			line.drawBody(data[i],svgDetails,xaxis,yaxis);
			if(type == "crosstab"){
				line.plotData(data[i],svgDetails,xaxis,axis);
			}else{
				line.plotData(data[i],svgDetails,xaxis,axis[i]);
			}
			
			//line.drawFooter();
		}
		 
};
Line.prototype.drawHeader = function(data,svgDetails,yaxis){
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
Line.prototype.drawBody = function(data,svgDetails,xaxis,yaxis){
	var upperLimit = data.newMaxMin[0],
		lowerLimit = data.newMaxMin[1],
		numOfyaxisTicks = yaxis.calculateTicksNum(upperLimit,lowerLimit),
		numOfData = data.dataArr.length,
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
		i,temp,yaxisLabel,tempArr = [],calculationY;

		//draw container
		yaxis.drawBox(marginx,marginy,_width,_height,"container",false);
		//outer box for test purpose
		//yaxis.drawBox(0,0,svgW,svgH,"container",false);
		//draw y axis ticks
		yaxis.drawTicks(5,_height,numOfyaxisTicks,marginx,marginy,false,"yaxisTicks",1);
		//adding labels
		for(i = 0;i <= numOfyaxisTicks; i++){
			yaxisLabel = (upperLimit - (((upperLimit-lowerLimit)/numOfyaxisTicks)*i));
        	yaxisLabel =  yaxis.sortedTitle(yaxisLabel);
        	tempArr.push(yaxisLabel);
		}

		temp = chartH/tempArr.length;
		for(i = 0;i<tempArr.length;i++){
			calculationY =(temp*i);
    		if(i%2!=0 && i != numOfyaxisTicks){
		        yaxis.drawBox(marginx,calculationY,_width,temp,"backgroundBox",false);                      
		    }
		}
		//draw y axis labels			
		yaxis.drawLabels(chartH,tempArr,marginx/2,marginy,"yaxisLabel","middle",1,false,14);
		//plot data

		
};
Line.prototype.plotData = function(data,svgDetails,xaxis,axis){
	var newmax = data.newMaxMin[0],
		newmin = data.newMaxMin[1],
		datasetStr="",
		dataValues = "",
		svgW = svgDetails && svgDetails.svgWidth,
		svgH = svgDetails && svgDetails.svgHeight,
		chartW = svgDetails && svgDetails.chartWidth,
		chartH = svgDetails && svgDetails.chartHeight,
		marginx = svgDetails && svgDetails.marginx,
		marginy = svgDetails && svgDetails.marginy,
		dataArray = data.dataArr,
		dataArrayLen =data.dataArr.length,
		y,
		xcord,
		ycord,
		barHight,
		xaxisticks = axis.length,
		plotRatio = (chartH-50)/(newmax-newmin);

	for(var i=0;i<dataArrayLen;i++){            
	    if(typeof dataArray[i]!="undefined" && dataArray[i] != null){
	        y = Number(dataArray[i]);
	        // if(chartType=="column"){
	        // 	this.divisionX = (this.chartWidth) / (this.xaxisticks);
	        // }else{
	        divisionX = (chartW-50) / (xaxisticks-1);
	        // }
	        xcord= (divisionX*i)+marginx;
	        barHight = ((y-newmin)*plotRatio); 
            ycord = (chartH -50 - barHight + marginx);
            // if(this.chartType=="column"){            	
            //	if(barHight<1){barHight=1;ycord=ycord-1;}
            //	datasetStr += (xcord+5)+","+ycord+","+(barHight+5)+","+y+","+currentGraph+" ";            	
            //}else{
            	datasetStr += xcord+","+ycord+" ";
            //	dataValues += currentGraph+","+y+" ";
            //}
	    }
    }//successfully displaying Data String for plotting
    console.log(datasetStr);
    xaxis.drawPlottedData(datasetStr,5);


};