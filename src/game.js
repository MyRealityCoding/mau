var MauGame = {

	init: function() {

		this.entities = [];

		var w = $(window).width();
		var h = $(window).height();
		var canvasElement = $("<canvas width='" + w + 
		                      "' height='" + h + "'></canvas>");
		$('body').html(canvasElement);	
	},	
	canvas: function(){
		return $('canvas');
	},
	context: function() {
		return this.canvas().get(0).getContext("2d");
	},
	width: function() {
		return this.canvas().width();
	},
	height: function() {
		return this.canvas().height();
	},
	update: function(dt) {
		for (var e in this.entities) {
			e.update(dt);
		}
	},
	draw: function() {
		this.context().clearRect(0, 0, this.width(), this.height());
		for (var e in this.entities) {
			e.draw(this.context());
		}
	},
	resize: function(w,h) {
		this.canvas().attr('width', w);
		this.canvas().attr('height', h);
		for (var e in this.entities) {
			e.resize(w,h);
		}
	},
	addEntity: function(entity) {
		this.entities.push(entity);
	}
};

var game = Object.create(MauGame);

$(document).ready(function() {

		game.init();

		var FPS = 30;

		setInterval(function() {
		  game.update(1);
		  game.draw();
		}, 1000 / FPS);
	});

// Always fit to window size
$(window).resize(function() {
	game.resize($(window).width(), $(window).height());
});