var width = 0, height = 0;
var widthBallViewer = 0, heightBallViewer = 0;
var mouseDown = false;
var context;
var contextBallViewer;

var balls = [];
var initMousePressX = 0, initMousePressY = 0;
var finalMousePressX = 0, finalMousePressY = 0;

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function update(){
	// clear the screen 
	context.clearRect(0, 0, width, height);
	
	for (let b1 = 0; b1 < balls.length; b1++) {
		console.log("here");
		balls[b1].move();
		for (let b2 = 0; b2 < balls.length; b2++) {
			if (b2 != b1 && balls[b1].isCollided(balls[b2])) {
				balls[b1].setVelocityAfterCollision(balls[b2]);
			}
		}
		context.fillStyle = "#003E3E";
		context.beginPath();
		context.arc(balls[b1].position.x, balls[b1].position.y, balls[b1].radius, 0, 2*Math.PI);
		
		context.fill();
	}
	
	var radius = parseInt(document.getElementById("rangeRadius").value);
	
	if (mouseDown) {
		context.beginPath();
		context.moveTo(initMousePressX, initMousePressY);
		context.lineTo(finalMousePressX, finalMousePressY);
		context.stroke();
		
		context.beginPath();
		context.arc(initMousePressX, initMousePressY, radius, 0, 2*Math.PI);
		context.strokeStyle = "#cfffff";
		context.stroke();
	} else {
		context.beginPath();
		context.arc(finalMousePressX, finalMousePressY, radius, 0, 2*Math.PI);
		context.strokeStyle = "#cfffff";
		context.stroke();
	}
}

function updateBallViewer() {
	contextBallViewer.clearRect(0, 0, widthBallViewer, heightBallViewer);
	contextBallViewer.fillStyle = "#003E3E";
	contextBallViewer.beginPath();
	contextBallViewer.arc(widthBallViewer/2, heightBallViewer/2, document.getElementById("rangeRadius").value, 0, 2*Math.PI);
	contextBallViewer.fill();
}

function onChangeRangeRadius(e) {
	document.getElementById("labelRadius").innerHTML = document.getElementById("rangeRadius").value;
	updateBallViewer();
}

function onChangeRangeMass(e) {
	document.getElementById("labelMass").innerHTML = document.getElementById("rangeMass").value;
}

function createRandomBalls(amount) {
	for(let i = 0; i < 5; i++) { 
		let rndPosX = getRndInteger(100, worldWidth);
		let rndPosY = getRndInteger(100, worldHeight);
		let rndVelX = getRndInteger(1, 3) * (Math.round(Math.random()) * 2 - 1);
		let rndVelY = getRndInteger(1, 3) * (Math.round(Math.random()) * 2 - 1);
		let rndRadius = getRndInteger(10, 40);
		let b = new Ball(new Pair(rndPosX, rndPosY), new Pair(rndVelX, rndVelY), rndRadius, 10);
		balls.push(b);
	}
}

function clearBalls() {
	balls=[];
}

window.addEventListener("load", function (event) {
	var canvas = document.getElementById("canvas");
	var canvasBallViewer = document.getElementById("canvasBallViewer");
	
	document.getElementById("labelRadius").value = document.getElementById("rangeRadius").value;
	document.getElementById("labelMass").value = document.getElementById("rangeMass").value;
	
	
	context = canvas.getContext("2d");
	contextBallViewer = canvasBallViewer.getContext("2d");

	width = window.innerWidth - 400;
	height = window.innerHeight - 100;
	widthBallViewer = canvasBallViewer.width;
	heightBallViewer = canvasBallViewer.height;
	
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';
	canvas.width = width;
	canvas.height = height;

	worldWidth = width; // =context.canvas.width;
	worldHeight = height; // =context.canvas.height;
	
	canvas.addEventListener('mousedown', function(event){
		mouseDown = true;
		initMousePressX = event.pageX-this.offsetLeft-10;
		initMousePressY = event.pageY-this.offsetTop-10;
	});
	
	canvas.addEventListener('mouseup', function(event){
		mouseDown = false;
		var mass = parseInt(document.getElementById("rangeMass").value);
		var radius = parseInt(document.getElementById("rangeRadius").value);
		var position = new Pair(initMousePressX, initMousePressY);
		var velocity = new Pair((finalMousePressX-initMousePressX)/40, (finalMousePressY-initMousePressY)/40);
		var ball = new Ball(position, velocity, radius, mass);
		balls.push(ball);
	});
	
	canvas.addEventListener('mousemove', function(event){
		finalMousePressX = event.pageX-this.offsetLeft-10;
		finalMousePressY = event.pageY-this.offsetTop-10;
		update();
	});
	
	
	// create 5 balls
	createRandomBalls(5);
	
	updateBallViewer();
	
	// let the world run
	setInterval(update, 10);
});