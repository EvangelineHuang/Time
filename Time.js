var json_data=d3.json("gradeDataTime.json");
var w=600;
var h=500;
var padding=20;
var maxDay=9;
var margin={
  top:20,
  bottom:20,
  left:20,
  right:20
}
var xScale=d3.scaleLinear()
             .domain([0.,4])
             .range([0,w-margin.left-margin.right-150])
var yScale=d3.scaleLinear()
             .domain([0,100])
             .range([0,h-margin.top-margin.bottom]);
var yScale2=d3.scaleLinear()
              .domain([0,100])
              .range([h-margin.top-margin.bottom,0]);
var colorscale=d3.scaleOrdinal(d3.schemePastel1);

//////////////////////////////////////////////////////////////
var initial=function(data,day){


var svg=d3.select("svg")
          .attr("width",w)
          .attr("height",h);

var rect=svg.append("g")
            .classed("rects",true)
            .attr("transform","translate(30,-20)")
            .selectAll("rect")
             .data(data[day].grades)
             .enter()
             .append("rect")
             .transition()
             .duration(1000)
             .attr("x",function(d,i){
               return xScale(i);
             })
             .attr("y",function(d){
               return h-yScale(d.grade);
             })
             .attr("width",(w-150)/4-padding)
             .attr("height",function(d){
               return yScale(d.grade);
             })
             .attr("fill",function(d){
               return colorscale(d.name);
             });
var xAxis=d3.axisBottom(xScale)
            .tickValues([0,1,2,3,4]);
var yAxis=d3.axisLeft(yScale2)
            .ticks(11);
svg.append("g")
   .classed("axis",true)
   .call(xAxis)
   .attr("transform","translate("+(margin.left+5)+","+(h-margin.top)+")");
svg.append("g")
   .classed("axis",true)
   .call(yAxis)
   .attr("transform","translate("+(margin.left+5)+","+margin.top+")");

svg.append("g")
   .selectAll("rect")
   .data(data[day].grades)
   .enter()
   .append("rect")
   .attr("x",475)
   .attr("y",function(d,i){
     return i*35+110;})
   .attr("width",25)
   .attr("height",25)
   .attr("fill",function(d){
     return colorscale(d.name);
   })

   svg.append("g")
      .selectAll("text")
      .data(data[day].grades)
      .enter()
      .append("text")
      .attr("x",520)
      .attr("y",function(d,i){
        return i*35+130;})
      .text(function(d){
        return d.name;
      })
    svg.append("g")
       .classed("date",true)
       .append("text")
       .attr("x",475)
       .attr("y",30)
       .text("Day:"+data[day].day)


nextDay(data,day);
prevDay(data,day);
newData(data,day);
}
//////////////////////////////////////////////
var change=function(data,day){

d3.selectAll("rect")
  .data(data[day].grades)
  .transition()
  .attr("y",function(d){
      return h-yScale(d.grade);
  })
  .attr("height",function(d){
      return yScale(d.grade);
  });

  d3.select(".date text")
    .text("Day:"+data[day].day);
nextDay(data,day);
prevDay(data,day);
newData(data,day);

}
//////////////////////////////////////////////

var prevDay=function(data,day){
  if(day>0 && day<=maxDay){
  d3.select("#prev")
    .attr("disabled",null)
    .on("click",function(){change(data,day-1)});}
  else{
  d3.select("#prev")
    .attr("disabled",true);
  }
}

var nextDay=function(data,day){
  if(day>=0 && day<maxDay){
    d3.select("#next")
      .attr("disabled",null)
      .on("click",function(){change(data,day+1)});}
  else{
    d3.select("#next")
      .attr("disabled",true);
      }
}

////////////////////////////////////////////////
json_data.then(function(d){
             initial(d,0);
           },
           function(err){
             console.log(err);
           })
//////////////////////////////////////////////
var newData=function(data,day)
{
  d3.select("#submit")
    .on("click",function(){
  maxDay=maxDay+1;
  var fred=document.getElementById("Fred").value;
  var sally=document.getElementById("Sally").value;
  var karl=document.getElementById("Karl").value;
  var nancy=document.getElementById("Nancy").value;
  var newdata=[{name:"Fred",grade:fred},{name:"Sally",grade:sally},{name:"Karl",grade:karl},{name:"Nancy",grade:nancy}]
  json_data.then(function(d){
               d.push({day:maxDay+1,grades:newdata})
             },
             function(err){
               console.log(err);
             })
  nextDay(data,day);})
}
