//xaxis.js
function Xaxis(_canvas, _svg) {
    Axis.call(this, _canvas, _svg);
    this.arr = [];
}
Xaxis.prototype = Object.create(Axis.prototype);
Xaxis.prototype.constructor = Xaxis;
Xaxis.prototype.draw = function(_drawingObj) {
    var xaxis = this,
        canvas = xaxis && xaxis.canvas,
        svg = xaxis && xaxis.svg,
        svgDetails = xaxis && xaxis.svgDetails,
        drawingObj = _drawingObj,
        i;
    //xaxis.drawTicks(_lenTick,_width,_numTicks,_x,_y,_isVertical,_id,_posTicks);
};
Xaxis.prototype.drawCrossTabLines = function(top, left, _id, model, svgDetails) {

    var axis = this,
        svg = axis && axis.element,//svg in which the data will be ploted
        canvas = axis && axis.canvas,//canvas instanse
        id = _id,
        classname = _id + "Class",
        products = model.products,
        subProducts = model.axis,
        svgDetails = svgDetails,
        barH = svgDetails.barHeight,
        barS = svgDetails.barSpace,
        svgW = svgDetails.svgWidth,
        i,
        num;

    for (i in products) {
        num = subProducts[i].length * (2 * barS + barH);
        top += num;
        canvas.createLines(svg, left, top, svgW, top, classname, id);
    }
};
Xaxis.prototype.drawPlottedData = function(dataset, radius, arr) {
    var axis = this,
        svg = axis && axis.element,//svg in which the data will be ploted
        canvas = axis && axis.canvas,//canvas instanse
        xy = dataset.split(" "),
        xyCor,
        pathstr = "",
        i,
        pathLine,
        circleArr = [],
        xyCorlen = xy.length - 1,
        circleElement;

    //canvas.createPoly(svg,dataset);

    for (i = 0; i < xyCorlen; i++) {
        xyCor = xy[i].split(',');
        if (i == 0) {
            pathstr += "M" + xyCor[0] + "," + xyCor[1] + " ";
        } else {
            pathstr += "L" + xyCor[0] + "," + xyCor[1] + " ";
        }
    }

    pathLine = canvas.createPath(svg, pathstr);

    for (i = 0; i < xyCorlen; i++) {
        xyCor = xy[i].split(',');
        circleElement = canvas.createCirles(svg, xyCor[0], xyCor[1], radius);
        circleElement.setAttribute("style", "visibility:hidden");
        circleArr.push(circleElement);
        axis.arr.push({
            point: xyCor[0],
            pointy: xyCor[1],
            element: circleElement,
            data: arr[i]
        });
    }
    axis.animatePath(pathLine);
    axis.animateCircle(circleArr);
    return axis.arr;

};
Xaxis.prototype.animateCircle = function(_circleArr) {
    var i, 
    	len = _circleArr.length,
        time = 2000 / len;
    for (i = 0; i < len; i++) {
        //dealing with each circle element
        (function(i) {
            setTimeout(function() {
                _circleArr[i].setAttribute("style", "visibility:visible");
                _circleArr[i].setAttribute("r", "7");
                _circleArr[i].setAttribute("style", "fill:#6de0d8");
                setTimeout(function() {
                    _circleArr[i].setAttribute("r", "5");
                    _circleArr[i].setAttribute("style", "fill:#fff");
                }, 300);

            }, time * (i + 0.5));
        })(i);
    }
};
Xaxis.prototype.animatePath = function(_pathLine) {

    var length = _pathLine.getTotalLength();
    // Clear any previous transition
    _pathLine.style.transition = _pathLine.style.WebkitTransition =
        'none';
    // Set up the starting positions
    _pathLine.style.strokeDasharray = length + ' ' + length;
    _pathLine.style.strokeDashoffset = length;
    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    _pathLine.getBoundingClientRect();
    // Define our transition
    _pathLine.style.transition = _pathLine.style.WebkitTransition =
        'stroke-dashoffset 2s ease-in-out';
    // animating
    _pathLine.style.strokeDashoffset = '0';
}
Xaxis.prototype.drawColumnData = function(dataset, width, arr) {
    var axis = this,
        svg = axis && axis.element, //svg in which the data will be ploted
        canvas = axis && axis.canvas,
        top = svg.getBoundingClientRect().top,
        xy = dataset.split(" "),
        width = (typeof width === "undefined") ? 10 : width,
        xyCor,
        barElement,
        i,
        tempObj,
        xyCorlen = xy.length - 1;
    for (i = 0; i < xyCorlen; i++) {
        xyCor = xy[i].split(',');

        tempObj = {
            point: xyCor[0],
            pointy: xyCor[1],
            width: width,
            height: xyCor[2],
            pointx2: xyCor[3],
            top: top,
            data: arr[i]
        };
        barElement = axis.animateColumn(canvas, svg, tempObj);
        // barElement = axis.animateColumn(canvas, svg, tempObj);

        tempObj.element = barElement;
        axis.arr.push(tempObj);
    }

    return axis.arr;
};
Xaxis.prototype.animateColumn = function(canvas, svg, obj) {
    var _obj = obj,
        _steps = 10,
    	_x = Number(_obj && _obj.point),
        _y = Number(_obj && _obj.pointy),
        _height = Number(_obj && _obj.height),
        _width = Number(_obj && _obj.width),
        _y2 = _y + _height,
        _divison = _height / _steps,
        _tempY = _y2 - _divison,
        _tempHeight = _divison,
        id = "bar",
        rectClass = id + "Class",
        i,
        barElement = canvas.createRect(svg, _x, _tempY, _tempHeight, _width, id, rectClass, "#096AB5");
    for (i = 0; i < _steps; i++) {
        (function(j) {
            setTimeout(function() {
                _tempY = _y2 - _divison*j;
                _tempHeight = _divison*j;
                barElement.setAttribute("y",_tempY);
                barElement.setAttribute("height",_tempHeight);
            }, j*10);     
        })(i);
    }
    return barElement;
};
Xaxis.prototype.drawHairLine = function(x, y1, y2, id) {
    var axis = this,
        svg = axis && axis.element,
        canvas = axis && axis.canvas,
        classname = id + "Class",
        hairline = canvas.createLines(svg, x, y1, x, (y1 + y2), classname, id);
    hairline.setAttribute("visibility", "hidden");
    return hairline;
};
