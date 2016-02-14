$(document).ready(function() {

  // Place JavaScript code here...
  $(window).scroll(function(e){
    parallax();
	});

	function parallax(){
	    var scrolled = $(window).scrollTop();
	    $('.bg').css('background-position','center '+(-(scrolled*0.4))+'px');
	}
});