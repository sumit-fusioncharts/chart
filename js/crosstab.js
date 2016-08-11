//crosstab.js
function Crosstab(_jsonData){
	this.jsonData = _jsonData;
}
Crosstab.prototype.draw = function(){
	//init will draw the outer svg
	var crosstab = this,
		jsonData = crosstab && crosstab.jsonData,
		data = jsonData && jsonData.data,
		svgDetails = jsonData && jsonData.svg,
		model = jsonData && jsonData.model,
		zones = model && model.zones,
		productType = model && model.products,
		lenZones = zones.length,
		lenProducts = productType.length,
		info = jsonData && jsonData.chart,
		chartDiv = info && info.chartDiv,
		divId = document.getElementById(chartDiv),
		svgW = svgDetails && svgDetails.svgW,
		svgH = svgDetails && svgDetails.svgH,
		top = 40,
		canvas = new Canvas(),
		i,
		j,
		xaxis,
<<<<<<< HEAD
		yaxis,
		chartW = svgW,
		chartH = svgDetails.chartH,
		chartHeaderHeight = 40,
		drawingObj = [];

			currentSvg = crosstab.init(svgW,svgH,canvas,divId);

			xaxis = new Xaxis(canvas,currentSvg);
			yaxis = new Yaxis(canvas,currentSvg);

			xaxis.drawTicks(20,svgW,lenZones,0,40,true,"verticalTicks",1);
			xaxis.drawLabels(svgW,zones,0,30,"headerText","middle",0.5,true);
			xaxis.drawCrossTabLines(svgH,svgW,lenZones,0,chartHeaderHeight,true,"xlines",0,2);

			
			

			this.dataSeries(yaxis,canvas,currentSvg);
=======
		yaxis;
		currentSvg = crosstab.init(svgW,svgH,canvas,divId);
		//this.header(canvas,currentSvg,true);
		var axis = new Axis(canvas,currentSvg);
		axis.drawTicks(20,svgW,lenZones,0,40,true,"verticalTicks",1);
		axis.drawTicks(20,svgH,lenProducts,30,40,false,"verticalTicks",1);console.log(model);
		axis.drawLabels(svgW,zones,0,30,"headerText","middle",0.5,true);
		axis.drawLines(svgW,lenProducts,40,40,false,"xlines",1);
>>>>>>> 2aeb8cfbf6b98e134a6a255649f22258e08a86a9

};
Crosstab.prototype.init = function(_w,_h,_canvas,_divId){
	return _canvas.createSvg(_w,_h,"outerSvg","outerSvgClass",_divId);
<<<<<<< HEAD
};

Crosstab.prototype.dataSeries = function(_axisCon,_canvas,_currentSvg){
	var crosstab = this,
		canvas = _canvas,
		currentSvg = _currentSvg,
		jsonData = crosstab && crosstab.jsonData,
		data = jsonData && jsonData.data,
		svgDetails = jsonData && jsonData.svg,
		model = jsonData && jsonData.model,
		zones = model && model.zones,
		productType = model && model.products,
		lenZones = zones.length,
		lenProducts = productType.length,
		svgH = svgDetails && svgDetails.svgH,
		svgW = svgDetails && svgDetails.svgW,
		chartH = svgDetails.chartH,
		subPSpace = svgH/lenProducts,
		sunZoneSpace = svgW/lenZones,
		barS = svgDetails.barS,
		barH = svgDetails.barH,
		space = barS*2+barH,
		i,
		j,
		k,
		l,
		top = 60,
		temp,
		tempArr,
		sub_product_Arr = [],
		plotBody = new PlotBody(canvas,currentSvg),
		sub_product,
		sos,
		tempBool,
		ratio,
		cnt = 0,
		barPos = top,
		setSubProduct = function(){
							for(i in productType){
								tempArr = [];
								
								for(j = 2; j<lenZones; j++){	
									for(k in data){
										if(data[k].product == productType[i] && data[k].region == zones[j]){
											if(!lookup(data[k].sub_product,tempArr)){
												tempArr.push(data[k].sub_product);
											}
										}
									}
								}
								barPos += (space*tempArr.length);
								plotBody.drawLabels(0,productType[i],100,barPos-60,"productType","start",0.5,false);
								plotBody.drawLines(svgW,0,1,10,barPos,false,"xlines",1);
								sub_product_Arr.push(tempArr.sort());
							}
							return sub_product_Arr;
						};
		temp = setSubProduct();
		







		// for(i in productType){
		// 	plotBody.drawLabels(0,productType[i],100,barPos,"productType","start",0.5,false);
		// 	for(k in sub_product_Arr[i]){
		// 		tempBool = false;
		// 		cnt++;
		// 		for(j = 2; j<lenZones;j++){
		// 			for(l in data){
		// 				if(data[l].product == productType[i] && data[l].region == zones[j]
		// 					 && data[l].sub_product==sub_product_Arr[i][k]){
		// 					temp = sunZoneSpace * 1.5;
		// 					barPos = 40 + cnt*24;
		// 					//draw level
		// 					if(!tempBool){//console.log(sub_product_Arr[i][k],data[l].sos);
		// 						tempBool= true;
		// 						console.log(sub_product_Arr[i][k],temp,currentSvg,barPos);
		// 						plotBody.drawLabels(0,sub_product_Arr[i][k],temp,barPos,"sub_product","middle",0.5,true);
		// 					}
		// 					//plot each value in diff zones
		// 					//calculate distance
							
							
		// 				}
		// 			}
		// 		}
		// 	}
			
		// 	//_width,_height,_numTicks,_x,_y,_isVertical,_id,_posTicks
		// 	plotBody.drawLines(svgW,0,1,10,barPos,false,"xlines",1);
		// }


		
};
/*
						//temp = space*Number(k)+40;console.log(temp);	
						//console.log(data[k].sub_product);
						// sub_product = data[k].sub_product;
						// sos = data.sos;//_width,_textArr,_x,_y,_id,_posTexts,_pos,_rightToLeft
						// _axisCon.drawLabels(0,sub_product,subPSpace,temp,"sub_product","middle",0.5,false);
*/
=======
};
>>>>>>> 2aeb8cfbf6b98e134a6a255649f22258e08a86a9
