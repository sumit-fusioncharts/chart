function ChartOrder(fun,obj){
	switch(fun){
        case "maxtomin": this.maxtomin();break;
        case "mintomax": this.mintomax();break;
        case "avgmaxtomin": this.avgmaxtomin();break; 
        case "avgmintomax": this.avgmintomax();break; 
        default : defaultorder();break;  
    }
}
