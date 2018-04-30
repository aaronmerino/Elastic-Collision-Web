// SEAN (허션) - process (prod. BYAT)
// pretty good song

function World(container) {
	this.balls = [];
	this.canvas = document.createElement("canvas");
	this.context = this.canvas.getContext("2d");
	this.width = window.innerWidth - 400;
	this.height = window.innerHeight - 100;

	this.canvas.style.width = this.width + 'px';
	this.canvas.style.height = this.height + 'px';
	this.canvas.width = this.width;
	this.canvas.height = this.height;


	this.mouseDown = false;
	this.initMousePressX = 0;
	this.initMousePressY = 0;
	this.finalMousePressX = 0;
	this.finalMousePressY = 0;

	this.canvas.addEventListener('mousedown', (event) => {
		this.initMousePressX = event.pageX - this.canvas.offsetLeft - 10;
		this.initMousePressY = event.pageY - this.canvas.offsetTop - 10;
		this.mouseDown = true;
	});

	this.canvas.addEventListener('mouseup', (event) => {
		var mass = parseInt(document.getElementById("rangeMass").value);
		var radius = parseInt(document.getElementById("rangeRadius").value);
		var position = new Pair(this.initMousePressX, this.initMousePressY);
		var velocity = new Pair((this.finalMousePressX - this.initMousePressX) / 40,
														(this.finalMousePressY - this.initMousePressY) / 40);
		var ball = new Ball(this, position, velocity, radius, mass);
		this.mouseDown = false;
		this.balls.push(ball);
	});

	this.canvas.addEventListener('mousemove', (event) => {
		this.finalMousePressX = event.pageX - this.canvas.offsetLeft - 10;
		this.finalMousePressY = event.pageY - this.canvas.offsetTop - 10;
		this.render();
	});
	container.insertBefore(this.canvas, container.childNodes[0]);
}

World.prototype.clearBalls = function() {
	this.balls = [];
}

World.prototype.resizeCanvas = function() {
	this.width = window.innerWidth - 400;
	this.height = window.innerHeight - 100;
	this.canvas.style.width = this.width + 'px';
	this.canvas.style.height = this.height + 'px';
	this.canvas.width = this.width;
	this.canvas.height = this.height;
}

/*
	move all elements in the world in one tick
*/
World.prototype.tick = function() {
	for (let b1 = 0; b1 < this.balls.length; b1++) {
		this.balls[b1].move();
		for (let b2 = 0; b2 < this.balls.length; b2++) {
			if (b2 != b1 && this.balls[b1].isCollided(this.balls[b2])) {
				this.balls[b1].setVelocityAfterCollision(this.balls[b2]);
			}
		}
	}
}

World.prototype.render = function() {
	this.context.clearRect(0, 0, this.width, this.height);

	for (let i = 0; i < this.balls.length; i++) {
		this.balls[i].render();
	}

	var radius = parseInt(document.getElementById("rangeRadius").value);

	if (this.mouseDown) {
		this.context.beginPath();
		this.context.moveTo(this.initMousePressX, this.initMousePressY);
		this.context.lineTo(this.finalMousePressX, this.finalMousePressY);
		this.context.stroke();

		this.context.beginPath();
		this.context.arc(this.initMousePressX, this.initMousePressY, radius, 0, 2*Math.PI);
		this.context.strokeStyle = "#cfffff";
		this.context.stroke();
	} else {
		this.context.beginPath();
		this.context.arc(this.finalMousePressX, this.finalMousePressY, radius, 0, 2*Math.PI);
		this.context.strokeStyle = "#cfffff";
		this.context.stroke();
	}
}

World.prototype.createRandomBalls = function(amount) {
	for(let i = 0; i < 5; i++) {
		let rndPosX = getRndInteger(100, worldWidth);
		let rndPosY = getRndInteger(100, worldHeight);
		let rndVelX = getRndInteger(1, 3) * (Math.round(Math.random()) * 2 - 1);
		let rndVelY = getRndInteger(1, 3) * (Math.round(Math.random()) * 2 - 1);
		let rndRadius = getRndInteger(10, 40);
		let b = new Ball(this, new Pair(rndPosX, rndPosY), new Pair(rndVelX, rndVelY), rndRadius, 10);
		this.balls.push(b);
	}
}
