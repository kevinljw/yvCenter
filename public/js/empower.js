$(document).ready(function() {
 // var nowHomeCarouselIndex = 0;
 
  $('.eachMentor').click(function(){

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
    .html('<img src="/uploads/'+allHomeCoverArr[index].picture+'" width="98%" /><p><p>'+allHomeCoverArr[index].abstract+'</p>');
  $('#homeCoverModel .modal-dialog .modal-footer .left-side a').attr('href', allHomeCoverArr[index].link)
}

