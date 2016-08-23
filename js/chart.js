function ChartFeatures(jsonData) {
    this.jsonData = jsonData;
    this.lineArr = [];
    this.plotPoints = [];
    this.flag = false;
}
ChartFeatures.prototype.drawCaption = function(_canvas, _info, _div, marginx) {
    var caption = _info.caption,
        subCaption = _info.subCaption,
        width = _info.width,
        scrWidth = window.innerWidth,
        maxSvg = parseInt(((scrWidth / width) + "").split(".")[0]),
        id = "captionHeader",
        className = "captionHeaderClass",
        cHWidth = maxSvg * width,
        cMid = cHWidth / 2,
        cHHeight = 60,
        cHsvg = _canvas.createSvg(cHWidth, cHHeight, id, className, _div);
    _canvas.createText(cHsvg, cMid + marginx, 20, caption, "#000", 20, "middle", "mainCaptionHeaderClass");
    _canvas.createText(cHsvg, cMid + marginx, 40, subCaption, "#000", 16, "middle", "subCaptionHeaderClass");
};
ChartFeatures.prototype.drawDiv = function() {
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
    var chart = this;
    dragable = document.getElementById("dragableDiv");
    dragable.style.visibility = "hidden";
    dragable.style.width = "0px";
    dragable.style.height = "0px";
    dragable.style.top = "0px";
    dragable.style.left = "0px";
    s.removeEventListener("mousemove", chart.extendDiv, false);
    d.removeEventListener("mousemove", chart.extendDiv, false);
};
ChartFeatures.prototype.drawDragableDiv = function(e, svg, flag) {
    var startX = event.pageX,
        startY = event.pageY,
        dragable = document.getElementById("dragableDiv");
    dragable.style.visibility = "visible";
    dragable.style.cursor = "default";
    dragable.style.top = (startY + scrY + 5) + "px";
    dragable.style.left = (startX + 5) + "px";
};
ChartFeatures.prototype.positionDragDiv = function(event, x, y, svg) {
    var currentPosX = event.pageX,
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
    y1 -= (svgTop + scrY);

    return [x1, y1, x2, y2];
};
ChartFeatures.prototype.positionHairline = function(_hairline, x) {
    var i;
    for (i in _hairline) {
        _hairline[i].setAttribute("visibility", "visible");
        _hairline[i].setAttribute("x1", x);
        _hairline[i].setAttribute("x2", x);
    }
};
