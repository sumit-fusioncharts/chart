//column.js 
function Column(_jsonData) {
    ChartFeatures.call(this, _jsonData);
}
//inheriting common chart features
Column.prototype = Object.create(ChartFeatures.prototype);
Column.prototype.constructor = Column;
Column.prototype.draw = function() {
    var column = this,
        jsonData = column && column.jsonData,
        data = jsonData && jsonData.data,
        svgDetails = jsonData && jsonData.svgDetails,
        model = jsonData && jsonData.model,
        axis = model && model.axis,
        info = jsonData && jsonData.chart,
        type = info.chartType,
        marginx = svgDetails && svgDetails.marginx,
        svgId = "svg",
        svgClass = svgId + "Class",
        svgW = svgDetails && svgDetails.svgWidth,
        svgH = svgDetails && svgDetails.svgHeight,
        chartDiv = info && info.chartDiv,
        svgAppend = document.getElementById(chartDiv),
        i,
        temp,
        svgLeft,
        flag = false,
        svgTop,
        divPosX,
        divPosY,
        dragable;
    //creating canvas element
    canvas = new Canvas();
    //creating div element and appending it to body
    dragable = column.drawDiv();
    //draw caption and subCaption at top if available
    column.drawCaption(canvas, info, svgAppend, marginx);

    for (i in data) {
        svg = canvas.createSvg(svgW, svgH, svgId, svgClass, svgAppend);
        (function(svg, flag, divPosX, divPosY, i, dragable) {
            svg.addEventListener("mousedown", function(event) {
                flag = true;
                divPosX = event.clientX;
                divPosY = event.clientY;
                column.drawDragableDiv(event, svg, flag);
            }, false);
            svg.addEventListener("mousemove", function(event) {
                if (flag) {
                    column.extendDiv(event, divPosX, divPosY, svg);
                }
            }, false);
            dragable.addEventListener("mousemove", function(event) {
                if (flag) {
                    column.extendDiv(event, divPosX, divPosY, svg);
                }
            }, false);
            dragable.addEventListener("mouseup", function(event) {
                flag = false;
                column.resetDiv(event, svg, dragable);
            }, false);

        })(svg, flag, divPosX, divPosY, i, dragable);

        xaxis = new Xaxis(canvas, svg);
        yaxis = new Yaxis(canvas, svg);
        column.drawHeader(data[i], svgDetails, yaxis);

        if (type == "crosstab") {
            column.drawBody(data[i], svgDetails, xaxis, yaxis, axis[data[i].product]);
            column.plotData(data[i], svgDetails, xaxis, axis[data[i].product]);
            column.drawFooter(data[i], svgDetails, yaxis, xaxis, axis[data[i].product]);
        } else {
            column.drawBody(data[i], svgDetails, xaxis, yaxis, axis);
            column.plotData(data[i], svgDetails, xaxis, axis[i]);
            column.drawFooter(data[i], svgDetails, yaxis, xaxis, axis);
        }
    }
};
//draw footer
Column.prototype.drawFooter = function(data, svgDetails, yaxis, xaxis, axis) {
    var svgW = svgDetails && svgDetails.svgWidth,
        svgH = svgDetails && svgDetails.svgHeight,
        chartW = svgDetails && svgDetails.chartWidth,
        chartH = svgDetails && svgDetails.chartHeight,
        upperLimit = data.newMaxMin[0],
        lowerLimit = data.newMaxMin[1],
        numOfyaxisTicks = yaxis.calculateTicksNum(upperLimit, lowerLimit),
        numOfData = axis.length,
        divisiony = chartH / numOfyaxisTicks, //height per segment
        divisionx = chartW / numOfData, //width per segment
        marginx = svgDetails && svgDetails.marginx,
        marginy = svgDetails && svgDetails.marginy,
        _width = chartW - marginx,
        _height = chartH - marginy;

    xaxis.drawTicks(5, _width, numOfData - 1, marginx, chartH + 5, true, "yaxisTicks", 1);
    xaxis.drawLabels(chartW, axis, marginx / 2, chartH + 20, "yaxisLabel", "middle", 1, true, 14);
}

