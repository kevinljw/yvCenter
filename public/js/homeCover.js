$(document).ready(function() {
 // var nowHomeCarouselIndex = 0;
 // console.log(allHomeCoverArr)
 for(var i=0; i<goodLinkPageNum; i++){
    $('#carousel_goodLink ol.carousel-indicators').append( '<li'+((i==0)?' class="active"':'')+' data-target="#carousel_goodLink-generic" data-slide-to="'+i+'"></li>' );
    $('#carousel_goodLink .carousel-inner.weblinks').append('<div class="item'+((i==0)?' active':'')+' col-md-offset-1 col-md-10"></div>');
  }
  
  allLinksArr.forEach(function(eachLink){
    var index=0;
    while($('#carousel_'+eachLink.area+' .item:eq('+index+')').children().length>1){
      index++;
    }
    $('#carousel_'+eachLink.area+' .item:eq('+index+')').append('<div class="col-sm-6"><a href="'+eachLink.link+'" tartget="_blank"><img src="/uploads/'+eachLink.picture+'" alt="'+eachLink.name+'" height="160px"/><h3>'+eachLink.name+'</h3></a></div>');
  });

  for(var i=0; i<homeCoverPageNum; i++){
    $('#carousel_home ol.carousel-indicators').append( '<li'+((i==0)?' class="active"':'')+' data-target="#carousel_home-generic" data-slide-to="'+i+'"></li>' );
    $('#carousel_home .carousel-inner.homeCovers').append('<div class="item'+((i==0)?' active':'')+' col-md-offset-1 col-md-10"></div>');
  }

  allHomeCoverArr.forEach(function(eachCover){
    var index=0;
    while($('#carousel_home .item:eq('+index+')').children().length>0){
      index++;
    }
    $('#carousel_home .item:eq('+index+')').append('<div class="col-sm-12"><a data-toggle="modal" data-target="#homeCoverModel"><img src="/uploads/'+eachCover.picture+'" alt="'+eachCover.title+'" height="320px"/><h3>'+eachCover.title+'</h3></a></div>');
  });

  // setHomeCoverModel(nowHomeCarouselIndex);

  $('#carousel_home .carousel-inner.homeCovers').click(function(){

      setHomeCoverModel($('#carousel_home ol.carousel-indicators li.active').attr('data-slide-to'));
  });
  // $('#carousel_home').bind('slide.bs.carousel', function (e) {
  //     nowHomeCarouselIndex++;
  //     if(nowHomeCarouselIndex>=allHomeCoverArr.length) nowHomeCarouselIndex=0;
  //     // console.log($('#homeCoverModel').css('display'));
  //     if($('#homeCoverModel').css('display')!='block') setHomeCoverModel(nowHomeCarouselIndex);
  //     // console.log('slide event!');
  // });

  
});

function setHomeCoverModel(index){

  $('#homeCoverModel .modal-dialog .modal-header .modal-title').text(allHomeCoverArr[index].title);
  $('#homeCoverModel .modal-dialog .modal-body')
    .html('<img src="/uploads/'+allHomeCoverArr[index].picture+'" width="98%" /><br><br><p>'+allHomeCoverArr[index].abstract.replace(/(?:\r\n|\r|\n)/g,'<p>')+'</p>');
  $('#homeCoverModel .modal-dialog .modal-footer .left-side a').attr('href', allHomeCoverArr[index].link)
}

