// import Pair from './Pair.js';

function Attractor(world, position, mass) {
    this.world = world;
    this.position = position;
    this.mass = mass;
    this.radius = 20 + mass;
}

Attractor.prototype.isMouseOver = function(mouseX, mouseY) {
    var dx = this.position.x - mouseX;
	var dy = this.position.y - mouseY;

	var distance = Math.sqrt((dx * dx) + (dy * dy));
	return distance <= this.radius;
}

Attractor.prototype.render = function() {
	this.world.context.strokeStyle = "#003872";
    this.world.context.shadowBlur = 10;
    this.world.context.shadowColor = "#003E3E";
	this.world.context.beginPath();
    this.world.context.lineWidth = 2;
	this.world.context.arc((this.position.x - this.world.panOffsetX) * this.world.zoomMultiplier, (this.position.y - this.world.panOffsetY) * this.world.zoomMultiplier, this.radius * this.world.zoomMultiplier, 0,
        2*Math.PI);
	this.world.context.stroke();
}

Attractor.prototype.attractBalls = function() {
    var balls = this.world.balls;
    /* TODO: spazzing ballz happens when they touch near the centre!!!!!
    ** need to fix this !!!!! URGENT!!! DANGER!!!
    ** ALSO, DONT DRINK COFFEE!!!
    */
    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        let dx = this.position.x - ball.position.x;
		let dy = this.position.y - ball.position.y;
		let dist = Math.sqrt(dx*dx + dy*dy);

        if (dist > 800) {
            continue;
        }

        if (dist == 0) {
            dist = 0.01;
        }
		ball.velocity.x += dx / (dist*dist / this.mass);
		ball.velocity.y += dy / (dist*dist / this.mass);
    }
}
