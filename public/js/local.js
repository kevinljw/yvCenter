$(document).ready(function() {

      var tooltip = d3.select(".thisTooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

      
      var districtVal = window.location.href.split('/');
      districtVal = districtVal[districtVal.length-1].split('#')[0];
      console.log(districtVal);
      if(districtVal!=''){
        d3.selectAll("#"+districtVal).style("fill", "#F3BB45");
        
        d3.selectAll("#"+districtVal).classed("clicked", true);
      }

      var kinmenSVGs = d3.selectAll("#kinmenSVG g")
      
      kinmenSVGs
        .on("mouseover", function(){
          if(!d3.select(this).classed("clicked")){
            d3.selectAll(this.childNodes).style("fill", "#7A9E9F");
          }  
          
          return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){
          if(!d3.select(this).classed("clicked")){
            d3.selectAll(this.childNodes).style("fill", "#7AC29A");
          }       
          return tooltip.style("visibility", "hidden");})
        .on("click", function(){
          window.location = '/youth/local/'+d3.select(this).attr('id')+'#kinmenTab';
          return true;
        });

      var taipeiSVGs = d3.selectAll("#taipeiSVG .oneDistrict")
      //- console.log(districtVal[districtVal.length-1])

      taipeiSVGs
        .on("mouseover", function(){
          if(!d3.select(this).classed("clicked")){
            d3.select(this).style("fill", "#7A9E9F");

          }  
          
          return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){
          if(!d3.select(this).classed("clicked")){
            d3.select(this).style("fill", "#7AC29A");
          }       
          return tooltip.style("visibility", "hidden");})
        .on("click", function(){

          window.location = '/youth/local/'+d3.select(this).attr('id')+'#taipeiTab';
          //- if(!d3.select(this).classed("clicked")){
          //-   d3.selectAll(".oneDistrict.clicked").style("fill", "#7AC29A").classed("clicked", false);
          //-   d3.select(this).style("fill", "#F3BB45");
          //-   d3.select(this).classed("clicked", true);
          //- }      
          return true;
        });
});