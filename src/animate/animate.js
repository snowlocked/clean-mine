function init(){
  window.requestAnimationFrame(draw);
}
let x=0,y=0
let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d');
canvas.lineWidth=5
canvas.strokeStyle="#eeddcc"
function draw() {
	context.save()
	context.moveTo(x,y)
	context.lineTo(x++,y++)
	y++
	context.stroke()
	context.restore()
	window.requestAnimationFrame(draw);
}

init();