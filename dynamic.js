(function(){

let gid = (e) => document.getElementById(e);
let gcl = (e) => document.getElementsByClassName(e);
let html = document.documentElement;

// functions
f = {};

// color functions
f.color = {
	// Calculate point between two colors
	calc: function (a, b, p){
		return [0, 1, 2].map((i) => b[i] + (a[i] - b[i]) * p);
	},

	// Color range n between 2 RGB values a and b
	range: function (a, b, n){
		a = sf.rgbsplit(a);
		b = sf.rgbsplit(b);
		var cRange = [];
		for (i = 0; i < n; i++){
			cRange[i] = sf.rgbjoin(sf.color.calc(a, b, i / (n - 1)));
		};
		return cRange;
	}
};

// catch popup messages
f.receiver = function(){
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.data.target == "dynamic"){
			sendResponse({data: request.data.target, success: true});
			f.preview[request.data.payload.type](request.data.payload.data);
		};
	});
};
f.receiver();

var conversion = {
	bg: {n: 5, refs: ["mainbg", "darkestbg", "darkbg", "darkerbg", "secondarybg"]},
	duoblue: {n: 3, refs: ["duoblue", "darkblue", "darkestblue"]},
	text: {n: 3, refs: ["maintext", "lightertext", "lighttext"]},
	correct: {n: 3, refs: ["correctlight", "correct", "correctdark"]},
	wrong: {n: 2, refs: ["wrong", "wrongdark"]},
	gold: {n: 2, refs: ["goldlight", "golddark"]}
};

// preview unsaved changes
f.preview = {
	color: function(data){
		if("min" in data[data.type]){
			var range = f.color.range(data[data.type].min, data[data.type].max, conversion[data.type].n);
			var countr = 0;
			for (var i = 0; i < conversion[data.type].refs.length; i++) {
				html.style.setProperty("--" + conversion[data.type].refs[i], range[i]);
			}
		}
	},
	
	enable: function(data){
		html.setAttribute("mode", data);
	}
};





































































})();