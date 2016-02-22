$(document).ready(function() {

  // Place JavaScript code here...
  $(window).scroll(function(e){
    parallax();
	});

	function parallax(){
	    var scrolled = $(window).scrollTop();
	    $('.bg').css('background-position','center '+(-(scrolled*0.4))+'px');
	}
	
    function toggleAllTime(source) {
      console.log("toggleAllTime(source)");
      checkboxes = document.getElementsByName('time');
      checkboxes.forEach(function(checkbox){
        checkbox.checked = source.checked;
      });
      
    }
});