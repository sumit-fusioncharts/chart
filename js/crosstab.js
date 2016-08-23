//crosstab.js
function Crosstab(_jsonData) {
    this.jsonData = _jsonData;
}
Crosstab.prototype.draw = function() {
    //init will draw the outer svg
    var crosstab = this,
        jsonData = crosstab && crosstab.jsonData,
        data = jsonData && jsonData.data,
        svgDetails = jsonData && jsonData.svgDetails,
        model = jsonData && jsonData.model,
        zones = model && model.zones,
        productType = model && model.products,
        lenZones = zones.length,
        lenProducts = productType.length,
        info = jsonData && jsonData.chart,
        chartDiv = info && info.chartDiv,
        svgAppend = document.getElementById(chartDiv),
        svgW = svgDetails && svgDetails.svgWidth,
        svgH = svgDetails && svgDetails.svgHeight,
        svg,
        canvas,
        svgId = "svg",
        svgClass = svgId + "Class",
        isHorizontal = true;

    canvas = new Canvas();
    svg = canvas.createSvg(svgW, svgH, svgId, svgClass, svgAppend);

    xaxis = new Xaxis(canvas, svg);
    yaxis = new Yaxis(canvas, svg);

    crosstab.drawHeader(zones, xaxis, isHorizontal);
    crosstab.drawFooter(xaxis, isHorizontal);
    crosstab.drawBody(xaxis, yaxis);

};
Crosstab.prototype.drawHeader = function(_arr, _axis, _isHorizontal) {
    var crosstab = this,
        jsonData = crosstab && crosstab.jsonData,
        svgDetails = jsonData && jsonData.svgDetails,
        _width = svgDetails.svgWidth,
        _posTexts = "start",
        _id = "headerText",
        _idTicks = "headerTicks",
        _top = 40,
        _lenTick = 30,
        _numTicks = _arr.length,
        _verticalTicks = true;

    _axis.drawLabels(_width, _arr, 0, _top / 1.3, _id, _posTexts, 0.25, _isHorizontal);
    _axis.drawTicks(_lenTick, _width, _numTicks, 0, _top, _verticalTicks, _idTicks, 1);
    _axis.drawLines(_width, 1, 0, _top, _isHorizontal, _idTicks, 1);
};
Crosstab.prototype.drawFooter = function(_axis, _isHorizontal) {
    var crosstab = this,
        jsonData = crosstab && crosstab.jsonData,
        svgDetails = jsonData && jsonData.svgDetails,
        _width = svgDetails.svgWidth,
        _chartHeight = svgDetails.chartHeight,
        _top = 40,
        _x = _top + _chartHeight,
        _id = "footerLine";
};
Crosstab.prototype.drawBody = function(xaxis, yaxis) {
    var crosstab = this,
        jsonData = crosstab && crosstab.jsonData,
        svgDetails = jsonData && jsonData.svgDetails,
        data = jsonData && jsonData.data,
        info = jsonData && jsonData.chart,
        model = jsonData && jsonData.model,
        products = model && model.products,
        zones = model && model.zones,
        lenZones = zones.length,
        lenProducts = products.length,
        subProduct = model && model.axis,
        _width = svgDetails.svgWidth,
        barHeight = svgDetails && svgDetails.barHeight,
        barSpace = svgDetails && svgDetails.barSpace,
        chartWidth = svgDetails && svgDetails.chartWidth,
        chartHeight = svgDetails && svgDetails.chartHeight,
        lossColorMax = info.maxLossColor,
        lossColorMin = info.minLossColor,
        profitColorMax = info.maxProfitColor,
        profitColorMin = info.minProfitColor,
        i, j, k, dataarr1, dataarr2, currentPos = 0,
        maxValue, tempWidth, temp = 0,
        ypos = 25,
        sop, sop, ratioColor,
        space = barHeight + 2 * barSpace,
        pos = chartWidth * 0.25,
        subProductPos = chartWidth + pos,
        productsPos = pos;

    yaxis.drawTicks(chartHeight + 40, _width, lenZones, 0, chartHeight + 80, true, "verticalLines", 1);
    //draw lines as par subproducts numbers
    xaxis.drawCrossTabLines(40, 0, "horizontalLines", model, svgDetails);

    for (i in products) {
        for (j in subProduct[i]) {
            ypos += space;
            if (j == 0) {
                yaxis.drawLabels(chartHeight, products[i], productsPos, ypos, "Product", "start", 1, false);
            }
            yaxis.drawLabels(chartHeight, subProduct[i][j], subProductPos, ypos, "subProduct", "start", 1, false);
        }
    }
    ypos = 5;
    for (i in products) {
        for (j = 2; j < lenZones; j++) {
            temp = ypos;
            pos = chartWidth * j + 1;

            dataarr1 = data[currentPos].dataArr;
            dataarr2 = data[currentPos].dataArr1;
            maxValue = data[currentPos].newMaxMin[0];
            //temp = ypos; 
            for (k in dataarr1) {
                temp += space;
                if (dataarr1[k] != null) {
                    sop = dataarr2[k];
                    sos = dataarr1[k];
                    ratioColor = (Math.abs(sop) / sos);
                    if (sop < 0) { //loss
                        rectColor = crosstab.genColor(lossColorMax, lossColorMin, ratioColor);
                    } else {
                        rectColor = crosstab.genColor(profitColorMax, profitColorMin, ratioColor);
                    }
                    tempWidth = crosstab.plot(maxValue, dataarr1[k], chartWidth);
                    yaxis.drawBox(pos, temp, tempWidth, barHeight, "crosstabRect", false, rectColor);
                }
            }
            currentPos++;
        }
        ypos = temp;
    }
};
Crosstab.prototype.plot = function(max, sos, _width) {
    var plotRatio = (_width - 60) / max;
    return plotRatio * sos;
};
Crosstab.prototype.genColor = function(clr1, clr2, rto) {

    var color1 = clr1.substring(1, clr1.length);
    var color2 = clr2.substring(1, clr2.length);

    var ratio = rto;

    var hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
    var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
    var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

    var middle = hex(r) + hex(g) + hex(b);
    return middle;
}
