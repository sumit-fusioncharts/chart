//line.js
function Line(_jsonData) {
    this.jsonData = _jsonData;
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
        i, temp;

    canvas = new Canvas();

    for (i in data) {
        svg = canvas.createSvg(svgW, svgH, svgId, svgClass, svgAppend);
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
    var upperLimit = data.newMaxMin[0],
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

    //draw container
    box = yaxis.drawBox(marginx, marginy, _width, _height, "container", false);
    line.drawHairLine(box);
};

Line.prototype.plotData = function(data, svgDetails, xaxis, axis) {
    var newmax = data.newMaxMin[0],
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
        y,
        xcord,
        ycord,
        barHight,
        xaxisticks = axis.length,
        plotRatio = (chartH - 50) / (newmax - newmin);

    for (var i = 0; i < dataArrayLen; i++) {
        if (typeof dataArray[i] != "undefined" && dataArray[i] != null) {
            y = Number(dataArray[i]);
            xcord = (divisionx * i) + marginx + divisionx / 2;
            barHight = ((y - newmin) * plotRatio);
            ycord = (chartH - barHight);
            datasetStr += xcord + "," + ycord + " ";
        }
    } //successfully displaying Data String for plotting
    xaxis.drawPlottedData(datasetStr, 5);


};
Line.prototype.drawHairLine = function(box) {

    var rectLeft = box.getBoundingClientRect().left;
    // box.addEventListener("mousemove", function(event) {
    //     customEventHairLine.detail = { x: event.pageX };
    //     box.dispatchEvent(customEventHairLine);
    // }, false);
    var rollover = new CustomEvent("mouserollover",{
      "detail":{x:event.pageX,y:event.clientY, left:rectLeft}
    });
    box.dispatchEvent(customEventHairLine);
    box.addEventListener("mouserollover", moveCrosshair, false);
    //box.addEventListener("mouseout", hideCrossHair, false);
};

function moveCrosshair(e) {
    console.log(e.detail.x);
}
