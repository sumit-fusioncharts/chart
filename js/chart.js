function ChartFeatures(jsonData){
	this.jsonData = jsonData;
	this.lineArr = [];
    this.plotPoints = [];
    this.flag = false;
}
ChartFeatures.prototype.drawCaption = function(_canvas,_info,_div,marginx) {
		var caption = _info.caption,
		subCaption = _info.subCaption,
		width = _info.width,
		scrWidth = window.innerWidth,
		maxSvg = parseInt(((scrWidth/width)+"").split(".")[0]),
		id = "captionHeader",
		className = "captionHeaderClass",
		cHWidth = maxSvg*width,
		cMid = cHWidth/2,
		cHHeight = 60,
		cHsvg = _canvas.createSvg(cHWidth, cHHeight, id, className, _div);
				_canvas.createText(cHsvg,cMid+marginx,20,caption,"#000",20,"middle","mainCaptionHeaderClass");
				_canvas.createText(cHsvg,cMid+marginx,40,subCaption,"#000",16,"middle","subCaptionHeaderClass");
};
ChartFeatures.prototype.drawDiv = function(){
		var dragable = document.createElement('div');
		    dragable.className = 'dragableDiv';
		    dragable.id = 'dragableDiv';
		    document.body.appendChild(dragable);
		return dragable;
};
ChartFeatures.prototype.drawHeader = function(data, svgDetails, yaxis) {
    var title = data.title,
        svgW = svgDetails && svgDetails.svgWidth,
        svgH = svgDetails && svgDetails.svgHeight,
        chartW = svgDetails && svgDetails.chartWidth,
        chartH = svgDetails && svgDetails.chartHeight,
        marginx = svgDetails && svgDetails.marginx,
        marginy = svgDetails && svgDetails.marginy,
        _width = chartW - marginx;

    yaxis.drawBox(marginx, 5, _width, 40, "titleBox", false);
    yaxis.drawLabels(0, title, svgW / 1.75, 30, "titleText", "middle", 1, true, 16);

};
ChartFeatures.prototype.manageTooltip = function(data, x, y, tooltip) {
    var box = tooltip.tooltipBox,
        text = tooltip.tooltipText;
    box.setAttribute("x", x);
    box.setAttribute("y", y);

    text.innerHTML = data;
    text.setAttribute("x", x + 40);
    text.setAttribute("y", y + 20);
};
ChartFeatures.prototype.resetDiv = function(e, s, d) {
    dragable = document.getElementById("dragableDiv");
    dragable.style.visibility = "hidden";
    dragable.style.width = "0px";
    dragable.style.height = "0px";
    dragable.style.top = "0px";
    dragable.style.left = "0px";
    s.removeEventListener("mousemove", line.extendDiv, false);
    d.removeEventListener("mousemove", line.extendDiv, false);
};