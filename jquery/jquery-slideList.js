(function( $ ) {
 
	$.fn.slider = function() {
		$(this).find("li").each(function(){
			var span = $(this).children("span");
			var attr = span.attr("bindClickEventForSlide");
			if (attr == undefined || attr == "false") {
				span.click(function() {
					var ul = $(this).parent().children("ul");
					var li = $(this).parent().children("ul span:first");
					if (ul.hasClass("slider-up")) {
						ul.removeClass("slider-up");
						ul.slideDown();
						ul.addClass("slider-down");
						li.addClass("active");
					} else {
						ul.removeClass("slider-down");
						ul.slideUp();
						ul.addClass("slider-up");
						li.removeClass("active");
					}
				});
				span.attr("bindClickEventForSlide", "true");
			}
			$(this).children("ul").each(function(){
				var ul = $(this);
				if (!ul.hasClass("slider-up") && !ul.hasClass("slider-down")) {
					ul.addClass("slider-up");
					ul.slideUp();
					prepareList("#" + ul.attr("id"));
				}
			});

		});
	};
	$.fn.sliderDestroy = function() {
		$(this).children("li").each(function(){
			var span = $(this).children("span");
			$(this).children("ul").each(function(){
				var ul = $(this);
				ul.removeClass("slider-up");
				ul.removeClass("slider-down");
			});
		});
	};
 
}( jQuery ));