Column.prototype.drawBody = function(data, svgDetails, xaxis, yaxis, axis, _type) {
    var upperLimit = data.newMaxMin[0],
        lowerLimit = data.newMaxMin[1],
        numOfyaxisTicks = yaxis.calculateTicksNum(upperLimit, lowerLimit),
        numOfData = axis.length,
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
        yaxisLabel,
        tempArr = [],
        calculationY;

    //draw y axis ticks
    yaxis.drawTicks(5, _height, numOfyaxisTicks, marginx, marginy, false, "yaxisTicks");

    //adding labels
    for (i = 0; i <= numOfyaxisTicks; i++) {
        yaxisLabel = (upperLimit - (((upperLimit - lowerLimit) / numOfyaxisTicks) * i));
        yaxisLabel = yaxis.sortedTitle(yaxisLabel);
        tempArr.push(yaxisLabel);
    }

    yaxis.drawInsideBox(marginx, marginy, _width, _height, numOfyaxisTicks, "backgroundBox", false);

    yaxis.drawLabels(_height, tempArr, marginx - 8, marginy, "yaxisLabel", "end", 0.06, false, 14);
};
Column.prototype.plotData = function(data, svgDetails, xaxis, axis) { //plot data    
    var column = this,
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
        numOfData = data.dataArr.length,
        divisionx = chartW / numOfData,
        dataArray = data.dataArr,
        dataArrayLen = data.dataArr.length,
        y,
        x2,
        y2,
        xcord,
        ycord, box,
        _width = chartW - marginx,
        _height = chartH - marginy,
        barHight,
        tempArr = [],
        gap = 5,
        w,
        divisionx,
        xaxisticks = axis.length, //****
        plotRatio = (chartH - marginx) / (newmax - newmin);
    //converting actual data to coordinates    
    for (var i = 0; i < dataArrayLen; i++) {
        //accurate width
        w = -2 * gap;
        //validation for data array only plot if not null or undefined
        if (typeof dataArray[i] != "undefined" && dataArray[i] != null) {
            y = Number(dataArray[i]);
            xcord = (divisionx * i) + marginx;
            barHight = ((y - newmin) * plotRatio);
            ycord = (chartH - barHight);
            if (barHight < 1) {
                barHight = 1;
                ycord = ycord - 1;
            }
            tempArr.push(y);
            datasetStr += (xcord + gap) + "," + ycord + "," + (barHight) + "," + (divisionx + w) + " ";

        }
    } //successfully displaying Data String for plotting

    x2 = marginx + chartH;
    y2 = marginy + chartH;
    column.plotPoints.push({
        dataArr: xaxis.drawColumnData(datasetStr, w, tempArr),
        tooltip: {
            tooltipBox: yaxis.drawBox(-90, -90, 30, 30, "tooltip", false),
            tooltipText: yaxis.drawSingleText(-90, -90, "", "tooltipTextClass", "middle", 14)
        },
        rect: { x2, y2 }
    });
    //draw container
    box = yaxis.drawBox(marginx, marginy, _width, _height, "container", false);
    //add custom event to box container
    column.eventHaircolumn(box, marginx);
};

Column.prototype.extendDiv = function(event, x, y, svg) {
    var column = this,
        divPoints;
    //position-extend div on mouse move
    divPoints = column.positionDragDiv(event, x, y, svg);
    //highLight selected div with dragdiv
    column.highLightPoints(divPoints[0], divPoints[1], divPoints[2], divPoints[3]);

};
Column.prototype.highLightPoints = function(left, top, currentPosX, currentPosY) {
    var line = this,
        _plotPoints = line && line.plotPoints,
        x,
        y,
        x1,
        x2,
        y1,
        ytop,
        element,
        width,
        height,
        i,
        j;

    for (i in _plotPoints) {
        for (j in _plotPoints[i].dataArr) {
            x1 = Number(_plotPoints[i].dataArr[j].point);
            x2 = Number(_plotPoints[i].dataArr[j].pointx2) + x1;
            y1 = Number(_plotPoints[i].dataArr[j].pointy);
            y2 = Number(_plotPoints[i].dataArr[j].pointy2);
            ytop = Number(_plotPoints[i].dataArr[j].top);
            width = x2 - x1;
            height = y2 - y1;
            element = _plotPoints[i].dataArr[j].element;

            if (currentPosX > x1 && currentPosY > y1 && left <= x2) {
                //element.setAttribute("stroke","#6E2F27");
                //element.setAttribute("stroke-width","1px");
                //element.setAttribute("stroke-dasharray", "10,10");
                element.setAttribute("style", "fill:#6553AD");
            } else {
                //element.setAttribute("stroke","none");
                element.setAttribute("style", "fill:#096AB5");
            }
        }
    }
};

Column.prototype.eventHaircolumn = function(box, marginx) {
    var column = this,
        rectLeft = box.getBoundingClientRect().left;
    box.addEventListener("mousemove", function(event) {
        OnAddEventListener((event.pageX - rectLeft + marginx), event.pageY, box);
    }, false);
    box.addEventListener("mouseonelement", function(event) {
        column.highLightCol(event);
    }, false);
};
Column.prototype.highLightCol = function(e) {
    var column = this,
        _plotPoints = column && column.plotPoints,
        x1,
        x2,
        y1,
        top, //drag box top position
        currentPosX, //dragdiv x2 position
        currentPosY, //dragdiv y2 position
        tooltip, //tooltip object
        mosPositionX = e.detail.x - scrX,
        mosPositionY = e.detail.top,
        element, //columns
        i,
        j;
    for (i in _plotPoints) {
        //setting current tooltip
        box = _plotPoints[i].tooltip.tooltipBox;
        text = _plotPoints[i].tooltip.tooltipText;
        //first hiding all tooltips
        box.setAttribute("style", "visibility:hidden");
        text.setAttribute("style", "visibility:hidden");
        //iterating each graph
        for (j in _plotPoints[i].dataArr) {
            x1 = Number(_plotPoints[i].dataArr[j].point);
            x2 = Number(_plotPoints[i].dataArr[j].pointx2);
            y1 = Number(_plotPoints[i].dataArr[j].pointy);
            top = Number(_plotPoints[i].dataArr[j].top);
            tooltip = _plotPoints[i].tooltip;
            element = _plotPoints[i].dataArr[j].element;
            if (mosPositionX >= (x1) && mosPositionX <= (x1 + x2) && mosPositionY >= (y1 + top)) {
                data = _plotPoints[i].dataArr[j].data;
                currentPosX = e.detail.x;
                rect = _plotPoints[i].rect;
                currentPosY = y1;
                if (e.detail.x > rect.x2 - rect.x2 / 5) {
                    currentPosX -= 90;
                } else {
                    currentPosX += 10;
                }
                if (y1 > (rect.x2 - rect.x2 / 2)) {
                    currentPosY -= 35;
                }
                //position tool tip at points
                column.manageTooltip(data, currentPosX, currentPosY, tooltip);
                //changing column color on hover
                element.setAttribute("style", "fill:#AA3939");
            } else {
                //reset the column color
                element.setAttribute("style", "fill:#096AB5");
            }
        }
    }

};
