function getCanvas() {
	return $('canvas');
}

function getContext() {
	canvasElement = getCanvas();
	return canvasElement.get(0).getContext("2d");
}

function gameWidth() {
	return getCanvas().width();
}

function gameHeight() {
	return getCanvas().height();
}

function init() {
	var w = $(window).width();
	var h = $(window).height();
	var canvasElement = $("<canvas width='" + w + 
	                      "' height='" + h + "'></canvas>");
	$('body').html(canvasElement);	
}

function update(dt) {

}

function draw() {
	  getContext().clearRect(0, 0, gameWidth(), gameHeight());
}

$(document).ready(function() {

	init();

	var FPS = 30;

	setInterval(function() {
	  update(1);
	  draw();
	}, 1000 / FPS);
});

// Always fit to window size
$(window).resize(function() {
	getCanvas().attr('width', $(window).width());
	getCanvas().attr('height', $(window).height());
});