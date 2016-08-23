//line.js
function Line(_jsonData) {
    ChartFeatures.call(this, _jsonData);

}
Line.prototype = Object.create(ChartFeatures.prototype);
Line.prototype.constructor = Line;
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
        marginx = svgDetails && svgDetails.marginx,
        svgId = "svg",
        svgClass = svgId + "Class",
        svgW = svgDetails && svgDetails.svgWidth,
        svgH = svgDetails && svgDetails.svgHeight,
        chartDiv = info && info.chartDiv,
        svgAppend = document.getElementById(chartDiv),
        i,
        temp,
        dragable,
        caption,
        flag = line.flag,
        divPosX, divPosY;
    //creating canvas instanse
    canvas = new Canvas();
    //creating dragbox div and visibility set to hidden
    dragable = line.drawDiv();
    //drawing the top caption and subcaption
    line.drawCaption(canvas, info, svgAppend, marginx);
    //iterating each dataset
    for (i in data) {
        svg = canvas.createSvg(svgW, svgH, svgId, svgClass, svgAppend);
        //drag event to every svg
        (function(svg, flag, divPosX, divPosY, i, dragable) {
            svg.addEventListener("mousedown", function(event) {
                //when mouse button down flag is set to true
                flag = true;
                divPosX = event.clientX; //current x position of drag box
                divPosY = event.clientY; //current y position of drag box
                line.drawDragableDiv(event, svg, flag); //set dragbox in the current position
            }, false);
            svg.addEventListener("mousemove", function(event) {
                if (flag) { //only works when mousedown
                    line.hideCrossHair(); //disable hairline when dragbox is working
                    line.extendDiv(event, divPosX, divPosY, svg); // increase height width of the box
                }
            }, false);
            dragable.addEventListener("mousemove", function(event) {
                if (flag) { //only works when mousedown
                    line.extendDiv(event, divPosX, divPosY, svg); // increase height width of the box (backward)
                }
            }, false);
            dragable.addEventListener("mouseup", function(event) {
                flag = false; //when mouse up 
                line.resetDiv(event, svg, dragable); //reset the position of the drag box
            }, false);
        })(svg, flag, divPosX, divPosY, i, dragable);
        //creating x and y axis instanse
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
        hairline,
        flag = line.flag,
        yaxisLabel,
        tempArr = [],
        box,
        calculationY;

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
    //hairline created and pushed in linearr
    hairline = xaxis.drawHairLine(marginx, marginy, _height, "hairline");
    lineArr.push(hairline);

    //draw container
    box = yaxis.drawBox(marginx, marginy, _width, _height, "container", false);
    //add custom event to box container
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
        xaxisticks = axis.length,
        plotRatio = (chartH - 50) / (newmax - newmin),
        x2,
        y2;
    //converting actual data to coordinates    
    for (i = 0; i < dataArrayLen; i++) {
        //validation for data array only plot if not null or undefined
        if (typeof dataArray[i] != "undefined" && dataArray[i] != null) {
            y = Number(dataArray[i]);
            xcord = (divisionx * i) + marginx + divisionx / 2;
            ycord = (chartH - ((y - newmin) * plotRatio));
            datasetStr += xcord + "," + ycord + " ";
            tempArr.push(y);
        }
    } //successfully displaying Data String for plotting
    //draw tooltip
    x2 = marginx + chartH;
    y2 = marginy + chartH;
    /*  plot point contains dataArr which draws the coordinates
        and returns coordinates, element object
        tooltip contains tooltip rect and text per box object
        rect key contains rect height and width
    */
    line.plotPoints.push({
        dataArr: xaxis.drawPlottedData(datasetStr, 5, tempArr),
        tooltip: {
            tooltipBox: yaxis.drawBox(-90, -90, 30, 30, "tooltip", false),
            tooltipText: yaxis.drawSingleText(-90, -90, "", "tooltipTextClass", "middle", 14)
        },
        rect: { x2, y2 }
    });
};


Line.prototype.extendDiv = function(event, x, y, svg) {
    var line = this,
        divPoints;
    //position-extend div on mouse move
    divPoints = line.positionDragDiv(event, x, y, svg);
    //highLight selected div with dragdiv
    line.highLightPoints(divPoints[0], divPoints[1], divPoints[2], divPoints[3]);
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

            if (left < (x + 5) && currentPosX > (x - 5) && (y + 5) > top && (y - 5) < currentPosY) {
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
        //sync hairline with mousemove
        line.positionHairline(_hairline,e.detail.x);

    for (i in _plotPoints) {
        tooltip = _plotPoints[i].tooltip;
        rect = _plotPoints[i].rect;
        box = _plotPoints[i].tooltip.tooltipBox;
        text = _plotPoints[i].tooltip.tooltipText;
        box.setAttribute("style", "visibility:hidden");
        text.setAttribute("style", "visibility:hidden");

        for (j in _plotPoints[i].dataArr) {
            temp = Number(_plotPoints[i].dataArr[j].point);
            element = _plotPoints[i].dataArr[j].element;
            if (e.detail.x > (temp - 5) && e.detail.x < (temp + 5)) {

                box.setAttribute("style", "visibility:visible");
                text.setAttribute("style", "visibility:visible");
                data = _plotPoints[i].dataArr[j].data;
                currentPosX = e.detail.x;
                currentPosY = Number(_plotPoints[i].dataArr[j].pointy);
                if (e.detail.x > rect.x2 - rect.x2 / 5) {
                    currentPosX -= 90;
                } else {
                    currentPosX += 10;
                }
                if (currentPosY > rect.x2 - rect.x2 / 2) {
                    currentPosY -= 40;
                }
                line.manageTooltip(data, currentPosX, currentPosY, tooltip);
                element.setAttribute("style", "stroke:#8254A8;");
                element.setAttribute("r", "6");
            } else {
                element.setAttribute("style", "stroke:#1F7ACB");
                element.setAttribute("r", "5");
            }
        }
    }
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
