//crosstab.js
function Crosstab(_jsonData){
	this.jsonData = _jsonData;
}
Crosstab.prototype.draw = function(){
	//init will draw the outer svg
	var crosstab = this,
		jsonData = crosstab && crosstab.jsonData,
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
		axis,
		xaxis,
		yaxis;
		currentSvg = crosstab.init(svgW,svgH,canvas,divId);
		//this.header(canvas,currentSvg,true);
		var axis = new Axis(canvas,currentSvg);
		axis.drawTicks(20,svgW,lenZones,0,40,true,"verticalTicks",1);
		axis.drawTicks(20,svgH,lenProducts,30,40,false,"verticalTicks",1);console.log(model);
		axis.drawLabels(svgW,zones,0,30,"headerText","middle",0.5,true);
		axis.drawLines(svgW,lenProducts,40,40,false,"xlines",1);

};
Crosstab.prototype.init = function(_w,_h,_canvas,_divId){
	return _canvas.createSvg(_w,_h,"outerSvg","outerSvgClass",_divId);
};