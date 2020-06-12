//xml object for testing
// var text = new XML(); 
// var parser, xmlDoc;


// text = "<note activities='hi'>" +
// "<to>Tove</to>" +
// "<from>Jani</from>" +
// "<heading>Reminder</heading>" +
// "<body>Don't forget me this weekend!</body>" +
// "</note>";

// let layers = text.getElementsByTagName("Layer");
// console.log(text);
// console.log(layer[1].grainSizeUnits2);

// parser = new DOMParser();
// xmlDoc = parser.parseFromString(text, "text/xml");

// document.getElementById("to").innerHTML =
// xmlDoc.getElementsByTagName("to")[0].childNodes[0].nodeValue;
// document.getElementById("from").innerHTML =
// xmlDoc.getElementsByTagName("from")[0].childNodes[0].nodeValue;
// document.getElementById("message").innerHTML =
// xmlDoc.getElementsByTagName("body")[0].childNodes[0].nodeValue;

//details to populate table, maybe associate different identifiers? {id:{formatted id: value}}??
//should it be a map instead of an object? -> No because it being passed as an objedt? Does that matter?
function getDetails(data){
	var details = {};
	details.state = data.Pit_Observation.Location[0].$.state;
	details.name = data.Pit_Observation.User[0].$.name;
	details.coord = data.Pit_Observation.Location[0].$.type;
	console.log(details);
	return details;
}

//uas a forEach in data here??
function makeTable(data){
	table = document.getElementById('pit_data');
	header = document.createElement("TR");
	headRow = document.createElement("THEAD");
	for (param in Object.keys(data)){
		let headCell = document.createElement("TH"); //wrong TAG!!!
		headCell.textContent = (Object.keys(data)[param]);
		header.appendChild(headCell);
	}
	tbody = document.createElement("TBODY");
	let row = document.createElement("TR");
	for (param in Object.values(data)){
		let cell = document.createElement("TD");
		cell.textContent = (Object.values(data)[param]);
		row.appendChild(cell);
	}
	headRow.appendChild(header);
	tbody.appendChild(row);
	table.appendChild(headRow);
	table.appendChild(tbody);
}

function getData(){
	var req = new XMLHttpRequest;
	var locData = {};
//should this map be made somewhere else??
	var hardnesses = new Map();
	hardnesses.set('I', 6);
	hardnesses.set('K', 5);
	hardnesses.set('P', 4);
	hardnesses.set('1F', 3);
	hardnesses.set('4F', 2);
	hardnesses.set('F', 1);
	req.open('GET', 'http://flip3.engr.oregonstate.edu:3380/', true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			var data = JSON.parse(req.responseText);
			// console.log(data.Layer);
			var sd = [];
			var h = [];
			//populates array and adds to barChart. Doesn't handle top down profiles, +/- hardness,
			//or tapered hardness yet
			for (i in data.Pit_Observation.Layer){
				l = Object.values(data.Pit_Observation.Layer[i]);
				f = l[0];
				sd[i] = f.startDepth
				h[i] = hardnesses.get(f.hardness1);
				var myBarchart = new Barchart(
				{
					canvas:c,
					padding:10,
					gridScale:1,
					gridColor:"#333333",
					data:myVinyls,
				  colors:["#a55ca5","#67b6c7", "#bccd7a","#eb9743"],
				  widths:sd,
				  hardness:h
				}
			);
			}
			myBarchart.draw();
			var details = getDetails(data);
			makeTable(details);		
			console.log(sd);
			console.log(h);
			console.log(data);

			return JSON.parse(req.responseText);
		}
	});
	req.send(null);

}

function drawLine(ctx, startX, startY, endX, endY, color){
	ctx.save();
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX,endY);
	ctx.stroke();
	ctx.restore();
}

function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color){
	ctx.save();
	ctx.fillStyle=color;
	ctx.fillRect(upperLeftCornerY, upperLeftCornerX, height, width);
	ctx.lineWidth = 0.5;
	ctx.strokeRect(upperLeftCornerY, upperLeftCornerX, height, width)
	// ctx.stroke();
	ctx.restore();
	console.log("uly" + upperLeftCornerY);
}

