
var qqtop = -$("#nc_im .new_qqkf span").height()/2 +50;
	var qqdl = -$("#nc_im .new_qqdl span").height()/2 +50;
	$("#nc_im .new_qqkf span").css("top",qqtop);
	$("#nc_im .new_qqdl span").css("top",qqdl);
	$("#nc_im .im_bg").mouseover(function(){
	  $(this).find("span,em").stop().fadeIn();
	});
	$("#nc_im .im_bg").mouseout(function(){
	  $(this).find("span,em").stop().fadeOut();
	});
	$("#nc_im .im_bg .im_top").click(function () {
        var speed=300;
        $('body,html').animate({ scrollTop: 0 }, speed);
        return false;
	})

