$(document).ready(function() {
    $("#whatever_time").change(function(){
      // console.log("whatever click")
      $(".time_item").toggleClass('checked', $(this).prop("checked") );
    });
  
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

    // $("select#area").on('change', function() {
    // console.log('#area')
    //   if ($("#area option[value='2']").attr('selected')) {
    //       console.log('option[value="2"]')
    //     $('#inserForm_here.form-group').html('<label for="abstract" class="col-sm-4 control-label">簡介\
    //           <div class="col-sm-6">\
    //             <textarea type="text" name="abstract" id="abstract" class="form-control"></textarea>\
    //           </div>\
    //     </label>')
    //   }
    //   else{
    //     $('#inserForm_here.form-group').empty();
    //   }
    // });
    
});