//graph data, replace this with xml data eventually
var myVinyls = {
	"Classical music": 10,
	"Alternative roc": 14,
	"Pop": 2,
	"Jazz": 12
};

var Barchart = function(options){
	this.options = options;
	this.canvas = options.canvas;
	this.ctx = this.canvas.getContext("2d");
	this.colors = options.colors;
	this.widths = options.widths;
	this.hardness = options.hardness;

//should this get changed back to previous way and rotate canvas at end??
//->No b/c it will rotate text populated in the canvas? Is it possible to rotate
//just the graph in the canvas? Is that possible? right now everything is drawn
//directly into canvas. Can a canvas be nested in a canvas to make a frame?
	this.draw = function(){
		var maxValue = 8;
		// for (var categ in this.options.data){
		// 	maxValue = Math.max(maxValue,this.options.data[categ]);
		// }
		var canvasActualHeight = this.canvas.height - this.options.padding * 2;
		var canvasActualWidth = this.canvas.width - this.options.padding * 2;

		//draw vertical grid lines
		var gridValue = 0;
		var hardnesses = ['', 'F', '4F', '1F', 'P', 'K', 'I'];
		for (gridValue in hardnesses){
			var gridY = canvasActualWidth * (1 - gridValue/maxValue) + this.options.padding;
			drawLine(
				this.ctx,
				gridY,
				0,
				gridY,
				canvasActualWidth,
				this.options.gridColor
			);

			//writing grid markers
			this.ctx.save();
			this.ctx.fillStyle = this.options.gridColor;
			this.ctx.font = "bold 10px Arial";
			this.ctx.fillText(hardnesses[gridValue], gridY - 2, canvasActualWidth + this.options.padding);
			this.ctx.restore();

			gridValue+=this.options.gridScale;
		}
		//draw horizontal grid lines
		//something's not right with odd pit height
		var lines = Math.ceil(this.options.widths[0]/10);
		gridValue = 0;
		for (var i = 0; i < lines; i++){
			var gridX = canvasActualHeight - (canvasActualHeight * (1-i/lines));
			console.log(this.options.padding)
			drawLine(
				this.ctx,
				0,
				gridX,
				canvasActualHeight,
				gridX,
				this.options.gridColor
				);
				//write grid markers
				this.ctx.save();
				this.ctx.fillStyle = this.options.gridColor;
				this.ctx.font = "bold 10px Arial";
				this.ctx.fillText(this.options.widths[0] - i * 10, this.options.padding, gridX + this.options.padding);
				this.ctx.restore();
				console.log(gridX)

		}
		//draw bars
		var numberOfBars = Object.keys(this.options.widths).length;
		// var barSize = (canvasActualHeight)/numberOfBars;
		var index = 0;
		var pitDepth = this.widths[0];
		for (categ in this.options.widths){
//			var val = this.options.data[categ];
			var barHeight = Math.round(canvasActualWidth * (this.hardness[index])/maxValue);
			var barSize = canvasActualHeight-(this.options.widths[index]/pitDepth) * canvasActualHeight;
			var width1 = this.widths[index];
			var width2;
			// console.log(index + "bars = " + numberOfBars)
			if (index === numberOfBars-1){
				width2 = 0;
			} else {
				width2 = this.widths[index+1];
			}
			var w = ((width1 - width2)/pitDepth) * canvasActualHeight;
			console.log("width = " + this.canvas.padding)
			// console.log("height = " + barHeight)
			// var barHeight = Math.round(canvasActualWidth * val/maxValue);
			// console.log('barsize = ' + barSize + 'index = ' + index)
			drawBar(
				this.ctx,
				barSize,																												//upperLeftY
				this.canvas.width - barHeight - this.options.padding,						//upperLeftX
				w,																															//width
				barHeight,																											//height
				this.colors[0]
			);

			index += 1;
		}
	}
}

//page setup
const buttonListener = document.getElementById('get');
buttonListener.addEventListener('click', function(event){
//data object returned here, not assigned or used right now
	getData();
})

var c = document.getElementById('plot');
c.width = 300;
c.height = 300;
c.style.padding = "10px";
