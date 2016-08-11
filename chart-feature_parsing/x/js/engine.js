//engine.js
function Engine(_object){
	if(_object==false){
		//unable to parse show error

	}
	this.model = _object;
}
Engine.prototype.render = function(){
	
	var engine = this,
		jsondata = engine && engine.model,
		data = jsondata && jsondata.data,
		lenData = data && data.length,
		info = jsondata && jsondata.chart,
		model = jsondata && jsondata.model,
		zones = model && model.zones,
		lenZones = zones.length,
		chartType = info && info.chartType,
		maxArr = [],
		minArr = [],
		scrWidth = window.innerWidth-20,
		scrHeight = window.innerHeight-20,
		svgW,
		svgH,
		pps,
		numOfCharts,
		barH,
		barMaxW,
		barS,
		crosstab,
		i;

		if (chartType == "line") {

		}else if(chartType == "column"){

		}else if(chartType == "crosstab"){
			//get max values according to zones && min set to 0
			for(i = 2;i < lenZones; i++){
				maxArr.push(this.beautifyMax(this.getMax(data,zones[i])));
			}

			svgW = scrWidth;
			svgH = scrHeight;
			pps = scrHeight/lenData;     //pixel per scale
			pps = (pps<4) ? 4 : pps;     //resetting pps to set bounds
			barS = (pps *25)/100; 		 //spaces between two bars
			barH = (pps - 2*barS) 		 //height of each bar
			barMaxW = scrWidth/lenZones; //width of each Chart

			jsondata.svg = {svgW,svgH,barS,barH,barMaxW}; //add svg information to json

			crosstab = new Crosstab(jsondata);
			crosstab.draw();

		}else{
			//throw Error

		}
};
Engine.prototype.getMax = function(_searchDirectry,_condition){
	var temp = 0,
		i,
		__condition = _condition,
		__data = _searchDirectry;
		
	if(typeof __condition != "undefined"){
		for(i in __data){
			if(__data[i].region == __condition){
				if(__data[i].sos>temp){
					temp = __data[i].sos;
				}
			}
		}
	}else{
		for(i in __data){
			if(__data[i].sos>temp){
				temp = __data[i].sos;
			}
		}
	}
	return temp;
};
Engine.prototype.beautifyMax = function(_num){
		var temp = 1,
			val = _num;
	    length =Math.log(val) * Math.LOG10E + 1 | 0;
	    length -= 2;
	    while(length--){
	     temp = temp*10;
	    }
	    val = Math.ceil(val / temp) * temp;
	    return val;
};
/*Engine.prototype = {
	beautifyMax : function(_num){
		var temp = 1,
			val = _num;
	    length =Math.log(val) * Math.LOG10E + 1 | 0;
	    length -= 2;
	    while(length--){
	     temp = temp*10;
	    }
	    val = Math.ceil(val / temp) * temp;
	    return val;
	}
};
Engine.prototype = {
	crosstab  : function(){

	},
	line : function(){

	},
	column : function(){

	}
};*/