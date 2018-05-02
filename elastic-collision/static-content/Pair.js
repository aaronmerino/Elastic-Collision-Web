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
