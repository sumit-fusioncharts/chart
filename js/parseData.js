//parseData.js
'use strict'
function ParseData(jsonObject){	
	var chartObj = jsonObject,
		model = this._decideParsingMethod(chartObj);
	return model;
}
ParseData.prototype._decideParsingMethod = function(jsonObject){
	var chartObj = jsonObject,
		chartInfo = chartObj && chartObj.chart,
		chartType = chartInfo && chartInfo.chartType;
	if(chartType == "crosstab")
		return this._parseCrossTab(chartObj);
	else if(chartType == "line" || chartType == "column"){
		return this._commonParsing(chartObj);		
	}
};
ParseData.prototype._parseCrossTab = function(jsonObject){
	var parseData = this,
		chartObj = jsonObject,
		chartData = chartObj && chartObj.data,
		chartInfo = chartObj && chartObj.chart,
		model = {},
		parsedObj = {},
		data = [],
		plotData = [],
		tempArr1 = [],
		tempArr=[],
		i,
		j,
		k,
		l,
		tempVar,	
		subProductsArr,
		flag,
		cnt = 0,
		zonemax,

		zones = (function(){
					tempArr = [];
					for(i in chartData){
						tempVar = chartData[i].region;
						if(!lookup(tempVar,tempArr)){
							tempArr.push(tempVar);
						}
					}
					tempArr.sort();
					tempArr.unshift(chartInfo.product_name,chartInfo.sub_product_name);
					return tempArr;
				})(),
		products = (function(){
					tempArr = [];
					for(i in chartData){
						tempVar = chartData[i].product;
						if(!lookup(tempVar,tempArr)){
							tempArr.push(tempVar);
						}
					}
					return tempArr;
				})(),
		subProducts = (function(){
							tempArr = [];
							subProductsArr = [];
							
							for(i in products){
								for(j in chartData){
									if(products[i] == chartData[j].product){
										tempVar = chartData[j].sub_product; 
										if(!lookup(tempVar,tempArr)){
											tempArr.push(tempVar);
										}
									}
								}								
								subProductsArr.push(tempArr);
								tempArr = [];
							}
							return subProductsArr;
						})();
		//adding null to empty data
		for(i in products){
			for(j in subProducts[i]){
				for(k = 2; k< zones.length; k++){ 
					flag = false;
					for(l in chartData){
						if(products[i] == chartData[l].product && subProducts[i][j] == chartData[l].sub_product && 
							zones[k] == chartData[l].region){
							flag = true;
						}
					}
					if(flag == false){
						chartData.push({product:products[i],sub_product:subProducts[i][j],region:zones[k],
							sop:null,sos:null});
					}
				}
			}
		}

		zonemax = [];
		for(i =2; i<zones.length;i++){
			flag = false;
			for(j in chartData){
				if(chartData[j].region == zones[i]){
					if(flag == false){
						flag = true;
						tempVar = chartData[j].sos;
					}else{
						if(chartData[j].sos>tempVar){
							tempVar = chartData[j].sos;
						}
					}
				}
			}
		zonemax.push(tempVar);
		}

		//getting back plotdata
		for(i in products){
			for(k = 2; k< zones.length; k++){ 
				for(j in subProducts[i]){				
					for(l in chartData){
						if(products[i] == chartData[l].product && subProducts[i][j] == chartData[l].sub_product &&
						 zones[k] == chartData[l].region){
							tempVar = chartData[l].sos;
							tempArr.push(tempVar);
							tempVar = chartData[l].sop;
							tempArr1.push(tempVar);
						}
					}
				}
				plotData.push({dataArr:tempArr, index:cnt, maxMinAvg:parseData.generateMaxMinAvg(tempArr),
					title:products[i]+"-"+zones[k], newMaxMin:[zonemax[k-2],0], dataArr1:tempArr1, product:Number(i)});
		 		tempArr = [];
		 		tempArr1 = [];
		 		cnt++;
			}
		}

	model = {zones : zones, products : products, axis : subProductsArr, maxperzone:zonemax};
	parsedObj = {chart:chartInfo, data:plotData, model:model};

	return parsedObj;
};
ParseData.prototype._commonParsing = function(jsonObject){
	var parseData = this,
		chartObj = jsonObject,
		chartInfo = chartObj && chartObj.chart,
		separator = chartInfo && chartInfo.dataseparator,
		timeStamp = chartObj && chartObj.timestamp,
		time = timeStamp && timeStamp.time,
		xaxis = time.split(separator),
		dataSet = chartObj && chartObj.dataset,
		dataSetData,
		data = [],
		title,
		dataArr,
		maxMinAvg,
		obj = {},
		avg,
		temp,
		index,
		i;

		for(i in dataSet){
			index = Number(i);
			title = dataSet[i].title;
			dataSetData = dataSet && dataSet[i].data;
			dataArr = dataSetData.split(separator);
			dataArr = parseData.reassignBlackData(dataArr);
			maxMinAvg = parseData.generateMaxMinAvg(dataArr);
			data.push({index,title,dataArr,maxMinAvg});
		}

		obj.chart = chartInfo;
		obj.data = data;
		obj.model = {axis:xaxis};

		return obj;
};
ParseData.prototype.reassignBlackData = function(_arr){
	_arr =  _arr.map(function(num){
		if(num == ""){ return null;}
		else{ return Number(num);}
	});
	return _arr;
}

ParseData.prototype.generateMaxMinAvg = function(_arr){
	// function for generating maximum,minimum
	// and avarage of given numbers from an array
  	var temp =[],i;
  	for(i in _arr){
  		if(_arr[i]!=null){
    		temp.push(_arr[i]);
    	}
  	}
    var avg,
    sum = 0,
    max = temp[0],
    min = temp[0],
    tempVal;
  	for (i in temp) {
    	tempVal = temp[i];
      	if (tempVal > max) {
        	max = tempVal;
      	}
      	if (tempVal < min) {
        	min = tempVal;
      	}
      	sum += tempVal;
    }
  	avg = sum / temp.length;
  	return [max, min, avg];
}