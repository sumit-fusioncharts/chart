//engine.js
function Engine(_object){
	if(_object==false){
		//unable to parse show error
	}
	this.obj = _object;
}
Engine.prototype.render = function(renderType){
	var engine = this,
		obj = engine && engine.obj,
        model = obj && obj.model,
        zones = model.zones,
        maxpz = model && model.maxperzone,
		info = obj && obj.chart,
		chartType = info && info.chartType, //throw error if undefined
		chartData = obj && obj.data,
		index,
        maxMinAvg,
        temp,
        canvas,
        svgHeight,
        svgWidth,
        chartHeight,
        chartWidth,
        marginx,
        marginy,
        i,
		j;

	if(typeof renderType === "undefined"){
		renderType = chartType;
	}

	if(renderType == "crosstab"){
        
        //set crostab width,height
        var barHeight = 30,
            barSpace = 5,
            height = 0,
            axis = model && model.axis;

        chartWidth = (typeof info.width === "undefined") ? 200 : info.width;
        svgWidth = chartWidth * zones.length;
        
        for(i in model.axis){
            height += model.axis[i].length * (2*barSpace+barHeight);
        }
        chartHeight = height;
        svgHeight = height+100;
        obj.svgDetails = {svgHeight:svgHeight,svgWidth:svgWidth,chartWidth:chartWidth,chartHeight:chartHeight,
            barHeight:barHeight,barSpace:barSpace};

        crosstab = new Crosstab(obj);
        crosstab.draw();

	}else if(renderType == "line" || renderType == "column"){
        if(chartType == "line" || chartType == "column"){
            for(i in chartData){
                //beautify max min
                maxMinAvg = chartData[i].maxMinAvg;
                temp = engine.beautify(maxMinAvg[0],maxMinAvg[1]);
                chartData[i].newMaxMin = temp;
            }        
        }

        svgWidth = (typeof info.width === "undefined") ? 400 : info.width;
        marginx = 50;
        chartWidth = svgWidth - marginx;
        svgHeight = (typeof info.height === "undefined") ? 400 : info.height;
        marginy = 50;
        chartHeight = svgHeight - marginy;

        obj.svgDetails = {svgHeight:svgHeight,svgWidth:svgWidth,chartHeight:chartHeight,chartWidth:chartWidth,
            marginx:marginx,marginy:marginy};

        if(renderType == "line"){
            line = new Line(obj);
            line.draw();
        }else{
            column = new Column(obj);
            column.draw();
        }
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
			if(__data[i]>temp){
				temp = __data[i];
			}
		}
	}
	return temp;
};

Engine.prototype.beautifyMax = function(_num){
		var temp = 1,
			val = _num;
	    length = Math.log(val) * Math.LOG10E + 1 | 0;
	    length -= 2;
	    while(length--){
	     temp = temp*10;
	    }
	    val = Math.ceil(val / temp) * temp;
	    return val;
};

Engine.prototype.countzeros = function(val){
        var cnt=0,len;
        for(var i=0;i<val.length;i++){
            if(val[i]=="0"){
                cnt++;
            }else{
                break;
            }
        }
        return cnt;
    }
Engine.prototype.addLeadingzeros = function(val,cnt){
    if(typeof val!="string"){val=val.toString();}
        while (val.length <= cnt){
            val = "0" + val;
        }
        return val;
    };
Engine.prototype.removeNeg = function(val){
        val = val.toString();
            if (val.substring(0, 1) == '-') {
            val = Number(val.substring(1));        
        }//now max does not contains "-"
        return val;
    };
Engine.prototype.genUp = function(val){
          var len = val.length,temp;
          if (len > 3) {
            temp = (Number(val[len - 3]) + 1) * 100;
            temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
          } else {
            temp = (Number(val[0]) + 1) * Math.pow(10, (len - 1));
          }
          return temp;
    };
Engine.prototype.genDown = function(val){
         var len = val.length,temp;
          if (len == 1) {
            temp = 0;
          } else {
             if (len > 3) {
                temp = (Number(val[len - 3])) * 100;
                temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
              } else {
                temp = (Number(val[0])) * Math.pow(10, (len - 1));
              }
        }
      return temp;
    };
Engine.prototype.beautify = function(max,min){
	var cnt=0,negMax=false,negMin=false,newmax,newmin;//typeval solid,single
            if(max<0){negMax=true;
                   max=this.removeNeg(max); 
                }
            if(max%1!=0){//decimal                    
                if(max<1){
                    newmax = max.toString().split(".")[1];
                    cnt=this.countzeros(newmax);//counting leading zeros
                    newmax = newmax.replace(/^0+/, '');//removing leading zeros
                    if(negMax==true){
                        newmax = this.genDown(newmax);
                        newmax = "-0."+this.addLeadingzeros(newmax,cnt);
                    }else{
                        newmax = this.genUp(newmax);
                        newmax = "0."+this.addLeadingzeros(newmax,cnt);
                    }
                }else{
                        newmax = max.toString().split(".")[0];
                        if(negMax==true){
                            newmax = "-"+this.genDown(newmax);
                        }else{
                            newmax = this.genUp(newmax);
                        }
                    }           
            }else{
                newmax = max.toString();
                if(negMax==true){
                    newmax = "-"+this.genDown(newmax);
                }else{
                    newmax = this.genUp(newmax);
                }
            }
            //+++++++++++++++++++++++
            if(min<0){negMin=true;
                    min=this.removeNeg(min);
                }
            if(min%1!=0){
                
                if(min<1){
                    newmin = min.toString().split(".")[1];//0.002,0.2,-0.5
                    cnt=this.countzeros(newmin);//counting leading zeros
                    newmin = newmin.replace(/^0+/, '');//removing leading zeros
                    if(negMin==true){
                        newmin = this.genUp(newmin);
                        newmin = "-0."+this.addLeadingzeros(newmin,cnt);
                    }else{
                        newmin = this.genDown(newmin);
                        newmin = "0."+this.addLeadingzeros(newmin,cnt);
                    }

                }else{
                    newmin = min.toString().split(".")[0];//2.34-down,(-2.34,neg=up) single-1
                        if(negMin==true){
                            newmin = "-"+this.genUp(newmin);
                        }else{
                            newmin = this.genDown(newmin);
                        }
                    }
                }else{
                    newmin = min.toString();
                    //normal 200-down,234-down,(200,neg=up)
                    if(negMin==true){
                        newmin = "-"+this.genUp(newmin);
                    }else{
                        newmin = this.genDown(newmin);
                    }
                }  
    return[Number(newmax),Number(newmin)]; 
};
