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
	var chartObj = jsonObject,
		chartData = chartObj && chartObj.data,
		chartInfo = chartObj && chartObj.chart,
		model = {},
		data = [],
		i,
		j,
		k,
		tempVar,
		tempArr,
		subProductsArr,
		plotData = [],

		zones = (function(){
					tempArr = [];
					tempArr.push(chartInfo.product_name);
					tempArr.push(chartInfo.sub_product_name);
					for(i in chartData){
						tempVar = chartData[i].region;
						if(!lookup(tempVar,tempArr)){
							tempArr.push(tempVar);
						}
					}
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
						})();

		for(i in products){
			for(j in zones){
				for(k in chartData){
					if(products[i] == chartData[k].product && zones[j] == chartData[k].region){
						tempVar = chartData[k].sos; 
						if(!lookup(tempVar,tempArr)){
							tempArr.push(tempVar);
						}
					}
				}
				plotData.push(tempArr);
				tempArr = [];
			}		
		}

	model = {zones : zones, products : products, subProductsArr : subProductsArr, plotData};
	chartObj.model = model;
	return chartObj;
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
			dataArr = reassignBlackData(dataArr);
			maxMinAvg = generateMaxMinAvg(dataArr);
			data.push({index,title,dataArr,maxMinAvg});
		}

		function reassignBlackData(_arr){
			_arr =  _arr.map(function(num){
				if(num == ""){ return 0;}
				else{ return Number(num);}
			});
			return _arr;
		}
		function generateMaxMinAvg(_arr){
			//sorting array max to min without changing original array
			temp = _arr;
			_arr = _arr.concat().sort(max2min);
			avg = temp.reduce(sum, 0)/temp.length;
			return [_arr[0],_arr[_arr.length-1],avg];
		}

		obj.chart = chartInfo;
		obj.data = data;
		obj.model = xaxis;

		return obj;
};

