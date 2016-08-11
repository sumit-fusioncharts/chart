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
		i ,
		tempVar,
		tempArr,
		zones = function(){
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
		},
		products = function(){
			tempArr = [];
			for(i in chartData){
				tempVar = chartData[i].product;
				if(!lookup(tempVar,tempArr)){
					tempArr.push(tempVar);
				}
			}
			return tempArr;
		};

	model = {zones : zones(), products : products()};
	chartObj.model = model;
	return chartObj;
};
ParseData.prototype._commonParsing = function(){

};