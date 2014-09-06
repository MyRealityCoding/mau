var Collisions = {
	on: function(entitityA,entityB) {

	},
	check: function(entityA,entities) {
		for (var i = 0; i < entities.length; ++i) {
			var entityB = entities[i];
			if (entityA !== entityB && entityA.collides(entityB)) {
				this.on(entityA,entityB);
			}
		}
	}
};

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

var EntityType = {
	None: 0,
	Mouse: 1,
	BadCat: 2,
	GoodCat: 3
};

var Entity = {

	x: 0,
	y: 0,
	w:160,
	h:160,
	sprite: null,
	type: EntityType.None,
	behavior: null,

	update: function(dt) {

	},

	draw: function(context) {
		if (this.sprite != null) {
			context.drawImage(this.sprite, this.x, this.y, this.w, this.h);
		}
	},

	resize: function(w,h) {

	},
	collides: function(other) {
		return (this.x >= other.x && this.y >= other.y
		&& this.x <= other.x + other.w && this.y <= other.y + other.h);
	}
};

var Game = {

	assets: Object.create(Assets),
	collisions: Object.create(Collisions),
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

			if (e.behavior != null) {
				e.behavior.update(e,this.delta);
			}
			e.update(this.delta);
			this.collisions.check(e,this.entities);
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

$(document).ready(function() {

		var RandomBehavior = {

			veloX : 0.0,
			veloY : 0.0,

			update: function(entity,dt) {
				this.veloX += (Math.random() < 0.5 ? Math.random() : -Math.random()) * 80.0;
				this.veloY += (Math.random() < 0.5 ? Math.random() : -Math.random()) * 80.0;
				entity.x += this.veloX * dt;
				entity.y += this.veloY * dt;

				// Prevent entity from leaving our world

				if (entity.x < 0) {
					entity.x = 0;
					this.veloX = 0;
				}

				if (entity.y < 0) {
					entity.y = 0;
					this.veloY = 0;
				}

				if (entity.x + entity.w > game.width()) {
					entity.x = game.width() - entity.w;
					this.veloX = 0;
				}

				if (entity.y + entity.h > game.height()) {
					entity.y = game.height() - entity.h;
					this.veloY = 0;
				}
			}
		}

		var TrackingBehavior = {

			target : null,

			update: function(entity,dt) {
				if (this.target != null) {
					entity.x += (this.target.x - entity.x) * dt * 0.5;
					entity.y += (this.target.y - entity.y) * dt * 0.5;
				}
			}
		}

		game.collisions.on = function(entityA,entityB) {
			// A: BadCat and B: GoodCat -> GAME OVER!
			if (entityA.type === EntityType.BadCat &&
				entityB.type === EntityType.GoodCat) {
				// TODO: GAME OVER HERE!
			} 
			// A: BadCat and B: Mouse -> GAME OVER!
			else if (entityA.type === EntityType.BadCat &&
				entityB.type === EntityType.Mouse) {
				// TODO: GAME OVER HERE!
			} 
			// A: Mouse and B: GoodCat -> WON!
			else if (entityA.type === EntityType.Mouse &&
				entityB.type === EntityType.GoodCat) {
				// TODO: WON HERE!
			}
		};

		function addRandomCat(game,type) {
			var cat = Object.create(Entity);
			cat.type = type;
			cat.x = Math.random() * game.width();
			cat.y = Math.random() * game.height();

			if (type === EntityType.GoodCat) {
				cat.sprite = game.assets.image("cat-good.png");
				cat.behavior = Object.create(RandomBehavior);
			} else if (type == EntityType.BadCat) {
				cat.sprite = game.assets.image("cat-bad.png");
				cat.behavior = Object.create(TrackingBehavior);
			}
			game.addEntity(cat);
			return cat;
		}

		game.init();
		var mouse = Object.create(Entity);
		mouse.type = EntityType.Mouse;
		mouse.x = 100;
		mouse.y = 200;
		mouse.w = 80;
		mouse.h = 80;
		mouse.sprite = game.assets.image("mouse.png");
		game.addEntity(mouse);

		mouse.update = function(dt) {
			this.x += (game.mouseX - mouse.x) * dt;
			this.y += (game.mouseY - mouse.y) * dt;
		};

		var badCat = addRandomCat(game, EntityType.BadCat);
		var goodCat = addRandomCat(game, EntityType.GoodCat);
		goodCat.w = 120;
		goodCat.h = 120;
		badCat.behavior.target = goodCat;
	
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