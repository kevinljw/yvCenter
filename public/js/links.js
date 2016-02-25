$(document).ready(function() {

  for(var i=0; i<goodLinkPageNum; i++){
    $('#carousel_goodLink ol.carousel-indicators').append( '<li'+((i==0)?' class="active"':'')+' data-target="#carousel_goodLink-generic" data-slide-to="'+i+'"></li>' );
    $('#carousel_goodLink .carousel-inner.weblinks').append('<div class="item'+((i==0)?' active':'')+' col-md-offset-1 col-md-10"></div>');
  }

  if(isAllLink){
    for(var i=0; i<govPageNum; i++){
      $('#carousel_gov ol.carousel-indicators').append( '<li'+((i==0)?' class="active"':'')+' data-target="#carousel_gov-generic" data-slide-to="'+i+'"></li>' );
      $('#carousel_gov .carousel-inner.weblinks').append('<div class="item'+((i==0)?' active':'')+' col-md-offset-1 col-md-10"></div>');
    }
    for(var i=0; i<vcenterPageNum; i++){
      $('#carousel_vcenter ol.carousel-indicators').append( '<li'+((i==0)?' class="active"':'')+' data-target="#carousel_vcenter-generic" data-slide-to="'+i+'"></li>' );
      $('#carousel_vcenter .carousel-inner.weblinks').append('<div class="item'+((i==0)?' active':'')+' col-md-offset-1 col-md-10"></div>');
    }
    for(var i=0; i<servicePointPageNum; i++){
      $('#carousel_servicePoint ol.carousel-indicators').append( '<li'+((i==0)?' class="active"':'')+' data-target="#carousel_servicePoint-generic" data-slide-to="'+i+'"></li>' );
      $('#carousel_servicePoint .carousel-inner.weblinks').append('<div class="item'+((i==0)?' active':'')+' col-md-offset-1 col-md-10"></div>');
    }
  }
  // console.log(allLinksArr);
  // allLinksArr.forEach(function(eachLink){
  //   console.log('#carousel_'+eachLink.area+' .item');
  // });
  allLinksArr.forEach(function(eachLink){
    var index=0;
    while($('#carousel_'+eachLink.area+' .item:eq('+index+')').children().length>1){
      index++;
    }
    $('#carousel_'+eachLink.area+' .item:eq('+index+')').append('<div class="col-sm-6"><a href="'+eachLink.link+'" tartget="_blank"><img src="/uploads/'+eachLink.picture+'" alt="'+eachLink.name+'" height="160px"/><h3>'+eachLink.name+'</h3></a></div>');
  });
});

