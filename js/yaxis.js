//Yaxis.js
function Yaxis(_canvas,_svg,_svgDetails){
	Axis.call(this,_canvas,_svg);
	this.svgDetails = _svgDetails;
}
Yaxis.prototype = Object.create(Axis.prototype);
Yaxis.prototype.constructor = Yaxis;