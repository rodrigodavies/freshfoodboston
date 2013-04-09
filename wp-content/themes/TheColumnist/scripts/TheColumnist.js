$(document).ready(function() {
	
 	$('a.show').click(function() {
		$('.entry').fadeIn(400);
		$('#older-posts').fadeOut(400);
		$('.thumbnail img').fadeOut(400);
		return false;
	});
	
	$('a.hide').click(function() {
		$('.entry').fadeOut(400);
		$('#older-posts').fadeIn(400);
		$('.thumbnail img').fadeIn(400);
		return false;
	});
	
	$('.thumbnail').hover(
		function() {
			$("img", this).fadeOut(400);
		},
		function() {
			$("img", this).fadeIn(400);
		}
	)
	
	$('.menu li').hover(
		function() {
			$("li", this).fadeIn(400);
		},
		function() {
			$("li", this).fadeOut(400);
		}
	)
	
	$('.menu li').hover(
		function() {
			$('div', this).fadeIn(400);
		},
		function() {
			$('div', this).fadeOut(400);
		}
	)
	
	$('.menu li ul li').hover(
		function() {
			$(this).children("ul").fadeIn(400);
		}
	)
});
