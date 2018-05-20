// SEAN (허션) - process (prod. BYAT)
// pretty good song

function World(container) {
	this.balls = [];
	this.attractors = [];

	this.drawLines = true;
	this.canvas = document.createElement("canvas");
	this.context = this.canvas.getContext("2d");
	this.width = window.innerWidth - 400;
	this.height = window.innerHeight - 50;

	this.canvas.style.width = this.width + 'px';
	this.canvas.style.height = this.height + 'px';
	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.mouseGrab = false;
	this.mouseGrabbed = null;
	this.mouseGrabOffsetX = 0;
	this.mouseGrabOffsetY = 0;

	this.mouseDown = false;
	this.mouseOut = false;
	this.initMousePressX = 0;
	this.initMousePressY = 0;
	this.finalMousePressX = 0;
	this.finalMousePressY = 0;

	this.canvas.addEventListener('mouseout', (event) => {
		this.mouseOut = true;
	});

	this.canvas.addEventListener('mouseover', (event) => {
		this.mouseOut = false;
	});

	window.addEventListener('mousedown', (event) => {
		if (!this.mouseOut) {
			var rect = this.canvas.getBoundingClientRect();
			var scaleX = this.canvas.width / rect.width;
			var scaleY = this.canvas.height / rect.height;
			this.initMousePressX = (event.pageX - rect.left) * scaleX;
			this.initMousePressY = (event.pageY - rect.top) * scaleY;

			for (let i = 0; i < this.attractors.length; i++) {
				if (this.attractors[i].isMouseOver(this.initMousePressX,
					this.initMousePressY)) {
						this.mouseGrab = true;
						this.mouseGrabbed = this.attractors[i];
						this.mouseGrabOffsetX = this.finalMousePressX - this.mouseGrabbed.position.x;
						this.mouseGrabOffsetY = this.finalMousePressY - this.mouseGrabbed.position.y;
						break;
					}
			}

			this.mouseDown = true;
		}
	});

	window.addEventListener('mouseup', (event) => {
		if (!this.mouseOut && this.mouseDown && !this.mouseGrab) {
			var mass = parseInt(document.getElementById("rangeMass").value);
			var radius = parseInt(document.getElementById("rangeRadius").value);
			var position = new Pair(this.initMousePressX, this.initMousePressY);
			var velocity = new Pair((this.finalMousePressX - this.initMousePressX) / 40,
									(this.finalMousePressY - this.initMousePressY) / 40);
			var ball = new Ball(this, position, velocity, radius, mass);
			this.balls.push(ball);
		}
		this.mouseDown = false;
		this.mouseGrab = false;
		this.mouseGrabbed = null;
	});

	this.canvas.addEventListener('mousemove', (event) => {
		var rect = this.canvas.getBoundingClientRect();
		var scaleX = this.canvas.width / rect.width;
		var scaleY = this.canvas.height / rect.height;
		this.finalMousePressX = (event.pageX - rect.left) * scaleX;
		this.finalMousePressY = (event.pageY - rect.top) * scaleY;

		if (this.mouseGrab) {
			this.mouseGrabbed.position.x = this.finalMousePressX - this.mouseGrabOffsetX;
			this.mouseGrabbed.position.y = this.finalMousePressY - this.mouseGrabOffsetY;
		}
		this.render();
	});
	container.insertBefore(this.canvas, container.childNodes[0]);
}

World.prototype.initialize = function() {
	this.attractors.push(new Attractor(this, new Pair(this.width/2 - 200, this.height/2), 2));
	this.attractors.push(new Attractor(this, new Pair(this.width/2 + 200, this.height/2), 2));
	this.createRandomBalls(3);
}

World.prototype.clearBalls = function() {
	this.balls = [];
}

World.prototype.resizeCanvas = function() {
	this.width = window.innerWidth - 400;
	this.height = window.innerHeight - 50;
	this.canvas.style.width = this.width + 'px';
	this.canvas.style.height = this.height + 'px';
	this.canvas.width = this.width;
	this.canvas.height = this.height;
}

/*
	move all elements in the world in one tick
*/
World.prototype.tick = function() {
	for (let i = 0; i < this.attractors.length; i++) {
		this.attractors[i].attractBalls();
	}

	for (let b1 = 0; b1 < this.balls.length; b1++) {
		this.balls[b1].move();
		for (let b2 = 0; b2 < this.balls.length; b2++) {
			if (b1 !== b2 && this.balls[b1].isCollided(this.balls[b2])) {
				this.balls[b1].setVelocityAfterCollision(this.balls[b2]);
			}
		}
	}
}

World.prototype.render = function() {
	this.context.clearRect(0, 0, this.width, this.height);

	if (this.drawLines) {
		for (let b1 = 0; b1 < this.balls.length; b1++) {
			for (let b2 = b1+1; b2 < this.balls.length; b2++) {
				var dx = this.balls[b1].position.x - this.balls[b2].position.x;
				var dy = this.balls[b1].position.y - this.balls[b2].position.y;
				var thickness = 1 / Math.sqrt((dx * dx) + (dy * dy))*200;
				if (thickness > 0.2) {
					this.context.beginPath();
					this.context.lineWidth = thickness > 2 ? 2 : thickness;
					this.context.strokeStyle = "#003E3E";
					this.context.shadowBlur = 0;
					//this.context.shadowColor = "#003E3E";
					this.context.moveTo(this.balls[b1].position.x,
						this.balls[b1].position.y);
					this.context.lineTo(this.balls[b2].position.x,
						this.balls[b2].position.y);
					this.context.stroke();
				}
			}
		}
	}

	for (let i = 0; i < this.balls.length; i++) {
		this.balls[i].render();
	}

	for (let i = 0; i < this.attractors.length; i++) {
		this.attractors[i].render();
	}

	var radius = parseInt(document.getElementById("rangeRadius").value);
	this.context.shadowBlur = 0;
	if (!this.mouseOut && !this.mouseGrab) {
		if (this.mouseDown) {
			this.context.beginPath();
			this.context.lineWidth = 1;
			this.context.strokeStyle = "#cfffff";
			this.context.moveTo(this.initMousePressX, this.initMousePressY);
			this.context.lineTo(this.finalMousePressX, this.finalMousePressY);
			this.context.stroke();

			this.context.beginPath();
			this.context.arc(this.initMousePressX, this.initMousePressY,
				radius, 0, 2*Math.PI);
			this.context.stroke();
		} else {
			this.context.beginPath();
			this.context.lineWidth = 1;
			this.context.arc(this.finalMousePressX, this.finalMousePressY,
				radius, 0, 2*Math.PI);
			this.context.strokeStyle = "#cfffff";
			this.context.stroke();
		}
	}
}

World.prototype.createRandomBalls = function(amount) {
	for(let i = 0; i < amount; i++) {
		let rndPosX = getRndInteger(100, this.width);
		let rndPosY = getRndInteger(100, this.height);
		//let rndVelX = getRndInteger(1, 2) * (Math.round(Math.random()) * 2 - 1);
		//let rndVelY = getRndInteger(1, 2) * (Math.round(Math.random()) * 2 - 1);
		let rndVelX = 0;
		let rndVelY = 0;
		let rndRadius = 5;
		let b = new Ball(this, new Pair(rndPosX, rndPosY), new Pair(rndVelX, rndVelY), rndRadius, 10);
		this.balls.push(b);
	}
}
