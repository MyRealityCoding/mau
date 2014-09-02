var Assets = {

	images: {},

	image: function(src) {
		src = "img/" + src;
		if (!this.images[src]) {
			this.images[src] = new Image();
			this.images[src].src = src;
		}
		return this.images[src];
	}
};

var Entity = {

	x: 0,
	y: 0,
	w:10,
	h:10,
	sprite: null,

	update: function(dt) {
		
	},

	draw: function(context) {
		if (this.sprite != null) {
			context.drawImage(this.sprite, this.x, this.y, this.w, this.h);
		}
	},

	resize: function(w,h) {

	}
};

var Game = {

	init: function() {
		this.now = Date.now();
	    this.delta = 0;
	    this.then = this.now;
		this.entities = [];
		this.mouseX = 0;
		this.mouseY = 0;
		var w = $(window).width();
		var h = $(window).height();
		var canvasElement = $("<canvas width='" + w + 
		                      "' height='" + h + "'></canvas>");
		var game = this;

		function getMousePos(canvas, evt) {
	        var rect = canvas.getBoundingClientRect();
	        return {
	          x: evt.clientX - rect.left,
	          y: evt.clientY - rect.top
	        };
	      }
		$('body').html(canvasElement);
		canvasElement.get(0).addEventListener('mousemove', function(evt) {
	        var mousePos = getMousePos(canvasElement.get(0), evt);
	        game.mouseX = mousePos.x;
	        game.mouseY = mousePos.y;
      	}, false);
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
	update: function() {
		this.now = Date.now();
	    this.delta = (this.now - this.then) / 1000; // seconds since last frame
	    this.then = this.now;
		for (var i = 0; i < this.entities.length; ++i) {
			var e = this.entities[i];
			e.update(this.delta);
		}
	},
	draw: function() {
		this.context().clearRect(0, 0, this.width(), this.height());
		for (var i = 0; i < this.entities.length; ++i) {
			var e = this.entities[i];
			e.draw(this.context());
		}
	},
	resize: function(w,h) {
		this.canvas().attr('width', w);
		this.canvas().attr('height', h);
		for (var i = 0; i < this.entities.length; ++i) {
			var e = this.entities[i];
			e.resize(w,h);
		}
	},
	addEntity: function(entity) {
		this.entities.push(entity);
	}
};

var game = Object.create(Game);
var assets = Object.create(Assets);

$(document).ready(function() {

		game.init();
		var mouse = Object.create(Entity);
		mouse.x = 100;
		mouse.y = 200;
		mouse.w = 50;
		mouse.h = 50;
		mouse.sprite = assets.image("mouse.png");
		game.addEntity(mouse);

		mouse.update = function(dt) {
			this.x += (game.mouseX - mouse.x) * dt;
			this.y += (game.mouseY - mouse.y) * dt;
		};

		// Add cat
		var cat1 = Object.create(Entity);
		cat1.x = Math.random() * game.width();
		cat1.y = Math.random() * game.height();
		cat1.sprite = assets.image("mouse.png");
		cat1.update = function(dt) {
			this.x += Math.random() < 0.5 ? Math.random() : -Math.random();
			this.y += Math.random() < 0.5 ? Math.random() : -Math.random();
		};
		game.addEntity(cat1);
	
		var FPS = 60;

		setInterval(function() {
		  game.update();
		  game.draw();
		}, 1000 / FPS);
	});

// Always fit to window size
$(window).resize(function() {
	game.resize($(window).width(), $(window).height());
});