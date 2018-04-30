	// elastic collision

function Pair(x, y) {
	this.x = x;
	this.y = y;
}

Pair.prototype.normalize = function(){
	var magnitude = Math.sqrt( (this.x * this.x) + (this.y * this.y) );

	if (magnitude < 1)
		return;

	this.x = this.x / magnitude;
	this.y = this.y / magnitude;
}

function Ball(world, position, velocity, radius, mass) {
	this.world = world;
	this.position = position;
	this.velocity = velocity;
	this.radius = radius;
	this.mass = mass;
}

Ball.prototype.render = function() {
	this.world.context.fillStyle = "#003E3E";
	this.world.context.beginPath();
	this.world.context.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
	this.world.context.fill();
}

Ball.prototype.move = function() {
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;

	if(this.position.x - this.radius < 0){
		this.velocity.x = Math.abs(this.velocity.x);
	}

	if(this.position.x + this.radius > worldWidth){
		this.velocity.x = -Math.abs(this.velocity.x);
	}

	if(this.position.y - this.radius < 0){
		this.velocity.y = Math.abs(this.velocity.y);
	}

	if(this.position.y + this.radius > worldHeight){
		this.velocity.y = -Math.abs(this.velocity.y);
	}
}


Ball.prototype.isCollided = function(ball) {
	var dx = (this.position.x) - (ball.position.x);
	var dy = (this.position.y) - (ball.position.y);

	var distance = Math.sqrt( (dx * dx) + (dy * dy) );
	if ( distance <= this.radius + ball.radius ) {
		let offsetDistance = (this.radius + ball.radius) - distance + 1;

		if (distance == 0) {
			distance = 0.001;
		}

		let angle = Math.asin(dy / distance);
		if (dx < 0 && dy >= 0) {
			angle = Math.PI - Math.abs(angle);
		} else if (dx < 0 && dy < 0) {
			angle = Math.PI + Math.abs(angle);
		} else if (dx > 0 && dy < 0) {
			angle = 2*Math.PI - Math.abs(angle);
		}

		this.position.x += Math.cos(angle) * offsetDistance;
		this.position.y += Math.sin(angle) * offsetDistance;
		return true;
	}

	return false;
}

Ball.prototype.getAngle = function() {
	if (this.velocity.x == 0) this.velocity.x = 0.01;

	var angle = Math.atan(this.velocity.y/this.velocity.x);

	if (this.velocity.x < 0 && this.velocity.y >= 0) {
		angle = Math.PI - Math.abs(angle);
	} else if (this.velocity.x < 0 && this.velocity.y < 0) {
		angle = Math.PI + Math.abs(angle);
	}

	return angle;
}

Ball.prototype.setVelocityAfterCollision = function(ball) {
	// DETERMINE CONTACT ANGLE
	// -------------------------------------------------
	var dx = ball.position.x - this.position.x;
	var dy = ball.position.y - this.position.y;
	if (dx == 0) dx = 0.001;

	var contactAngle = Math.atan(dy/dx);
	if (dx < 0 && dy >= 0) {
		contactAngle = Math.PI - Math.abs(contactAngle);
	} else if (dx < 0 && dy < 0) {
		contactAngle = Math.PI + Math.abs(contactAngle);
	}
	// -------------------------------------------------

	var angle1 = this.getAngle();
	var speed1 = Math.sqrt((this.velocity.x * this.velocity.x) + (this.velocity.y * this.velocity.y));
	var angle2 = ball.getAngle();
	var speed2 = Math.sqrt((ball.velocity.x * ball.velocity.x) + (ball.velocity.y * ball.velocity.y));

	var newVelocityX = (((speed1*Math.cos(angle1-contactAngle)*(this.mass-ball.mass)+2*ball.mass*speed2*Math.cos(angle2-contactAngle))/(this.mass+ball.mass)) * Math.cos(contactAngle)) +
							speed1*Math.sin(angle1-contactAngle)*Math.cos(contactAngle + (Math.PI/2));

	var newVelocityY = ((speed1*Math.cos(angle1-contactAngle)*(this.mass-ball.mass)+2*ball.mass*speed2*Math.cos(angle2-contactAngle))/(this.mass+ball.mass)) * Math.sin(contactAngle) +
							speed1*Math.sin(angle1-contactAngle)*Math.sin(contactAngle + (Math.PI/2));

	var	newVelocity2X = (((speed2*Math.cos(angle2-contactAngle)*(ball.mass-this.mass)+2*this.mass*speed1*Math.cos(angle1-contactAngle))/(ball.mass+this.mass)) * Math.cos(contactAngle)) +
							speed2*Math.sin(angle2-contactAngle)*Math.cos(contactAngle + (Math.PI/2));

	var	newVelocity2Y = ((speed2*Math.cos(angle2-contactAngle)*(ball.mass-this.mass)+2*this.mass*speed1*Math.cos(angle1-contactAngle))/(ball.mass+this.mass)) * Math.sin(contactAngle) +
							speed2*Math.sin(angle2-contactAngle)*Math.sin(contactAngle + (Math.PI/2));


	this.velocity.x = newVelocityX;
	this.velocity.y = newVelocityY;

	ball.velocity.x = newVelocity2X;
	ball.velocity.y = newVelocity2Y;
}
