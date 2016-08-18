window.onload=function(){
  var xmlhttp= new XMLHttpRequest(),
      mychart,
      chart;
  xmlhttp.onreadystatechange = function(){   
    if ( xmlhttp.readyState === 4 && xmlhttp.status === 200 ) {
      mychart = new ParseData(JSON.parse(xmlhttp.responseText));
      chart = new Engine(mychart);
      chart.render("column");
    }
  };
  xmlhttp.open('GET','json/data.json',true);
  xmlhttp.send();
};
