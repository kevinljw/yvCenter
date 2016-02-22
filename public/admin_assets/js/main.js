
$(document).ready(function() {

  // Place JavaScript code here...
  	$(".addNewBoard").click(function() {

  		var num=$(".eachBoard").length;
  		// console.log(num);
	    $("<tr class='eachBoard'>\
        	<td>"+num+"</td>\
        	<td>\
        		<input type='text' class='form-control' name='boardName'\
        		 value='"+$("#keyingBoardName").val()+"'/>\
        	</td>\
        	<td>\
        		<button class='deleteThisBoard btn btn-danger btn-xs' type='button'>\
                  	<i class='fa fa-minus'/>\
                </button>\
        	</td>\
          </td>").insertAfter("#boardForm > table > tbody > tr:last-child");
	    return false;
	});
	$(".addNewPage").click(function() {
  		var num=$(".eachPage").length;
  		// console.log(num);
	    $("<p class='eachPage'>\
	    	<label>"+num+"</label>\
	    	<input type='text' name='pageName'/>\
	    	<input type='text' name='pageId' style='display:none'/>\
	    	<span class='deleteThisPage'>\
	    		<i class='fa fa-minus-circle'/>\
	    	</span>\
	      </p>").insertAfter("#pageForm > p:last-child");
	    return false;
	});
	$(".addNewKeyword").click(function() {
  		var num=$(".eachKeyword").length;
  		// console.log(num);
	    $("<p class='eachKeyword'>\
	    	<label>"+num+"</label>\
	    	<input type='text' name='keywordName'/>\
	    	<span class='deleteThisKey'>\
	    		<i class='fa fa-minus-circle'/>\
	    	</span>\
	      </p>").insertAfter("#keywordForm > p:last-child");
	    return false;
	});
	$("#keywordForm").on("click",".deleteThisKey", function(e){ //user click on remove text
        e.preventDefault(); 
        $(this).parent().remove();
    });
	// $(".deleteThisPage").click(function() {
	// 	// console.log("D");
	// 	$(this).parent().remove();
	// });
	$("#pageForm").on("click",".deleteThisPage", function(e){ //user click on remove text
        e.preventDefault(); 
        $(this).parent().parent().remove();
    });
    $("#boardForm").on("click",".deleteThisBoard", function(e){ //user click on remove text
        e.preventDefault(); 
        $(this).parent().parent().remove();
    });
    $("#SearchResult").on("click",".addThisPage", function(e){ //user click on remove text
        var num=$(".eachPage").length;
        e.preventDefault(); 
        $("<tr class='eachPage'>\
        	<td>"+num+"</td>\
        	<td>\
        		<input type='text' class='form-control' name='pageName' value='"+$(this).parent().siblings("#sResultName").text()+"''></input>\
        		<input type='text' name='pageId' style='display:none' value='"+$(this).parent().siblings("#sResultId").text()+"'></input>\
        	</td>\
        	<td>\
        		<button class='deleteThisPage btn btn-danger btn-xs' type='button'>\
                  	<i class='fa fa-minus'/>\
                </button>\
        	</td>\
          </tr>").insertBefore("#pageForm > table > tbody > tr:last-child");
        $(this).closest(".tr").remove();
    });
    $("#hotBoardResult").on("click",".addThisBoard", function(e){ //user click on remove text
        var num=$(".eachBoard").length;
        e.preventDefault();
        $("<tr class='eachBoard'>\
        	<td>"+num+"</td>\
        	<td>\
        		<input type='text' class='form-control' name='boardName'\
        		 value='"+$(this).parent().siblings("#sResultName").text()+"'/>\
        	</td>\
        	<td>\
        		<button class='deleteThisBoard btn btn-danger btn-xs' type='button'>\
                  	<i class='fa fa-minus'/>\
                </button>\
        	</td>\
          </td>").insertBefore("#boardForm > table > tbody > tr:last-child");
        
        $(this).closest(".tr").remove();
    });
    
    
    $("#searchForm").submit(function(event){
	  // prevent default browser behaviour
	  event.preventDefault();
	  //do stuff with your form here

	  searchPage($('input[name="searchName"]').val());

	});

	$("#sourceFb").change(function() {
	    if(this.checked) {
	    	$("#fbPagesList").show();
	    	$("#pttBoardsList").hide();
	        // console.log("fb check");
	    }
	});
	$("#sourcePtt").change(function() {
	    if(this.checked) {
	    	$("#pttBoardsList").show();
	    	$("#fbPagesList").hide();
	        // console.log("fb check");
	    }
	});

});
function searchPage(queryStr){

	console.log(queryStr+"--forFBapi");
	FB.api('/search?q='+queryStr+'&type=page',{
		access_token : userToken,
	}, function(response) {
		$("#SearchResult").empty();
		response.data.forEach(function(sPage,sIndex){
			$("#SearchResult").append("\
			<tr>\
			    <td id='sResultIndex'>"+sIndex+"</td>\
			    <td id='sResultName'>"+sPage.name+"</td>\
			    <td id='sResultId' style='display: none'>"+sPage.id+"</td>\
			    <td>\
				    <a class='btn btn-info btn-xs viewThisPageBtn' href='https://www.facebook.com/"+sPage.id+"' role='button' target='_blank'>\
				    		<i class='fa fa-mobile'/>\
				    	預覽\
				    </a>\
				    <button class='btn btn-success btn-xs addThisPage'>\
				    	<i class='fa fa-plus'/>\
				    	加入\
				    </button>\
			    </td>\
			</tr>");
		});
	  // console.log(response.data);
	});
}



