//line.js
function Line(_jsonData) {
    this.jsonData = _jsonData;
    this.lineArr = [];
    this.plotPoints = [];
    this.flag = false;

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
        svgClass = svgId + "Class",
        svgW = svgDetails && svgDetails.svgWidth,
        svgH = svgDetails && svgDetails.svgHeight,
        chartDiv = info && info.chartDiv,
        svgAppend = document.getElementById(chartDiv),
        i,
        temp,
        dragable,
        flag = line.flag,
        divPosX, divPosY;

    canvas = new Canvas();


    dragable = document.createElement('div');
    dragable.className = 'dragableDiv';
    dragable.id = 'dragableDiv';
    svgAppend.appendChild(dragable);

    for (i in data) {


        svg = canvas.createSvg(svgW, svgH, svgId, svgClass, svgAppend);
        //drag event to every svg
        (function(svg, flag,divPosX, divPosY , i,dragable){
            svg.addEventListener("mousedown", function(event) {
                flag = true;
                divPosX = event.clientX;
                divPosY = event.clientY;
                line.drawDragableDiv(event, svg, flag);
            }, false);
            svg.addEventListener("mousemove", function(event) {
                if (flag) {
                    line.hideCrossHair();
                    line.extendDiv(event, divPosX, divPosY, svg);
                }
            }, false);
            dragable.addEventListener("mousemove", function(event) {
                if (flag) {
                    line.extendDiv(event, divPosX, divPosY, svg);
                }
            }, false);
            dragable.addEventListener("mouseup", function(event) {
                flag = false;
                line.resetDiv(event, svg, dragable);
            }, false);
        })( svg, flag,divPosX, divPosY , i,dragable);

        xaxis = new Xaxis(canvas, svg);
        yaxis = new Yaxis(canvas, svg);
        line.drawHeader(data[i], svgDetails, yaxis);

        if (type == "crosstab") {
            line.drawBody(data[i], svgDetails, xaxis, yaxis, axis[data[i].product]);
            line.plotData(data[i], svgDetails, xaxis, axis[data[i].product]);

        } else {
            line.drawBody(data[i], svgDetails, xaxis, yaxis, axis);
            line.plotData(data[i], svgDetails, xaxis, axis);
        }

        //line.drawFooter();
    }

};
Line.prototype.drawHeader = function(data, svgDetails, yaxis) {
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
Line.prototype.drawBody = function(data, svgDetails, xaxis, yaxis, axis) {
    var line = this,
        lineArr = line.lineArr,
        upperLimit = data.newMaxMin[0],
        lowerLimit = data.newMaxMin[1],
        numOfyaxisTicks = yaxis.calculateTicksNum(upperLimit, lowerLimit),
        numOfData = axis.length, //data.dataArr.length,
        svgW = svgDetails && svgDetails.svgWidth,
        svgH = svgDetails && svgDetails.svgHeight,
        chartW = svgDetails && svgDetails.chartWidth,
        chartH = svgDetails && svgDetails.chartHeight,
        divisiony = chartH / numOfyaxisTicks, //height per segment
        divisionx = chartW / numOfData, //width per segment
        marginx = svgDetails && svgDetails.marginx,
        marginy = svgDetails && svgDetails.marginy,
        _width = chartW - marginx,
        _height = chartH - marginy,
        i,
        temp,
        flag = line.flag,
        yaxisLabel,
        tempArr = [],
        box,
        calculationY;


    //outer box for test purpose
    //yaxis.drawBox(0,0,svgW,svgH,"container",false);
    //draw y axis ticks
    yaxis.drawTicks(5, _height, numOfyaxisTicks, marginx, marginy, false, "yaxisTicks");
    xaxis.drawTicks(5, _width, numOfData - 1, marginx, chartH + 5, true, "yaxisTicks", 1);
    //adding labels
    for (i = 0; i <= numOfyaxisTicks; i++) {
        yaxisLabel = (upperLimit - (((upperLimit - lowerLimit) / numOfyaxisTicks) * i));
        yaxisLabel = yaxis.sortedTitle(yaxisLabel);
        tempArr.push(yaxisLabel);
    }

    yaxis.drawInsideBox(marginx, marginy, _width, _height, numOfyaxisTicks, "backgroundBox", false);
    //draw y axis labels            
    yaxis.drawLabels(_height, tempArr, marginx - 8, marginy, "yaxisLabel", "end", 0.06, false, 14);
    xaxis.drawLabels(chartW, axis, marginx / 2, chartH + 20, "yaxisLabel", "middle", 1, true, 14);
    temp = xaxis.drawHairLine(marginx, marginy, _height, "hairline");
    lineArr.push(temp);

    //draw container
    box = yaxis.drawBox(marginx, marginy, _width, _height, "container", false);
    line.eventHairLine(box, marginx);

};

Line.prototype.plotData = function(data, svgDetails, xaxis, axis) {
    var line = this,
        newmax = data.newMaxMin[0],
        newmin = data.newMaxMin[1],
        datasetStr = "",
        dataValues = "",
        svgW = svgDetails && svgDetails.svgWidth,
        svgH = svgDetails && svgDetails.svgHeight,
        chartW = svgDetails && svgDetails.chartWidth,
        chartH = svgDetails && svgDetails.chartHeight,
        marginx = svgDetails && svgDetails.marginx,
        marginy = svgDetails && svgDetails.marginy,
        dataArray = data.dataArr,
        dataArrayLen = data.dataArr.length,
        numOfData = data.dataArr.length,
        divisionx = chartW / numOfData,
        plotPoints = line.plotPoints,
        tempArr = [],
        i,
        y,
        xcord,
        ycord,
        barHight,
        xaxisticks = axis.length,
        plotRatio = (chartH - 50) / (newmax - newmin),
        x2,
        y2;

    for (i = 0; i < dataArrayLen; i++) {
        if (typeof dataArray[i] != "undefined" && dataArray[i] != null) {
            y = Number(dataArray[i]);
            xcord = (divisionx * i) + marginx + divisionx / 2;
            barHight = ((y - newmin) * plotRatio);
            ycord = (chartH - barHight);
            datasetStr += xcord + "," + ycord + " ";
            tempArr.push(y);
        }
    } //successfully displaying Data String for plotting
    //draw tooltip

    x2 = marginx + chartH;
    y2 = marginy + chartH;
    line.plotPoints.push({
        dataArr: xaxis.drawPlottedData(datasetStr, 5, tempArr),
        tooltip: {
            tooltipBox: yaxis.drawBox(-90, -90, 30, 30, "tooltip", false),
            tooltipText: yaxis.drawSingleText(-90, -90, "", "tooltipTextClass", "middle", 14)
        },
        rect: { x2, y2 }
    });
};
Line.prototype.drawDragableDiv = function(e, svg, flag) {
    var startX = event.pageX,
        startY = event.pageY,
        dragable = document.getElementById("dragableDiv");
    dragable.style.visibility = "visible";
    dragable.style.cursor = "default";
    dragable.style.top = (startY + scrY +5) + "px";
    dragable.style.left = (startX +5) + "px";
};
Line.prototype.resetDiv = function(e, s, d) {
    dragable = document.getElementById("dragableDiv");
    dragable.style.visibility = "hidden";
    dragable.style.width = "0px";
    dragable.style.height = "0px";
    dragable.style.top = "0px";
    dragable.style.left = "0px";
    s.removeEventListener("mousemove", line.extendDiv, false);
    d.removeEventListener("mousemove", line.extendDiv, false);
};
Line.prototype.extendDiv = function(event, x, y, svg) {
    var line = this,
        currentPosX = event.pageX,
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
    y1 -= (svgTop+scrY); 
    
    line.highLightPoints(x1, y1, x2, y2);

};
Line.prototype.highLightPoints = function(left, top, currentPosX, currentPosY) {
    var line = this,
        _plotPoints = line && line.plotPoints,
        x,
        y,
        i,
        j;

    for (i in _plotPoints) {
        for (j in _plotPoints[i].dataArr) {
            x = Number(_plotPoints[i].dataArr[j].point);
            y = Number(_plotPoints[i].dataArr[j].pointy);
            element = _plotPoints[i].dataArr[j].element;

            if (left < (x + 5) && currentPosX > (x - 5) && (y + 5) > top && (y-5)<currentPosY) {
                element.setAttribute("r", "8");
            } else {
                element.setAttribute("r", "5");
            }
        }
    }
};
Line.prototype.eventHairLine = function(box, marginx) {
    var line = this,
        hairline = line.lineArr,
        rectLeft = box.getBoundingClientRect().left;
    box.addEventListener("mousemove", function(event) {
        OnAddEventListener((event.pageX - rectLeft + marginx), rectLeft, box);
    }, false);
    //box.addEventListener("mouseonelement", line.moveCrosshair, false);
    box.addEventListener("mouseout", function() {
        line.hideCrossHair();
    }, false);
    box.addEventListener("mouseonelement", function(event) {
        line.moveCrosshair(event);
    }, false);
};


Line.prototype.moveCrosshair = function(e) {
    var line = this,
        flag = line && line.flag,   
        _hairline = line && line.lineArr,
        _plotPoints = line && line.plotPoints,
        temp,
        currentPosX,
        currentPosY,
        rect,
        tooltip,
        element,
        data, box, text,
        i,
        j;
        console.log(flag)
    for (i in _hairline) {
        _hairline[i].setAttribute("visibility", "visible");
        _hairline[i].setAttribute("x1", e.detail.x );
        _hairline[i].setAttribute("x2", e.detail.x );
    }

    for (i in _plotPoints) {
            tooltip = _plotPoints[i].tooltip;
            rect = _plotPoints[i].rect;
            box = _plotPoints[i].tooltip.tooltipBox;
            text = _plotPoints[i].tooltip.tooltipText;
            box.setAttribute("style","visibility:hidden");
            text.setAttribute("style","visibility:hidden");
        
        for (j in _plotPoints[i].dataArr) {
            temp = Number(_plotPoints[i].dataArr[j].point);
            element = _plotPoints[i].dataArr[j].element;
            if (e.detail.x > (temp - 5) && e.detail.x < (temp + 5)) {

                box.setAttribute("style", "visibility:visible");
                text.setAttribute("style", "visibility:visible");
                data = _plotPoints[i].dataArr[j].data;
                currentPosX = e.detail.x;
                currentPosY = Number(_plotPoints[i].dataArr[j].pointy);
                if (e.detail.x > rect.x2 - rect.x2/5) {
                    currentPosX -= 90;
                } else {
                    currentPosX += 10;
                }
                if (currentPosY > rect.x2 - rect.x2/2) {
                    currentPosY -= 40;
                }
                line.manageTooltip(data, currentPosX, currentPosY, tooltip);
                element.setAttribute("style", "stroke:red");
            } else {
                
                element.setAttribute("style", "stroke:#1F7ACB");
            }
        }
    }
};
Line.prototype.manageTooltip = function(data, x, y, tooltip) {
    var box = tooltip.tooltipBox,
        text = tooltip.tooltipText;


    box.setAttribute("x", x);
    box.setAttribute("y", y);

    text.innerHTML = data;
    text.setAttribute("x", x + 40);
    text.setAttribute("y", y + 20);
};
Line.prototype.hideCrossHair = function() {
    var line = this,
        _hairline = line && line.lineArr,
        _plotPoints = line && line.plotPoints,
        box,
        text,
        i;
    for (i in _hairline) {
        _hairline[i].setAttribute("visibility", "hidden");
    }
    for (i in _plotPoints) {
        box = _plotPoints[i].tooltip.tooltipBox;
        text = _plotPoints[i].tooltip.tooltipText;
        box.setAttribute("style", "visibility:hidden");
        text.setAttribute("style", "visibility:hidden");
    }
};
