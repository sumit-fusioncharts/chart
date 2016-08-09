//parseData.js
function ParseData(jsonObject){	
	var chartObj = jsonObject,
		model = this._decideParsingMethod(chartObj);
	return model;
};
ParseData.prototype._decideParsingMethod = function(jsonObject){
	var chartObj = jsonObject,
		chartInfo = chartObj && chartObj.chartinfo,
		chartType = chartInfo && chartInfo.chartType;
	if(chartType == "crossTab")
		return this._parseCrossTab(chartObj);
	else if(chartType == "line" || chartType == "column"){
		return this._commonParsing(chartObj);		
	}
};
ParseData.prototype._parseCrossTab = function(){
	
};
ParseData.prototype._commonParsing = function(){

};