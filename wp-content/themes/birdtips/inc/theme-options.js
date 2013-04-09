(function($){

	$(document).ready(function() {

		var f = $.farbtastic('#colorPickerDiv');
		$('.colorwell').each(function () { f.linkTo(this); }).focus(function() {
			f.linkTo(this);
		});

		$('.pickcolor').click( function(e) {
			f.linkTo($(this).siblings('.colorwell'));
			var offset = $(this).offset();
			$('#colorPickerDiv').css('top', (offset.top) + 'px');
			$('#colorPickerDiv').css('left', (offset.left) + 'px');
			$('#colorPickerDiv').show();
		});

		$(document).mousedown( function() {
			$('#colorPickerDiv').hide();
		});

		$('.default-color').click( function(e) {
			var color = $(this).text();
			f.linkTo($(this).siblings('.colorwell'));
			f.setColor(color);
		});
	});

})(jQuery);