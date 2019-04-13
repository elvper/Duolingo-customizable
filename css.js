(function(){
// duolingo theme changer

// add def bg if active against flickering
// scaling

// short CSS references
var ref = '[mode=black]',
	d = ref + ' ';

// functions
sf = {};

// rgb to array
sf.rgbsplit = (rgb) => rgb.match(/\d+/g).map(Number);
// array to rgb
sf.rgbjoin = (parts) => "rgb(" + parts + ")";
// rgba to rgb
sf.rgbareduce = (rgba) => sf.rgbjoin(sf.rgbsplit(rgba).slice(0, 3));

// style creation functions
sf.construct = {};

// color functions
sf.color = {
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

// stored settings
var dm = JSON.parse(localStorage.getItem('TrueDarkStyle')) || "default";

// default settings
defsettings = {
	initialized: 0,
	enabled: true,
	theme: {
		preset: "black"
	},
	lastsession: 0,
	remembersession: 6,
	brightness: {
		session: 0,
		day: 1,
		night: 0.8,
		dynamic: false,
		fadeearlier: 0.5
	},
	userinput: {
		latitude: null,
		longitude: null
	},
	color: {
		// backgrounds colors
		bg: {
			max: "rgb(0, 0, 0)",
			min: "rgb(100, 100, 100)",
			transparent: "rgba(0,0,0,0)"
		},
		// text colors
		text: { // main text color
			max: "rgb(200, 200, 200)",
			min: "rgb(255, 255, 255)",
			contrast: "rgb(255, 177, 0)",
			url: "rgb(28, 176, 246)"
		},
		// blue theme colors
		duoblue: {
			max: "rgb(28, 176, 246)",
			min: "rgb(12, 77, 110)"
		},
		// correct colors
		correct: {
			max: "rgb(0, 238, 0)",
			min: "rgb(0, 100, 0)"
		},
		// wrong colors
		wrong: {
			max: "rgb(255, 0, 0)",
			min: "rgb(88, 0, 0)"
		},
		// golden colors
		gold: {
			max: "rgb(255, 200, 0)",
			min: "rgb(255, 180, 0)"
		}
	},
	// custom CSS
	custom: {
		active: false,
		css: ""
	}
};
settings = defsettings;

sf.construct.colorranges = function(){
	settings.color.bg.range = sf.color.range(settings.color.bg.min, settings.color.bg.max, 5);
	settings.color.text.range = sf.color.range(settings.color.text.min, settings.color.text.max, 3);
	settings.color.text.likebg = settings.color.bg.max;
	settings.color.duoblue.range = sf.color.range(settings.color.duoblue.min, settings.color.duoblue.max, 3);
	settings.color.correct.range = sf.color.range(settings.color.correct.min, settings.color.correct.max, 3);
	settings.color.wrong.range = sf.color.range(settings.color.wrong.min, settings.color.wrong.max, 2);
	settings.color.gold.range = sf.color.range(settings.color.gold.min, settings.color.gold.max, 2);
};

// CSS variable references
var pc = {};
sf.construct.cssrefs = function(){
	pc = {
		bg: {
			secondary:		"var(--secondarybg)",
			main:			"var(--mainbg)",
			darker:			"var(--darkerbg)",
			dark:			"var(--darkbg)",
			darkest:		"var(--darkestbg)",
			transparent:	settings.color.bg.transparent
		},
		duoblue: {
			main:			"var(--duoblue)",
			dark:			"var(--darkblue)",
			darkest:		"var(--darkestblue)"
		},
		text: {
			main: 			"var(--maintext)",
			light:			"var(--lightertext)",
			lightest: 		"var(--lighttext)",
			likebg: 		"var(--textlikebg)",
			contrast: 		"var(--contrasttext)",
			url:			"var(--urltext)"
		},
		correct: {
			main:	 		"var(--correct)",
			dark:			"var(--correctdark)",
			light:			"var(--correctlight)"
		},
		wrong: {
			main:			"var(--wrong)",
			dark:			"var(--wrongdark)"
		},
		gold: {
			light:			"var(--goldlight)",
			dark:			"var(--golddark)"
		}
	};
};

var stylevars = {};
sf.construct.cssvars = function(){
	stylevars = ':root{' +
		// background
		'--mainbg: ' + 			settings.color.bg.range[0]			+ ';' +
		'--secondarybg: ' + 	settings.color.bg.range[4]			+ ';' +
		'--darkerbg: ' + 		settings.color.bg.range[3]			+ ';' +
		'--darkbg: ' + 			settings.color.bg.range[2]			+ ';' +
		'--darkestbg: ' + 		settings.color.bg.range[1]			+ ';' +
		// text
		'--maintext: ' + 		settings.color.text.range[0]		+ ';' +
		'--lightertext: ' + 	settings.color.text.range[1]		+ ';' +
		'--lighttext: ' + 		settings.color.text.range[2]		+ ';' +
		'--textlikebg: ' + 		settings.color.text.likebg			+ ';' +
		'--contrasttext: ' +	settings.color.text.contrast		+ ';' +
		'--urltext: ' +			settings.color.text.url				+ ';' +
		// blue accent color
		'--duoblue: ' +			settings.color.duoblue.range[0]		+ ';' +
		'--darkblue: ' +		settings.color.duoblue.range[1]		+ ';' +
		'--darkestblue: ' +		settings.color.duoblue.range[2]		+ ';' +
		// correct color
		'--correctlight: ' +	settings.color.correct.range[0]		+ ';' +
		'--correct: ' +			settings.color.correct.range[1]		+ ';' +
		'--correctdark: ' +		settings.color.correct.range[2]		+ ';' +
		// wrong color
		'--wrong: ' +			settings.color.wrong.range[0]		+ ';' +
		'--wrongdark: ' +		settings.color.wrong.range[1]		+ ';' +
		// gold color
		'--goldlight: ' +		settings.color.gold.range[0]		+ ';' +
		'--golddark: ' +		settings.color.gold.range[1]		+ ';' +
	'}';
};

// dark version of icons
var darkicons = {};
sf.construct.icons = function(){
var imgsvg = "data:image/svg+xml;utf8,";

darkicons.oldcrown = imgsvg + "<svg width='34' height='30' viewBox='0 0 34 30' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><defs><path d='M1.49 4.538l6.632 2.365a1 1 0 0 0 1.16-.376L13.175.85a1 1 0 0 1 1.65 0l3.893 5.676a1 1 0 0 0 1.16.376l6.633-2.365a1 1 0 0 1 1.317 1.137l-3.484 17.52a1 1 0 0 1-.98.805H4.636a1 1 0 0 1-.98-.805L.172 5.675a1 1 0 0 1 1.316-1.137z' id='a'/></defs><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><g><g><g transform='translate(3 3)'><mask id='b' fill='%23fff'><use xlink:href='%23a'/></mask><g><use fill='%23FFB500' fill-rule='evenodd' xlink:href='%23a'/><path stroke='%23000' stroke-width='3' d='M8.263 5.36L11.938.004a2.5 2.5 0 0 1 4.124 0l3.675 5.358 6.27-2.236A2.5 2.5 0 0 1 29.3 5.968l-3.484 17.52a2.5 2.5 0 0 1-2.452 2.012H4.637a2.5 2.5 0 0 1-2.452-2.012l-3.484-17.52a2.5 2.5 0 0 1 3.292-2.843l6.27 2.236z'/></g><path fill='%23FFCC29' opacity='.7' mask='url(%23b)' d='M8 0h6v25H8z'/></g></g></g></g></g></svg>";

darkicons.crown = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' version='1.1'><title>crown</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><g><path d='M12.756 14.993l4.876-5.111a3.281 3.281 0 0 1 4.67-.079l5.292 5.186 2.843-2.261a2.481 2.481 0 0 1 3.939 2.591L30.67 28.971a2.8 2.8 0 0 1-2.702 2.067h-16.06a2.8 2.8 0 0 1-2.703-2.067l-3.65-13.453a2.638 2.638 0 0 1 4.117-2.81l3.083 2.285z' stroke='" + settings.color.gold.max + "' stroke-width='2' fill='" + settings.color.gold.min + "'/><path d='M11.16 17.002l1.099.942a.9.9 0 0 0 1.273-.102l2.717-3.212a1.14 1.14 0 0 1 2.008.646l.936 11.787a1.14 1.14 0 0 1-1.137 1.23h-4.48a1.14 1.14 0 0 1-1.103-.854l-2.508-9.692a.739.739 0 0 1 1.196-.745z' fill='" + settings.color.gold.max + "'/></g></g></g></svg>";

darkicons.crown0 = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>crown empty</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g fill='rgb(50,50,50)' stroke='rgb(100,100,100)' stroke-width='2'><g><path d='M12.756 14.993l4.876-5.111a3.281 3.281 0 0 1 4.67-.079l5.292 5.186 2.843-2.261a2.481 2.481 0 0 1 3.939 2.591L30.67 28.971a2.8 2.8 0 0 1-2.702 2.067h-16.06a2.8 2.8 0 0 1-2.703-2.067l-3.65-13.453a2.638 2.638 0 0 1 4.117-2.81l3.083 2.285z'/></g></g></g><script xmlns=''/></svg>";

darkicons.star = imgsvg + "<svg width='49' height='47' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><defs><path d='M94.56 94.585l-10.267 5.311a2 2 0 0 1-2.89-2.12l1.953-11.201-8.241-7.905a2 2 0 0 1 1.101-3.423l11.42-1.633 5.137-10.242a2 2 0 0 1 3.575 0l5.137 10.242 11.42 1.633a2 2 0 0 1 1.101 3.423l-8.241 7.905 1.952 11.201a2 2 0 0 1-2.889 2.12L94.56 94.585z' id='a'/></defs><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><g><g transform='translate(-70 -58)'><use fill='%23FFC800' fill-rule='evenodd' xlink:href='%23a'/><path stroke='%23000' stroke-width='4' d='M94.56 96.836l-9.348 4.837a4 4 0 0 1-5.779-4.24l1.77-10.152-7.473-7.168a4 4 0 0 1 2.203-6.846l10.384-1.485 4.668-9.307a4 4 0 0 1 7.15 0l4.669 9.307 10.384 1.485a4 4 0 0 1 2.202 6.846l-7.472 7.168 1.77 10.152a4 4 0 0 1-5.779 4.24l-9.349-4.837z'/></g></g></g></g></svg>";

darkicons.slider = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'><defs><linearGradient id='grad1' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' style='stop-color:rgb(255,255,255);stop-opacity:1'/><stop offset='10%' style='stop-color:rgb(255,255,255);stop-opacity:1'/><stop offset='90%' style='stop-color:rgb(0,0,0);stop-opacity:1'/><stop offset='100%' style='stop-color:rgb(0,0,0);stop-opacity:1'/></linearGradient></defs><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><ellipse xmlns='http://www.w3.org/2000/svg' stroke='%23000' ry='10' rx='10' id='svg_2' cy='12' cx='12' stroke-width='5' fill='%23fff'/><circle cx='12' cy='12' r='10' fill='url(%23grad1)'/></g></svg>";

darkicons.unlit = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='3 3 34 34' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>streak_empty</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><g fill='rgb(0,0,0)' stroke='rgb(100,100,100)' stroke-width='2'><path d='M9.068 21.675l-.024-8.459c-.005-1.882 1.206-3.274 3.012-2.97.357.06.942.245 1.25.41l1.691.905 3.25-4.097a2.876 2.876 0 0 1 4.506 0L29.523 16A10.832 10.832 0 0 1 32 22.889C32 29.034 26.843 34 20.5 34S9 29.034 9 22.889c0-.408.023-.813.068-1.214z'/></g><g fill='rgb(100,100,100)'><path d='M17.012 22.077a.462.462 0 0 1 .057-.104l2.65-3.609a.924.924 0 0 1 1.49 0l2.523 3.436A4.237 4.237 0 0 1 25 24.815c0 2.393-2.015 4.333-4.5 4.333s-4.5-1.94-4.5-4.333c0-1.039.38-1.992 1.012-2.738z'/></g></g></g><script xmlns=''/></svg>";

darkicons.lit = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='3 3 34 34' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>streak</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><g fill='%23FF9600' stroke='%23FFC800' stroke-width='2'><path d='M9.068 21.675l-.024-8.459c-.005-1.882 1.206-3.274 3.012-2.97.357.06.942.245 1.25.41l1.691.905 3.25-4.097a2.876 2.876 0 0 1 4.506 0L29.523 16A10.832 10.832 0 0 1 32 22.889C32 29.034 26.843 34 20.5 34S9 29.034 9 22.889c0-.408.023-.813.068-1.214z'/></g><g fill='%23FFC800'><path d='M17.012 22.077a.462.462 0 0 1 .057-.104l2.65-3.609a.924.924 0 0 1 1.49 0l2.523 3.436A4.237 4.237 0 0 1 25 24.815c0 2.393-2.015 4.333-4.5 4.333s-4.5-1.94-4.5-4.333c0-1.039.38-1.992 1.012-2.738z'/></g></g></g><script xmlns=''/></svg>";

darkicons.lightbulb = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='21' height='26' viewBox='0 0 21 26' version='1.1'><head xmlns=''/><head xmlns=''/><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' stroke-linecap='round' stroke-linejoin='round'><g stroke='" + settings.color.bg.range[0] + "'><g><g><g><path d='M7.834 21.2v-2.607C4.367 17.42 2 14.194 2 10.533 2 5.827 5.878 2 10.646 2c4.767 0 8.646 3.828 8.646 8.532 0 3.662-2.367 6.887-5.834 8.061V21.2H7.834zM13.458 24.767H7.834' stroke-width='2.2'/><g stroke-width='2'><path d='M11.804 12.07L9.098 14M11.804 8.07L9.098 10'/></g></g></g></g></g></g><script xmlns=''/></svg>";

darkicons.key = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='23' height='22' viewBox='0 0 23 22' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g fill='" + settings.color.bg.range[0] + "' fill-rule='nonzero'><g><g><g><path d='M10.728 20.213a6 6 0 1 1-8.485-8.485 6 6 0 0 1 8.485 8.485zM9.314 18.8a4 4 0 1 0-5.657-5.657A4 4 0 0 0 9.314 18.8z'/><path d='M19.167 4.703l-1.415 1.415 1.591 1.59a1 1 0 1 1-1.414 1.415l-1.59-1.591-4.894 4.893a1 1 0 0 1-1.414-1.414L20.213.828a1 1 0 0 1 1.414 1.415l-1.046 1.046 1.59 1.591a1 1 0 1 1-1.413 1.414l-1.591-1.59z'/></g></g></g></g></g><script xmlns=''/></svg>";

darkicons.slowspeaker = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='80' height='42' viewBox='0 0 80 42' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>slow_speak</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g fill='" + settings.color.duoblue.range[0] + "' fill-rule='nonzero'><path d='M63.641 27.981c-1.137.58-2.54.149-3.132-.964a2.248 2.248 0 0 1 .985-3.065c1.872-.955 3.094-2.93 3.094-5.143 0-2.209-1.216-4.178-3.08-5.136a2.248 2.248 0 0 1-.976-3.068c.597-1.111 2-1.539 3.136-.955a10.282 10.282 0 0 1 5.564 9.159c0 3.907-2.183 7.434-5.59 9.172z'/><path d='M68.706 37.301c-1.137.58-2.54.149-3.133-.964a2.248 2.248 0 0 1 .985-3.065c5.311-2.71 8.752-8.268 8.752-14.47 0-6.186-3.422-11.731-8.71-14.45a2.248 2.248 0 0 1-.977-3.068c.597-1.11 2-1.538 3.136-.955 6.817 3.504 11.195 10.6 11.195 18.473 0 7.895-4.402 15.006-11.248 18.5zM27.752 34.628l-9.2 2.516v2.429a2.281 2.281 0 0 1-2.282 2.28h-5.788a2.281 2.281 0 0 1-2.281-2.28v-2.165l-6.206.006a1.957 1.957 0 0 1-.54-3.839l15.398-4.413c.216-.062.433-.085.645-.073l18.48-5.115c4.346-1.374 5.68-2.744 5.83-5.334v-.956a6.294 6.294 0 0 1 6.294-6.294h1.862a6.294 6.294 0 0 1 6.294 6.294v2.631a3.664 3.664 0 0 1-3.663 3.664h-3.776c-1.68 3.688-5.21 6.24-10.717 7.969v7.625a2.281 2.281 0 0 1-2.28 2.28h-5.79a2.281 2.281 0 0 1-2.28-2.28v-4.945zM6.354 26.221a16.39 16.39 0 0 1-.318-1.049C3.768 16.71 8.656 8.043 16.96 5.818c8.304-2.225 16.87 2.838 19.137 11.3.095.353.177.71.248 1.067.17.86-.348 1.703-1.185 1.927L8.345 27.297a1.656 1.656 0 0 1-1.99-1.076z'/></g></g><script xmlns=''/></svg>";

darkicons.speaker = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='55' height='42' viewBox='0 0 55 42' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>speaker</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><path d='M35.35 28.274c2.88-1.413 4.855-4.331 4.855-7.701 0-3.362-1.965-6.273-4.831-7.69M41.012 38.303c6.63-3.255 11.18-9.976 11.18-17.738 0-7.741-4.527-14.447-11.127-17.711' stroke='" + settings.color.duoblue.range[0] + "' stroke-width='5.08' stroke-linecap='round' stroke-linejoin='round'/><g fill='" + settings.color.duoblue.range[0] + "'><g><g><path d='M9.024 10.188L23.001.431a2.094 2.094 0 0 1 3.292 1.717v37.484a2.094 2.094 0 0 1-3.292 1.717L9.34 31.812H5.963a5.08 5.08 0 0 1-5.08-5.08V15.268a5.08 5.08 0 0 1 5.08-5.08h3.061z'/></g></g></g></g></g><script xmlns=''/></svg>";

darkicons.various = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' width='1000' height='1000' viewBox='0 0 1000 1000'><head xmlns=''/><head xmlns=''/><head xmlns=''/><defs><style>.cls-1,.cls-104,.cls-105,.cls-107,.cls-108,.cls-114,.cls-119,.cls-127,.cls-128,.cls-132,.cls-133,.cls-17,.cls-2,.cls-45,.cls-57,.cls-58,.cls-59,.cls-85,.cls-87{fill:none}.cls-2{clip-rule:evenodd}.cls-3{fill:%23faa919}.cls-4{fill:%23ffc10d}.cls-5{fill:%23ff6c00}.cls-54,.cls-6,.cls-68,.cls-69,.cls-70,.cls-76{fill:" + settings.color.text.range[2] + "}.cls-7{fill:%23ffa200}.cls-8{fill:%23e3e3e3}.cls-9{fill:%23d33131}.cls-10{fill:%23f93d3d}.cls-11{fill:%23af2828}.cls-12{fill:%23e83838}.cls-13{fill:%23f77f7f;opacity:.3}.cls-14{fill:%23e02804}.cls-15{fill:%23ec0000}.cls-16{fill:%23353535}.cls-17,.cls-45{stroke:" + settings.color.text.range[2] + ";stroke-linejoin:round}.cls-104,.cls-105,.cls-107,.cls-108,.cls-17,.cls-45{stroke-linecap:round}.cls-17{stroke-width:2.5px}.cls-139,.cls-18{fill:%231cb0f6}.cls-19{fill:%2336c5f2;opacity:.25}.cls-20,.cls-74{fill:%237ac70c}.cls-21{fill:%23ffb103}.cls-22{fill:%2300adf8}.cls-23{fill:%237a3922}.cls-24{fill:%23472213}.cls-25{fill:%23b71515}.cls-26{fill:%23e5e5e5}.cls-27{fill:%2379a100}.cls-28{fill:%231caff6}.cls-29{fill:%23cbcbcb}.cls-30{fill:%23ec0b1b}.cls-31{fill:%239c0}.cls-32{fill:%23b0b0b0}.cls-33{fill:%23494949}.cls-34{fill:%23e8e8e8}.cls-35{fill:%232e2e2e}.cls-36{fill:%238dbc00}.cls-37{fill:%23c2c2c2}.cls-38{fill:%23c4c4c4}.cls-39{fill:%239e9e9e}.cls-40{fill:%236fb500}.cls-41,.cls-44{fill:%239b9b9b}.cls-42{opacity:.08}.cls-43{fill:%235a8900}.cls-44,.cls-68{opacity:.7}.cls-45{stroke-width:2.57px}.cls-46{fill:%2316a8e7}.cls-47{fill:%23eceeec}.cls-48{fill:%23b8b8b8}.cls-49{fill:%23df4a32}.cls-50{fill:%233b5999}.cls-51{clip-path:url(%23clip-path)}.cls-52{clip-path:url(%23clip-path-2)}.cls-53{fill:%23afafaf}.cls-54{stroke:%23231f20;stroke-opacity:.08}.cls-104,.cls-105,.cls-107,.cls-108,.cls-114,.cls-119,.cls-127,.cls-128,.cls-132,.cls-133,.cls-54,.cls-57,.cls-58,.cls-59,.cls-85,.cls-87{stroke-miterlimit:10}.cls-54,.cls-57,.cls-58{stroke-width:3px}.cls-55{fill:%23e2e2e2}.cls-56{fill:%2393cc17}.cls-57{stroke:%23a5d20c}.cls-58{stroke:%23d6d6d6}.cls-59{stroke:%23bababa}.cls-105,.cls-108,.cls-59,.cls-85,.cls-87{stroke-width:2px}.cls-60{fill:%23ffb094}.cls-61{fill:%230af}.cls-62{opacity:.19}.cls-63{fill:%2388c11a}.cls-64{fill:%23774335}.cls-65{fill:%23934928}.cls-66{fill:%23ad582d}.cls-67{fill:%23cc2f2f}.cls-69{opacity:.28}.cls-70{opacity:.39}.cls-71{fill:%237f3f22}.cls-72{fill:%23d6d6d6}.cls-73{fill:%23a5d20c}.cls-74{opacity:.65}.cls-75{fill:%23ec0a1b;opacity:.35}.cls-76{opacity:.8}.cls-77{fill:%23b7b7b7}.cls-78{fill:%23f6ab00}.cls-79{fill:%23f6bb03}.cls-80{fill:%235fa8dc}.cls-81{fill:%23dcdcdc}.cls-82{fill:%23e7e7e7}.cls-83{fill:%236eaa05}.cls-84{clip-path:url(%23clip-path-3)}.cls-104,.cls-105,.cls-119,.cls-132,.cls-133,.cls-85{stroke:%231cb0f6}.cls-86{clip-path:url(%23clip-path-4)}.cls-107,.cls-108,.cls-114,.cls-127,.cls-128,.cls-87{stroke:%23979797}.cls-88{clip-path:url(%23clip-path-5)}.cls-89{clip-path:url(%23clip-path-6)}.cls-90{clip-path:url(%23clip-path-7)}.cls-91{clip-path:url(%23clip-path-8)}.cls-92{clip-path:url(%23clip-path-9)}.cls-93{clip-path:url(%23clip-path-10)}.cls-94{clip-path:url(%23clip-path-11)}.cls-95{clip-path:url(%23clip-path-12)}.cls-96{clip-path:url(%23clip-path-13)}.cls-140,.cls-97{fill:%23979797}.cls-98{clip-path:url(%23clip-path-14)}.cls-99{clip-path:url(%23clip-path-15)}.cls-100{clip-path:url(%23clip-path-16)}.cls-101{clip-path:url(%23clip-path-17)}.cls-102{clip-path:url(%23clip-path-18)}.cls-103{clip-path:url(%23clip-path-19)}.cls-104,.cls-107{stroke-width:2.14px}.cls-106{clip-path:url(%23clip-path-20)}.cls-109{fill:%23969696}.cls-110{fill:%23ffb003}.cls-111{fill:%23ffc400}.cls-112{fill:%23fa811b}.cls-113{fill:%23777}.cls-114,.cls-119{stroke-width:2.2px}.cls-115{clip-path:url(%23clip-path-21)}.cls-116{fill:%23999}.cls-117{clip-path:url(%23clip-path-22)}.cls-118{clip-path:url(%23clip-path-23)}.cls-120{clip-path:url(%23clip-path-24)}.cls-121{clip-path:url(%23clip-path-25)}.cls-122{clip-path:url(%23clip-path-26)}.cls-123{clip-path:url(%23clip-path-27)}.cls-124{isolation:isolate}.cls-125{clip-path:url(%23clip-path-28)}.cls-126{clip-path:url(%23clip-path-30)}.cls-127,.cls-132{stroke-width:3.56px}.cls-128,.cls-133{stroke-width:1.78px}.cls-129{clip-path:url(%23clip-path-32)}.cls-130{clip-path:url(%23clip-path-33)}.cls-131{clip-path:url(%23clip-path-35)}.cls-134{clip-path:url(%23clip-path-37)}.cls-135{clip-path:url(%23clip-path-38)}.cls-136{fill:url(%23linear-gradient)}.cls-137{fill:url(%23linear-gradient-2)}.cls-138{fill:%23c9268c}.cls-139,.cls-140{fill-rule:evenodd}</style><clipPath id='clip-path'><path class='cls-1' d='M63.23 70H77.8v11.84H63.23z'/></clipPath><clipPath id='clip-path-2'><path class='cls-1' d='M63.23 69.96h14.6v11.88h-14.6z'/></clipPath><clipPath id='clip-path-3'><path class='cls-1' d='M710 90h37v34h-37z'/></clipPath><clipPath id='clip-path-4'><path class='cls-1' d='M750 90h37v34h-37z'/></clipPath><clipPath id='clip-path-5'><path class='cls-1' d='M790 90h42v32h-42z'/></clipPath><clipPath id='clip-path-6'><path class='cls-2' d='M803.61 107.77a7.37 7.37 0 0 1-7.36-7.36v-3a7.36 7.36 0 1 1 14.72 0v3a7.37 7.37 0 0 1-7.36 7.36m0-13.48c-2.81 0-5.1.26-5.1 3.08v3a5.1 5.1 0 1 0 10.2 0v-3c0-2.82-2.29-3.08-5.1-3.08'/></clipPath><clipPath id='clip-path-7'><path class='cls-2' d='M806.87 100.5a3.26 3.26 0 1 1-6.51 0z'/></clipPath><clipPath id='clip-path-8'><path class='cls-2' d='M820.45 107.77a7.37 7.37 0 0 1-7.36-7.36v-5.89h14.72v5.88a7.37 7.37 0 0 1-7.36 7.37zm-5.1-13.22v5.86a5.1 5.1 0 1 0 10.2 0v-5.86z'/></clipPath><clipPath id='clip-path-9'><path class='cls-2' d='M823.71 100.5a3.26 3.26 0 1 1-6.51 0z'/></clipPath><clipPath id='clip-path-10'><path class='cls-2' d='M827.43 94.55h-14.34a4.29 4.29 0 0 1 4.29-4.29h14.34a4.29 4.29 0 0 1-4.29 4.29'/></clipPath><clipPath id='clip-path-11'><path class='cls-2' d='M790.83 99.06v8.71a4.29 4.29 0 0 0 4.29-4.29v-8.72a4.29 4.29 0 0 0-4.29 4.29'/></clipPath><clipPath id='clip-path-12'><path class='cls-1' d='M835 90h42v32h-42z'/></clipPath><clipPath id='clip-path-13'><path class='cls-2' d='M848.61 107.77a7.37 7.37 0 0 1-7.36-7.36v-3a7.36 7.36 0 1 1 14.72 0v3a7.37 7.37 0 0 1-7.36 7.36m0-13.48c-2.81 0-5.1.26-5.1 3.08v3a5.1 5.1 0 1 0 10.2 0v-3c0-2.82-2.29-3.08-5.1-3.08'/></clipPath><clipPath id='clip-path-14'><path class='cls-2' d='M851.87 100.5a3.26 3.26 0 1 1-6.51 0z'/></clipPath><clipPath id='clip-path-15'><path class='cls-2' d='M865.45 107.77a7.37 7.37 0 0 1-7.36-7.36v-5.89h14.72v5.88a7.37 7.37 0 0 1-7.36 7.37zm-5.1-13.22v5.86a5.1 5.1 0 1 0 10.2 0v-5.86z'/></clipPath><clipPath id='clip-path-16'><path class='cls-2' d='M868.71 100.5a3.26 3.26 0 1 1-6.51 0z'/></clipPath><clipPath id='clip-path-17'><path class='cls-2' d='M872.43 94.55h-14.34a4.29 4.29 0 0 1 4.29-4.29h14.34a4.29 4.29 0 0 1-4.29 4.29'/></clipPath><clipPath id='clip-path-18'><path class='cls-2' d='M835.83 99.06v8.71a4.29 4.29 0 0 0 4.29-4.29v-8.72a4.29 4.29 0 0 0-4.29 4.29'/></clipPath><clipPath id='clip-path-19'><path class='cls-1' d='M880 90h38v30h-38z'/></clipPath><clipPath id='clip-path-20'><path class='cls-1' d='M920 90h38v30h-38z'/></clipPath><clipPath id='clip-path-21'><path class='cls-2' d='M971.61 110.18a1.78 1.78 0 1 1 1.78-1.78 1.78 1.78 0 0 1-1.78 1.78zm9.14 0a1.78 1.78 0 1 1 1.78-1.78 1.78 1.78 0 0 1-1.77 1.78zm.38 2.83a5.24 5.24 0 0 1-10.08 1.41 5.15 5.15 0 0 1-.34-1.41z'/></clipPath><clipPath id='clip-path-22'><path class='cls-1' d='M987.86 106.48a2.52 2.52 0 0 1 0 5m0 2a4.56 4.56 0 0 0 0-9.12z'/></clipPath><clipPath id='clip-path-23'><path class='cls-1' d='M964.49 111.51a2.52 2.52 0 0 1 0-5m0-2a4.56 4.56 0 0 0 0 9.12'/></clipPath><clipPath id='clip-path-24'><path class='cls-2' d='M971.61 149.27a1.78 1.78 0 1 1 1.78-1.78 1.78 1.78 0 0 1-1.78 1.78zm9.14 0a1.78 1.78 0 1 1 1.78-1.78 1.78 1.78 0 0 1-1.77 1.78zm.38 2.83a5.24 5.24 0 0 1-10.08 1.41 5.15 5.15 0 0 1-.34-1.41z'/></clipPath><clipPath id='clip-path-25'><path class='cls-1' d='M987.86 145.57a2.52 2.52 0 0 1 0 5m0 2a4.56 4.56 0 0 0 0-9.12z'/></clipPath><clipPath id='clip-path-26'><path class='cls-1' d='M964.49 150.6a2.52 2.52 0 0 1 0-5m0-2a4.56 4.56 0 0 0 0 9.12'/></clipPath><clipPath id='clip-path-27'><circle class='cls-1' cx='870.94' cy='177.73' r='13.78'/></clipPath><clipPath id='clip-path-28'><path class='cls-1' d='M848.16 157.95h53v43h-53z'/></clipPath><clipPath id='clip-path-30'><path class='cls-1' d='M857.16 163.95h28v28h-28z'/></clipPath><clipPath id='clip-path-32'><circle class='cls-1' cx='903.72' cy='177.73' r='13.78'/></clipPath><clipPath id='clip-path-33'><path class='cls-1' d='M880.94 157.95h53v43h-53z'/></clipPath><clipPath id='clip-path-35'><path class='cls-1' d='M889.94 163.95h28v28h-28z'/></clipPath><clipPath id='clip-path-37'><path class='cls-2' d='M934 169.21l-1.93 1.93 2.08 2.08 1.93-1.93zm-2-5.21l7.5 5v10l-7.5 5-7.5-5v-10z'/></clipPath><clipPath id='clip-path-38'><path class='cls-1' d='M632.5 93.95h320v568h-320z'/></clipPath><linearGradient id='linear-gradient' x1='237.65' y1='797.43' x2='236.87' y2='796.58' gradientTransform='matrix(19.99 0 0 -19.99 -4045.66 15988.03)' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='%23bb2cb6'/><stop offset='.49' stop-color='%23f72300'/><stop offset='1' stop-color='%23fe9c00'/></linearGradient><linearGradient id='linear-gradient-2' x1='260.1' y1='805.47' x2='259.46' y2='804.69' gradientTransform='matrix(10.27 0 0 -10.27 -1969.01 8318.55)' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='%23dd224b'/><stop offset='1' stop-color='%23fc5b00'/></linearGradient></defs><title>THE_LATEST_SPRITE</title><g><circle class='cls-3' cx='14.88' cy='54.88' r='14.88'/><path class='cls-4' d='M25.55 49.39L9.1 65.4a11.92 11.92 0 0 0 4.77 1.43l13-12.63a11.93 11.93 0 0 0-1.32-4.81zM16.84 43L3 56.52a12 12 0 0 0 3.56 7l17.18-16.74a12 12 0 0 0-6.9-3.78z'/></g><g><path class='cls-5' d='M41.55 68.88a10.41 10.41 0 0 1-6.74-18.33c.16-.13.67-.6.64-1.05a1 1 0 0 1 1.7-.77 2.52 2.52 0 0 1 .73 2.06 5.3 5.3 0 0 1-.05.73 8 8 0 0 1-.25 1.15 5.32 5.32 0 0 1-.18.5 3.89 3.89 0 0 0-.18.49 1.58 1.58 0 0 0 0 .57 1.13 1.13 0 0 0 .43.67 1.1 1.1 0 0 0 .75.28 1.4 1.4 0 0 0 .43-.08c1-.33.86-1.77.72-2.6a10.44 10.44 0 0 0-.46-1.62 8.22 8.22 0 0 1-.58-2.69 7.91 7.91 0 0 1 .2-1.78 7.13 7.13 0 0 1 1-2.34 9.69 9.69 0 0 1 1-1.25l.3-.33a1.49 1.49 0 0 1 .77-.46L42 42a1 1 0 0 1 1 1 1.71 1.71 0 0 1-.08.45c-.5 1.71 1.09 3.18 2.33 4.13a19.56 19.56 0 0 1 5 5 10.41 10.41 0 0 1-8.64 16.22z'/><path class='cls-6' d='M42 43a.74.74 0 0 1 0 .19c-.76 2.59 1.81 4.56 2.67 5.23a18.62 18.62 0 0 1 4.73 4.8 9.41 9.41 0 1 1-13.9-1.91 2.47 2.47 0 0 0 1-1.87h.05s.38.31.38 1.29a4.35 4.35 0 0 1 0 .59 6.92 6.92 0 0 1-.22 1 4.37 4.37 0 0 1-.16.43 4.74 4.74 0 0 0-.21.59 2.58 2.58 0 0 0-.05.94 2.24 2.24 0 0 0 2.17 1.83 2.41 2.41 0 0 0 .76-.13c.71-.25 1.83-1.06 1.38-3.71a11.39 11.39 0 0 0-.5-1.79 7.31 7.31 0 0 1-.52-2.36 6.91 6.91 0 0 1 .17-1.56 6.14 6.14 0 0 1 .86-2 9 9 0 0 1 .94-1.13l.3-.33A.5.5 0 0 1 42 43m0-2a2 2 0 0 0-.43 0 2.47 2.47 0 0 0-1.3.78l-.28.31a10.69 10.69 0 0 0-1.14 1.38 8.14 8.14 0 0 0-1.14 2.66 8.83 8.83 0 0 0-.21 1.55 2 2 0 0 0-3 1.73 1.33 1.33 0 0 1-.29.32A11.41 11.41 0 1 0 51 52.09a20.62 20.62 0 0 0-5.19-5.28c-1.56-1.2-2.19-2.21-1.94-3.06a2.59 2.59 0 0 0 .12-.66A2 2 0 0 0 42 41zm-3.83 13a.5.5 0 0 1 0-.14 3.35 3.35 0 0 1 .13-.34 6.33 6.33 0 0 0 .23-.63v-.09c.12.88 0 1.24-.08 1.3h-.2l-.1-.11z'/></g><path class='cls-5' d='M367.12 49.38a4.18 4.18 0 0 0 .15-.41 6.61 6.61 0 0 0 .21-1 4.16 4.16 0 0 0 0-.57c0-.94-.34-1.22-.36-1.24h-.05a2.36 2.36 0 0 1-.95 1.78 9 9 0 1 0 13.28 1.82 17.8 17.8 0 0 0-4.52-4.58c-.83-.64-3.27-2.52-2.55-5a.71.71 0 0 0 0-.18.48.48 0 0 0-.24.15l-.29.32a8.6 8.6 0 0 0-.9 1.08 5.87 5.87 0 0 0-.82 1.92A6.6 6.6 0 0 0 370 45a7 7 0 0 0 .5 2.25 10.89 10.89 0 0 1 .48 1.71c.43 2.54-.64 3.31-1.32 3.55a2.3 2.3 0 0 1-.73.13 2.14 2.14 0 0 1-2.08-1.75 2.46 2.46 0 0 1 .05-.89 4.53 4.53 0 0 1 .22-.62z'/><g><path class='cls-7' d='M646.48 68.06a10.2 10.2 0 0 1-6.61-18 1.23 1.23 0 0 0 .51-.76 1.25 1.25 0 0 1 2.1-1 2.71 2.71 0 0 1 .8 2.19 5.3 5.3 0 0 1-.05.73 7.81 7.81 0 0 1-.25 1.14 5.27 5.27 0 0 1-.19.52 3.64 3.64 0 0 0-.15.42 1.27 1.27 0 0 0 0 .43.89.89 0 0 0 .31.45.75.75 0 0 0 .52.19 1.06 1.06 0 0 0 .31-.06c.7-.24.61-1.45.49-2.14a9.68 9.68 0 0 0-.43-1.51 8 8 0 0 1-.57-2.64 7.79 7.79 0 0 1 .2-1.76 7.13 7.13 0 0 1 1-2.32 9.68 9.68 0 0 1 1-1.23l.28-.31a1.72 1.72 0 0 1 .89-.54 1.25 1.25 0 0 1 1.52 1.25 1.94 1.94 0 0 1-.09.51c-.42 1.46 1 2.76 2.11 3.62a18.92 18.92 0 0 1 4.78 4.87 10.2 10.2 0 0 1-8.47 15.9z'/><path class='cls-6' d='M646.9 43.13a.71.71 0 0 1 0 .18c-.72 2.47 1.72 4.34 2.54 5a17.72 17.72 0 0 1 4.5 4.56A9 9 0 1 1 640.68 51a2.35 2.35 0 0 0 .95-1.78h.05s.36.3.36 1.23a4.15 4.15 0 0 1 0 .56 6.59 6.59 0 0 1-.21 1 4.16 4.16 0 0 1-.15.41 4.5 4.5 0 0 0-.2.57 2.45 2.45 0 0 0 0 .89 2.13 2.13 0 0 0 2.07 1.74 2.29 2.29 0 0 0 .72-.13c.67-.23 1.74-1 1.31-3.53a10.84 10.84 0 0 0-.48-1.7 7 7 0 0 1-.5-2.24 6.57 6.57 0 0 1 .17-1.48 5.84 5.84 0 0 1 .81-1.91 8.56 8.56 0 0 1 .89-1.07l.29-.31a.47.47 0 0 1 .23-.15m0-2.5a2.5 2.5 0 0 0-.53.06 2.94 2.94 0 0 0-1.56.92l-.27.29a10.65 10.65 0 0 0-1.14 1.39 8.34 8.34 0 0 0-1.25 2.74q-.09.39-.14.78a2.5 2.5 0 0 0-3 2.26l-.07.07A11.45 11.45 0 1 0 656 51.45a20.21 20.21 0 0 0-5.08-5.17c-1.53-1.19-1.74-1.88-1.64-2.26a3.18 3.18 0 0 0 .14-.78 2.5 2.5 0 0 0-2.5-2.61z'/></g><g><path class='cls-8' d='M671.11 68.06a10.2 10.2 0 0 1-6.61-18 1.23 1.23 0 0 0 .51-.76 1.25 1.25 0 0 1 2.1-1 2.71 2.71 0 0 1 .8 2.19 5.24 5.24 0 0 1-.05.74 7.77 7.77 0 0 1-.25 1.14 5.27 5.27 0 0 1-.19.52 3.34 3.34 0 0 0-.15.42 1.22 1.22 0 0 0 0 .43.89.89 0 0 0 .31.45.74.74 0 0 0 .52.19 1.06 1.06 0 0 0 .31-.06c.7-.24.61-1.45.49-2.14a9.67 9.67 0 0 0-.43-1.51 8 8 0 0 1-.56-2.64 7.79 7.79 0 0 1 .2-1.76 7.09 7.09 0 0 1 1-2.32 9.58 9.58 0 0 1 1-1.23l.28-.3a1.72 1.72 0 0 1 .89-.53 1.25 1.25 0 0 1 1.52 1.29 2 2 0 0 1-.09.49c-.42 1.45 1 2.75 2.11 3.6a18.92 18.92 0 0 1 4.78 4.87 10.2 10.2 0 0 1-8.47 15.9z'/><path class='cls-6' d='M671.53 43.13a.71.71 0 0 1 0 .18c-.72 2.47 1.72 4.34 2.54 5a17.72 17.72 0 0 1 4.5 4.56A9 9 0 1 1 665.31 51a2.35 2.35 0 0 0 .95-1.78h.05s.36.3.36 1.23a4.15 4.15 0 0 1 0 .56 6.59 6.59 0 0 1-.21 1 4.17 4.17 0 0 1-.15.41 4.5 4.5 0 0 0-.2.57 2.45 2.45 0 0 0 0 .89 2.13 2.13 0 0 0 2.07 1.74 2.29 2.29 0 0 0 .72-.13c.67-.23 1.74-1 1.31-3.53a10.83 10.83 0 0 0-.48-1.7 7 7 0 0 1-.5-2.24 6.57 6.57 0 0 1 .17-1.48 5.84 5.84 0 0 1 .81-1.91 8.56 8.56 0 0 1 .79-1.03l.29-.31a.47.47 0 0 1 .23-.15m0-2.5a2.5 2.5 0 0 0-.53.06 2.94 2.94 0 0 0-1.56.92l-.27.29A10.65 10.65 0 0 0 668 43.3a8.34 8.34 0 0 0-1.13 2.7q-.09.39-.14.78a2.5 2.5 0 0 0-3 2.26l-.07.07a11.45 11.45 0 1 0 16.91 2.32 20.21 20.21 0 0 0-5.08-5.17c-1.53-1.19-1.74-1.88-1.64-2.26a3.18 3.18 0 0 0 .14-.78 2.5 2.5 0 0 0-2.5-2.61z'/></g><g><path class='cls-9' d='M54.15 63.13V47.9l9.47-5.48 9.48 5.48v15.23l-9.48 5.47-9.47-5.47z'/><path class='cls-6' d='M63.62 43.57l8.48 4.9v14.09l-8.48 4.9-8.48-4.9V48.47l8.48-4.9m0-2.29l-1 .57-8.48 4.9-1 .57V63.7l1 .57 8.48 4.9 1 .57 1-.57 8.48-4.9 1-.57V47.32l-1-.57-8.48-4.9-1-.57z'/></g><path class='cls-10' d='M63.63 43.58l-.01-.01-8.47 4.89 3.56 2.97 4.92-1.62v-6.23z'/><path class='cls-11' d='M63.63 67.43l.01.01 8.47-4.89-3.55-2.97-4.93 1.61v6.24z'/><path class='cls-12' d='M63.62 48.59l4.92 2.84v8.16l-4.92 2.84-4.91-2.84v-8.16l4.91-2.84z'/><g><path class='cls-6' d='M59.28 53.72a.07.07 0 0 1-.07 0 4.53 4.53 0 0 0-2.43-2.48.07.07 0 0 1 0-.13 4.54 4.54 0 0 0 2.43-2.48.07.07 0 0 1 .07 0 .07.07 0 0 1 .07 0 4.54 4.54 0 0 0 2.43 2.48.07.07 0 0 1 0 .13 4.53 4.53 0 0 0-2.43 2.48.07.07 0 0 1-.07 0z'/><path class='cls-6' d='M59.28 48.62a4.59 4.59 0 0 0 2.47 2.52 4.59 4.59 0 0 0-2.47 2.52 4.59 4.59 0 0 0-2.47-2.52 4.59 4.59 0 0 0 2.47-2.52m0-.15a.15.15 0 0 0-.14.09A4.46 4.46 0 0 1 56.75 51a.15.15 0 0 0 0 .27 4.46 4.46 0 0 1 2.39 2.44.15.15 0 0 0 .27 0 4.46 4.46 0 0 1 2.39-2.44.15.15 0 0 0 0-.27 4.46 4.46 0 0 1-2.39-2.44.15.15 0 0 0-.14-.09z'/></g><path class='cls-13' d='M65.5 49.68l-6.79 6.8v3.11l.81.48 8.78-8.78-2.8-1.61zM61.92 61.45l6.62-6.62v-2.17l-7.99 8 1.37.79z'/><g><path class='cls-9' d='M106.59 140l26.34 15.21v43.75l-26.34 15.21-26.35-15.21v-43.75L106.59 140z'/><path class='cls-10' d='M106.63 140.02l-.04-.02-26.3 15.18 11.04 9.23 15.3-5.02v-19.37z'/><path class='cls-11' d='M106.61 214.09l.04.02 26.29-15.18-11.03-9.23-15.3 5.02v19.37z'/><path class='cls-12' d='M106.59 155.6l15.26 8.81v25.35l-15.26 8.81-15.26-8.81v-25.35l15.26-8.81z'/><g><path class='cls-6' d='M93.1 169.81a.18.18 0 0 1-.17-.11 11.07 11.07 0 0 0-5.94-6 .18.18 0 0 1 0-.33 11.06 11.06 0 0 0 5.94-6 .18.18 0 0 1 .17-.11.18.18 0 0 1 .17.11 11.06 11.06 0 0 0 5.94 6 .18.18 0 0 1 0 .33 11.06 11.06 0 0 0-5.94 6 .18.18 0 0 1-.17.11z'/><path class='cls-6' d='M93.1 157.34a11.2 11.2 0 0 0 6 6.15 11.2 11.2 0 0 0-6 6.15 11.2 11.2 0 0 0-6-6.15 11.2 11.2 0 0 0 6-6.15m0-.36a.36.36 0 0 0-.33.22 10.88 10.88 0 0 1-5.84 5.95.36.36 0 0 0 0 .66 10.88 10.88 0 0 1 5.84 5.95.36.36 0 0 0 .66 0 10.88 10.88 0 0 1 5.84-5.95.36.36 0 0 0 0-.66 10.88 10.88 0 0 1-5.84-5.95.36.36 0 0 0-.33-.22z'/></g><path class='cls-13' d='M112.43 158.97l-21.1 21.11v9.68l2.53 1.46 27.24-27.24-8.67-5.01zM101.3 195.52l20.55-20.56v-6.73l-24.82 24.82 4.27 2.47z'/></g><path class='cls-6' d='M37.48 52.58h1.96v2.38h-1.96z'/><path class='cls-14' d='M87.25 60a1 1 0 0 1-.32-.05.9.9 0 0 1-.25-.14c-5.45-3.93-8-6.06-9.59-7.86A7.69 7.69 0 0 1 75 46.32v-.06A6.54 6.54 0 0 1 81.77 40a7 7 0 0 1 5.48 2.59A7 7 0 0 1 92.73 40a6.54 6.54 0 0 1 6.77 6.26v.06A7.69 7.69 0 0 1 97.41 52c-1.54 1.79-4.14 3.92-9.6 7.86a.91.91 0 0 1-.22.12 1 1 0 0 1-.34.02z'/><path class='cls-8' d='M138.5 60a1 1 0 0 1-.32-.05.92.92 0 0 1-.26-.14c-5.56-3.93-8.21-6.06-9.79-7.86a7.6 7.6 0 0 1-2.13-5.63v-.06c0-3.45 3.1-6.26 6.91-6.26a7.21 7.21 0 0 1 5.59 2.59 7.22 7.22 0 0 1 5.59-2.59c3.81 0 6.91 2.81 6.91 6.26v.06a7.6 7.6 0 0 1-2.13 5.68c-1.57 1.79-4.23 3.92-9.79 7.86a.94.94 0 0 1-.23.12 1 1 0 0 1-.35.02z'/><path class='cls-8' d='M138.25 60a1 1 0 0 1-.32-.05.9.9 0 0 1-.25-.14c-5.45-3.93-8-6.06-9.59-7.86a7.69 7.69 0 0 1-2.09-5.63v-.06a6.54 6.54 0 0 1 6.77-6.26 7 7 0 0 1 5.48 2.59 7 7 0 0 1 5.48-2.59 6.54 6.54 0 0 1 6.77 6.26v.06a7.69 7.69 0 0 1-2.09 5.68c-1.54 1.79-4.14 3.92-9.6 7.86a.91.91 0 0 1-.22.12 1 1 0 0 1-.34.02z'/><path class='cls-15' d='M409.14 62.42a.85.85 0 0 1-.28 0 .79.79 0 0 1-.22-.12c-4.74-3.38-7-5.21-8.35-6.74a6.55 6.55 0 0 1-1.81-4.86v-.05a5.66 5.66 0 0 1 5.89-5.37 6.14 6.14 0 0 1 4.77 2.22 6.14 6.14 0 0 1 4.77-2.22 5.66 5.66 0 0 1 5.89 5.37v.05a6.55 6.55 0 0 1-1.8 4.81c-1.34 1.54-3.61 3.37-8.35 6.75a.8.8 0 0 1-.19.11.86.86 0 0 1-.32.05z'/><g><path class='cls-16' d='M115.13 52.85a.93.93 0 0 1 1.24-.07l7.63-7.64a2 2 0 0 0 0-2.83l-1.18-1.18a2 2 0 0 0-2.83 0l-7.4 7.4a.93.93 0 0 1-1.28 1.28l-.86.86a2 2 0 0 0-.13 2.66l-6 6-.72-.72-2.77 3.73 1.71 1.71 3.73-2.77-.8-.8 6-6 .16.16a2 2 0 0 0 2.83 0l.6-.6a.93.93 0 0 1 .07-1.19zM117.57 53.93l-2.75 2.75 6.5 7 3.44-3.25zm3.88 7.69a1.25 1.25 0 1 1 1.25-1.25 1.25 1.25 0 0 1-1.26 1.25zM107.04 51.39l5.07-5.19-2.32-4.99-3.7-1.21-.61 1.41 2.15 1.96.3 1.76-1.88 1.82-1.76-.3-1.8-2.23-1.29.43.82 4.11 5.02 2.43z'/></g><path class='cls-6' d='M182.88 45.38c-3.93 0-3.34 4.78-6.25 4.48a11.28 11.28 0 0 0-10.44-7c-5.07 0-9.67 4.42-10.5 9.27-1.52-.27-2-1.83-2.74-1.83-1.55 0 .33 3.9 4.11 6.68a7 7 0 0 0 1 .75c-.26 1.1-.95 2-1 3.1-.12 1.37.4 1.92 1.4 2s2.16-.38 2.33-3.06a4.61 4.61 0 0 1 .1-.76 20.24 20.24 0 0 0 5.13.92 26.06 26.06 0 0 0 5.42-.41 8.21 8.21 0 0 0 .36 2.43c.52 1.27 1.23 1.52 2.16 1.14s1.75-1.33.67-3.79a4.6 4.6 0 0 1-.26-.73 4.88 4.88 0 0 0 3-4.57 12.13 12.13 0 0 0-.22-2.31c1.35.26 2 1.38 4.92 1.38a4.24 4.24 0 0 0 4.56-3.56c.15-.97.25-4.13-3.75-4.13z'/><path class='cls-17' d='M190.75 45.25a11 11 0 0 1-.12 8M196 42s3.06 7.48-.23 14.5'/><circle class='cls-18' cx='215.2' cy='55.02' r='14.91'/><path class='cls-6' d='M218.43 48l-1.48 1.64 1.1.79-1.67 4 .7-3.42-1.49-1.14 1.53-3a3.76 3.76 0 0 0-1.94-.58c-3.72 0-6.74 6.44-6.74 10.16a6.74 6.74 0 0 0 13.47 0 14 14 0 0 0-3.48-8.45z'/><path class='cls-19' d='M221.46 53.59a8 8 0 0 1-8.13 6.92 8.58 8.58 0 0 1-4.17-1.06 6.7 6.7 0 0 0 6 3.5 6.52 6.52 0 0 0 6.74-6.47 11 11 0 0 0-.44-2.89z'/><g><path class='cls-9' d='M241.71 61.25a10.1 10.1 0 1 1 10.1-10.1 10.12 10.12 0 0 1-10.1 10.1z'/><path class='cls-6' d='M241.71 42a9.1 9.1 0 1 1-9.1 9.1 9.1 9.1 0 0 1 9.1-9.1m0-2a11.1 11.1 0 1 0 11.1 11.1 11.12 11.12 0 0 0-11.1-11.1z'/></g><path class='cls-6' d='M278.71 52.67l-.37-2.32 3.06-.5 8.69.32 3.5.18.18 2.25-2.5 4.82-4.56 1.43-5.25-1.81-2.37-2.12-.38-2.25z'/><circle class='cls-6' cx='245.94' cy='48.86' r='1.3'/><circle class='cls-6' cx='237.46' cy='48.86' r='1.3'/><path class='cls-6' d='M236.85 55.92a4.82 4.82 0 0 1 9.65 0'/><g><path class='cls-20' d='M286.4 61.17a10.06 10.06 0 1 1 10.06-10.07 10.07 10.07 0 0 1-10.06 10.07zm-5.56-9.24a5.68 5.68 0 0 0 11.17 0z'/><path class='cls-6' d='M286.4 42a9.06 9.06 0 1 1-9.06 9.06A9.06 9.06 0 0 1 286.4 42m0 15.56a6.68 6.68 0 0 0 6.68-6.68h-13.33a6.68 6.68 0 0 0 6.68 6.68m0-17.56a11.06 11.06 0 1 0 11.03 11.1A11.08 11.08 0 0 0 286.4 40zm-4.2 12.89h8.45a4.67 4.67 0 0 1-8.45 0z'/></g><circle class='cls-6' cx='290.65' cy='47.89' r='1.29'/><circle class='cls-6' cx='282.21' cy='47.89' r='1.29'/><path class='cls-21' d='M264.09 42a9.15 9.15 0 1 0 9.15 9.15 9.15 9.15 0 0 0-9.15-9.15zm5.11 12.59h-10.13a1 1 0 0 1 0-2h10.13a1 1 0 0 1 0 2z'/><g><path class='cls-21' d='M264.09 61.29a10.15 10.15 0 1 1 10.15-10.15 10.16 10.16 0 0 1-10.15 10.15z'/><path class='cls-6' d='M264.09 42a9.15 9.15 0 1 1-9.15 9.15 9.15 9.15 0 0 1 9.15-9.15m0-2a11.15 11.15 0 1 0 11.15 11.15A11.16 11.16 0 0 0 264.09 40z'/></g><circle class='cls-6' cx='268.33' cy='48.81' r='1.3'/><circle class='cls-6' cx='259.81' cy='48.81' r='1.3'/><path class='cls-6' d='M270.18 53.61a1 1 0 0 1-1 1h-10.11a1 1 0 0 1-1-1 1 1 0 0 1 1-1h10.13a1 1 0 0 1 1 1z'/><path class='cls-22' d='M310.83 49.15l-8.29-8.29a2.42 2.42 0 0 0-3.42 3.42l6.59 6.59-6.59 6.59a2.42 2.42 0 0 0 3.42 3.42l8.29-8.29a2.45 2.45 0 0 0 0-3.45z'/><g><path class='cls-6' d='M339.94 49h-27.1l3.68-9h19.87l3.55 9z'/><path class='cls-23' d='M315 59h23v5h-23z'/><path class='cls-23' d='M315 50h3v10h-3zM335 50h3v10h-3z'/><path class='cls-24' d='M337.47 60h-22.33l1.58-4h19.17l1.58 4z'/><path class='cls-25' d='M312.81 49h5.3l2.52-9h-4.23l-3.59 9zM339.93 49h-5.3l-2.52-9h4.35l3.47 9zM323.66 49h5.42l-.51-9h-4.41l-.5 9zM318.11 49.18a2.65 2.65 0 1 1-5.3 0M329.08 49.18a2.71 2.71 0 1 1-5.42 0M339.92 49.18a2.65 2.65 0 1 1-5.3 0'/><path class='cls-26' d='M334.62 49.18a2.77 2.77 0 1 1-5.54 0M323.64 49.18a2.77 2.77 0 1 1-5.54 0'/></g><g><path class='cls-4' d='M351.09 65.13a3.57 3.57 0 0 1-3.52-3h-3a1 1 0 0 1-.29 0h-2.25a1 1 0 0 1-.82-1.57l2.4-3.56v-6.62a1 1 0 0 1 0-.22 7.47 7.47 0 0 1 4.23-6.48 3.19 3.19 0 0 1 6.28-.07 7.44 7.44 0 0 1 4.36 6.55 1 1 0 0 1 0 .21v6.75l2.14 3.38a1 1 0 0 1-.85 1.53h-2a.93.93 0 0 1-.28 0h-2.91a3.57 3.57 0 0 1-3.49 3.1z'/><path class='cls-6' d='M351 42a2.19 2.19 0 0 1 2.19 2.19v.11a6.43 6.43 0 0 1 4.32 6.08v7l2.31 3.62H353.6a2.56 2.56 0 1 1-5 0h-6.54l2.5-3.62v-7a6.43 6.43 0 0 1 4.2-6v-.16A2.19 2.19 0 0 1 351 42m0-2a4.19 4.19 0 0 0-4 3 8.48 8.48 0 0 0-4.36 7 2 2 0 0 0 0 .33v6.36l-2.19 3.17a2 2 0 0 0 1.62 3.14h2.14a1.93 1.93 0 0 0 .4 0h2.18a4.56 4.56 0 0 0 8.6 0h2.14a2 2 0 0 0 .41 0h1.88a2 2 0 0 0 1.69-3l-2-3.14v-6.48a2 2 0 0 0 0-.33 8.44 8.44 0 0 0-4.5-7.13A4.19 4.19 0 0 0 351 40z'/></g><g><path class='cls-27' d='M389.53 64.19a2.31 2.31 0 0 1-1.65-.68l-2.63-2.63a2.32 2.32 0 0 1 3.28-3.28l1 1 4-4a2.32 2.32 0 1 1 3.28 3.28l-5.63 5.63a2.3 2.3 0 0 1-1.64.68z'/><path class='cls-6' d='M395.18 54.92a1.32 1.32 0 0 1 .93 2.25l-5.63 5.63a1.31 1.31 0 0 1-.93.39 1.31 1.31 0 0 1-.93-.39L386 60.17a1.32 1.32 0 1 1 1.87-1.87l1.67 1.7 4.71-4.71a1.32 1.32 0 0 1 .93-.39m0-2a3.3 3.3 0 0 0-2.35 1l-3.3 3.3-.3-.3a3.32 3.32 0 1 0-4.7 4.7l2.63 2.63a3.35 3.35 0 0 0 4.72 0l5.63-5.63a3.32 3.32 0 0 0-2.35-5.67z'/></g><path class='cls-28' d='M471.19 40.06l11.88 11.61 11.56-11.61h-23.44zM470.13 41.56l7.89 8.65-7.89 8.64V41.56zM496.02 41.56l-7.89 8.65 7.89 8.64V41.56z'/><path class='cls-28' d='M471.44 59.92h23.17l-7.88-8.29-3.83 3.41-3.58-3.41-7.88 8.29z'/><g><path class='cls-6' d='M497.19 40.06l11.88 11.61 11.56-11.61h-23.44zM496.13 41.56l7.89 8.65-7.89 8.64V41.56zM522.02 41.56l-7.89 8.65 7.89 8.64V41.56z'/><path class='cls-6' d='M497.44 59.92h23.17l-7.88-8.29-3.83 3.41-3.58-3.41-7.88 8.29z'/></g><path d='M540.71 48h-5.46v-5.48a2.54 2.54 0 0 0-5.08 0V48h-5.46a2.54 2.54 0 1 0 0 5.08h5.46v5.46a2.54 2.54 0 1 0 5.08 0v-5.48h5.46a2.54 2.54 0 0 0 0-5.08z'/><path class='cls-6' d='M573.29 75.49h-3.55v-3.55a1.65 1.65 0 0 0-3.31 0v3.55h-3.55a1.65 1.65 0 1 0 0 3.31h3.55v3.55a1.65 1.65 0 1 0 3.31 0V78.8h3.55a1.65 1.65 0 0 0 0-3.31zM563.9 50.92v-2.63l-2.16-.3a7.54 7.54 0 0 0-1-2.57l1.26-1.65-1.86-1.86-1.55 1.18a7.56 7.56 0 0 0-2.71-1.2l-.23-1.89H553l-.25 1.81A7.56 7.56 0 0 0 550 43l-1.47-1.11-1.86 1.86 1.16 1.53a7.55 7.55 0 0 0-1 2.72l-2 .27v2.63l2.12.29a7.56 7.56 0 0 0 1.05 2.45l-1.36 1.8 1.86 1.86 1.89-1.44a7.54 7.54 0 0 0 2.29.9l.33 2.41h2.63l.34-2.46a7.55 7.55 0 0 0 2.21-.91l2 1.49 1.81-1.85-1.45-1.91a7.56 7.56 0 0 0 1-2.3zm-9.65 1.75a3.35 3.35 0 1 1 3.35-3.35 3.35 3.35 0 0 1-3.35 3.35zM591 79.24v-2.15l-1.77-.24a6.16 6.16 0 0 0-.78-2.1l1-1.35-1.45-1.52-1.27 1a6.18 6.18 0 0 0-2.22-1l-.21-1.51h-2.14l-.2 1.48a6.18 6.18 0 0 0-2.29 1l-1.2-.91-1.52 1.52.95 1.25a6.16 6.16 0 0 0-.85 2.22l-1.63.22v2.14l1.73.24a6.18 6.18 0 0 0 .91 2L576.95 83l1.52 1.52 1.53-1.24a6.16 6.16 0 0 0 1.87.73l.27 2h2.14l.28-2a6.17 6.17 0 0 0 1.81-.74l1.63 1.18 1.52-1.52-1.18-1.56a6.18 6.18 0 0 0 .84-1.88zm-7.88 1.43a2.74 2.74 0 1 1 2.74-2.74 2.74 2.74 0 0 1-2.72 2.74zM566.28 58.94l-3.65 5.34-3.65-5.34h7.3z'/><path d='M575.46 44.81l3.05-3.05a1 1 0 1 0-1.39-1.39l-3.74 3.74a1 1 0 0 0 0 1.39l3.74 3.74a1 1 0 1 0 1.39-1.39zM480.12 78.24l5.2-5.2a1.67 1.67 0 0 0-2.32-2.37l-6.38 6.38a1.69 1.69 0 0 0 0 2.38L483 85.8a1.67 1.67 0 0 0 2.37-2.37z'/><path class='cls-6' d='M490.12 78.24l5.2-5.2a1.67 1.67 0 0 0-2.32-2.37l-6.38 6.38a1.69 1.69 0 0 0 0 2.38L493 85.8a1.67 1.67 0 0 0 2.37-2.37z'/><path class='cls-29' d='M412.12 78.24l5.2-5.2a1.67 1.67 0 0 0-2.32-2.37l-6.38 6.38a1.69 1.69 0 0 0 0 2.38L415 85.8a1.67 1.67 0 0 0 2.37-2.37z'/><path class='cls-28' d='M422.12 78.24l5.2-5.2a1.67 1.67 0 0 0-2.32-2.37l-6.38 6.38a1.69 1.69 0 0 0 0 2.38L425 85.8a1.67 1.67 0 0 0 2.37-2.37z'/><path d='M582.43 44.81l-3.05 3.05a1 1 0 0 0 1.39 1.39l3.74-3.74a1 1 0 0 0 0-1.39l-3.74-3.74a1 1 0 0 0-1.39 1.39z'/><path class='cls-28' d='M575.46 54.81l3.05-3.05a1 1 0 1 0-1.39-1.39l-3.74 3.74a1 1 0 0 0 0 1.39l3.74 3.74a1 1 0 1 0 1.39-1.39zM582.43 54.81l-3.05 3.05a1 1 0 0 0 1.39 1.39l3.74-3.74a1 1 0 0 0 0-1.39l-3.74-3.74a1 1 0 0 0-1.39 1.39z'/><path class='cls-30' d='M123.42 85.83l-5.25-5.25a1.69 1.69 0 0 0-2.39 2.42l6.44 6.44a1.7 1.7 0 0 0 2.4 0l6.44-6.44a1.69 1.69 0 0 0-2.39-2.39z'/><path class='cls-31' d='M123.42 74.1l5.25 5.25a1.69 1.69 0 0 0 2.39-2.35l-6.44-6.44a1.7 1.7 0 0 0-2.4 0L115.78 77a1.69 1.69 0 0 0 2.39 2.39z'/><path class='cls-29' d='M106.42 85.83l-5.25-5.25A1.69 1.69 0 1 0 98.78 83l6.44 6.44a1.7 1.7 0 0 0 2.4 0l6.44-6.44a1.69 1.69 0 1 0-2.39-2.39z'/><path class='cls-29' d='M106.42 74.1l5.25 5.25a1.69 1.69 0 0 0 2.39-2.35l-6.44-6.44a1.7 1.7 0 0 0-2.4 0L98.78 77a1.69 1.69 0 0 0 2.39 2.39z'/><path class='cls-16' d='M13.42 70.35a1 1 0 0 0-1.38 0l-5.16 5.16-5.22-5.22a1 1 0 1 0-1.37 1.37L6 77.36a1 1 0 0 0 .17.25 1 1 0 0 0 1.38 0l5.89-5.89a1 1 0 0 0-.02-1.37zM89.5 70.29a1 1 0 0 0 0 1.38l5.16 5.16L89.44 82a1 1 0 0 0 1.38 1.38l5.7-5.7a1 1 0 0 0 .25-.17 1 1 0 0 0 0-1.38l-5.89-5.89a1 1 0 0 0-1.38.05z'/><path class='cls-32' d='M13.42 78.45a1 1 0 0 0-1.38 0l-5.16 5.16-5.22-5.22a1 1 0 1 0-1.37 1.37L6 85.46a1 1 0 0 0 .17.25 1 1 0 0 0 1.38 0l5.89-5.89a1 1 0 0 0-.02-1.37z'/><g><circle class='cls-31' cx='24' cy='80' r='10'/><path class='cls-6' d='M29.46 76.6a1 1 0 0 0-1.43 0L22.66 82l-2.31-2.31a1 1 0 0 0-1.43 1.43l2.81 2.81a1 1 0 0 0 .18.26 1 1 0 0 0 1.43 0L29.46 78a1 1 0 0 0 0-1.4z'/></g><path class='cls-16' d='M44.75 76v-1.86a4.14 4.14 0 0 0-8.28 0V76h-1.24v8.08H46V76zm-6.42-1.86a2.28 2.28 0 0 1 4.55 0V76h-4.55z'/><path class='cls-6' d='M628 51.56v-2.2a4.91 4.91 0 0 0-9.82 0v2.2h-1.46v9.59h12.75v-9.59zm-7.61-2.2a2.7 2.7 0 0 1 5.4 0v2.2h-5.4z'/><path class='cls-33' d='M53.57 73.25a3.25 3.25 0 1 0-4.52 3L47 82.93h6.56l-2.13-6.63a3.25 3.25 0 0 0 2.14-3.05z'/><path class='cls-32' d='M83 70a4.62 4.62 0 0 0-3.73 7.35L83 84l3.75-6.66A4.62 4.62 0 0 0 83 70zm0 6.31a1.69 1.69 0 1 1 1.69-1.69A1.69 1.69 0 0 1 83 76.31z'/><path class='cls-29' d='M145.67 82L142 78.33a5.47 5.47 0 1 0-1.67 1.6l3.67 3.74a1.16 1.16 0 0 0 1.67-1.67zm-8.23-3.66a3.06 3.06 0 1 1 3.06-3.06 3.06 3.06 0 0 1-3.06 3.1z'/><path class='cls-34' d='M166.69 81.09v-2.68l-2.21-.3a7.69 7.69 0 0 0-1-2.62l1.27-1.68-1.89-1.89-1.58 1.2a7.71 7.71 0 0 0-2.77-1.22l-.23-1.9h-2.68l-.26 1.85a7.71 7.71 0 0 0-2.86 1.2L151 71.91l-1.9 1.89 1.18 1.56a7.69 7.69 0 0 0-1.06 2.77l-2 .28v2.68l2.16.3a7.71 7.71 0 0 0 1.13 2.48l-1.41 1.83 1.9 1.89 1.93-1.46a7.69 7.69 0 0 0 2.34.91l.34 2.46h2.68l.35-2.5a7.69 7.69 0 0 0 2.26-.93l2 1.52 1.89-1.89-1.47-1.95a7.71 7.71 0 0 0 1-2.34zm-9.84 1.78a3.42 3.42 0 1 1 3.42-3.42 3.42 3.42 0 0 1-3.41 3.42z'/><path class='cls-28' d='M186.69 81.09v-2.68l-2.21-.3a7.69 7.69 0 0 0-1-2.62l1.27-1.68-1.89-1.89-1.58 1.2a7.71 7.71 0 0 0-2.77-1.22l-.23-1.9h-2.68l-.26 1.85a7.71 7.71 0 0 0-2.86 1.2L171 71.91l-1.9 1.89 1.18 1.56a7.69 7.69 0 0 0-1.06 2.77l-2 .28v2.68l2.16.3a7.71 7.71 0 0 0 1.13 2.48l-1.41 1.83 1.9 1.89 1.93-1.46a7.69 7.69 0 0 0 2.34.91l.34 2.46h2.68l.35-2.5a7.69 7.69 0 0 0 2.26-.93l2 1.52 1.89-1.89-1.47-1.95a7.71 7.71 0 0 0 1-2.34zm-9.84 1.78a3.42 3.42 0 1 1 3.42-3.42 3.42 3.42 0 0 1-3.41 3.42z'/><path class='cls-18' d='M223.42 70.35a1 1 0 0 0-1.38 0l-5.16 5.16-5.22-5.22a1 1 0 0 0-1.38 1.38l5.7 5.7a1 1 0 0 0 .17.25 1 1 0 0 0 1.38 0l5.89-5.89a1 1 0 0 0 0-1.38z'/><path class='cls-6' d='M223.42 78.45a1 1 0 0 0-1.38 0l-5.16 5.16-5.22-5.22a1 1 0 0 0-1.38 1.38l5.7 5.7a1 1 0 0 0 .17.25 1 1 0 0 0 1.38 0l5.89-5.89a1 1 0 0 0 0-1.38zM313.42 70.31a1 1 0 0 0 0 1.38l5.16 5.16-5.22 5.22a1 1 0 0 0 1.38 1.38l5.7-5.7a1 1 0 0 0 .25-.17 1 1 0 0 0 0-1.38l-5.89-5.89a1 1 0 0 0-1.38 0z'/><path class='cls-5' d='M228.44 77.14a3.16 3.16 0 0 0 .12-.31 5 5 0 0 0 .16-.73 3.15 3.15 0 0 0 0-.43c0-.71-.26-.93-.27-.94a1.79 1.79 0 0 1-.72 1.35 6.8 6.8 0 1 0 10 1.38 13.47 13.47 0 0 0-3.39-3.46c-.62-.48-2.48-1.91-1.93-3.78a.54.54 0 0 0 0-.13.36.36 0 0 0-.18.12l-.22.24a6.5 6.5 0 0 0-.68.81 4.44 4.44 0 0 0-.62 1.45 5 5 0 0 0-.13 1.12 5.28 5.28 0 0 0 .38 1.7 8.24 8.24 0 0 1 .36 1.29c.33 1.92-.48 2.51-1 2.68a1.74 1.74 0 0 1-.55.1 1.62 1.62 0 0 1-1.57-1.33 1.86 1.86 0 0 1 0-.68 3.43 3.43 0 0 1 .24-.45z'/><path class='cls-35' d='M254.6 80.08l3.9-3.9a3.29 3.29 0 1 0-4.66-4.66l-3.9 3.9-3.9-3.9a3.29 3.29 0 0 0-4.66 4.66l3.9 3.9-3.9 3.9a3.29 3.29 0 0 0 4.62 4.66l3.9-3.9 3.9 3.9a3.29 3.29 0 1 0 4.7-4.64z'/><path class='cls-30' d='M230.91 105.44l6.33-6.33a5.34 5.34 0 0 0-7.55-7.55l-6.33 6.33-6.36-6.33a5.34 5.34 0 0 0-7.55 7.55l6.33 6.33-6.33 6.33a5.34 5.34 0 0 0 7.55 7.55l6.33-6.33 6.33 6.33a5.34 5.34 0 0 0 7.55-7.55z'/><path class='cls-6' d='M269.16 75.48l2.25-2.25a1.89 1.89 0 1 0-2.68-2.68l-2.25 2.25-2.25-2.25a1.89 1.89 0 0 0-2.68 2.68l2.25 2.25-2.25 2.25a1.89 1.89 0 0 0 2.68 2.68l2.25-2.25 2.25 2.25a1.89 1.89 0 1 0 2.68-2.68z'/><g><path class='cls-6' d='M198.74 80a.7.7 0 0 1-.63-1 5.43 5.43 0 0 0 .06-3.93.7.7 0 0 1 1.3-.53 6.84 6.84 0 0 1-.08 5.05.7.7 0 0 1-.65.41zM201.63 81.83a.7.7 0 0 1-.63-1 10.53 10.53 0 0 0 .11-7.57.7.7 0 0 1 1.3-.53 11.78 11.78 0 0 1-.14 8.7.7.7 0 0 1-.64.4zM189.41 74.19H191a.41.41 0 0 0 .26-.09l4.34-3.6a.41.41 0 0 1 .67.32v12.32a.41.41 0 0 1-.67.32L191.36 80a.41.41 0 0 0-.26-.09h-1.46a1.63 1.63 0 0 1-1.64-1.6V75.6a1.41 1.41 0 0 1 1.41-1.41z'/></g><path class='cls-6' d='M148.43 125.62a2.55 2.55 0 0 1-2.31-3.63c3.19-6.82.24-14.21.2-14.28a2.55 2.55 0 0 1 4.72-1.93c.16.39 3.82 9.56-.31 18.38a2.55 2.55 0 0 1-2.3 1.46zM159 132.25a2.55 2.55 0 0 1-2.31-3.63c6.13-13.11.47-27.42.41-27.56a2.55 2.55 0 0 1 4.73-1.93c.27.67 6.59 16.47-.51 31.65a2.55 2.55 0 0 1-2.32 1.47zM114.48 104.43h5.94a1.5 1.5 0 0 0 1-.34L137.15 91a1.5 1.5 0 0 1 2.45 1.15V137a1.5 1.5 0 0 1-2.43 1.17l-15.58-12.5a1.5 1.5 0 0 0-.94-.33h-5.32a6 6 0 0 1-5.95-5.94v-9.86a5.11 5.11 0 0 1 5.1-5.11zM287.54 70.54a2 2 0 0 0-2.83 0l-6.2 5.79-1.85-1.85a2 2 0 0 0-2.83 2.83l3.17 3.13a2.17 2.17 0 0 0 3 .06l7.63-7.13a2 2 0 0 0-.09-2.83z'/><path class='cls-36' d='M204.81 91.59a5.43 5.43 0 0 0-7.67 0l-16.79 15.69-5-5a5.43 5.43 0 1 0-7.67 7.67l8.48 8.48a5.88 5.88 0 0 0 8 .17l20.67-19.32a5.43 5.43 0 0 0-.02-7.69z'/><path class='cls-37' d='M296.95 76.05a3.42 3.42 0 1 0-4 0 5.46 5.46 0 0 0-3.45 5.07h10.9a5.46 5.46 0 0 0-3.45-5.07zM301.23 70h1.83v10h-1.83zM304.02 76.08l3.96-1v1.25l3.34-.25v-4.66l-2.71.04-.04-1.38-4.46.59-.09 5.41z'/><path class='cls-6' d='M55.32 108H.82l7.4-17h39.95l7.15 17z'/><path class='cls-23' d='M5 129h46v11H5z'/><path class='cls-23' d='M5 110h3v22H5zM46 110h5v22h-5z'/><path class='cls-24' d='M50.34 131H5.46l3.17-8h38.54l3.17 8z'/><path class='cls-25' d='M.77 108h10.65l5.07-17H8L.77 108zM55.29 108H44.64l-5.07-17h8.74l6.98 17zM22.58 108h10.9l-1.01-17h-8.88l-1.01 17zM11.42 107a5.32 5.32 0 1 1-10.65 0M33.48 107a5.45 5.45 0 1 1-10.9 0M55.29 107a5.33 5.33 0 1 1-10.65 0'/><path class='cls-26' d='M44.63 107a5.57 5.57 0 1 1-11.14 0M22.55 107a5.57 5.57 0 1 1-11.14 0'/><path class='cls-35' d='M281.72 94a8 8 0 0 1 2 4.31 10.06 10.06 0 0 1-5.85-7.19 8.4 8.4 0 0 1 3.85 2.88zM283.92 99.66a8 8 0 0 1 2.59 4 10.06 10.06 0 0 1-6.74-6.36 8.4 8.4 0 0 1 4.15 2.36zM286.51 95.79a8 8 0 0 1-.22 4.76 10.06 10.06 0 0 1-1.78-9.09 8.4 8.4 0 0 1 2 4.33zM289.81 100.71a8 8 0 0 1-1.16 4.63 10.06 10.06 0 0 1 .07-9.27 8.4 8.4 0 0 1 1.09 4.64zM292.2 105.71a8 8 0 0 1-2.79 3.87 10.06 10.06 0 0 1 3.49-8.58 8.4 8.4 0 0 1-.7 4.71zM292 112.26a8 8 0 0 1-3.44 3.3 10.06 10.06 0 0 1 5-7.81 8.4 8.4 0 0 1-1.56 4.51zM291.75 117.79a8 8 0 0 1-4.25 2.21 10.06 10.06 0 0 1 7-6 8.4 8.4 0 0 1-2.75 3.79zM287.6 124.32a9.42 9.42 0 0 1-5.24 2 11.79 11.79 0 0 1 9-6.1 9.84 9.84 0 0 1-3.76 4.1z'/><path class='cls-35' d='M285.06 129.06a9.55 9.55 0 0 1-5.67-.06 12 12 0 0 1 10.73-2.5 10 10 0 0 1-5.06 2.56zM279 132.91a9.55 9.55 0 0 1-5.37-1.82 12 12 0 0 1 11 1 10 10 0 0 1-5.63.82zM270.65 137.45a6.93 6.93 0 0 1-2.62-3.17 8.67 8.67 0 0 1 6.41 4.77 7.24 7.24 0 0 1-3.79-1.6zM273.68 135.15a9.55 9.55 0 0 1-5.16-2.34 12 12 0 0 1 10.83 2 10 10 0 0 1-5.67.34z'/><path class='cls-35' d='M273.65 130.51a9.55 9.55 0 0 1-5.14 2.39 12 12 0 0 1 8.61-6.87 10 10 0 0 1-3.47 4.48zM281.4 125a9.06 9.06 0 0 1-3.79 3.82 11.34 11.34 0 0 1 5.39-9 9.47 9.47 0 0 1-1.6 5.18zM286.8 117a9.06 9.06 0 0 1-1.89 5 11.34 11.34 0 0 1 1.26-10.37 9.47 9.47 0 0 1 .63 5.37zM287.79 108.51a8.24 8.24 0 0 1 .75 4.84 10.32 10.32 0 0 1-3.64-8.78 8.62 8.62 0 0 1 2.89 3.94zM254.33 94a8 8 0 0 0-2 4.31 10.06 10.06 0 0 0 5.85-7.19 8.4 8.4 0 0 0-3.85 2.88zM252.13 99.66a8 8 0 0 0-2.59 4 10.06 10.06 0 0 0 6.74-6.36 8.4 8.4 0 0 0-4.15 2.36zM249.54 95.79a8 8 0 0 0 .22 4.76 10.06 10.06 0 0 0 1.78-9.09 8.4 8.4 0 0 0-2 4.33zM246.24 100.71a8 8 0 0 0 1.16 4.63 10.06 10.06 0 0 0-.07-9.27 8.4 8.4 0 0 0-1.09 4.64zM243.85 105.71a8 8 0 0 0 2.79 3.87 10.06 10.06 0 0 0-3.49-8.58 8.4 8.4 0 0 0 .7 4.71zM244.05 112.26a8 8 0 0 0 3.44 3.3 10.06 10.06 0 0 0-5-7.81 8.4 8.4 0 0 0 1.56 4.51zM244.3 117.79a8 8 0 0 0 4.25 2.17 10.06 10.06 0 0 0-7-6 8.4 8.4 0 0 0 2.75 3.83zM248.44 124.32a9.42 9.42 0 0 0 5.24 2 11.79 11.79 0 0 0-9-6.1 9.84 9.84 0 0 0 3.76 4.1z'/><path class='cls-35' d='M251 129.06a9.55 9.55 0 0 0 5.67-.06 12 12 0 0 0-10.73-2.5 10 10 0 0 0 5.06 2.56zM257 132.91a9.55 9.55 0 0 0 5.37-1.82 12 12 0 0 0-11 1 10 10 0 0 0 5.63.82zM265.4 137.45a6.93 6.93 0 0 0 2.62-3.17 8.67 8.67 0 0 0-6.41 4.77 7.24 7.24 0 0 0 3.79-1.6zM262.37 135.15a9.55 9.55 0 0 0 5.16-2.34 12 12 0 0 0-10.83 2 10 10 0 0 0 5.67.34z'/><path class='cls-35' d='M262.39 130.51a9.55 9.55 0 0 0 5.14 2.39 12 12 0 0 0-8.61-6.87 10 10 0 0 0 3.47 4.48zM254.65 125a9.06 9.06 0 0 0 3.79 3.82 11.34 11.34 0 0 0-5.39-9 9.47 9.47 0 0 0 1.6 5.18zM249.25 117a9.06 9.06 0 0 0 1.89 5 11.34 11.34 0 0 0-1.26-10.37 9.47 9.47 0 0 0-.63 5.37zM248.26 108.51a8.24 8.24 0 0 0-.75 4.84 10.32 10.32 0 0 0 3.64-8.78 8.62 8.62 0 0 0-2.89 3.94z'/><g><path class='cls-38' transform='rotate(-45 66.78 162.478)' d='M62.93 159.56h7.69v5.85h-7.69z'/><path class='cls-39' d='M64.79 160.33l.91 7.37 5.87-5.87-4.14-4.14-2.64 2.64z'/><path class='cls-38' d='M34.33 149.23h8.88v5.58h-8.88z'/><rect class='cls-38' x='65.09' y='153.8' width='9.08' height='11.2' rx='1.69' ry='1.69' transform='rotate(-45 69.626 159.4)'/><path class='cls-38' transform='rotate(-45 10.323 162.484)' d='M7.39 158.64h5.85v7.69H7.39z'/><path class='cls-39' d='M12.3 160.33l-.91 7.37-5.86-5.87 4.14-4.14 2.63 2.64z'/><rect class='cls-38' x='1.87' y='154.86' width='11.2' height='9.08' rx='1.69' ry='1.69' transform='rotate(-45 7.473 159.394)'/><path class='cls-39' d='M34.33 146.02h8.88v5.82h-8.88z'/><circle class='cls-38' cx='38.7' cy='190.03' r='35.97'/><circle class='cls-6' cx='38.7' cy='190.03' r='28.89'/><path class='cls-40' d='M38.76 187l20.49 23.6c5.45-5.38 8.83-11.56 8.83-19.81a29.64 29.64 0 0 0-29.64-29.64h.33z'/><path class='cls-41' d='M37.77 209.69a1 1 0 0 1 1-1 1 1 0 0 1 1 1v3.71a1 1 0 0 1-1 1 1 1 0 0 1-1-1z'/><path class='cls-42' d='M26.34 171.33a30 30 0 0 1 36 2.07 28.88 28.88 0 0 0-48.11 31.91 30 30 0 0 1 12.11-33.98z'/><rect class='cls-38' x='30.69' y='140' width='16.01' height='9.22' rx='1.72' ry='1.72'/><path class='cls-41' d='M15.32 191.11a1 1 0 0 1-1-1 1 1 0 0 1 1-1H19a1 1 0 0 1 1 1 1 1 0 0 1-1 1z'/><path class='cls-43' d='M39.83 170.38a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-3.71a1 1 0 0 1 1-1 1 1 0 0 1 1 1zM62.05 188.94a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-3.71a1 1 0 0 1-1-1 1 1 0 0 1 1-1z'/><path class='cls-44' d='M23.06 204.77a1 1 0 0 1 1.45 0 1 1 0 0 1 0 1.45l-1.34 1.34a1 1 0 0 1-1.45 0 1 1 0 0 1 0-1.45zM21.4 174.28a1 1 0 0 1 0-1.45 1 1 0 0 1 1.45 0l1.34 1.34a1 1 0 0 1 0 1.45 1 1 0 0 1-1.45 0z'/><path class='cls-43' d='M55 175.95a1 1 0 0 1-1.45 0 1 1 0 0 1 0-1.45l1.34-1.34a1 1 0 0 1 1.45 0 1 1 0 0 1 0 1.45zM56.21 205.56a1 1 0 0 1 0 1.45 1 1 0 0 1-1.45 0l-1.34-1.34a1 1 0 0 1 0-1.45 1 1 0 0 1 1.45 0z'/><path class='cls-44' d='M18.82 198a1 1 0 0 1 1.35.53 1 1 0 0 1-.53 1.35l-1.74.76a1 1 0 0 1-1.35-.53 1 1 0 0 1 .53-1.35zM28.44 169a1 1 0 0 1 .53-1.35 1 1 0 0 1 1.35.53l.76 1.74a1 1 0 0 1-.53 1.35 1 1 0 0 1-1.35-.53z'/><path class='cls-43' d='M59.06 182.83a1 1 0 0 1-1.35-.53 1 1 0 0 1 .53-1.35l1.76-.75a1 1 0 0 1 1.35.53 1 1 0 0 1-.53 1.35z'/><path class='cls-41' d='M49.38 210.84a1 1 0 0 1-.53 1.35 1 1 0 0 1-1.35-.53l-.76-1.74a1 1 0 0 1 .53-1.35 1 1 0 0 1 1.35.53z'/><path class='cls-44' d='M29.9 209.61a1 1 0 0 1 1.34-.54 1 1 0 0 1 .54 1.34l-.78 1.75a1 1 0 0 1-1.34.54 1 1 0 0 1-.54-1.34zM16.91 182a1 1 0 0 1-.54-1.34 1 1 0 0 1 1.34-.54l1.74.74a1 1 0 0 1 .54 1.34 1 1 0 0 1-1.34.54z'/><path class='cls-43' d='M48.64 170.92a1 1 0 0 1-1.34.54 1 1 0 0 1-.54-1.34l.74-1.74a1 1 0 0 1 1.34-.54 1 1 0 0 1 .54 1.34z'/><path class='cls-9' d='M55.66 205.56l-12.37-15.29v-.38a4.55 4.55 0 1 0-4.45 4.65h.32l15.68 11.86a.59.59 0 0 0 .82-.84z'/><path class='cls-43' d='M60.92 197.9a1 1 0 0 1 .54 1.34 1 1 0 0 1-1.34.54l-1.74-.78a1 1 0 0 1-.54-1.34 1 1 0 0 1 1.34-.54z'/><circle class='cls-6' cx='38.76' cy='189.99' r='1.69' transform='rotate(-1.27 38.948 190.38)'/><path class='cls-45' d='M20.14 163.39a24.54 24.54 0 0 0-6.66 6.23'/><circle class='cls-6' cx='24.4' cy='160.64' r='1.42'/></g><g><path class='cls-46' d='M311.11 123.92a8.21 8.21 0 0 0 8.21-8.21v-17.5a8.21 8.21 0 1 0-16.42 0v17.5a8.21 8.21 0 0 0 8.21 8.21z'/><path class='cls-46' d='M323 107.2v8.51a11.87 11.87 0 1 1-23.74 0v-8.51h-3v8.51a14.89 14.89 0 0 0 13.16 14.77v6.81H303v3h16.25v-3h-6.85v-6.77a14.89 14.89 0 0 0 13.6-14.81v-8.51z'/></g><g><path class='cls-6' d='M341.11 123.92a8.21 8.21 0 0 0 8.21-8.21v-17.5a8.21 8.21 0 1 0-16.42 0v17.5a8.21 8.21 0 0 0 8.21 8.21z'/><path class='cls-6' d='M353 107.2v8.51a11.87 11.87 0 1 1-23.74 0v-8.51h-3v8.51a14.89 14.89 0 0 0 13.16 14.77v6.81H333v3h16.25v-3h-6.85v-6.77a14.89 14.89 0 0 0 13.6-14.81v-8.51z'/></g><g><path class='cls-47' d='M371.11 123.92a8.21 8.21 0 0 0 8.21-8.21v-17.5a8.21 8.21 0 1 0-16.42 0v17.5a8.21 8.21 0 0 0 8.21 8.21z'/><path class='cls-47' d='M383 107.2v8.51a11.87 11.87 0 1 1-23.74 0v-8.51h-3v8.51a14.89 14.89 0 0 0 13.16 14.77v6.81H363v3h16.25v-3h-6.85v-6.77a14.89 14.89 0 0 0 13.6-14.81v-8.51z'/></g><g><path class='cls-48' d='M364.53 249.05a8.21 8.21 0 0 0 8.21-8.21v-17.5a8.21 8.21 0 1 0-16.42 0v17.5a8.21 8.21 0 0 0 8.21 8.21z'/><path class='cls-48' d='M376.4 232.34v8.51a11.87 11.87 0 1 1-23.74 0v-8.51h-3v8.51a14.89 14.89 0 0 0 13.16 14.77v6.81h-6.37v3h16.25v-3h-6.87v-6.77a14.89 14.89 0 0 0 13.58-14.81v-8.51z'/></g><g><path class='cls-18' d='M37.28 17.23v.19a13.47 13.47 0 0 1-.28 3.65 3.65 3.65 0 0 1-1.4 1.83 3.83 3.83 0 0 1-2.21.62 3.68 3.68 0 0 1-2.19-.63 3.53 3.53 0 0 1-1.29-1.77 12.75 12.75 0 0 1-.4-3.7V7h-5.28v10.42a20.39 20.39 0 0 0 .59 5.16 8.07 8.07 0 0 0 3 4.26 9.21 9.21 0 0 0 5.53 1.53 9.47 9.47 0 0 0 5.2-1.31 8.14 8.14 0 0 0 3.09-3.75 17.82 17.82 0 0 0 .84-5.89V7h-5.2zM21.78 0h-5.22v8.15L16.31 8a11 11 0 0 0-5.53-1.47 10.43 10.43 0 0 0-7.2 2.83A10.51 10.51 0 0 0 0 17.42a10.55 10.55 0 0 0 3.16 7.73 10.37 10.37 0 0 0 7.63 3.18 11 11 0 0 0 5.56-1.44 10.54 10.54 0 0 0 4-4 10.92 10.92 0 0 0 1.44-4.77v-.73-.67zm-6.86 21.82a5.41 5.41 0 0 1-4.08 1.7 5.35 5.35 0 0 1-4-1.68 6.12 6.12 0 0 1-1.6-4.4 6 6 0 0 1 1.62-4.31 5.36 5.36 0 0 1 4-1.69 5.41 5.41 0 0 1 4.09 1.67 6 6 0 0 1 1.6 4.33 6.07 6.07 0 0 1-1.63 4.38zM64.69 12a10.63 10.63 0 0 0-4-4 11 11 0 0 0-5.53-1.47 10.44 10.44 0 0 0-7.2 2.83 10.51 10.51 0 0 0-3.57 8.08 10.55 10.55 0 0 0 3.16 7.73 10.36 10.36 0 0 0 7.63 3.18 11 11 0 0 0 5.56-1.44 10.52 10.52 0 0 0 4-4 10.9 10.9 0 0 0 1.46-5.5A10.73 10.73 0 0 0 64.69 12zm-5.43 9.84a5.41 5.41 0 0 1-4.08 1.7 5.35 5.35 0 0 1-4-1.68 6.12 6.12 0 0 1-1.6-4.4 6 6 0 0 1 1.62-4.31 5.76 5.76 0 0 1 8.13 0 6 6 0 0 1 1.6 4.33 6.07 6.07 0 0 1-1.67 4.34zM84.33 28h5.27V7.9h-5.27zm-9-5.44a3.62 3.62 0 0 1-1.35-1.82 13.35 13.35 0 0 1-.33-3.65V0h-5.24v17.09a17.73 17.73 0 0 0 .86 5.91 8.15 8.15 0 0 0 3.09 3.75A9.48 9.48 0 0 0 77.55 28h4v-4.82h-4.04a3.82 3.82 0 0 1-2.21-.62zm34.91-10.78A8.13 8.13 0 0 0 107.11 8a9.48 9.48 0 0 0-5.2-1.31 9.21 9.21 0 0 0-5.53 1.53 8.06 8.06 0 0 0-3 4.26 20.35 20.35 0 0 0-.59 5.16V28h5.27V18v-.36a13 13 0 0 1 .4-3.7 3.56 3.56 0 0 1 1.29-1.77 3.7 3.7 0 0 1 2.19-.63 3.81 3.81 0 0 1 2.21.62 3.66 3.66 0 0 1 1.37 1.84 13.44 13.44 0 0 1 .32 3.65V28h5.22v-8.78-1.57a17.8 17.8 0 0 0-.85-5.88zM86.81.36a2.79 2.79 0 1 0 2.79 2.79A2.79 2.79 0 0 0 86.81.36zm69.89 11.79a10.57 10.57 0 0 0-4-4 11 11 0 0 0-5.56-1.44 10.36 10.36 0 0 0-7.63 3.18 10.54 10.54 0 0 0-3.16 7.73 10.52 10.52 0 0 0 3.57 8.08 10.43 10.43 0 0 0 7.2 2.83 11.05 11.05 0 0 0 5.54-1.47 10.8 10.8 0 0 0 5.49-9.44 10.91 10.91 0 0 0-1.45-5.47zm-3.79 5.5a6 6 0 0 1-1.6 4.35 5.76 5.76 0 0 1-8.14 0 6 6 0 0 1-1.61-4.31 6.12 6.12 0 0 1 1.6-4.39 5.35 5.35 0 0 1 4-1.68 5.4 5.4 0 0 1 4.08 1.7 6.07 6.07 0 0 1 1.63 4.37zm-18.36-.87a10.82 10.82 0 0 0-1.43-4.73 10.42 10.42 0 0 0-3.95-4 10.9 10.9 0 0 0-5.51-1.43 10.27 10.27 0 0 0-7.56 3.15 10.46 10.46 0 0 0-3.1 7.7 10.41 10.41 0 0 0 3.54 8 10.34 10.34 0 0 0 7.14 2.8 10.91 10.91 0 0 0 5.48-1.46l.25-.17V29a6 6 0 0 1-1.62 4.3 5.71 5.71 0 0 1-8 0l-3.4 3.7.09.09a10.34 10.34 0 0 0 7.14 2.8 10.91 10.91 0 0 0 5.48-1.46 10.69 10.69 0 0 0 5.44-9.35v-10.9-.67-.72zm-5.19.72a6 6 0 0 1-1.58 4.29 5.71 5.71 0 0 1-8.06 0 5.94 5.94 0 0 1-1.6-4.27 6.06 6.06 0 0 1 1.59-4.35 5.29 5.29 0 0 1 4-1.67 5.36 5.36 0 0 1 4 1.69 6 6 0 0 1 1.61 4.34z'/></g><g><path class='cls-6' d='M197 17.12v.19a13.38 13.38 0 0 1-.32 3.63 3.62 3.62 0 0 1-1.34 1.81 3.81 3.81 0 0 1-2.2.62 3.66 3.66 0 0 1-2.18-.63 3.51 3.51 0 0 1-1.24-1.74 12.67 12.67 0 0 1-.4-3.67V7h-5.24V17.31a20.26 20.26 0 0 0 .59 5.13 8 8 0 0 0 3 4.23 9.15 9.15 0 0 0 5.5 1.52 9.41 9.41 0 0 0 5.16-1.3 8.09 8.09 0 0 0 3.07-3.73 17.71 17.71 0 0 0 .83-5.85V7H197zM181.64 0h-5.18v8.1l-.25-.17a11 11 0 0 0-5.5-1.46 10.37 10.37 0 0 0-7.16 2.81 10.44 10.44 0 0 0-3.55 8 10.48 10.48 0 0 0 3.14 7.72 10.3 10.3 0 0 0 7.58 3.16 10.92 10.92 0 0 0 5.52-1.43 10.47 10.47 0 0 0 4-4 10.85 10.85 0 0 0 1.4-4.73v-.72-.67zm-6.81 21.67a5.38 5.38 0 0 1-4.05 1.69 5.32 5.32 0 0 1-4-1.67 6.08 6.08 0 0 1-1.59-4.37 6 6 0 0 1 1.58-4.32 5.72 5.72 0 0 1 8.08 0 6 6 0 0 1 1.59 4.3 6 6 0 0 1-1.61 4.38zm49.46-9.78a10.56 10.56 0 0 0-4-4 11 11 0 0 0-5.5-1.46 10.37 10.37 0 0 0-7.16 2.81 10.44 10.44 0 0 0-3.55 8 10.49 10.49 0 0 0 3.13 7.76 10.3 10.3 0 0 0 7.58 3.16 10.93 10.93 0 0 0 5.52-1.43 10.45 10.45 0 0 0 4-4 10.83 10.83 0 0 0 1.45-5.47 10.66 10.66 0 0 0-1.48-5.36zm-5.39 9.78a5.38 5.38 0 0 1-4.05 1.69 5.32 5.32 0 0 1-4-1.67 6.08 6.08 0 0 1-1.59-4.37 6 6 0 0 1 1.58-4.32 5.72 5.72 0 0 1 8.08 0 6 6 0 0 1 1.59 4.3 6 6 0 0 1-1.62 4.38zM243.8 27.82h5.2v-20h-5.2zm-9-5.41a3.6 3.6 0 0 1-1.34-1.81 13.26 13.26 0 0 1-.32-3.63V0H228v16.98a17.62 17.62 0 0 0 .83 5.85 8.1 8.1 0 0 0 3.07 3.73 9.42 9.42 0 0 0 5.16 1.3h4V23h-4a3.79 3.79 0 0 1-2.24-.59zm34.72-10.71a8.08 8.08 0 0 0-3.08-3.7 9.42 9.42 0 0 0-5.16-1.3 9.15 9.15 0 0 0-5.49 1.52 8 8 0 0 0-3 4.23 20.22 20.22 0 0 0-.59 5.12V27.88h5.24V17.9v-.36a12.87 12.87 0 0 1 .4-3.67 3.53 3.53 0 0 1 1.29-1.76 3.67 3.67 0 0 1 2.18-.63 3.79 3.79 0 0 1 2.2.62 3.63 3.63 0 0 1 1.34 1.81 13.36 13.36 0 0 1 .32 3.63V27.85h5.18V19.1v-1.56a17.69 17.69 0 0 0-.83-5.84zM246.26.36A2.77 2.77 0 1 0 249 3.13a2.77 2.77 0 0 0-2.74-2.77zm69.45 11.72a10.5 10.5 0 0 0-4-4 10.93 10.93 0 0 0-5.52-1.43 10.3 10.3 0 0 0-7.58 3.16 10.48 10.48 0 0 0-3.14 7.68 10.45 10.45 0 0 0 3.55 8 10.37 10.37 0 0 0 7.16 2.81 11 11 0 0 0 5.5-1.46 10.73 10.73 0 0 0 5.46-9.38 10.84 10.84 0 0 0-1.42-5.38zm-3.77 5.47a6 6 0 0 1-1.58 4.3 5.73 5.73 0 0 1-8.08 0 6 6 0 0 1-1.6-4.28 6.08 6.08 0 0 1 1.59-4.37 5.31 5.31 0 0 1 4-1.67 5.37 5.37 0 0 1 4.05 1.69 6 6 0 0 1 1.68 4.31zm-18.24-.86a10.75 10.75 0 0 0-1.42-4.7A10.36 10.36 0 0 0 288.36 8a10.83 10.83 0 0 0-5.47-1.42 10.2 10.2 0 0 0-7.52 3.13 10.39 10.39 0 0 0-3.11 7.61 10.35 10.35 0 0 0 3.52 8 10.28 10.28 0 0 0 7.09 2.78 10.84 10.84 0 0 0 5.45-1.45l.25-.16v2.35a6 6 0 0 1-1.57 4.31 5.67 5.67 0 0 1-8 0l-3.34 3.57.09.09a10.28 10.28 0 0 0 7.09 2.78 10.84 10.84 0 0 0 5.45-1.45 10.62 10.62 0 0 0 5.41-9.29V18.07v-.66-.72zm-5.15.72a5.93 5.93 0 0 1-1.55 4.25 5.68 5.68 0 0 1-8 0 5.9 5.9 0 0 1-1.59-4.24 6 6 0 0 1 1.58-4.33 5.26 5.26 0 0 1 4-1.66 5.32 5.32 0 0 1 4 1.68 6 6 0 0 1 1.6 4.31z'/></g><g><path class='cls-6' d='M429.53 50.44c0-1.17 3.28-2 3.28-5.55a4.34 4.34 0 0 0-2.07-3.72l1.84-.09 1.64-1.08h-5.75c-3.78 0-7 1.84-7 5.58 0 4 3.78 4.52 4.67 4.52a10.13 10.13 0 0 0 1-.06 1.72 1.72 0 0 0-.39 1.23 2.43 2.43 0 0 0 .89 1.82c-6.29 0-7.63 3.31-7.63 4.86s1.33 4.05 6.13 4.05 7.63-2.42 7.63-5.58-4.24-4.36-4.24-5.98zm-1.92-1.21c-1.47 0-3.59-1.86-3.59-5.08s2.53-3 2.53-3c1.56 0 3.7 1.73 3.7 5.1 0 1.94-1.17 2.98-2.64 2.98zm0 11.54c-2.79 0-5.06-1.32-5.06-3.52s2-3.33 6.14-3.33c0 0 3.09 1.69 3.09 3.7s-1.36 3.15-4.15 3.15zM443.01 49.1h-2.92v-2.92h-1.52v2.92h-2.92v1.52h2.92v2.92h1.52v-2.92h2.92V49.1z'/></g><g><path class='cls-6' d='M395.51 78.21c0-.92 2.58-1.58 2.58-4.37a3.41 3.41 0 0 0-1.63-2.92l1.44-.07 1.3-.85h-4.52c-3 0-5.49 1.44-5.49 4.38a3.53 3.53 0 0 0 3.67 3.55 8 8 0 0 0 .82-.05 1.36 1.36 0 0 0-.31 1 1.91 1.91 0 0 0 .7 1.43c-4.94 0-6 2.6-6 3.82s1 3.19 4.77 3.19 6-1.9 6-4.38-3.33-3.46-3.33-4.73zm-1.51-1c-1.16 0-2.82-1.46-2.82-4s2-2.36 2-2.36c1.22 0 2.91 1.36 2.91 4a2.08 2.08 0 0 1-2.09 2.41zm0 9.07c-2.19 0-4-1-4-2.77s1.6-2.62 4.83-2.62c0 0 2.43 1.33 2.43 2.91s-1.05 2.53-3.26 2.53zM406.11 77.15h-2.3v-2.29h-1.19v2.29h-2.3v1.2h2.3v2.3h1.19v-2.3h2.3v-1.2z'/></g><path class='cls-49' d='M376 78.21c0-.92 2.58-1.58 2.58-4.37a3.41 3.41 0 0 0-1.58-2.92l1.44-.07 1.26-.85h-4.52c-3 0-5.49 1.44-5.49 4.38a3.53 3.53 0 0 0 3.67 3.55 8 8 0 0 0 .82-.05 1.36 1.36 0 0 0-.31 1 1.91 1.91 0 0 0 .7 1.43c-4.94 0-6 2.6-6 3.82s1 3.19 4.77 3.19 6-1.9 6-4.38-3.34-3.46-3.34-4.73zm-1.51-1c-1.16 0-2.82-1.46-2.82-4s2-2.36 2-2.36c1.22 0 2.91 1.36 2.91 4a2.08 2.08 0 0 1-2.08 2.41zm0 9.07c-2.19 0-4-1-4-2.77s1.6-2.62 4.83-2.62c0 0 2.43 1.33 2.43 2.91s-1.04 2.53-3.24 2.53zM386.61 77.42h-2.3v-2.3h-1.19v2.3h-2.3v1.19h2.3v2.3h1.19v-2.3h2.3v-1.19z'/><path class='cls-50' d='M353.48 78.51l.36-2.78h-2.75V74c0-.81.22-1.35 1.38-1.35h1.47v-2.54a19.71 19.71 0 0 0-2.15-.11 3.35 3.35 0 0 0-3.58 3.68v2.05h-2.4v2.78h2.4v7.13h2.87v-7.13z'/><g><rect class='cls-6' x='325.1' y='69.94' width='4' height='10.03' rx='.5' ry='.5'/><rect class='cls-6' x='337.1' y='69.94' width='4' height='10.03' rx='.5' ry='.5'/><path class='cls-6' d='M322.1 73.03h2v3.94h-2zM342.1 73.03h2v3.94h-2zM330.1 74h5.94v2h-5.94z'/></g><path class='cls-6' d='M454.75 70.13l1.94 3.92 4.32.62-3.13 3.05.74 4.31-3.87-2.03-3.87 2.03.74-4.31-3.13-3.05 4.33-.62 1.93-3.92z'/><g class='cls-51'><g class='cls-52'><path class='cls-6' d='M67.81 81.84a8.46 8.46 0 0 1-4.58-1.34 6.08 6.08 0 0 0 .71 0 6 6 0 0 0 3.71-1.28 3 3 0 0 1-2.79-2.08 3 3 0 0 0 1.35-.05 3 3 0 0 1-2.4-2.93 3 3 0 0 0 1.35.37 3 3 0 0 1-.93-4 8.49 8.49 0 0 0 6.16 3.12 3 3 0 0 1 5.09-2.73 6 6 0 0 0 1.9-.73 3 3 0 0 1-1.31 1.65 6 6 0 0 0 1.72-.47 6.08 6.08 0 0 1-1.49 1.55v.39a8.45 8.45 0 0 1-8.5 8.5'/></g></g><path class='cls-6' d='M61.61 79.69l.39-2.78h-2.79v-1.78c0-.81.22-1.35 1.38-1.35h1.47v-2.49a19.71 19.71 0 0 0-2.15-.11 3.35 3.35 0 0 0-3.58 3.68v2.05h-2.4v2.78h2.4v7.13h2.87v-7.13zM468.11 69.88s-1.21 2.38-5.87 3.08c0 3.38 2.54 8.55 5.83 10 0-5.03.04-13.08.04-13.08zM469 69.88s1.21 2.38 5.88 3.08c0 3.38-2.54 8.55-5.83 10-.05-5.03-.05-13.08-.05-13.08z'/><g><path class='cls-29' d='M445.47 84.44a4.23 4.23 0 0 0 1.43-3.15 4.79 4.79 0 1 0-4.77 4.41 5.17 5.17 0 0 0 .85-.07l3.17 2.57z'/><path class='cls-29' d='M435.88 81.15a6 6 0 0 1 6.25-5.77h.59A6.75 6.75 0 0 0 435.9 70a6.65 6.65 0 0 0-6.9 6.37 6.12 6.12 0 0 0 2.07 4.55l-1 3.53 3.39-2.19a5.46 5.46 0 0 0 2.45.48h.23a5.35 5.35 0 0 1-.26-1.59z'/></g><path d='M526.54 70.54a2 2 0 0 0-2.83 0l-6.2 5.79-1.85-1.85a2 2 0 0 0-2.83 2.83l3.17 3.13a2.17 2.17 0 0 0 3 .06l7.63-7.13a2 2 0 0 0-.09-2.83z'/><path class='cls-53' d='M964.86 164.54a2 2 0 0 0-2.83 0l-6.2 5.79-1.83-1.85a2 2 0 1 0-2.83 2.83l3.13 3.13a2.17 2.17 0 0 0 3 .06l7.63-7.13a2 2 0 0 0-.07-2.83z'/><path class='cls-6' d='M596.8 78.56l-1.8 1.76-1.76-1.76a1.16 1.16 0 0 0-1.64 1.64l1.8 1.8-1.76 1.76a1.16 1.16 0 1 0 1.64 1.64l1.72-1.8 1.76 1.76a1.16 1.16 0 1 0 1.64-1.64L596.68 82l1.76-1.76a1.16 1.16 0 0 0-1.64-1.64zM599.33 70.66a1.16 1.16 0 0 0-1.64 0l-3.6 3.34-1.09-1.06a1.16 1.16 0 0 0-1.64 1.64l1.82 1.82a1.26 1.26 0 0 0 1.71 0l4.43-4.14a1.16 1.16 0 0 0 .01-1.6zM616 70.47a1.41 1.41 0 0 0 0 2l7.47 7.47-7.56 7.56a1.41 1.41 0 1 0 2 2l8.25-8.25a1.39 1.39 0 0 0 .36-.25 1.41 1.41 0 0 0 0-2l-8.51-8.51a1.41 1.41 0 0 0-2.01-.02zM633.13 70a4.66 4.66 0 0 0-3.76 7.42l3.73 6.74 3.78-6.72a4.66 4.66 0 0 0-3.75-7.44zm0 6.37a1.7 1.7 0 1 1 1.7-1.7 1.7 1.7 0 0 1-1.7 1.7z'/><path d='M655.38 78.22c0-.92 2.58-1.58 2.58-4.37a3.41 3.41 0 0 0-1.63-2.92l1.44-.07 1.29-.85h-4.52c-3 0-5.49 1.44-5.49 4.38a3.53 3.53 0 0 0 3.67 3.55 8 8 0 0 0 .82-.05 1.36 1.36 0 0 0-.31 1 1.91 1.91 0 0 0 .7 1.43c-4.94 0-6 2.6-6 3.82s1 3.19 4.77 3.19 6-1.9 6-4.38-3.32-3.46-3.32-4.73zm-1.51-1c-1.16 0-2.82-1.46-2.82-4s2-2.36 2-2.36c1.22 0 2.91 1.36 2.91 4a2.08 2.08 0 0 1-2.09 2.41zm0 9.07c-2.19 0-4-1-4-2.77s1.6-2.62 4.83-2.62c0 0 2.43 1.33 2.43 2.91s-1.05 2.53-3.24 2.53zM665.98 77.17h-2.29v-2.3h-1.2v2.3h-2.29v1.19h2.29v2.3h1.2v-2.3h2.29v-1.19z'/><path class='cls-6' d='M408 90a17 17 0 1 0 17 17 17 17 0 0 0-17-17zm-9.63 19.45h-2.54v-4.39h2.54zm5.26 2.79a.56.56 0 0 1-.56.56h-3.34a.56.56 0 0 1-.56-.56v-10.07a.56.56 0 0 1 .56-.56h3.34a.56.56 0 0 1 .56.56zm8.13-3.87h-7.33v-2.23h7.33zm5.25 3.87a.56.56 0 0 1-.56.56h-3.35a.56.56 0 0 1-.56-.56v-10.07a.56.56 0 0 1 .56-.56h3.34a.56.56 0 0 1 .56.56zm.8-2.79v-4.39h2.54v4.39z'/><path d='M646.48 79l.36-2.78h-2.75v-1.75c0-.81.22-1.35 1.38-1.35h1.47v-2.49a19.71 19.71 0 0 0-2.15-.11 3.35 3.35 0 0 0-3.58 3.68v2.05h-2.4V79h2.4v7.13h2.87V79z'/><path class='cls-28' d='M674.06 77.93l-5 5a1.61 1.61 0 1 0 2.28 2.28l6.13-6.13a1.62 1.62 0 0 0 0-2.28l-6.13-6.13a1.61 1.61 0 1 0-2.28 2.28z'/><path class='cls-29' d='M684.06 77.93l-5 5a1.61 1.61 0 1 0 2.28 2.28l6.13-6.13a1.62 1.62 0 0 0 0-2.28l-6.13-6.13a1.61 1.61 0 1 0-2.28 2.28z'/><path class='cls-6' d='M694.06 77.93l-5 5a1.61 1.61 0 1 0 2.28 2.28l6.13-6.13a1.62 1.62 0 0 0 0-2.28l-6.13-6.13a1.61 1.61 0 1 0-2.28 2.28z'/><g><path class='cls-9' d='M722.56 70l6.38 3.69v10.6l-6.38 3.68-6.39-3.68v-10.6l6.39-3.69z'/><path class='cls-10' d='M722.57 70h-.01l-6.38 3.68 2.68 2.24 3.71-1.22V70z'/><path class='cls-11' d='M722.56 87.95l.01.01 6.37-3.68-2.67-2.24-3.71 1.22v4.69z'/><path class='cls-12' d='M722.56 73.78l3.69 2.14v6.14l-3.69 2.13-3.7-2.13v-6.14l3.7-2.14z'/><g><path class='cls-6' d='M719.29 77.64a.05.05 0 0 1-.05 0 3.41 3.41 0 0 0-1.83-1.86.06.06 0 0 1 0-.1 3.41 3.41 0 0 0 1.83-1.86.05.05 0 0 1 .1 0 3.41 3.41 0 0 0 1.83 1.86.06.06 0 0 1 0 .1 3.41 3.41 0 0 0-1.83 1.86.05.05 0 0 1-.05 0z'/><path class='cls-6' d='M719.29 73.8a3.45 3.45 0 0 0 1.86 1.89 1.86 1.86 0 1 1-3.72 0 3.45 3.45 0 0 0 1.86-1.89m0-.11a.11.11 0 0 0-.1.07 3.35 3.35 0 0 1-1.8 1.83.11.11 0 0 0 0 .2 3.35 3.35 0 0 1 1.8 1.83.11.11 0 0 0 .1.07.11.11 0 0 0 .1-.07 3.35 3.35 0 0 1 1.8-1.83.11.11 0 0 0 0-.2 3.35 3.35 0 0 1-1.8-1.83.11.11 0 0 0-.1-.07z'/></g><path class='cls-13' d='M723.97 74.6l-5.11 5.11v2.35l.61.35 6.6-6.6-2.1-1.21zM721.27 83.45l4.98-4.98v-1.63l-6.01 6.02 1.03.59z'/></g><g><path class='cls-29' d='M767.53 71.5v8h-8.92v-8h8.92m1-1.5h-10.92a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10.92a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5z'/><path class='cls-29' d='M759.63 72.79h1.83v1.17h-1.83zM764.63 72.79h1.83v1.17h-1.83zM762.13 72.79h1.83v1.17h-1.83zM759.63 76.79h1.83v1.17h-1.83zM764.63 76.79h1.83v1.17h-1.83zM762.13 76.79h1.83v1.17h-1.83zM759.63 74.79h1.83v1.17h-1.83zM764.63 74.79h1.83v1.17h-1.83zM762.13 74.79h1.83v1.17h-1.83z'/></g><path class='cls-29' d='M750.05 75.11v-4.17h-2.17v4.17h-3.08l4.2 4.12 4.21-4.12h-3.16zM743.04 81.14h12.04v1.85h-12.04z'/><g><path d='M607.48 72a5.63 5.63 0 1 1-5.62 5.63 5.62 5.62 0 0 1 5.62-5.63m0-2a7.63 7.63 0 1 0 7.63 7.63 7.63 7.63 0 0 0-7.63-7.63z'/><path d='M611.09 79.6l-3.07-2.21v-3.72h-1.45v4.5h.03l3.64 2.61.85-1.18z'/></g><g><path class='cls-6' d='M707.48 72a5.63 5.63 0 1 1-5.62 5.63 5.62 5.62 0 0 1 5.62-5.63m0-2a7.63 7.63 0 1 0 7.63 7.63 7.63 7.63 0 0 0-7.63-7.63z'/><path class='cls-6' d='M711.09 79.6l-3.07-2.21v-3.72h-1.45v4.5h.03l3.64 2.61.85-1.18z'/></g><path class='cls-6' d='M557.35 70.97v-1h-4.16v1h-3.9v1.09h12v-1.09h-3.94zM549.32 73l2 12h8l2-12zm4.28 10.5a.48.48 0 0 1-.54-.42l-1-8.47a.48.48 0 1 1 1-.12L554 83a.48.48 0 0 1-.4.5zm3.89-.42a.48.48 0 1 1-1-.12l1-8.47a.48.48 0 1 1 1 .12z'/><path d='M545.1 70.97v-1h-4.16v1h-3.9v1.09h12v-1.09h-3.94zM537.07 73l2 12h8l2-12zm4.28 10.5a.48.48 0 0 1-.54-.42l-1-8.47a.48.48 0 1 1 1-.12l1 8.47a.48.48 0 0 1-.46.54zm3.89-.42a.48.48 0 1 1-1-.12l1-8.47a.48.48 0 1 1 1 .12z'/><path class='cls-6' d='M532.6 77.31c3.87-2.23 3.36-5.05 3.36-5.05h-7c0 1.53.46 3.34 3.34 5.06-3.87 2.23-3.36 5.05-3.36 5.05h7c0-1.53-.46-3.37-3.34-5.06zM527.95 70.58h8.94v1.08h-8.94zM527.95 83.08h8.94v1.08h-8.94z'/><path class='cls-29' d='M740.68 72.1a2.6 2.6 0 0 0-3.67 0L736 73.15a2.57 2.57 0 0 0-.4 3.13l-.21.21a2.56 2.56 0 0 0-3.06.44l-1.1 1.07a2.6 2.6 0 1 0 3.67 3.67l1.05-1.05a2.56 2.56 0 0 0 .47-3l.27-.27a2.57 2.57 0 0 0 2.93-.51l1.05-1.05a2.59 2.59 0 0 0 0-3.67zm-5.61 7.62L734 80.77a1.38 1.38 0 0 1-1.9 0 1.35 1.35 0 0 1 0-1.9l1.05-1.05a1.34 1.34 0 0 1 1-.39h.27l-1.23 1.23a.69.69 0 0 0 0 1l.12.12a.69.69 0 0 0 1 0l1.19-1.19a1.34 1.34 0 0 1-.44 1.13zm4.73-4.83l-1.05 1.05a1.35 1.35 0 0 1-1 .37l1.19-1.19a.69.69 0 0 0 0-1l-.12-.12a.69.69 0 0 0-1 0l-1.31 1.31a1.34 1.34 0 0 1 .34-1.3l1.04-1.01a1.35 1.35 0 1 1 1.9 1.9z'/><g><path class='cls-6' d='M502.03 78.04h4.04v8.13h-4.04zM502.03 70h4v1.08h-4zM507.11 75.83a3.54 3.54 0 0 0 1.5 1.21H511v-4.91h-1.92a3.33 3.33 0 0 0-2 1l-.12-1h-5.29c-3.62 0-4.54 4.71-4.54 4.71a4.59 4.59 0 0 1 3.21-1.23c1.58 0 1.73.53 1.73.81v.65h4l.5-1.21z'/></g><path class='cls-54' d='M82.3 93C70 93 60 101.2 60 111.3c0 6.1 3.6 11.4 9.1 14.8v.2c0 6.6-8 8.4-2.4 8.4 5.2 0 10-3.6 11.1-5.4a34.19 34.19 0 0 0 4.5.4c12.3 0 22.3-8.2 22.3-18.3.1-10.3-9.9-18.4-22.3-18.4z'/><path class='cls-6' d='M600 41a12 12 0 1 0 12 12 12 12 0 0 0-12-12zm5.5 13.92h-3.33v3.33a2.08 2.08 0 1 1-4.17 0V54.9h-3.33a2.08 2.08 0 0 1 0-4.17H598V47.4a2.08 2.08 0 0 1 4.17 0v3.33h3.33a2.08 2.08 0 0 1 0 4.17z'/><g><path class='cls-55' d='M775 80a2.7 2.7 0 0 1 .26-5.4h1.5v-2.52h-1.5a5.25 5.25 0 0 0-.26 10.48v2.32l3.62-3.59L775 77.7zM781.76 72.08h-.32v-2.2l-3.62 3.59 3.62 3.59v-2.44h.32a2.7 2.7 0 0 1 0 5.41h-1.89v2.54h1.89a5.25 5.25 0 0 0 0-10.49z'/></g><path d='M794.4 81.38a8.13 8.13 0 0 1-4.4-1.29 5.84 5.84 0 0 0 .69 0 5.76 5.76 0 0 0 3.57-1.23 2.88 2.88 0 0 1-2.68-2 2.88 2.88 0 0 0 1.3 0 2.87 2.87 0 0 1-2.3-2.82 2.86 2.86 0 0 0 1.3.36 2.88 2.88 0 0 1-.89-3.84 8.16 8.16 0 0 0 5.92 3 2.87 2.87 0 0 1 4.9-2.62 5.75 5.75 0 0 0 1.82-.7 2.88 2.88 0 0 1-1.26 1.59 5.74 5.74 0 0 0 1.65-.45 5.84 5.84 0 0 1-1.43 1.49v.37a8.12 8.12 0 0 1-8.17 8.17'/><path class='cls-56' d='M707.16 114.21l-7-24-23.56 8.34 8.92 4.57c-8 12.11-21 19-33.57 18.47a36.89 36.89 0 0 0 46.9-11.59z'/><path class='cls-57' d='M254.42 203.16a25.27 25.27 0 1 1 25.27-25.27'/><path class='cls-58' d='M314.42 203.16a25.27 25.27 0 1 1 25.27-25.27'/><path class='cls-59' d='M361 166.84a6.27 6.27 0 0 1 2.15-4.89l-.12.12a6.46 6.46 0 1 0-9.49.48 6 6 0 0 1 1.51 4.24M354.07 168.85h7.65M355.14 171.87h5.51M389.69 154.49l-15.57 15.57M374.12 154.49l15.57 15.57'/><circle class='cls-56' cx='485.34' cy='186.55' r='37.25'/><path class='cls-60' d='M466.72 216.75a2 2 0 0 1 2.14-1.19c3 .4 5.46 2.28 8.08 3.71h3.34a3.24 3.24 0 0 1 2.42-2.27 8 8 0 0 1 4.29.4 18 18 0 0 1 7.89-1.8 2.4 2.4 0 0 1 1 .28 10.62 10.62 0 0 1 1.18.23 20.34 20.34 0 0 1 5.27-.93 2.33 2.33 0 0 1 1 .21 2.41 2.41 0 0 1 1.49-.74v-34a19.47 19.47 0 0 0-19.41-19.41A19.47 19.47 0 0 0 466 180.62v35.53z'/><path class='cls-6' d='M509 191.44L485 199l-24-7.56h-12.57c.06.45.13.9.2 1.35l.07.05.64.64a2.33 2.33 0 0 1 .68 2.26 51.82 51.82 0 0 0 12 17.9c2 1.44 4 3 6 4.52q1.14.44 2.31.84a2.86 2.86 0 0 1 .64 0c10.76 2.05 21.48-.66 30.85-6.09 6.8-3.94 16.18-9.7 17.61-18.14A2.24 2.24 0 0 1 522 193q.14-.78.24-1.57z'/><path class='cls-61' d='M522.23 191.71l-37.17 11.56-36.63-11.65a37.25 37.25 0 0 0 73.79.1z'/><path class='cls-62' d='M485.34 223.8a37.25 37.25 0 0 0 36.89-32.09l-37.17 11.56v20.53z'/><path class='cls-63' d='M505.41 207.29a4.5 4.5 0 0 1-5.55-7.09'/><path class='cls-64' d='M505.41 202.96h1.55v6.21h-1.55z'/><circle class='cls-65' cx='485.2' cy='160.09' r='8.17'/><path class='cls-66' d='M485.43 159.56a21.07 21.07 0 0 0-20.93 19.35h.27a25.37 25.37 0 0 0 20.42-10.29 25.37 25.37 0 0 0 20.42 10.29h.75a21.07 21.07 0 0 0-20.93-19.35z'/><path class='cls-67' d='M505.92 207.35c-2.82 0-13.25-4.79-11.84 7.89a14.85 14.85 0 0 0 2.5 6.83 37.33 37.33 0 0 0 19.54-14.54c-2.85-2.29-8.24-.18-10.2-.18z'/><circle class='cls-68' cx='499.46' cy='211.72' r='2.25'/><circle class='cls-69' cx='494.02' cy='185.58' r='6.04'/><circle class='cls-69' cx='476.1' cy='185.58' r='6.04'/><path class='cls-70' d='M476.1 179.54A6 6 0 0 0 472 190l8.52-8.52a6 6 0 0 0-4.42-1.94zM494 179.54a6 6 0 0 0-4.07 10.46l8.52-8.52a6 6 0 0 0-4.45-1.94z'/><path class='cls-71' d='M504.85 184.88h-3.93a7 7 0 0 0-13.63-1.11 3.39 3.39 0 0 0-4.39 0 7 7 0 0 0-13.63 1.11H466v1.41h3.24a7 7 0 0 0 13.84.07 2 2 0 0 1 3.95 0 7 7 0 0 0 13.84-.07h3.93zm-28.67 6.25a5.55 5.55 0 1 1 5.55-5.55v.58a5.55 5.55 0 0 1-5.55 4.97zm17.81 0a5.55 5.55 0 0 1-5.51-5v-.18-.41a5.55 5.55 0 1 1 5.55 5.55z'/><path class='cls-72' d='M324.71 174.3h-7.27v-12.17l-11.9 17.67h7.27v12.16l11.9-17.66z'/><path class='cls-73' d='M264.71 174.3h-7.27v-12.17l-11.9 17.67h7.27v12.16l11.9-17.66z'/><path class='cls-74' d='M410.2 195.21c0-6.41-6.45-11.61-14.4-11.61s-14.4 5.2-14.4 11.61c0 4.9 3.78 9.09 9.11 10.79a15.84 15.84 0 0 1-3.6 4.2c.51 0 1 0 1.55-.07a15.71 15.71 0 0 0 8.31-3.35c7.5-.41 13.43-5.42 13.43-11.57z'/><path class='cls-75' d='M379.2 195.21c0-6.41-6.45-11.61-14.4-11.61s-14.4 5.2-14.4 11.61c0 4.9 3.78 9.09 9.11 10.79a15.84 15.84 0 0 1-3.6 4.2c.51 0 1 0 1.55-.07a15.71 15.71 0 0 0 8.31-3.35c7.5-.41 13.43-5.42 13.43-11.57zM396.82 152.62h2.07v21.8h-2.07zM406.43 155.62h8.67v13.84h-8.67z'/><path class='cls-75' d='M405.57 154.77h3.84v-2.15h-8.68v13.85h4.84v-11.7z'/><path class='cls-74' d='M419.82 152.62h2.07v21.8h-2.07zM429.43 155.62h8.67v13.84h-8.67z'/><path class='cls-74' d='M428.57 154.77h3.84v-2.15h-8.68v13.85h4.84v-11.7z'/><path class='cls-76' d='M544.06 149.2a17.26 17.26 0 1 0 17.26 17.26 17.26 17.26 0 0 0-17.26-17.26zm2.57 28.08h-5.51v-2h5.51zm1.07-3h-7.66v-2h7.66zm2.14-7.18a5.27 5.27 0 0 0-1.85 4.18h-2a7.2 7.2 0 0 1 2.27-5.42 5.39 5.39 0 0 0 1.25-3.42 5.46 5.46 0 0 0-5.41-5.5 5.52 5.52 0 0 0-3.87 1.56 5.45 5.45 0 0 0 0 7.78l.09.1a7 7 0 0 1 1.68 4.82h-2a5 5 0 0 0-1.26-3.58 7.45 7.45 0 0 1 .05-10.58 7.31 7.31 0 0 1 5.29-2.14 7.46 7.46 0 0 1 5.72 12.16z'/><path class='cls-77' d='M539.5 90.5h35v35h-35zM576.5 90.5h35v35h-35zM613.5 90.5h35v35h-35z'/><path class='cls-6' d='M562.29 97.41a11.74 11.74 0 0 0-2.88-.1 4.35 4.35 0 0 0-4 4.72v3h-2.68v3.55h2.72V119h3.37v-10.4h3.3l.16-3.55h-3.46v-2.56c0-.77 0-1.63 2.12-1.63h1.24zM586.28 103.9h3.73v11.78h-3.73z'/><circle class='cls-6' cx='588.14' cy='100.25' r='2.08'/><path class='cls-6' d='M592.08 103.9h3.74v11.78h-3.74z'/><path class='cls-6' d='M599.4 103.63c2.23 0 4.07 1.75 4.07 5.2v6.85h-3.73v-6.36s.14-2.6-2-2.6-1.93 2.57-1.93 3.43-1.37-.92-1.37-.92l1.17-3.12a3.7 3.7 0 0 1 3.79-2.48zM461.33 40.45a11.74 11.74 0 0 0-2.88-.1 4.35 4.35 0 0 0-4 4.72v3h-2.65v3.55h2.72V62h3.37V51.64h3.3l.16-3.55h-3.46v-2.56c0-.77 0-1.63 2.12-1.63h1.24z'/><path class='cls-78' d='M218.35 162.67a63.73 63.73 0 0 0-.89-10.55c-28.37-4.34-37.54-11.65-38.78-12.74 0-.09-.16-.09-.16 0-1.24 1.1-10.41 8.41-38.78 12.74a63.74 63.74 0 0 0-.89 10.55s-2.09 40 39.74 60.93c41.85-20.97 39.76-60.93 39.76-60.93z'/><path class='cls-79' d='M178.6 223.6v-84.3a.07.07 0 0 0-.08.07c-1.24 1.1-10.41 8.41-38.78 12.74a63.74 63.74 0 0 0-.89 10.55s-2.09 40 39.74 60.93z'/><path class='cls-80' d='M359.16 81.56a7.94 7.94 0 0 1-4.3-1.26 5.71 5.71 0 0 0 .67 0 5.63 5.63 0 0 0 3.49-1.2 2.81 2.81 0 0 1-2.62-1.95 2.81 2.81 0 0 0 1.27 0 2.81 2.81 0 0 1-2.25-2.75 2.8 2.8 0 0 0 1.27.35 2.81 2.81 0 0 1-.87-3.75 8 8 0 0 0 5.78 2.93 2.81 2.81 0 0 1 4.78-2.56 5.62 5.62 0 0 0 1.78-.68 2.81 2.81 0 0 1-1.23 1.55 5.61 5.61 0 0 0 1.61-.44 5.7 5.7 0 0 1-1.4 1.45v.36a7.93 7.93 0 0 1-8 8'/><g><path class='cls-18' d='M510.4 119.48a4.1 4.1 0 0 0 6.81-.86 4.1 4.1 0 0 0-6.81.86zM505.17 114a4.1 4.1 0 0 0 6.63 1.78 4.1 4.1 0 0 0-6.63-1.78zM503.64 105.89a4.1 4.1 0 0 0 4.09 5.51 4.1 4.1 0 0 0-4.09-5.51zM530.34 119.52a4.1 4.1 0 0 1-6.81-.86 4.1 4.1 0 0 1 6.81.86zM535.62 114a4.1 4.1 0 0 1-6.62 1.8 4.1 4.1 0 0 1 6.63-1.78zM537.1 105.89a4.1 4.1 0 0 1-4.1 5.51 4.1 4.1 0 0 1 4.09-5.51z'/><path class='cls-18' d='M505.17 114a4.1 4.1 0 0 0 6.63 1.78 4.1 4.1 0 0 0-6.63-1.78zM503.64 105.89a4.1 4.1 0 0 0 4.09 5.51 4.1 4.1 0 0 0-4.09-5.51zM537.1 105.89a4.1 4.1 0 0 1-4.1 5.51 4.1 4.1 0 0 1 4.09-5.51zM509.25 94v11.22a11.16 11.16 0 0 0 11.12 11.12 11.16 11.16 0 0 0 11.12-11.12V94z'/></g><g><path class='cls-6' d='M622.93 117.63a3.32 3.32 0 0 0 5.51-.7 3.32 3.32 0 0 0-5.51.7zM618.69 113.21a3.32 3.32 0 0 0 5.37 1.44 3.32 3.32 0 0 0-5.37-1.44zM617.45 106.62a3.32 3.32 0 0 0 3.31 4.46 3.32 3.32 0 0 0-3.31-4.46zM639.07 117.66a3.32 3.32 0 0 1-5.51-.7 3.32 3.32 0 0 1 5.51.7zM643.35 113.21a3.32 3.32 0 0 1-5.37 1.44 3.32 3.32 0 0 1 5.37-1.44zM644.55 106.62a3.32 3.32 0 0 1-3.31 4.46 3.32 3.32 0 0 1 3.31-4.46z'/><path class='cls-6' d='M618.69 113.21a3.32 3.32 0 0 0 5.37 1.44 3.32 3.32 0 0 0-5.37-1.44zM617.45 106.62a3.32 3.32 0 0 0 3.31 4.46 3.32 3.32 0 0 0-3.31-4.46zM644.55 106.62a3.32 3.32 0 0 1-3.31 4.46 3.32 3.32 0 0 1 3.31-4.46zM622 97v9.09a9 9 0 0 0 9 9 9 9 0 0 0 9-9V97z'/></g><path id='White' class='cls-18' d='M457 95.33h-21.47a1.33 1.33 0 0 0-1.33 1.33v21.43a1.33 1.33 0 0 0 1.33 1.33h11.54v-9.33h-3.14v-3.64h3.14v-2.68c0-3.11 1.9-4.81 4.68-4.81a25.76 25.76 0 0 1 2.81.14v3.25h-1.93c-1.51 0-1.8.72-1.8 1.77v2.32h3.6l-.47 3.64h-3.13v9.33H457a1.33 1.33 0 0 0 1.33-1.33V96.66a1.33 1.33 0 0 0-1.33-1.33z'/><path class='cls-18' d='M494.62 94.38h-22.34a1.91 1.91 0 0 0-1.93 1.89v22.43a1.91 1.91 0 0 0 1.93 1.89h22.34a1.92 1.92 0 0 0 1.94-1.89V96.26a1.92 1.92 0 0 0-1.94-1.88zm-16.5 22.34h-3.89V104.2h3.89zm-1.94-14.22a2.25 2.25 0 1 1 2.25-2.25 2.25 2.25 0 0 1-2.25 2.24zm16.51 14.22h-3.89v-6.08c0-1.45 0-3.32-2-3.32s-2.33 1.58-2.33 3.21v6.19h-3.89V104.2h3.73v1.71h.05a4.08 4.08 0 0 1 3.68-2c3.94 0 4.66 2.59 4.66 6z'/><g><path class='cls-81' d='M641.09 144v27.94a27.79 27.79 0 0 1-27.71 27.71 27.79 27.79 0 0 1-27.71-27.71V144z'/><path class='cls-82' d='M611.36 144l-13.21 13.21a7.45 7.45 0 0 0 10.54 10.54L632.44 144zM603.23 197.6l37.86-37.86V144l-47.3 47.3a27.83 27.83 0 0 0 9.44 6.3z'/><path class='cls-38' d='M638.09 147v24.94a24.71 24.71 0 0 1-49.41 0V147h49.41m3-3h-55.41v27.94a27.79 27.79 0 0 0 27.71 27.71 27.79 27.79 0 0 0 27.71-27.71V144z'/><path class='cls-20' d='M588.56 207.47a10.22 10.22 0 0 0 17-2.14 10.22 10.22 0 0 0-17 2.14zM575.52 193.88a10.22 10.22 0 0 0 16.48 4.43 10.22 10.22 0 0 0-16.51-4.43zM571.72 173.62a10.22 10.22 0 0 0 10.19 13.72 10.22 10.22 0 0 0-10.19-13.72zM638.21 207.57a10.22 10.22 0 0 1-17-2.14 10.22 10.22 0 0 1 17 2.14zM651.36 193.88a10.22 10.22 0 0 1-16.51 4.43 10.22 10.22 0 0 1 16.51-4.43zM655.06 173.62a10.22 10.22 0 0 1-10.19 13.72 10.22 10.22 0 0 1 10.19-13.72z'/><path class='cls-83' d='M597.81 203.73a8 8 0 0 1 5.25 1.9 8.1 8.1 0 0 1-5.7 3.35 8.83 8.83 0 0 1-1.1.07 8 8 0 0 1-5.25-1.9 8.1 8.1 0 0 1 5.7-3.35 8.83 8.83 0 0 1 1.1-.07m0-2a10.8 10.8 0 0 0-1.35.09 9.89 9.89 0 0 0-7.9 5.65 9.75 9.75 0 0 0 7.7 3.59 10.8 10.8 0 0 0 1.35-.09 9.89 9.89 0 0 0 7.9-5.65 9.75 9.75 0 0 0-7.7-3.59zM582.21 193.27a8.66 8.66 0 0 1 2.25.3 8.1 8.1 0 0 1 5.19 4.1 7.86 7.86 0 0 1-4.3 1.25 8.66 8.66 0 0 1-2.25-.3 8.1 8.1 0 0 1-5.19-4.1 7.86 7.86 0 0 1 4.3-1.25m0-2a9.59 9.59 0 0 0-6.68 2.61 9.89 9.89 0 0 0 7.06 6.67 10.66 10.66 0 0 0 2.77.37 9.59 9.59 0 0 0 6.68-2.61 9.89 9.89 0 0 0-7.06-6.67 10.66 10.66 0 0 0-2.77-.37zM573.19 175.6a8.37 8.37 0 0 1 7.25 9.75 8.37 8.37 0 0 1-7.25-9.75m-.6-2a8.67 8.67 0 0 0-.87 0 9.89 9.89 0 0 0 1.39 9.61 10 10 0 0 0 7.93 4.15 8.67 8.67 0 0 0 .87 0 9.89 9.89 0 0 0-1.39-9.61 10 10 0 0 0-7.93-4.15zM629 203.83a8.83 8.83 0 0 1 1.1.07 8.1 8.1 0 0 1 5.7 3.35 8 8 0 0 1-5.25 1.9 8.83 8.83 0 0 1-1.1-.07 8.1 8.1 0 0 1-5.7-3.35 8 8 0 0 1 5.25-1.9m0-2a9.75 9.75 0 0 0-7.7 3.59 9.89 9.89 0 0 0 7.9 5.65 10.8 10.8 0 0 0 1.35.09 9.75 9.75 0 0 0 7.7-3.59 9.89 9.89 0 0 0-7.9-5.65 10.8 10.8 0 0 0-1.35-.09zM644.68 193.27a7.86 7.86 0 0 1 4.3 1.25 8.1 8.1 0 0 1-5.19 4.1 8.66 8.66 0 0 1-2.25.3 7.86 7.86 0 0 1-4.3-1.25 8.1 8.1 0 0 1 5.19-4.1 8.66 8.66 0 0 1 2.25-.3m0-2a10.66 10.66 0 0 0-2.77.37 9.89 9.89 0 0 0-7.06 6.67 9.59 9.59 0 0 0 6.68 2.61 10.66 10.66 0 0 0 2.77-.37 9.89 9.89 0 0 0 7.06-6.67 9.59 9.59 0 0 0-6.68-2.61zM653.59 175.6a8.37 8.37 0 0 1-7.25 9.75 8.37 8.37 0 0 1 7.25-9.75m.6-2a10 10 0 0 0-7.93 4.15 9.89 9.89 0 0 0-1.39 9.61 8.67 8.67 0 0 0 .87 0 10 10 0 0 0 7.93-4.15 9.89 9.89 0 0 0 1.39-9.61 8.66 8.66 0 0 0-.87 0z'/></g><g id='Page-1'><g id='a'><g id='Group-2-Copy'><path id='Path-158' class='cls-6' d='M709 152.73c-1.35 0-11.66-.18-11.66-.18a4.25 4.25 0 0 0-4.06 4.09c-.51 4.09-.17 3.56 0 4.27s1.35 3.2 4.22 1.42 11.49-7.47 12-7.82.82-1.78-.5-1.78z'/><path id='Path-159' class='cls-6' d='M707.78 151.67H697a2.32 2.32 0 0 1-1.18-.36c-.51-.36 0-1.07 0-1.07a9.1 9.1 0 0 1 3.21-2.13 9.81 9.81 0 0 1 3.21-.53 9.51 9.51 0 0 1 4.22.89 8.47 8.47 0 0 1 2.53 2s.51.89-.17 1.07a2.4 2.4 0 0 1-1.04.13z'/><path id='Path-160' class='cls-6' d='M709.13 155.93s.68-.53 1.18-.18.17 1.24.17 1.24-4.56 9.25-5.41 10.13-2.53 2.84-5.41 1.78-3.38-2.31-3.38-2.31a2.46 2.46 0 0 1 .84-3c1.71-1.16 12.01-7.66 12.01-7.66z'/><path id='Path-161' class='cls-6' d='M711.33 158.07s.34-1.07.84-.89 1.69 3.2.84 6.22-1.35 3.38-2.2 4.27a7.47 7.47 0 0 1-4.22 2.13c-2 .36-.68-1.42-.68-1.42z'/><path id='Path-162' class='cls-6' d='M714.88 152c-.17-.18-.84-.71-1.35-.36a1.2 1.2 0 0 0-.34 1.42 5.41 5.41 0 0 0 .84 1.24c.34.36 1 .89 1.52.53s.34-1.24.17-1.6a7.53 7.53 0 0 0-.84-1.23z'/><path id='Path-163' class='cls-6' d='M711.5 151a12.59 12.59 0 0 1-2.7-1.78 13.69 13.69 0 0 1-2.2-1.78c-.34-.36-.68-1.07.17-1.07a6.14 6.14 0 0 1 3 .89c1.35.71 2.53 1.42 2.87 2.13a1.34 1.34 0 0 1 0 1.42 1.23 1.23 0 0 1-1.14.19z'/></g></g></g><g id='Page-1-2' data-name='Page-1'><g id='Artboard-6'><g id='Group-Copy'><path id='Shape' class='cls-6' d='M679.3 156.51a6.33 6.33 0 0 1 3-5.31 6.34 6.34 0 0 0-5-2.76c-2.11-.23-4.16 1.28-5.24 1.28s-2.76-1.26-4.54-1.23a6.67 6.67 0 0 0-5.63 3.49c-2.43 4.28-.62 10.57 1.71 14 1.17 1.69 2.53 3.59 4.31 3.52s2.4-1.13 4.5-1.13 2.7 1.13 4.52 1.09 3.05-1.7 4.18-3.41a14.1 14.1 0 0 0 1.91-4 6.1 6.1 0 0 1-3.67-5.62z'/><path id='Shape-2' data-name='Shape' class='cls-6' d='M675.87 146.17a6.29 6.29 0 0 0 1.4-4.46 6.21 6.21 0 0 0-4 2.12 6 6 0 0 0-1.44 4.3 5.13 5.13 0 0 0 4.07-2z'/></g></g></g><g id='Page-1-3' data-name='Page-1'><g id='Artboard-7'><g id='Untitled-1-Copy'><g id='VGgGvw'><g id='Group'><path id='Shape-3' data-name='Shape' class='cls-6' d='M749.2 157.19a3.2 3.2 0 0 1 2.64 3.58c0 2.08-1 3.58-2.83 3.69a43.51 43.51 0 0 1-7.1-.06c-2.32-.24-3.45-1.89-3.46-4.4v-2.52c0-2.84 1.24-4.55 3.83-4.72 2.86-.19 5.74 0 8.72 0v2.45h-7.85c-1.21 0-1.6.4-1.95 1.82 1.96-.03 7.24-.03 8 .16zm-6.82 4.81a46.38 46.38 0 0 0 5.7 0c.34 0 1.06 0 1.07-1a1.11 1.11 0 0 0-1-1.25c-2.28-.09-4.56-.05-6.82-.05-.22 1.37.1 2.2 1.05 2.3z'/><path id='Shape-4' data-name='Shape' class='cls-6' d='M723.73 164.54V162s6.36.12 8.61.11a1.93 1.93 0 0 0 1.53-.36c.52-.49.33-1.83.33-1.83h-9.47v-2.46h9.47s.22-1.31-.24-1.8a2.63 2.63 0 0 0-1.77-.48h-8.29v-2.51h9.68c2 .11 3.2 1.47 3.22 3.64v4.68c0 2.06-1 3.35-2.91 3.55-1.57.17-10.16 0-10.16 0z'/><path id='Shape-5' data-name='Shape' class='cls-6' d='M763.43 152.87a4.66 4.66 0 0 1 3.66 4.45v2.4c0 2.62-1.27 4.43-3.66 4.69a29.9 29.9 0 0 1-6.39 0c-2.37-.25-3.61-2-3.66-4.53v-2.27c0-3 1.09-4.76 3.87-4.94a35 35 0 0 1 6.18.2zm-3.22 9.2c4 0 4.41-.51 4.15-4.66-.07-1.16-.61-2-1.66-2.08a31.57 31.57 0 0 0-5 0c-1.1.09-1.62 1-1.66 2.2-.14 4.18.17 4.54 4 4.54z'/></g></g></g></g></g><g class='cls-84'><circle class='cls-85' cx='717.98' cy='115.68' r='6.5'/><circle class='cls-85' cx='738.73' cy='115.68' r='6.5'/><circle class='cls-85' cx='728.39' cy='97.5' r='6.5'/></g><g class='cls-86'><circle class='cls-87' cx='757.98' cy='115.68' r='6.5'/><circle class='cls-87' cx='778.73' cy='115.68' r='6.5'/><circle class='cls-87' cx='768.39' cy='97.5' r='6.5'/></g><g class='cls-88'><path class='cls-85' d='M813.85 112.18a9.69 9.69 0 0 1 16.29 7.09v1.26h-14.23'/><g class='cls-89'><path class='cls-18' d='M791.25 85h24.72v27.77h-24.72z'/></g><path class='cls-85' d='M793.92 120.53v-1.26a9.69 9.69 0 1 1 19.37 0v1.26z'/><g class='cls-90'><path class='cls-18' d='M795.36 95.5h16.51v13.26h-16.51z'/></g><g class='cls-91'><path class='cls-18' d='M808.09 89.52h24.72v23.24h-24.72z'/></g><g class='cls-92'><path class='cls-18' d='M812.2 95.5h16.51v13.26H812.2z'/></g><g class='cls-93'><path class='cls-18' d='M808.09 85.25h28.63v14.29h-28.63z'/></g><g class='cls-94'><path class='cls-18' d='M785.83 89.76h14.29v23h-14.29z'/></g></g><g class='cls-95'><path class='cls-87' d='M858.85 112.18a9.69 9.69 0 0 1 16.29 7.09v1.26h-14.23'/><g class='cls-96'><path class='cls-97' d='M836.25 85h24.72v27.77h-24.72z'/></g><path class='cls-87' d='M838.92 120.53v-1.26a9.69 9.69 0 1 1 19.37 0v1.26z'/><g class='cls-98'><path class='cls-97' d='M840.36 95.5h16.51v13.26h-16.51z'/></g><g class='cls-99'><path class='cls-97' d='M853.09 89.52h24.72v23.24h-24.72z'/></g><g class='cls-100'><path class='cls-97' d='M857.2 95.5h16.51v13.26H857.2z'/></g><g class='cls-101'><path class='cls-97' d='M853.09 85.25h28.63v14.29h-28.63z'/></g><g class='cls-102'><path class='cls-97' d='M830.83 89.76h14.29v23h-14.29z'/></g></g><g class='cls-103'><path class='cls-104' d='M884.22 103.68h.54a3.1 3.1 0 0 0 3-2l2.95-10.57h-5.47a.8.8 0 0 0-.75.52l-3.2 8.28c-.8 1.79.71 3.77 2.93 3.77zM913.63 103.68H913a3.1 3.1 0 0 1-3-2l-2.95-10.57h5.64a.8.8 0 0 1 .75.53l3.1 8.3c.8 1.79-.71 3.74-2.91 3.74zM898.35 103.68h1.09a2.94 2.94 0 0 0 3.13-2.93l-.57-9.66h-6.28l-.53 9.67a2.94 2.94 0 0 0 3.16 2.92z'/><path class='cls-104' d='M902 91.09l.55 10a3 3 0 0 0 3.13 2.62h.8a2.86 2.86 0 0 0 3-3.52L907 91.12zM890.73 91.09l-2.48 9.07a2.86 2.86 0 0 0 3 3.52h.8a3 3 0 0 0 3.13-2.62l.55-10z'/><path class='cls-85' d='M883.66 103.68v14.75a.36.36 0 0 0 .36.36h4.17a.36.36 0 0 0 .36-.36v-9.89a.14.14 0 0 1 .14-.14h5.83a.14.14 0 0 1 .14.14v9.89a.36.36 0 0 0 .36.36h19.33a.36.36 0 0 0 .36-.36v-14.75'/><rect class='cls-105' x='899.42' y='108.41' width='10.48' height='6.19' rx='.14' ry='.14'/></g><g class='cls-106'><path class='cls-107' d='M924.22 103.68h.54a3.1 3.1 0 0 0 3-2l2.95-10.57h-5.47a.8.8 0 0 0-.75.52l-3.2 8.28c-.8 1.79.71 3.77 2.93 3.77zM953.63 103.68H953a3.1 3.1 0 0 1-3-2l-2.95-10.57h5.64a.8.8 0 0 1 .75.53l3.1 8.3c.8 1.79-.71 3.74-2.91 3.74zM938.35 103.68h1.09a2.94 2.94 0 0 0 3.13-2.93l-.57-9.66h-6.28l-.53 9.67a2.94 2.94 0 0 0 3.16 2.92z'/><path class='cls-107' d='M942 91.09l.55 10a3 3 0 0 0 3.13 2.62h.8a2.86 2.86 0 0 0 3-3.52L947 91.12zM930.73 91.09l-2.48 9.07a2.86 2.86 0 0 0 3 3.52h.8a3 3 0 0 0 3.13-2.62l.55-10z'/><path class='cls-87' d='M923.66 103.68v14.75a.36.36 0 0 0 .36.36h4.17a.36.36 0 0 0 .36-.36v-9.89a.14.14 0 0 1 .14-.14h5.83a.14.14 0 0 1 .14.14v9.89a.36.36 0 0 0 .36.36h19.33a.36.36 0 0 0 .36-.36v-14.75'/><rect class='cls-108' x='939.42' y='108.41' width='10.48' height='6.19' rx='.14' ry='.14'/></g><g id='Page-2'><g id='tab-labs-active'><g id='labs'><path id='Path-3' class='cls-18' d='M816.48 148.5l-2.72-4.5h-9.26l-2.72 4.5zm-16.48 2a1 1 0 0 1-.86-1.51l4.23-7h11.51l4.23 7a1 1 0 0 1-.86 1.51z'/><path id='Fill-30-Copy' class='cls-18' d='M808.85 138.46a1.43 1.43 0 1 1-1.43-1.46 1.44 1.44 0 0 1 1.43 1.46z'/><path id='Fill-30-Copy-5' class='cls-18' d='M810.85 131.46a1.43 1.43 0 1 1-1.43-1.46 1.44 1.44 0 0 1 1.43 1.46z'/><path id='Path-Copy' class='cls-18' d='M806.08 129.58v5.68l-.3.48-8.56 13.82a1.66 1.66 0 0 0-.22.82 1.63 1.63 0 0 0 1.63 1.63h21.73a1.63 1.63 0 0 0 .79-.2 1.61 1.61 0 0 0 .68-2.12L813 135.35v-5.78l1.72-.25a1.17 1.17 0 0 0-.17-2.33h-10a1.17 1.17 0 0 0-.17 2.33zm-2 5.11v-3.37a3.17 3.17 0 0 1 .45-6.31h10a3.17 3.17 0 0 1 .45 6.31v3.47l8.57 13.84a3.63 3.63 0 0 1-3.17 5.38h-21.75a3.62 3.62 0 0 1-3.15-5.42z'/></g></g></g><g id='Page-2-2' data-name='Page-2'><g id='tab-labs-inactive'><g id='labs-2' data-name='labs'><path id='Path-3-2' data-name='Path-3' class='cls-97' d='M851.48 148.5l-2.72-4.5h-9.26l-2.72 4.5zm-16.48 2a1 1 0 0 1-.86-1.51l4.23-7h11.51l4.23 7a1 1 0 0 1-.86 1.51z'/><path id='Fill-30-Copy-2' data-name='Fill-30-Copy' class='cls-109' d='M843.85 138.46a1.43 1.43 0 1 1-1.43-1.46 1.44 1.44 0 0 1 1.43 1.46z'/><path id='Fill-30-Copy-5-2' data-name='Fill-30-Copy-5' class='cls-109' d='M845.85 131.46a1.43 1.43 0 1 1-1.43-1.46 1.44 1.44 0 0 1 1.43 1.46z'/><path id='Path-Copy-2' data-name='Path-Copy' class='cls-109' d='M841.08 129.58v5.68l-.3.48-8.56 13.82a1.66 1.66 0 0 0-.22.82 1.63 1.63 0 0 0 1.63 1.63h21.73a1.63 1.63 0 0 0 .79-.2 1.61 1.61 0 0 0 .68-2.12L848 135.35v-5.78l1.72-.25a1.17 1.17 0 0 0-.17-2.33h-10a1.17 1.17 0 0 0-.17 2.33zm-2 5.11v-3.37a3.17 3.17 0 0 1 .45-6.31h10a3.17 3.17 0 0 1 .45 6.31v3.47l8.57 13.84a3.63 3.63 0 0 1-3.17 5.38h-21.75a3.62 3.62 0 0 1-3.15-5.42z'/></g></g></g><g><path class='cls-110' d='M869 159.5l13-6.15 13 6.15v-28.31l-26-3.69v32z'/><path class='cls-111' d='M869 156.5l13-6.15 13 6.15v-32h-26v32z'/><path class='cls-6' d='M886 134l-4.52 4.54a.64.64 0 0 1-.91 0l-1.84-1.85a1.61 1.61 0 0 0-2.29 0 1.63 1.63 0 0 0 0 2.3l3.44 3.46a1.61 1.61 0 0 0 2.29 0l6.12-6.15a1.63 1.63 0 0 0 0-2.3 1.61 1.61 0 0 0-2.29 0z'/><path class='cls-110' d='M869 132.5v-8l-8 8h8z'/></g><g id='Page-2-3' data-name='Page-2'><g id='_3-copy' data-name='3-copy'><g id='Group-3-Copy'><path id='Page-1-4' data-name='Page-1' class='cls-112' d='M903.62 124.5a2.48 2.48 0 0 0 0 4.86v-4.86zm6.38 5.75l-4.54-4.54v3.56a2.49 2.49 0 0 1-4.7 1.16 6.42 6.42 0 1 0 9.28-.13z'/></g></g></g><g id='Page-2-4' data-name='Page-2'><g id='_3-copy-2' data-name='3-copy'><g id='Group-3-Copy-2' data-name='Group-3-Copy'><path id='Page-1-5' data-name='Page-1' class='cls-109' d='M920.62 124.5a2.48 2.48 0 0 0 0 4.86v-4.86zm6.38 5.75l-4.54-4.54v3.56a2.49 2.49 0 0 1-4.7 1.16 6.42 6.42 0 1 0 9.28-.13z'/></g></g></g><path class='cls-6' d='M908.38 144.07a1.23 1.23 0 0 0-1.74 0l-7.29 7.29a1.23 1.23 0 0 0-.36.92 1.2 1.2 0 0 0 .36.89l7.29 7.29a1.23 1.23 0 0 0 1.74-1.74l-5.23-5.23H915a1.23 1.23 0 1 0 0-2.45h-11.85l5.23-5.23a1.23 1.23 0 0 0 0-1.74z'/><path class='cls-113' d='M937.48 152.27a1.23 1.23 0 0 0-1.23-1.23h-11.87l5.23-5.23a1.23 1.23 0 1 0-1.74-1.74l-7.29 7.29a1.22 1.22 0 0 0-.36.92 1.2 1.2 0 0 0 .36.89l7.29 7.29a1.23 1.23 0 1 0 1.74-1.74l-5.23-5.23h11.87a1.23 1.23 0 0 0 1.23-1.22z'/><g><path class='cls-97' d='M991.31 99.64A12.42 12.42 0 0 0 979.17 87a11.84 11.84 0 0 0-8.43 3.53 8.67 8.67 0 0 0-5.7 16.31 11 11 0 0 1 .3-2.33 6.46 6.46 0 0 1 4.84-11.85l1.22.32.89-.89a9.65 9.65 0 0 1 6.87-2.88 10.2 10.2 0 0 1 9.94 10.37L989 104l-5.58 1.12a14.22 14.22 0 0 0 3.07.34h.69a11.27 11.27 0 0 1 .08 1.14l3.88-.78z'/><path class='cls-114' d='M987.14 105.48a11.21 11.21 0 0 1 .11 1.54v4.88a11.11 11.11 0 1 1-22.22 0V107a11.11 11.11 0 0 1 7.42-10.48c2.88 5.36 8.17 9 14 9z'/><g class='cls-115'><path class='cls-116' d='M963.33 100.12h25.71v24.11h-25.71z'/></g><g class='cls-117'><path class='cls-97' d='M981.36 97.93h17.54v22.13h-17.54z'/></g><g class='cls-118'><path class='cls-97' d='M953.45 97.93h17.54v22.13h-17.54z'/></g></g><g><path class='cls-18' d='M991.31 138.73a12.42 12.42 0 0 0-12.14-12.64 11.84 11.84 0 0 0-8.43 3.53 8.67 8.67 0 0 0-5.7 16.31 11 11 0 0 1 .3-2.33 6.46 6.46 0 0 1 4.84-11.85l1.22.32.89-.89a9.65 9.65 0 0 1 6.87-2.88 10.2 10.2 0 0 1 9.94 10.37l-.15 4.46-5.58 1.12a14.22 14.22 0 0 0 3.07.34h.69a11.27 11.27 0 0 1 .08 1.14l3.88-.78z'/><path class='cls-119' d='M987.14 144.57a11.21 11.21 0 0 1 .11 1.54V151a11.11 11.11 0 1 1-22.25 0v-4.9a11.11 11.11 0 0 1 7.42-10.48c2.88 5.36 8.17 9 14 9z'/><g class='cls-120'><path class='cls-18' d='M963.33 139.21h25.71v24.11h-25.71z'/></g><g class='cls-121'><path class='cls-18' d='M981.36 137.02h17.54v22.13h-17.54z'/></g><g class='cls-122'><path class='cls-18' d='M953.45 137.02h17.54v22.13h-17.54z'/></g></g><g class='cls-123'><g class='cls-124'><g class='cls-125'><g class='cls-123'><g class='cls-126'><circle class='cls-127' cx='870.94' cy='177.73' r='13.78'/></g></g><g class='cls-126'><path class='cls-128' d='M873.08 169.23v2.44a1.78 1.78 0 0 1-.75 1.45l-.54.38a1.61 1.61 0 0 0-.5 2l.3.59a.5.5 0 0 1-.39.73h-.13a1.78 1.78 0 0 1-1.1-.24l-.9-.54a1.78 1.78 0 0 0-1.62-.11l-.95.41a1.51 1.51 0 0 0-.91 1.39v1.56a.58.58 0 0 0 .55.59l1.43.06a1.78 1.78 0 0 1 1.64 1.29l.19.67a1.78 1.78 0 0 1-.59 1.87l-1 .83a1.78 1.78 0 0 0-.59.89l-1.6 5.61q-1.72-.49-1.79-.69t-.53-4.13a1.78 1.78 0 0 0-.45-1l-1-1.14a1.78 1.78 0 0 1-.46-1.3l.15-2.6a.61.61 0 0 1 .61-.57.53.53 0 0 0 .54-.52l-.07-.9a1.55 1.55 0 0 0-1.6-1.43h-.95a1.78 1.78 0 0 1-1.83-2 5.13 5.13 0 0 0-.09-2 15 15 0 0 1-.27-3.77 1.78 1.78 0 0 1 1.79-1.77h.12l8.61.61a1.78 1.78 0 0 0 .5 0l2.13-.46a1.78 1.78 0 0 1 2.15 1.74zM882.55 173.7l-3-.11a1.78 1.78 0 0 0-1.4.6l-1.31 1.48a1.78 1.78 0 0 0-.43.93l-.21 1.52a1.78 1.78 0 0 0 1.46 2l1.12.2a1.78 1.78 0 0 1 1.47 1.78l-.1 5.55a1.12 1.12 0 0 0 .27.75.85.85 0 0 0 .7.29l8.18-.58 3-12-9.36-2.31a1.78 1.78 0 0 0-.39-.1z'/></g></g></g></g><g class='cls-129'><g class='cls-124'><g class='cls-130'><g class='cls-129'><g class='cls-131'><circle class='cls-132' cx='903.72' cy='177.73' r='13.78'/></g></g><g class='cls-131'><path class='cls-133' d='M905.85 169.23v2.44a1.78 1.78 0 0 1-.75 1.45l-.54.38a1.61 1.61 0 0 0-.5 2l.3.59a.5.5 0 0 1-.39.73h-.13a1.78 1.78 0 0 1-1.1-.24l-.9-.54a1.78 1.78 0 0 0-1.62-.11l-.95.41a1.51 1.51 0 0 0-.91 1.39v1.56a.58.58 0 0 0 .55.59l1.43.06a1.78 1.78 0 0 1 1.64 1.29l.19.67a1.78 1.78 0 0 1-.59 1.87l-1 .83a1.78 1.78 0 0 0-.59.89l-1.6 5.61q-1.72-.49-1.79-.69t-.53-4.13a1.78 1.78 0 0 0-.45-1l-1-1.14a1.78 1.78 0 0 1-.46-1.3l.15-2.6a.61.61 0 0 1 .61-.57.53.53 0 0 0 .54-.52l-.07-.9a1.55 1.55 0 0 0-1.6-1.43h-.95a1.78 1.78 0 0 1-1.83-2 5.13 5.13 0 0 0-.09-2 15 15 0 0 1-.27-3.77 1.78 1.78 0 0 1 1.79-1.77h.12l8.61.61a1.78 1.78 0 0 0 .5 0l2.13-.46a1.78 1.78 0 0 1 2.15 1.74zM915.33 173.7l-3-.11a1.78 1.78 0 0 0-1.4.6l-1.31 1.48a1.78 1.78 0 0 0-.43.93l-.21 1.52a1.78 1.78 0 0 0 1.46 2l1.12.2a1.78 1.78 0 0 1 1.44 1.78l-.1 5.55a1.12 1.12 0 0 0 .27.75.85.85 0 0 0 .7.29l8.18-.58 3-12-9.36-2.31a1.78 1.78 0 0 0-.36-.1z'/></g></g></g></g><g class='cls-134'><g class='cls-135'><path class='cls-6' d='M919.5 158.95h25v30h-25z'/></g></g><path class='cls-113' d='M840.81 178.85l-3.39-3.48a7.43 7.43 0 0 0 1.19-4 7.23 7.23 0 1 0-7.22 7.37 7.09 7.09 0 0 0 4.36-1.5l3.3 3.38a1.23 1.23 0 1 0 1.77-1.72zm-9.42-2.62a4.91 4.91 0 1 1 4.76-4.9 4.84 4.84 0 0 1-4.76 4.9zM850.91 170l3.89-3.89a1.24 1.24 0 0 0-1.75-1.75l-3.89 3.89-3.89-3.89a1.24 1.24 0 1 0-1.75 1.75l3.89 3.89-3.89 3.89a1.24 1.24 0 1 0 1.75 1.75l3.89-3.89 3.89 3.89a1.24 1.24 0 1 0 1.75-1.75z'/><g><path id='Fill-1' class='cls-136' d='M698 43c-2.72 0-3.06 0-4.12.06a7.34 7.34 0 0 0-2.43.46 5.11 5.11 0 0 0-2.92 2.92 7.34 7.34 0 0 0-.46 2.43c0 1.07-.06 1.41-.06 4.12s0 3.06.06 4.12a7.34 7.34 0 0 0 .46 2.43 5.11 5.11 0 0 0 2.92 2.92 7.34 7.34 0 0 0 2.43.46c1.07 0 1.41.06 4.12.06s3.06 0 4.12-.06a7.34 7.34 0 0 0 2.43-.46 5.11 5.11 0 0 0 2.92-2.92 7.34 7.34 0 0 0 .46-2.43c0-1.07.06-1.41.06-4.12s0-3.06-.06-4.12a7.34 7.34 0 0 0-.46-2.43 5.11 5.11 0 0 0-2.92-2.92 7.34 7.34 0 0 0-2.43-.46c-1.06-.06-1.4-.06-4.12-.06zm0 1.8c2.67 0 3 0 4 .06a5.53 5.53 0 0 1 1.86.34 3.31 3.31 0 0 1 1.9 1.9 5.53 5.53 0 0 1 .34 1.86c0 1.05.06 1.37.06 4s0 3-.06 4a5.53 5.53 0 0 1-.34 1.86 3.31 3.31 0 0 1-1.9 1.9 5.53 5.53 0 0 1-1.86.34c-1.05 0-1.37.06-4 .06s-3 0-4-.06a5.53 5.53 0 0 1-1.86-.34 3.31 3.31 0 0 1-1.9-1.9 5.53 5.53 0 0 1-.34-1.86c0-1.05-.06-1.37-.06-4s0-3 .06-4a5.53 5.53 0 0 1 .34-1.86 3.31 3.31 0 0 1 1.9-1.9 5.53 5.53 0 0 1 1.86-.34c1-.05 1.33-.06 4-.06z'/><path id='Fill-4' class='cls-137' d='M698 56.33a3.33 3.33 0 1 1 3.33-3.33 3.33 3.33 0 0 1-3.33 3.33zm0-8.47a5.14 5.14 0 1 0 5.14 5.14 5.14 5.14 0 0 0-5.14-5.14z'/><path id='Fill-5' class='cls-138' d='M704.54 47.66a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2'/></g><g id='Page-1-6' data-name='Page-1'><g id='glyph-logo_May2016-Copy' data-name='glyph-logo May2016-Copy'><g id='Group-3'><path id='Fill-1-2' data-name='Fill-1' class='cls-6' d='M722 43c-2.72 0-3.06 0-4.12.06a7.34 7.34 0 0 0-2.43.46 5.11 5.11 0 0 0-2.92 2.92 7.34 7.34 0 0 0-.46 2.43c0 1.07-.06 1.41-.06 4.12s0 3.06.06 4.12a7.34 7.34 0 0 0 .46 2.43 5.11 5.11 0 0 0 2.92 2.92 7.34 7.34 0 0 0 2.43.46c1.07 0 1.41.06 4.12.06s3.06 0 4.12-.06a7.34 7.34 0 0 0 2.43-.46 5.11 5.11 0 0 0 2.92-2.92 7.34 7.34 0 0 0 .46-2.43c0-1.07.06-1.41.06-4.12s0-3.06-.06-4.12a7.34 7.34 0 0 0-.46-2.43 5.11 5.11 0 0 0-2.92-2.92 7.34 7.34 0 0 0-2.43-.46c-1.06-.06-1.4-.06-4.12-.06zm0 1.8c2.67 0 3 0 4 .06a5.53 5.53 0 0 1 1.86.34 3.31 3.31 0 0 1 1.9 1.9 5.53 5.53 0 0 1 .34 1.86c0 1.05.06 1.37.06 4s0 3-.06 4a5.53 5.53 0 0 1-.34 1.86 3.31 3.31 0 0 1-1.9 1.9 5.53 5.53 0 0 1-1.86.34c-1.05 0-1.37.06-4 .06s-3 0-4-.06a5.53 5.53 0 0 1-1.86-.34 3.31 3.31 0 0 1-1.9-1.9 5.53 5.53 0 0 1-.34-1.86c0-1.05-.06-1.37-.06-4s0-3 .06-4a5.53 5.53 0 0 1 .34-1.86 3.31 3.31 0 0 1 1.9-1.9 5.53 5.53 0 0 1 1.86-.34c1-.05 1.33-.06 4-.06z'/></g><path id='Fill-4-2' data-name='Fill-4' class='cls-6' d='M722 56.33a3.33 3.33 0 1 1 3.33-3.33 3.33 3.33 0 0 1-3.33 3.33zm0-8.47a5.14 5.14 0 1 0 5.14 5.14 5.14 5.14 0 0 0-5.14-5.14z'/><path id='Fill-5-2' data-name='Fill-5' class='cls-6' d='M728.54 47.66a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2'/></g></g><path class='cls-139' d='M917.79 57.46H916V56a2.41 2.41 0 0 0-2.42-2.4H904a5.3 5.3 0 0 1-8.07 0h-9.54A2.41 2.41 0 0 0 884 56v1.43h-1.79a2.41 2.41 0 0 0-2.42 2.4V81.2a3 3 0 0 0 3.06 3h12.5a2.21 2.21 0 0 0 2.22 2.14h4.86a2.21 2.21 0 0 0 2.22-2.14h12.5a3 3 0 0 0 3.06-3V59.86a2.41 2.41 0 0 0-2.42-2.4zm-16.64 1.15a2.81 2.81 0 0 1 2.85-2.72h9.54a.14.14 0 0 1 .14.14v20.86a.14.14 0 0 1-.14.14H904a5.27 5.27 0 0 0-2.89.88zM886.28 56a.14.14 0 0 1 .14-.14h2.64v9a.64.64 0 0 0 1.05.48l2.18-1.83 2.11 1.82a.64.64 0 0 0 1.06-.48v-9h.5a2.81 2.81 0 0 1 2.89 2.72v19.35A5.27 5.27 0 0 0 896 77h-9.54a.14.14 0 0 1-.14-.14zm31.65 25.2a.78.78 0 0 1-.78.77h-13a1.77 1.77 0 0 0-1.78 1.77v.37h-4.74v-.37a1.77 1.77 0 0 0-1.78-1.74h-13a.78.78 0 0 1-.78-.77V59.86a.14.14 0 0 1 .14-.14H884v17.17a2.41 2.41 0 0 0 2.42 2.4H896a2.87 2.87 0 0 1 2.81 2 1.14 1.14 0 0 0 1.1.84h.25a1.14 1.14 0 0 0 1.1-.84 2.87 2.87 0 0 1 2.81-2h9.54a2.41 2.41 0 0 0 2.42-2.4V59.72h1.79a.14.14 0 0 1 .14.14z'/><path class='cls-140' d='M962.79 57.46H961V56a2.41 2.41 0 0 0-2.42-2.4H949a5.3 5.3 0 0 1-8.07 0h-9.54A2.41 2.41 0 0 0 929 56v1.43h-1.79a2.41 2.41 0 0 0-2.42 2.4V81.2a3 3 0 0 0 3.06 3h12.5a2.21 2.21 0 0 0 2.22 2.14h4.86a2.21 2.21 0 0 0 2.22-2.14h12.5a3 3 0 0 0 3.06-3V59.86a2.41 2.41 0 0 0-2.42-2.4zm-16.64 1.15a2.81 2.81 0 0 1 2.85-2.72h9.54a.14.14 0 0 1 .14.14v20.86a.14.14 0 0 1-.14.14H949a5.27 5.27 0 0 0-2.89.88zM931.28 56a.14.14 0 0 1 .14-.14h2.64v9a.64.64 0 0 0 1.05.48l2.18-1.83 2.11 1.82a.64.64 0 0 0 1.06-.48v-9h.5a2.81 2.81 0 0 1 2.89 2.72v19.35A5.27 5.27 0 0 0 941 77h-9.54a.14.14 0 0 1-.14-.14zm31.65 25.2a.78.78 0 0 1-.78.77h-13a1.77 1.77 0 0 0-1.78 1.77v.37h-4.74v-.37a1.77 1.77 0 0 0-1.78-1.74h-13a.78.78 0 0 1-.78-.77V59.86a.14.14 0 0 1 .14-.14H929v17.17a2.41 2.41 0 0 0 2.42 2.4H941a2.87 2.87 0 0 1 2.81 2 1.14 1.14 0 0 0 1.1.84h.25a1.14 1.14 0 0 0 1.1-.84 2.87 2.87 0 0 1 2.81-2h9.54a2.41 2.41 0 0 0 2.42-2.4V59.72h1.79a.14.14 0 0 1 .14.14z'/><g><path class='cls-139' d='M224.51 130.17a3.81 3.81 0 0 0 0 7.55h1.14l3.58 3.77v-15l-3.58 3.68zM235.08 134a4.48 4.48 0 0 0-2.36-4.06.63.63 0 0 0-.81.38.83.83 0 0 0 .33.94 3.13 3.13 0 0 1 1.63 2.83 3.19 3.19 0 0 1-1.55 2.74.73.73 0 0 0-.33.94c.16.19.33.38.57.38a.55.55 0 0 0 .33-.09 4.74 4.74 0 0 0 2.19-4.06z'/><path class='cls-139' d='M233.7 125.27a.63.63 0 0 0-.81.38.83.83 0 0 0 .33.94 8.81 8.81 0 0 1 .24 15 .73.73 0 0 0-.33.94.72.72 0 0 0 .81.19 9.85 9.85 0 0 0 4.8-8.68 9.57 9.57 0 0 0-5.04-8.77z'/></g></svg>";

darkicons.plus = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='35' height='12' viewBox='0 0 35 12' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>Plus blue</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g fill='" + settings.color.duoblue.range[0] + "'><path d='M.434 9.829V2.17c0-.558.3-.844.858-.844H4.53c1.872 0 3.107 1.417 3.107 3.34 0 1.938-1.235 3.38-3.107 3.38H3.177v1.781c0 .546-.286.846-.845.846h-1.04c-.559 0-.858-.3-.858-.845zm2.743-4.122h.767c.65 0 .91-.468.91-1.04 0-.571-.26-1-.858-1h-.819v2.04zM9.615 9.83c0 .545.299.845.857.845h4.68c.56 0 .859-.3.859-.845v-.65c0-.546-.3-.845-.858-.845h-2.796V2.172c0-.56-.285-.846-.845-.846h-1.04c-.558 0-.857.286-.857.845V9.83zm7.984-2.653c0 2.12 1.573 3.653 4.03 3.653 2.43 0 4.003-1.534 4.003-3.653V2.171c0-.558-.286-.844-.845-.844h-1.04c-.558 0-.845.286-.845.845V7.19c0 .766-.507 1.144-1.287 1.144-.766 0-1.273-.377-1.273-1.157V2.171c0-.56-.3-.846-.845-.846h-1.053c-.546 0-.845.286-.845.845v5.005zM28.09 9.92c.534.416 1.755.91 3.043.91 2.21 0 3.431-1.417 3.431-3.029 0-3.002-3.964-2.664-3.964-3.73 0-.248.181-.43.701-.43.56 0 .91.208 1.379.416.428.208.845.313 1.157-.299l.377-.74c.22-.455.181-.845-.274-1.17-.48-.325-1.52-.676-2.6-.676-1.989 0-3.47 1.195-3.47 2.99 0 2.99 3.952 2.795 3.952 3.783 0 .22-.157.416-.69.416-.727 0-1.247-.416-1.546-.533-.508-.274-.858-.247-1.17.207l-.495.715c-.402.585-.155.923.17 1.17z'/></g></g></svg>";

darkicons.shop = {};
darkicons.shop.streakrepair = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='124' height='124' viewBox='0 0 124 124' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>streak_repair</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><path d='M62 123.99C27.764 123.99.01 96.235.01 62 .01 27.764 27.765.01 62 .01c34.236 0 61.99 27.754 61.99 61.99 0 34.236-27.754 61.99-61.99 61.99z' fill='%23FF9600' fill-rule='nonzero'/><path d='M62 114.938c29.237 0 52.938-23.701 52.938-52.938 0-29.237-23.701-52.938-52.938-52.938C32.763 9.062 9.062 32.763 9.062 62c0 29.237 23.701 52.938 52.938 52.938z' fill='" + settings.color.bg.range[0] + "' fill-rule='nonzero'/><path d='M37.807 69.21a4.38 4.38 0 0 1-.002-.142V45.99a4.692 4.692 0 0 1 7.21-3.96l5.197 3.303 9.285-11.76a4.692 4.692 0 0 1 7.366 0l16.092 20.38c.08.101.153.204.223.31 3.369 4.213 5.377 9.519 5.377 15.283 0 13.71-11.36 24.825-25.375 24.825-14.014 0-25.375-11.114-25.375-24.825 0-.113 0-.225.002-.337z' fill='%23FF9600'/><ellipse fill='%23FFC800' cx='63.18' cy='73.721' rx='10.829' ry='10.532'/><path d='M64.754 58.462l6.839 8.61a1.876 1.876 0 0 1-1.469 3.043H56.236a1.876 1.876 0 0 1-1.469-3.042l6.84-8.611a2.01 2.01 0 0 1 3.147 0z' fill='%23FFC800'/></g><script xmlns=''/></svg>";

darkicons.shop.clock = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='124' height='124' viewBox='0 0 124 124' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>timed_practice</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g transform='translate(20 20)'><circle stroke='%23A977F8' stroke-width='7.496' fill='" + settings.color.bg.range[0] + "' cx='42' cy='42' r='42'/><path d='M43.34 38.186l14.358 3.568a2.775 2.775 0 1 1-.961 5.452l-14.712-1.558a3.797 3.797 0 0 1-3.34-4.436 3.797 3.797 0 0 1 4.655-3.026z' fill='%23545454'/><rect fill='%23DEDEDE' x='40.127' y='6.42' width='4.28' height='8.561' rx='2.14'/><rect fill='%23DEDEDE' x='40.127' y='69.019' width='4.28' height='8.561' rx='2.14'/><path d='M77.847 42a2.14 2.14 0 0 1-2.14 2.14h-4.28a2.14 2.14 0 0 1 0-4.28h4.28a2.14 2.14 0 0 1 2.14 2.14zM15.248 42a2.14 2.14 0 0 1-2.14 2.14h-4.28a2.14 2.14 0 0 1 0-4.28h4.28a2.14 2.14 0 0 1 2.14 2.14zM72.44 60.854a2.14 2.14 0 0 1-2.948.681l-3.63-2.268a2.14 2.14 0 1 1 2.268-3.63l3.63 2.268a2.14 2.14 0 0 1 .68 2.95zM19.354 27.682a2.14 2.14 0 0 1-2.949.68l-3.63-2.267a2.14 2.14 0 1 1 2.268-3.63l3.63 2.268a2.14 2.14 0 0 1 .681 2.95z' fill='%23DEDEDE'/><path d='M46.27 42.586l-1.15 23.312a2.72 2.72 0 1 1-5.434 0l-1.152-23.312a3.873 3.873 0 0 1 3.868-4.064 3.873 3.873 0 0 1 3.868 4.064z' fill='%23545454'/><path d='M59.517 73.119a2.14 2.14 0 0 1-2.91-.835l-2.075-3.743a2.14 2.14 0 1 1 3.744-2.075l2.075 3.743a2.14 2.14 0 0 1-.834 2.91zM29.168 18.369a2.14 2.14 0 0 1-2.909-.835l-2.075-3.743a2.14 2.14 0 1 1 3.744-2.075l2.075 3.743a2.14 2.14 0 0 1-.835 2.91zM26.115 73.702a2.14 2.14 0 0 1-.936-2.879l1.944-3.814a2.14 2.14 0 1 1 3.814 1.943l-1.944 3.814a2.14 2.14 0 0 1-2.878.936z' fill='%23DEDEDE'/><circle fill='%23545454' transform='matrix(1 0 0 -1 0 85.07)' cx='42.535' cy='42.535' r='6.153'/><path d='M54.534 17.926a2.14 2.14 0 0 1-.935-2.879l1.943-3.813a2.14 2.14 0 0 1 3.814 1.943l-1.944 3.814a2.14 2.14 0 0 1-2.878.935zM11.455 59.79a2.14 2.14 0 0 1 .783-2.924l3.707-2.14a2.14 2.14 0 0 1 2.14 3.707l-3.707 2.14a2.14 2.14 0 0 1-2.923-.783zM65.667 28.49a2.14 2.14 0 0 1 .783-2.923l3.707-2.14a2.14 2.14 0 1 1 2.14 3.707l-3.707 2.14a2.14 2.14 0 0 1-2.923-.784z' fill='%23DEDEDE'/></g></g><script xmlns=''/></svg>";

darkicons.shop.calendar = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='124' height='124' viewBox='0 0 124 124' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>double_or_nothing</title><defs><rect id='a' x='0' y='0' width='70' height='64' rx='4'/></defs><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g transform='translate(21 8)'><rect fill='%23FF9600' x='0' y='25.784' width='82' height='78' rx='7'/><path d='M64.916 13.095L75.5 45.271H20.75l37.691-33.9a4 4 0 0 1 6.475 1.724z' fill='%23FF9600'/><path d='M23.836 1.984L9 27.382h38c-5.187-5.28-8.645-9.402-10.375-12.364-1.264-2.163-3.139-6.334-5.625-12.51a4 4 0 0 0-7.164-.524zM66.125 17.221c1.688 5 5 8.563 7.375 8.563 1.583 0 1.375 1.583-.625 4.75l-11.063-4.75c1.75-9.042 3.188-11.896 4.313-8.563z' fill='%23FF9600'/><path d='M37.25 16.034c3.5 6.125 10 5.625 15.375.75 3.583-3.25 4.875-1.084 3.875 6.5L43.625 33.409l-12.75-11.625c1.916-7.917 4.04-9.834 6.375-5.75z' fill='%23FF9600'/><path d='M32.625 23.659c3 6.625 11.625 8.25 16.875 3.125 3.5-3.417 4.583-2.375 3.25 3.125L39 42.034 27.375 29.909c1.5-8.583 3.25-10.667 5.25-6.25z' fill='%23FFC800'/><path d='M23.836 18.768L9 44.166h38c-5.187-5.28-8.645-9.402-10.375-12.364-1.264-2.163-3.139-6.334-5.625-12.51a4 4 0 0 0-7.164-.524z' fill='%23FFC800'/><path d='M62.916 22.095L73.5 54.271H18.75l37.691-33.9a4 4 0 0 1 6.475 1.724z' fill='%23FFC800'/><path d='M15.375 16.471c-3 5.188-6.563 8.79-9.078 9.305-1.677.344-1.484 1.909.578 4.695 9.542-4.291 13.646-6.437 12.313-6.437-2 0-.813-12.75-3.813-7.563z' fill='%23FF9600'/><g transform='translate(6 33.784)'><mask id='b' fill='" + settings.color.bg.range[0] + "'><use xlink:href='%23a'/></mask><use fill='" + settings.color.bg.range[0] + "' xlink:href='%23a'/><path fill='%23F34848' mask='url(%23b)' d='M-6-3h81v21H-6z'/></g><circle fill='%23C22E2E' cx='24' cy='41.784' r='5'/><circle fill='%23C22E2E' cx='59' cy='41.784' r='5'/><g fill='%23F34848'><path d='M34.5 60.784h13a3.5 3.5 0 0 1 0 7h-13a3.5 3.5 0 0 1 0-7z'/><path d='M34.532 82.636l9.644-19.773a3.5 3.5 0 0 1 6.292 3.069l-9.644 19.773a3.5 3.5 0 0 1-6.292-3.069z'/></g><rect fill='" + settings.color.bg.range[0] + "' x='20' y='26.784' width='8' height='18' rx='4'/><rect fill='" + settings.color.bg.range[0] + "' x='55' y='26.784' width='8' height='18' rx='4'/><path d='M46.313 97.815c7.75 0 14.149-15.031 18.525-15.031 4.376 0 2.224 15.031 6.475 15.031 2.833 0 2.925.99.273 2.969h-22.75c-6.849-1.98-7.69-2.969-2.523-2.969z' fill='%23FF9600'/><path d='M39.187 97.8c-7.75 0-11.311-8.766-15.687-8.766-4.376 0-5.076 8.766-9.327 8.766-2.834 0-2.896.994-.186 2.984h22.749c6.8-1.99 7.618-2.984 2.451-2.984z' fill='%23FF9600'/></g></g><script xmlns=''/></svg>";

darkicons.discussion = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' version='1.1'><head xmlns=''/><head xmlns=''/><title>comments</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><path d='M22.033 25.69a1.644 1.644 0 0 1-.26.282l-5.067 4.352a1.644 1.644 0 0 1-2.715-1.269l.043-3.365h-1.419c-1.605 0-2.187-.167-2.773-.48a3.271 3.271 0 0 1-1.361-1.362C8.167 23.262 8 22.68 8 21.075v-7.46c0-1.605.167-2.187.48-2.773A3.271 3.271 0 0 1 9.843 9.48C10.428 9.167 11.01 9 12.615 9h15.612c1.605 0 2.187.167 2.773.48a3.271 3.271 0 0 1 1.361 1.362c.314.586.481 1.168.481 2.773v7.46c0 1.605-.167 2.187-.48 2.773A3.271 3.271 0 0 1 31 25.21c-.586.314-1.168.481-2.773.481h-6.194z' stroke='" + settings.color.text.range[0] + "' stroke-width='3'/></g></svg>";

darkicons.reading = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='270' height='140' style='&#10;    background: black;&#10;'><head xmlns=''/><head xmlns=''/><head xmlns=''/><defs><path id='a' d='M71.652 22.907c.016.36.025.723.025 1.088H.427v-7.551c0-.911.587-1.718 1.453-2L40.974 1.707A23.441 23.441 0 0 1 48.236.554c5.691 0 10.91 2.029 14.97 5.403A22.823 22.823 0 0 1 78.614 0c1.802 0 3.597.212 5.349.633l59.486 14.284v7.99H71.652z'/></defs><g fill='none' fill-rule='evenodd'><g fill-rule='nonzero' transform='translate(57.937 5.34)'><path fill='#75C200' d='M4.336 78.666h33.873v-6.668l15.447 16.134c.118.119.236.24.353.361 9.245 9.648 9.026 25.006-.564 34.338s-24.754 8.946-34-.701a26.078 26.078 0 0 1-1.027-1.14A57.114 57.114 0 0 1 4.336 78.665z'/><path fill='#F49000' d='M180.095 110.22a8.036 8.036 0 0 1-11.358.407l-.01-.01-9.268-8.657a8.065 8.065 0 0 1-.397-11.388 8.036 8.036 0 0 1 11.357-.407l.01.01 9.268 8.657a8.065 8.065 0 0 1 .398 11.389zm0-53.83a8.065 8.065 0 0 1-.398 11.388l-9.267 8.657a8.036 8.036 0 0 1-11.368-.397 8.065 8.065 0 0 1 .397-11.388l9.268-8.658.01-.01a8.036 8.036 0 0 1 11.358.407z'/><path fill='#78C800' d='M137.47 130.428H73.886l-21.108-8.544C24.15 110.298 10.319 77.712 21.87 49.071 33.403 20.475 65.934 6.643 94.53 18.176l.064.025 33.313 13.484c28.627 11.586 42.459 44.172 30.908 72.813-4.458 11.053-12.053 19.9-21.345 25.93z'/><ellipse cx='17.005' cy='66.214' fill='#8EE000' rx='8.043' ry='8.057'/><path fill='#74C100' d='M.189 80.13a6.348 6.348 0 0 1 6.348-6.348h8.752a6.348 6.348 0 1 1 0 12.696H6.537A6.348 6.348 0 0 1 .189 80.13z'/><path fill='#78C800' d='M113.65 1.267a20.961 20.961 0 0 1 5.964-.866c11.576 0 20.96 9.385 20.96 20.961v36.012c0 3.425-.339 6.843-1.013 10.201-5.634 28.076-32.961 46.268-61.037 40.634a43.573 43.573 0 0 1-18.477 4.112c-24.065 0-43.573-19.508-43.573-43.573V23.642c0-4.689 1.572-9.243 4.465-12.933C28.082 1.6 41.258.004 50.368 7.147c4.684 3.672 9.19 5.509 13.515 5.509 7.595 0 24.184-3.796 49.767-11.389z'/><path fill='#8EE000' d='M69.406 31.493c3.56-3.886 4.851 7.289 3.876 33.524H47.296c-4.536-29.844-3.342-41.038 3.584-33.581 4.47 4.918 13.186 5.887 18.526.057z'/><path fill='#8EE000' d='M88.967 22.913h1.566c12.852 0 23.27 10.418 23.27 23.27v14.096c0 12.852-10.418 23.27-23.27 23.27h-1.566c-12.852 0-23.27-10.418-23.27-23.27V46.183c0-12.852 10.418-23.27 23.27-23.27z'/><path fill='#8EE000' d='M86.023 13.407c.987-1.097 2.355-.913 3.09.363 3.536 6.135 2.73 13.983-2.136 19.392-4.865 5.409-12.578 7.033-19.043 4.154a2.171 2.171 0 0 1-.726-3.437l18.815-20.472z'/><path fill='#8EE000' d='M95.387 18.274a2.167 2.167 0 0 1 3.49.363c3.536 6.135 2.729 13.983-2.136 19.392-4.865 5.409-12.578 7.033-19.043 4.154a2.171 2.171 0 0 1-.726-3.437l18.415-20.472zm-60.482-4.112l15.291 16.555c.8.889.306 2.477-.976 3.135-6.16 3.164-13.048 2.421-16.991-1.962-3.944-4.384-3.963-11.318-.176-17.12.788-1.208 2.052-1.498 2.852-.608z'/><path fill='#8EE000' d='M27.46 18.995l14.936 16.603c.801.89.307 2.478-.975 3.137-6.161 3.163-13.051 2.417-16.997-1.97-3.947-4.386-3.968-11.322-.182-17.126.787-1.208 2.417-1.534 3.217-.644z'/><path fill='#8EE000' d='M34.59 22.913c10.096 0 18.28 8.184 18.28 18.28v24.076c0 10.096-8.184 18.28-18.28 18.28-10.095 0-18.28-8.184-18.28-18.28V41.192c0-10.095 8.185-18.28 18.28-18.28z'/><path fill='rgb(225,225,225)' d='M89.053 31.027c9.434 0 17.081 7.648 17.081 17.082v10.594c0 9.434-7.647 17.081-17.081 17.081s-17.081-7.647-17.081-17.081V48.109c0-9.434 7.647-17.082 17.081-17.082zm-52.08.489c7.546 0 13.663 6.117 13.663 13.663v16.942c0 7.546-6.117 13.663-13.663 13.663S23.31 69.667 23.31 62.121V45.179c0-7.546 6.117-13.663 13.663-13.663z'/><path fill='#4B4B4B' d='M36.948 44.448a6.623 6.623 0 0 1 6.623 6.624V63a6.623 6.623 0 0 1-13.247 0V51.07a6.623 6.623 0 0 1 6.624-6.623z'/><ellipse cx='31.083' cy='48.53' fill='rgb(225,225,225)' rx='4.387' ry='4.395'/><path fill='#4B4B4B' d='M85.735 44.448a8.011 8.011 0 0 1 8.011 8.012v9.09a8.011 8.011 0 0 1-16.023 0v-9.09a8.011 8.011 0 0 1 8.012-8.012z'/><ellipse cx='79.492' cy='48.53' fill='rgb(225,225,225)' rx='4.387' ry='4.395'/><path fill='#8EE000' d='M16.884 73.822a7.818 7.818 0 1 1-.245-15.634c.366-.006.954-.002 1.736.022 1.248.038 2.63.12 4.118.255 4.265.39 8.59 1.146 12.77 2.384 4.374 1.296 8.351 3.054 11.815 5.38a7.818 7.818 0 1 1-8.719 12.98c-2.031-1.365-4.585-2.494-7.535-3.368-3.102-.919-6.443-1.502-9.754-1.805a52.9 52.9 0 0 0-3.174-.198c-.532-.016-.88-.019-1.012-.016z'/><path fill='#F49000' d='M59.142 55.296a8.715 8.715 0 0 1 8.714 8.715v16.264a8.715 8.715 0 1 1-17.43 0V64.011a8.715 8.715 0 0 1 8.716-8.715z'/><path fill='#CD7900' d='M59.612 56.761a6.613 6.613 0 0 1 6.534 7.63l-2.479 15.917a6.386 6.386 0 0 1-6.31 5.403 5.468 5.468 0 0 1-5.468-5.469V64.484a7.723 7.723 0 0 1 7.723-7.723z'/><path fill='#FFCAFF' d='M55.45 85.369a11.07 11.07 0 0 1-.18-1.994c0-5.61 4.197-10.239 9.618-10.905l-1.22 7.838a6.386 6.386 0 0 1-6.31 5.403 5.461 5.461 0 0 1-1.908-.342z'/><path fill='#8EE000' d='M69.65 44.03v22.556H50.512V44.03z'/><path fill='#FFC200' d='M70.71 69.947l.066.398-18.406 2.062-5.996-2.062.066-.398c.958-5.806 6.083-10.128 12.135-10.128 6.051 0 11.176 4.322 12.135 10.128z'/><path fill='#FFDE00' d='M60.333 65.173a6.86 6.86 0 0 0-4.474 0 1.747 1.747 0 0 1-1.104-3.314 10.352 10.352 0 0 1 6.681 0 1.747 1.747 0 1 1-1.103 3.314z'/><path fill='#8EE000' d='M112.241 74.375a64.355 64.355 0 0 0-1.574-.09 96.008 96.008 0 0 0-4.543-.092c-4.713.013-9.458.337-13.874 1.064-3.542.583-6.7 1.402-9.353 2.455-.323.128-.654.254-1.132.43l-.54.199a102.95 102.95 0 0 0-1.084.408c-.426.167-.707.29-.765.322a7.818 7.818 0 0 1-7.431-13.757c.74-.4 1.527-.745 2.497-1.125.248-.096.504-.194.787-.3-.092.034 1.614-.595 1.899-.709 3.787-1.503 8.006-2.597 12.583-3.35 5.329-.878 10.881-1.257 16.371-1.272 1.915-.005 3.69.036 5.288.108.984.044 1.709.09 2.136.125a7.818 7.818 0 1 1-1.265 15.584z'/><path fill='#74C100' d='M97.134 79.398a6.348 6.348 0 0 1 6.348-6.348h30.687a6.348 6.348 0 1 1 0 12.696h-30.687a6.348 6.348 0 0 1-6.348-6.348z'/><path fill='#75C200' d='M98.688 75.248h37.833l2.45 28.277c.017.168.034.336.048.504 1.163 13.347-8.631 25.132-21.955 26.303-13.324 1.17-24.905-8.734-26.067-22.08a25.038 25.038 0 0 1-.087-1.537 57.01 57.01 0 0 1 7.778-31.467z'/><path fill='#8EE000' d='M82.568 69.876h19.01l-5.605 7.813H82.568z'/><path fill='#9AF300' d='M18.65 66.342a2.687 2.687 0 1 1-.853-5.307c2.882-.463 5.45-.105 7.615 1.14a2.687 2.687 0 0 1-2.678 4.66c-1.02-.586-2.35-.772-4.084-.493zm84.94 0a2.687 2.687 0 1 0 .852-5.307c-2.881-.463-5.45-.105-7.615 1.14a2.687 2.687 0 1 0 2.679 4.66c1.019-.586 2.35-.772 4.084-.493z'/></g><path fill='rgb(225,225,255)' fill-rule='nonzero' d='M107.065 107.268h34.305c6.903 0 13.782.796 20.502 2.372l53.59 12.567a2.155 2.155 0 0 1 1.663 2.099v5.39H84.636c0-12.387 10.042-22.428 22.429-22.428z'/><g transform='translate(27.174 107.677)'><mask id='b' fill='#fff'><use xlink:href='#a'/></mask><use fill='rgb(210,210,210)' fill-rule='nonzero' xlink:href='#a'/><path fill='rgb(200,200,200)' fill-rule='nonzero' d='M-1.307 23.943l43.592-13.68a20.374 20.374 0 0 1 6.323-1.008c4.868 0 9.475 1.717 13.166 4.814a2.254 2.254 0 0 0 2.97-.064c3.685-3.37 8.43-5.26 13.467-5.26 1.553 0 3.101.183 4.614.546l59.836 13.682 9.822-.066L83.35 7.099a22.013 22.013 0 0 0-5.14-.608c-5.757 0-11.009 2.212-14.988 5.85-3.98-3.337-9.068-5.34-14.615-5.34-2.374 0-4.735.375-6.997 1.112L-9 23.995l7.693-.052zm43.592-13.68a20.374 20.374 0 0 1 6.323-1.008c4.868 0 9.475 1.717 13.166 4.814a2.254 2.254 0 0 0 2.97-.064c3.685-3.37 8.43-5.26 13.467-5.26 1.553 0 3.101.183 4.614.546l59.836 13.682 9.822-.066L83.35 7.099a22.013 22.013 0 0 0-5.14-.608c-5.757 0-11.009 2.212-14.988 5.85-3.98-3.337-9.068-5.34-14.615-5.34-2.374 0-4.735.375-6.997 1.112L-9 23.995l7.693-.052 43.592-13.68zM71.653 29.52l.024 1.088c0-.365-.008-.727-.024-1.088zm0 0c.016.36.024.723.024 1.088l-.024-1.088z' mask='url(#b)'/><path fill='rgb(200,200,200)' fill-rule='nonzero' d='M-1.307 31.486l43.592-13.68a20.374 20.374 0 0 1 6.323-1.009c4.868 0 9.475 1.717 13.166 4.814.866.726 2.136.7 2.97-.063 3.685-3.37 8.43-5.261 13.467-5.261 1.553 0 3.101.183 4.614.547l59.836 13.681 9.822-.066L83.35 14.642a22.013 22.013 0 0 0-5.14-.609c-5.757 0-11.009 2.212-14.988 5.851-3.98-3.338-9.068-5.34-14.615-5.34-2.374 0-4.735.374-6.997 1.111L-9 31.538l7.693-.052zm43.592-13.68a20.374 20.374 0 0 1 6.323-1.009c4.868 0 9.475 1.717 13.166 4.814.866.726 2.136.7 2.97-.063 3.685-3.37 8.43-5.261 13.467-5.261 1.553 0 3.101.183 4.614.547l59.836 13.681 9.822-.066L83.35 14.642a22.013 22.013 0 0 0-5.14-.609c-5.757 0-11.009 2.212-14.988 5.851-3.98-3.338-9.068-5.34-14.615-5.34-2.374 0-4.735.374-6.997 1.111L-9 31.538l7.693-.052 43.592-13.68zm29.368 19.256l.024 1.089c0-.365-.008-.728-.024-1.089zm0 0c.016.361.024.724.024 1.089l-.024-1.089z' mask='url(#b)'/></g><path fill='rgb(210,210,210)' fill-rule='nonzero' d='M170.623 122.597h44.399c1.161 0 2.103.942 2.103 2.104v5.883h-46.502v-7.987z'/><path fill='#dbae06' fill-rule='nonzero' d='M95.571 138.284c-1.37-.966-2.55-1.449-3.542-1.449H88.99c-.993 0-2.173.483-3.543 1.449a6.347 6.347 0 0 1-3.657 1.16H26.55a2.104 2.104 0 0 1-2.104-2.104v-4.814c0-1.162.942-2.104 2.104-2.104H82.3a6.143 6.143 0 0 1 4.623-2.115h7.173c1.787 0 3.461.786 4.624 2.115h71.9v9.021H99.228a6.347 6.347 0 0 1-3.658-1.16z'/><path fill='#c98c00' fill-rule='nonzero' d='M170.623 130.33h47.557c1.162 0 2.104.942 2.104 2.104v4.906a2.104 2.104 0 0 1-2.104 2.103h-47.557v-9.113z'/><path fill='#ce0000' fill-rule='nonzero' d='M1.229 49.536l9.11-9.167a3.079 3.079 0 0 1 4.369 0l9.144 9.2a3.079 3.079 0 0 1 0 4.341l-9.111 9.168a3.079 3.079 0 0 1-4.368 0l-9.144-9.2a3.079 3.079 0 0 1 0-4.342z' opacity='.997'/><path fill='#008dd1' fill-rule='nonzero' d='M32.58 11.168l4.893-4.923a2.254 2.254 0 0 1 3.197 0l4.913 4.943c.874.88.874 2.299 0 3.178L40.69 19.29a2.254 2.254 0 0 1-3.197 0l-4.914-4.944a2.254 2.254 0 0 1 0-3.178z' opacity='.997'/><path fill='#ffcf26' fill-rule='nonzero' d='M247.758 9.498l8.307-8.316a3.093 3.093 0 0 1 4.374-.002l.002.002 8.336 8.35a3.093 3.093 0 0 1 0 4.372l-8.305 8.317a3.093 3.093 0 0 1-4.374.002l-.002-.002-8.336-8.349a3.093 3.093 0 0 1 0-4.372l-.002-.002z' opacity='.997'/></g><script xmlns=''/></svg>";

// icons of the mobile version
darkicons.mobile = {};
darkicons.mobile.inac = {}; // inactive
darkicons.mobile.ac = {}; // active

darkicons.mobile.ac.face = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='46' height='46' viewBox='0 0 46 46' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>profile</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><path d='M40 27.498A6.502 6.502 0 0 1 37.5 40h-28A6.5 6.5 0 0 1 7 27.498V21.5C7 12.387 14.387 5 23.5 5S40 12.387 40 21.5v5.998z' fill='%239069CD'/><g><g><g><path d='M23.5 9C30.404 9 36 14.596 36 21.5v6C36 34.404 30.404 40 23.5 40S11 34.404 11 27.5v-6C11 14.596 16.596 9 23.5 9z' fill='%23FFAD92'/><g fill='%23C97356'><path d='M20.5 19a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-3 0v-4a1.5 1.5 0 0 1 1.5-1.5zM26.5 19a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-3 0v-4a1.5 1.5 0 0 1 1.5-1.5z'/></g></g></g><path d='M20 28h7c.63 0 1 .385 1 1 0 2.898-2.281 4.875-4.5 4.875S19 31.898 19 29c0-.615.37-1 1-1z' fill='" + settings.color.text.range[2] + "' fill-rule='nonzero'/></g><path fill='%239069CD' d='M27.02 8.78l.703.833v2.819l-3.647 3.78-5.12 2.69-5.694.962-5.137-.458 1.688-1.312 2.041-3.772 2.56-3.3 5.567-2.754h4.799z'/><path d='M9 20.468h3.12c5.302-.036 13.74-.79 16.49-10.492.14-.57.276-1.228.406-1.976' stroke='%239069CD' stroke-width='2.266' stroke-linecap='round' stroke-linejoin='round'/></g></g><script xmlns=''/></svg>";

darkicons.mobile.ac.tree = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='46' height='46' viewBox='0 0 46 46' version='1.1' style='&%2310; &%2310;'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>learn</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><g transform='translate(6 3)'><ellipse fill='%23FF4B4B' cx='15' cy='33.464' rx='7' ry='6.893'/><ellipse fill='%23FFC800' cx='24.5' cy='17.522' rx='8.5' ry='8.37'/><ellipse stroke-width='2.27' fill='%231CB0F6' cx='11.082' cy='10.907' rx='12.211' ry='12.042'/></g></g></g><script xmlns=''/></svg>";

darkicons.mobile.inac.tree = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='46' height='46' viewBox='0 0 46 46' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>learn_inactive</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g fill='" + settings.color.bg.range[4] + "' stroke='" + settings.color.text.range[0] + "' stroke-width='2.27'><g transform='translate(6 3)'><ellipse cx='15' cy='33.464' rx='5.865' ry='5.758'/><ellipse cx='24.5' cy='17.522' rx='7.365' ry='7.235'/><ellipse cx='11.082' cy='10.907' rx='9.941' ry='9.772'/></g></g></g><script xmlns=''/></svg>";

darkicons.mobile.inac.face = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='46' height='46' viewBox='0 0 46 46' version='1.1' style='&%2310;&%2310;'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>profile_inactive</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><path d='M39.564 28.544l-.697-.29V21.5c0-8.487-6.88-15.367-15.367-15.367-8.487 0-15.367 6.88-15.367 15.367v6.753l-.697.29A5.368 5.368 0 0 0 9.5 38.868h28a5.367 5.367 0 0 0 2.064-10.323z' stroke='" + settings.color.text.range[0] + "' stroke-width='2.266' fill='" + settings.color.bg.range[4] + "'/><g><g><g><path d='M23.5 10.133c-6.278 0-11.367 5.09-11.367 11.367v6c0 6.278 5.09 11.367 11.367 11.367 6.278 0 11.367-5.09 11.367-11.367v-6c0-6.278-5.09-11.367-11.367-11.367z' stroke='" + settings.color.text.range[0] + "' stroke-width='2.266' fill='" + settings.color.bg.range[4] + "'/><g transform='translate(18.987 18.9)' fill='" + settings.color.text.range[0] + "'><path d='M1.513.1a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-3 0v-4a1.5 1.5 0 0 1 1.5-1.5z'/><rect x='6.013' y='.1' width='3' height='7' rx='1.5'/></g></g></g></g><path fill='" + settings.color.bg.range[4] + "' d='M27.02 8.78l.703.833v2.819l-3.647 3.78-5.12 2.69-5.694.962-4.137.198.688-1.968 2.041-3.772 2.56-3.3 5.567-2.754h4.799z'/><path d='M8 20.468h4.12c5.302-.036 13.74-.79 16.49-10.492.14-.57.276-1.228.406-1.976' stroke='" + settings.color.text.range[0] + "' stroke-width='2.266'/><path d='M31.156 11.5c-.875-.708-2.52-1.396-4.937-2.063l1.093-1.687c2.042.625 3.292 1.188 3.75 1.688.688.75 1.407 3.124.094 2.062zM11.25 18.188c-.125 2.125-.188 3.562-.188 4.312 0 .75-.604.75-1.812 0 0-2.083.125-3.417.375-4 .25-.583.792-.688 1.625-.313z' fill='" + settings.color.bg.range[4] + "'/></g></g><script xmlns=''/></svg>";

darkicons.mobile.inac.treasure = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='46' height='46' viewBox='0 0 46 46' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>shop_inactive</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g><path d='M35.486 8.163V9.33H10.514V8.163c0-.568-.46-1.028-1.029-1.028H5.163c-.568 0-1.028.46-1.028 1.028v29.674c0 .568.46 1.028 1.028 1.028h35.674c.568 0 1.028-.46 1.028-1.028V8.163c0-.568-.46-1.028-1.028-1.028h-4.322c-.568 0-1.029.46-1.029 1.028z' stroke='" + settings.color.text.range[0] + "' stroke-width='2.27' fill='" + settings.color.bg.range[4] + "'/><path d='M2 23h43' stroke='" + settings.color.text.range[0] + "' stroke-width='2.27' stroke-linecap='round' stroke-linejoin='round'/><path d='M17.163 15.135c-.568 0-1.028.46-1.028 1.028v14.674c0 .568.46 1.028 1.028 1.028h11.674c.568 0 1.028-.46 1.028-1.028V16.163c0-.568-.46-1.028-1.028-1.028H17.163z' stroke='" + settings.color.text.range[0] + "' stroke-width='2.27' fill='" + settings.color.bg.range[4] + "'/><g transform='translate(20 18)' fill='" + settings.color.text.range[0] + "'><ellipse cx='3' cy='3.676' rx='2.692' ry='2.746'/><path d='M4.346 5.324l.918 2.996A1.082 1.082 0 0 1 4.23 9.718H1.77A1.082 1.082 0 0 1 .736 8.32l.918-2.996a1.408 1.408 0 0 1 2.692 0z'/></g></g></g><script xmlns=''/></svg>";


darkicons.menu = {};
darkicons.menu.active = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:a='http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/' version='1.2' baseProfile='tiny' x='0px' y='0px' width='177px' height='202px' viewBox='-0.8 -0.5 177 202' xml:space='preserve'><head xmlns=''/><head xmlns=''/><head xmlns=''/><defs></defs><path fill='none' stroke='" + settings.color.text.range[0] + "' stroke-width='30' stroke-linecap='round' d='M33.7,64.3C22.1,77.2,15,94.3,15,113  c0,40.1,32.5,72.7,72.7,72.7c40.1,0,72.7-32.5,72.7-72.7c0-18.7-7.1-35.8-18.7-48.7'/><line fill='none' stroke='" + settings.color.text.range[0] + "' stroke-width='30' stroke-linecap='round' x1='87.8' y1='15' x2='87.8' y2='113'/><script xmlns=''/></svg>";

};

var invert, invertBright, invertBright2, invertBright4, bright, bgGradient;
sf.construct.otheroptions = function(){
	var rgbpart = settings.color.bg.range[0].substring(0, settings.color.bg.range[0].length - 1);
	invert = 'filter: invert(1) hue-rotate(180deg);-webkit-filter: invert(1) hue-rotate(180deg);';
	invertBright = 'filter: invert(1) hue-rotate(180deg) brightness(200%);-webkit-filter: invert(1) hue-rotate(180deg) brightness(200%);';
	invertBright2 = 'filter: invert(1) hue-rotate(180deg) brightness(200%);-webkit-filter: invert(1) hue-rotate(180deg) brightness(300%);';
	invertBright4 = 'filter: invert(1) hue-rotate(180deg) brightness(800%);-webkit-filter: invert(1) hue-rotate(180deg) brightness(800%)';
	bright = 'filter: brightness(800%);';
	bgGradient = 'background: radial-gradient(farthest-corner at 50% 40%, ' + rgbpart + ',1), ' + rgbpart + ',0.75), ' + rgbpart + ',0.5), ' + rgbpart + ',0.75));';
};

var darkCSS = "";
sf.construct.css = function(){
darkCSS = '' +

// brightness overlay
d + '#brightness' +
'{position: fixed;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0);top: 0;left: 0;z-index: 9000;pointer-events: none;transition: background-color 1s;}' +

// page background and load color
'html' + ref + // topspace
'{background:' + pc.bg.main + '}' +

// svg of many icons

d + '.cCL9P' +
'{background-image: url("' + darkicons.various + '")}' +

// #################################################################
// ############################### main ############################
// #################################################################

// ##### background #####
	// main background
d + '.LFfrA._3MLiB,' +
d + 'div[id=root]' + // front page
'{background:' + pc.bg.secondary + '}' +

	// secondary backgrounds
d + '._2hEQd._1E3L7,' + // skills box
d + '._1E3L7,' + // sidepanel boxes + labs stories
d + '.a5SW0,' + // leaderboard
d + '._1H-7I._2GJb6._1--zr' + // bonus skills
'{background:' + pc.bg.main + '}' +

// ##### topbar #####
//d + '._6t5Uh{opacity:.9}' +

// ##### main text #####
	// headers
//d + 'h1,' + // language skills title
d + '._1E3L7 h2,' + // sidebar titles
d + '.a5SW0 h2,' + // friends title
d + '._2SXd7 span' + 
'{color:' + pc.text.main + '}' +

	// text
d + '._378Tf._3qO9M._33VdW' +
'{color:' + pc.text.main + '!important' + '}' +

	// crown text
d + '.qLLbC' +
'{color:' + pc.text.likebg + ';font-weight: 900;font-size: 20px;}' +

// ##### main icons #####
	// crown svg
//d + old + 'img._2PyWM' +
//'{background-image: url("' + darkicons.oldcrown + '");background-repeat: no-repeat;background-size: //100%;background-position: center;padding: 43px 43px 0 0;overflow: hidden;}' +
//'{content: url("' + darkicons.crown + '");}' +

	// skill circles
//d + '._2xGPj > svg > path:last-of-type' + // 0 progress circle
//'{fill:url(' + '#goldRadial' + ')}' +
//d + '._2xGPj > svg > circle[fill="#dddddd"]:first-of-type' + // Not progressed
//'{fill:url(' + '#grayRadial' + ')}' +

	// locked skills
d + '._39kLK' + // background
'{background:' + pc.bg.secondary + '}' +
d + 'span.yeYoR._9l65a._3aw24' + // icons
'{opacity: 0.8;}' +

	// checkpoint passed
d + '._1kVHP.NSbuJ.jSpv4._2arQ0._3skMI._--tG3' +
'{' + invert + '}' +

	// leaderboard buttons
d + 'button._1V9bF._1uzK0._3f25b._2arQ0._3skMI' +
'{background:' + pc.bg.secondary + ';color:' + pc.text.lightest + '}' +

	// social buttons
d + '._2r9SH a' +
'{background:' + pc.text.main + '}' +

	// store button text hover
d + '.oNqWF:not([disabled]):hover' +
'{color:' + pc.text.main + '!important' + '}' +



	// crown text
//d + '._3QZJ_._2eJB1' +
//'{font-size: 44px;font-weight: 900;color:' + pc.text.likebg + '}' +

// ##### topbar dropdown #####
	// background dropdown
d + '._20LC5._2HujR._1ZY-H,' +
d + '._3q7Wh.OSaWc._2HujR._1ZY-H,' +
d + '.PfiUE._3EXnD' + // forum drops
'{background:' + pc.bg.main + '}' +

	// dropdown icon
d + '._20LC5:after,' + // icon user dropdown
d + '._2HujR:after,' + // icon language dropdown
d + 'span.EBhnz._3i3xv' + // forum icon
'{' + invert + '}' +

	// active bacground
d + '._1oVFS._2kNgI._1qBnH' +
'{background: ' + pc.bg.secondary + ';}' +

	// text
d + '._2kNgI._1qBnH,' +
d + '._2uBp_._1qBnH,' +
d + '._3sWvR,' +
d + '._1fA14,' +
d + 'a._23Nu6.jTtG3 span,' + // forum language
d + '._2-0SI' + // forum profile
'{color:' + pc.text.main + '}' +

	// separation line
d + '.qsrrc' +
'{border-top: 2px solid ' + pc.bg.secondary + ';}' +

	// hover dropdown
d + '._1fA14:hover,' +
d + '._2kNgI._1qBnH:hover > ._1fA14,' +
d + '._2kNgI._1qBnH:hover,' +
d + '._2uBp_._1qBnH:hover,' +
d + '._3sWvR:hover,' +
d + '._23Nu6:hover span,' + // forum language
d + '._3Utz6:hover span' + // forum profile
'{color: ' + pc.text.lightest + ' !important;}' +

// #################################################################
// ############################### main update #####################
// #################################################################

// top bar
	// text
d + '._2QyU5,' + // tabs
d + '._2R9gT,' + // username
d + '._227ZB' + // lingots
'{color:' + pc.text.lightest + '}' +

	// underline text
d + '.uWoNt,' + // active tab
d + '._2QyU5:hover' + // hover tab
'{border-bottom: 3px solid ' + pc.text.lightest + '}' +

	// language dropdown
d + '._2PurW h6' + // learning
'{color:' + pc.text.main + '}' +

	// plus icon
		// background
d + '._2XSRN' +
'{background:' + pc.text.lightest + '}' +
	
		// text
d + '._2XSRN img' +
'{background-image: url("' + darkicons.plus + '");background-repeat: no-repeat;padding: 50px 0 0 0;overflow: hidden;}' +

// page elements - no html bg border
	// remove html bg bar
d + 'div[id=root]' +
'{margin-top: -40px}' +

	// replace with div padding
d + '.LFfrA._3MLiB' +
'{padding-top: 40px}' +

	// add margin above tree
d + '.i12-l' +
'{padding-top: 25px}' +
	
		// golden
			// outer circle
				// tail
d + '._2xGPj circle:first-of-type[fill="#ffd900"]' + // full circle
'{fill:' + pc.gold.dark + '}' +

				// body
d + '._2xGPj stop' + // full circle
'{stop-color:' + pc.gold.light + '}' +

				// head
d + '._2xGPj circle[r="4"][fill="#ffd900"]' + // full circle
'{fill:' + pc.gold.light + '}' +

			// inner circle
d + '.ewiWc' +
'{background: linear-gradient(135deg,' + pc.gold.light + ',' + pc.gold.light + ' 26%,' + pc.gold.dark + ' 0,' + pc.gold.dark + ' 39%,' + pc.gold.light + ' 0,' + pc.gold.light + ' 52%,' + pc.gold.dark + ' 0,' + pc.gold.dark + ' 57%,' + pc.gold.light + ' 0,' + pc.gold.light + ' 78%,' + pc.gold.dark + ' 0,' + pc.gold.dark + ' 90%,' + pc.gold.light + ' 0,' + pc.gold.light + ');}' +

			// icon
d + '.ewiWc span' +
'{filter:brightness(90%);}' +
	
		// contrast circle
d + '._2xGPj circle:last-of-type' +
'{fill:' + pc.bg.main + '}' +

		// progress background
d + '._2xGPj circle:first-of-type[fill="#e5e5e5"],' + // 0 % circle
d + '._2xGPj path[fill="#e5e5e5"]' + // partial circle
'{fill:' + pc.bg.secondary + '}' +

		// crown
			// dark version golden
d + 'img._2PyWM[src="//d35aaqx5ub95lt.cloudfront.net/images/juicy-crown.svg"]' +
'{background-image: url("' + darkicons.crown + '");background-repeat: no-repeat;background-size: 100%;background-position: center;padding: 100% 100% 0 0;overflow: hidden;}' +

			// dark version crown level 0
d + 'img._2PyWM[src="//d35aaqx5ub95lt.cloudfront.net/images/juicy-crown-empty.svg"]' +
'{background-image: url("' + darkicons.crown0 + '");background-repeat: no-repeat;background-size: 100%;background-position: center;padding: 100% 100% 0 0;overflow: hidden;}' +	
			// size increase
d + '._26l3y' +
'{transform:scale(1.25);}' +

		// lesson
			// practice button bg
d + '.IeiLn ._2arQ0::after' +
'{background:' + pc.bg.main + '}' +

			// practice button text size
d + '._2arQ0' +
'{font-size: 150%;padding-top: 16px;}' +

			// text
d + '._1eGmL,' + // level
d + '._2yvEQ' + // lessons
'{color:' + pc.text.likebg + ';font-weight: 900;font-size: 125%;}' +

			// buttons
				// button border
d + '._1Le6e::after' +
'{border-color:' + pc.bg.main + '}' +
				
				// lightbulb
d + 'img.rwFvx' +
'{background-image: url("' + darkicons.lightbulb + '");background-repeat: no-repeat;background-position: center;padding: 50% 50% 0 0;overflow: hidden;}' +

				// key
d + 'img._3Gihx' +
'{background-image: url("' + darkicons.key + '");background-repeat: no-repeat;background-position: center;padding: 50% 50% 0 0;overflow: hidden;}' +

	// checkpoint
		// complete text
d + '._29pOf' +
'{color:' + pc.text.likebg + '}' +

		// checkpoint text
d + '.HVmLo' +
'{color:' + pc.text.main + ' !important}' +

// sidebar
	// border
d + '._1E3L7' +
'{border: 2px solid ' + pc.bg.dark + '}' +

	// crown level
		// icon
d + 'img._2vQZX' +
'{background-image: url("' + darkicons.crown + '");background-repeat: no-repeat;background-size: 100%;background-position: center;padding: 100% 100% 0 0;overflow: hidden;}' +

		// text
d + '._3QZJ_' +
'{color: ' + pc.text.likebg + ';font-size:400%;top: 55%;}' +

	// daily goal
		// unlit fire
d + '.be0HD' +
'{background-image: url("' + darkicons.unlit + '")}' +

		// lit fire
d + '._2D777' +
'{background-image: url("' + darkicons.lit + '")}' +

		// practice button
			// background
d + '._2ESN4::after' +
'{background:' + pc.duoblue.darkest + '}' +

			// text
d + '._2ESN4' +
'{color:' + pc.duoblue.main + ';border-color:' + pc.duoblue.main + ';border-width: 2px 2px 4px;}' +

			// icon
d + '._3V74Q img' +
'{display:block;opacity:0.8;}' +

		// basic text
d + '._1h5j2 span' +
'{color:' + pc.text.main + '}' +

		// contrast text
d + '._3gA3V,' + // xp number
d + '.-zeKA,' + // xp gained
d + '.g-M5R' + // streak, hours
'{color:' + pc.text.contrast + '}' +

		// graph
			// contrast dots
d + '._3qiOl.TTBxS.w341j svg circle[fill="#ffa200"]' +
'{fill:' + pc.text.contrast + '}' +

			// contrast lines
d + '._3qiOl.TTBxS.w341j svg path[fill="#ffa200"]' +
'{fill:' + pc.text.contrast + '}' +
d + '._3qiOl.TTBxS.w341j svg path[stroke="#ffa200"]' +
'{stroke:' + pc.text.contrast + '}' +

			// empty contrast dots
d + '._3qiOl.TTBxS.w341j svg circle[stroke="#ffa200"][fill="#ffffff"]' +
'{stroke:' + pc.text.contrast + ';fill:' + pc.bg.main + '}' +

			// text
d + '._3qiOl.TTBxS.w341j svg tspan' +
'{fill:' + pc.text.main + '}' +

			// horizontal lines
d + '._3qiOl.TTBxS.w341j svg path[stroke="#dedede"]' +
'{stroke:' + pc.bg.secondary + '}' +

		// goal circle svg
			// inner ring
d + '._3Ttma svg circle[fill="#ffffff"]' +
'{fill:' + pc.bg.main + ';stroke:' + pc.bg.main + ';}' +

			// outer ring
d + '._3Ttma svg circle[fill="#e5e5e5"]' +
'{fill:' + pc.bg.secondary + ';stroke:' + pc.bg.main + ';}' +

		// separator line
d + '._2G3uv' +
'{border-top: 2px solid ' + pc.text.main + '}' +

	// Progress quiz
		// explanation text
d + '._2LWQ9' +
'{color:' + pc.text.main + '}' +

		// separator line
d + '._2s9RN' +
'{border-top: 2px solid ' + pc.text.main + '}' +

	// friends
		// text
d + '._3-KNY,' + // name
d + '._2y_Xo,' + // xp
d + '._3g-KB span' + // time header
'{color: ' + pc.text.main + '}' +

		// button
			// text
d + '.oNqWF' +
'{color: ' + pc.text.main + '}' +

// course update message
	// background
d + '.q4nFo' +
'{background:' + pc.bg.main + '}' +

	// text
d + '._3YWBA h3,' + // new course update title
d + '._3CEhk' + // explanation
'{color: ' + pc.text.main + '}' +

// notifications
d + '._26XGQ a' + // username
'{color: ' + pc.text.url + '}' +

// mobile
	// top bar
		// background
d + '.NbGcm,' + // tree
d + '._6t5Uh' + // profile
'{background:' + pc.duoblue.main + ';max-height: 70px;}' +

		// text
d + '._386Yc,' + // language
d + '._3bicX,' + // streak
d + '.XQY8E.ta2gm' + // profile
'{color: ' + pc.text.lightest + '}' +

	// bottom bar
		// background
d + '._3Qsaf' +
'{background:' + pc.bg.dark + ';border-top: 2px solid ' + pc.text.main + ';}' +
		// icons
			// inactive
				// tree
d + '.D9Bv0' +			
'{background-image: url("' + darkicons.mobile.inac.tree + '")}' +

				// face
d + '._1vEqQ' +
'{background-image: url("' + darkicons.mobile.inac.face + '")}' +

				// treasure
d + '.kP-oh' +
'{background-image: url("' + darkicons.mobile.inac.treasure + '")}' +

			// active
				// tree
d + '._3RzDR' +
'{background-image: url("' + darkicons.mobile.ac.tree + '")}' +
			
				// face
d + '._1NN90' +
'{background-image: url("' + darkicons.mobile.ac.face + '")}' +

// golden owl
	// text
d + 'h1._3pRMM,' + // title
d + '._1RKTq p,' + // text
d + '._1EjoE' + // greeting
'{color: ' + pc.text.main + '}' +

	// signature
d + '._1TbWk' +
'{' + invert + '}' +

// bottom of page links
d + '._2EoAJ' +
'{color: ' + pc.text.lightest + '}' +
		
// #################################################################
// ########################### exercises ###########################
// #################################################################

	// introduction window
d + '._3giip' + // main bg
'{' + bgGradient + '}' +
d + '._3PBCS' + // bg of the bg
'{background-image: url(https://upload.wikimedia.org/wikipedia/commons/3/3d/443823397888imajjenloka.jpg);background-size: 5px 5px;}' +
d + '._1SfYc._1qCW5,' + // sort exercise question
d + '._2T9b4' + // sort exercise lines
'{background:' + pc.bg.transparent + '; color: ' + pc.text.main + ';}' +
d + '._3GXmV._1sntG' + // bottom bar bg
'{background:' + pc.bg.darkest + '}' +
d + '._2LZU-._3VdUV' + // text
'{color:' + pc.text.main + '}' +
d + '._1ujec,' + // headers
d + '.Hb0Y0' +
'{color:' + pc["header"] + '}' +

	// question
d + '._38VWB,' +
d + '.KRKEd._2UAIZ._1LyQh,' + // selection exercise
d + '._3mDrc' + // missing word exercise
'{color:' + pc.text.lightest + '}' +

	// question new word
d + '.MUGWy.XV0Fl' +
'{color:' + pc.text.contrast + ';font-weight: 700;}' +

	// check button
d + '._1cw2r button' +
'{color:' + pc.text.main + '}' +

	// exercise box y position
d + '._1Y5M_' + // solution box
'{justify-content: flex-start}' +

	// word choice button selected
d + '.iNLw3._1mSJd' + // all choice buttons
'{color:' + pc.text.main + ";" + 'background:' + pc.bg.main + '}' +

	// word choice button disabled
d + '.iNLw3._1mSJd.jkMDT' + // disabled choice buttons
'{color:' + pc.bg.main + '}' +

	// solution bottom bar
d + '._3uFh7' + // correct
'{' + invertBright + '}' +
d + '.svQU_,' + // wrong
d + '.svQU_ ._1l6NK' +
'{background:#6d0500}' +
d + 'button._3XJPq._2PaNr.ZrFol._3j92s._27uC9._3Lp3y' + // button text wrong
'{color:#820600}' +
d + '.svQU_ ._1l6NK ._2KMvD' + // contrast wrong
'{background:#f00;}' +
d + '.m_YKo._23CAe.cCL9P' + // icon wrong
'{filter: brightness(50%);-webkit-filter: brightness(50%);}' +

	// Typing field
d + 'textarea[dir=ltr],' +
d + '._1Juqt:disabled' + // also when disabled
'{background:' + pc.bg.main + ';color:' + pc.text.main + '}' +

	// end windows
d + '._14PRs' + // window count circles
'{border: 6px solid ' + pc.text.main + '}' +
d + '._1EVZm._14PRs' + // not current window
'{background:' + pc.text.main + '}' +
//d + '._26pCf' + // xp circle
//'{' + invertBright + '}' +

	// picture selection
d + '.a-Y8L span' + // text
'{color:' + pc.text.lightest + '}' +
d + '._2GNNM._3F380 .a-Y8L span' + // selected
'{color: rgb(0,0,0);font-weight: 900;}' +

	// header
d + '._1Zqmf' +
'{color:' + pc.text.main + '}' +

	// choice exercise
d + '._3EaeX' + // text and background
'{color:' + pc.text.lightest + ';background:' + pc.transparent + '}' +
d + '._1-PLN ._3EaeX,' + // selected background text
d + '._1-PLN' + // selected bar
'{background:' + pc.duoblue.dark + '}' +

	// missing word selection
d + '._386Rr' + // text
'{color:' + pc.text.lightest + '}' +

	// object name
d + '._1XKSx > input' +
'{background:' + pc.bg.main + ';color:' + pc.text.main + '}' +

	// wrong selected
d + '.challenge .challenge-answers li.grade-incorrect' +
'{background:' + pc.wrong.main + '}' +

	// exercise end carousel
// '._2HMBY' + // container
// '{width: ' + pc.carouselWidth + '%}' +
// '._1iUq9' + // carousel item
// '{width:' + pc.itemWidth + '%;opacity:' + carousel.opacity[1] + ';}' +
// '._20PKJ' + // stories text
// '{color:' + pc.text.lightest + '}' +

	// report text
d + '._3A0q- span' +
'{color:' + pc.text.lightest + '}' +

// #################################################################
// ########################### exercises update ####################
// #################################################################

// main
	// control buttons buttons
		// initial gray
d + '.oNqWF:after,' + // skip
d + 'button[data-test=player-next][disabled]::after' + // check
'{background:' + pc.bg.main + ';border-color:' + pc.bg.secondary + '}' +

		// continue button text
d + '._23-CV' +
'{color:' + pc.correct.dark + ';font-size:125%;}' +

		// correct continue button
d + '._3uFh7 ._1cw2r' +
'{' + invertBright + '}' +

		// correct continue button bg
d + '._23-CV::after' +
'{background:' + pc.correct.light + '}' +

		// wrong continue button text
d + '._3Lp3y' +
'{color:' + pc.wrong.dark + ';font-size: 125%;}' +

	// xp bar
d + '.MAF30' +
'{background:' + pc.bg.secondary + '}' +

	// borderline
//d + '._1uWv-' +
//'{border-top: 2px solid ' + pc.bg.secondary + '}' +

// exercises
	// sentence buttons
		// not chosen
d + '.iNLw3:after' +
'{background:' + pc.bg.main + ';border-color:' + pc.bg.secondary + '}' +

		// chosen
d + '.iNLw3.jkMDT._2sM1A:after' +
'{background:' + pc.bg.darker + ' !important;color:' + pc.bg.darker + '}' +

	// listen buttons
		// border color
d + '._1QCZJ:before' +
'{border: 4px solid ' + pc.duoblue.main + ';}' +
	
		// speaker
d + '._3on-X, .PzChj' +
'{background-image: url("' + darkicons.speaker + '")}' +
		
		// slow speaker
d + '._3ruEB' +
'{background-image: url("' + darkicons.slowspeaker + '")}' +

	// image select
d + '._1Al8r::after,' + // picked
d + '.g1wrO:hover::after' + // hover
'{background:' + pc.duoblue.dark + '}' +

	// checkbox
d + '._386Rr:hover::after' +
'{background:' + pc.duoblue.dark + '}' +

// completion
	// fire icon
d + '._2PuFu' +
'{background-image: url("' + darkicons.lit + '")}' +

	// Lesson complete message
d + 'h1._1c--K' +
'{color:' + pc.text.main + '}' +

// intro
	// text
d + '._1ujec' +
'{color:' + pc.text.main + '}' +

	// test out button text
d + '._23-CV' +
'{color:' + pc.text.likebg + '}' +

// practice option
	// intro text
d + 'h2._3cK58,' + // title
d + 'p.Hb0Y0' + // text
'{color:' + pc.text.main + '}' +

	// timer
d + '.Xfhea._3t4kt' +
'{color:' + pc.text.main + '}' +

// advertisements
	// podcast text
d + '.oOoPq' +
'{color:' + pc.text.main + '}' +

	// stories text
d + '._20PKJ' +
'{color:' + pc.text.main + '}' +

// #################################################################
// ########################### tips pages ##########################
// #################################################################

// headers
d + 'h2._21sXl' +
'{color:' + pc.headertext + '}' +

// all tips text
d + '._3Fb9m._2f1i5 p,' +
d + '._3Fb9m._2f1i5 li,' +
d + '._3Fb9m._2f1i5 td' +
'{color:' + pc.text.main + ' !important}' +

// ##### notifications #####
d + '.ReactModal__Content.ReactModal__Content--after-open' + // background
'{background:' + pc.bg.dark + '}' +
d + '._3GdnM,' + // text main
d + '._26XGQ,' + // text forum
d + '._3oZIl,' + // title main
d + '.Rl0dL' + // title forum
'{color:' + pc.text.lightest + '}' +

// #################################################################
// ########################### tips pages update ###################
// #################################################################

// titles
d + '._21sXl,' +
d + '._3Fb9m._2m-aJ h2,' +
d + '._3Fb9m._2m-aJ h3,' +
d + '._3Fb9m._2m-aJ h4,' +
d + '._3Fb9m._2m-aJ h5,' +
d + '._3Fb9m._2m-aJ h6' +
'{color:' + pc.text.main + '}' +

// text
d + '._3Fb9m._2m-aJ p,' + // normal text
d + '._3Fb9m._2m-aJ li,' + // bullet list
d + '._3Fb9m._2m-aJ td' + // table
'{color:' + pc.text.main + '}' +

// table header
d + '._3Fb9m._2m-aJ th' + // table
'{background:' + pc.duoblue.darkest + ';color:' + pc.text.light + ';}' +

// start lesson button
d + '._1N4Qn::after' +
'{background:' + pc.bg.main + '}' +

// #################################################################
// ############################## forum ############################
// #################################################################

// frontpage
	// background
d + '._2G7st,' + // main
d + '._3gLkn' + // sidebar
'{background:' + pc.bg.main + '}' +

	// text bubble and tags
d + '.ZSWDY._2d_n_,' +
d + '._3kBlf.PvWDw.cCL9P' +
'{' + invertBright4 + '}' +

	// text sidebar
d + '._2m1M3' +
'{color:' + pc.text.main + '}' +

	// sidebar hover background
d + '._2mcEu:hover,' + // text
d + '._3EC3Y:hover' + // bar
'{background:' + pc.duoblue.dark + ' !important}' +

	// sidebar hover text
d + '._2mcEu:hover ._2m1M3,' + // text
d + '._3EC3Y:hover ._2m1M3,' + // bar
d + '._2mcEu:hover .qSluo,' + // text from
d + '._3EC3Y:hover .qSluo' + // bar from
'{color:' + pc.text.lightest + '}' +

	// sidebar active
d + '._38pFe,' +
d + '._38pFe:hover,' +
d + '._38pFe ._2mcEu:hover' +
'{background:' + pc.bg.secondary + ' !important}' +

// posts
	// text
d + '._2povu,' +
d + '._2povu h4' + // header
'{color:' + pc.text.main + '}' +

	// code
d + '._2povu code' +
'{background:' + pc.duoblue.dark + '}' +

	// level
d + '[data-juicy=false] ._21PEz,' +
d + '[data-juicy=true] ._21PEz' +
'{color:' + pc.text.main + '}' +

	// comment field
d + '._1KvMS textarea,' + // top
d + '.claeN textarea' + // reply
'{background:' + pc.bg.main + ';color:' + pc.text.main + '}' +

	// new post
d + '.Q3ue-._2yvtl.gFN2J,' + // title
d + '.dVGCn._2yvtl.gFN2J' + // content
'{background:' + pc.bg.main + ';color:' + pc.text.main + '}' +

	// cancel button
d + 'button.nb0Da._1maJr.GBjLC' +
'{background:' + pc.bg.secondary + '}' +
d + 'button.nb0Da._1maJr.GBjLC:hover' + // hover
'{background:' + pc.bg.dark + '}' +

	// sorting dropdown
		// background
d + 'span._2ZMSF._3EXnD' +
'{background:' + pc.bg.dark + '}' +

		// text
d + 'li._1CkMd' +
'{color:' + pc.text.main + '}' +

// #################################################################
// ############################## forum update #####################
// #################################################################

// topbar
	// background
d + '._2i8Km' +
'{background:' + pc.duoblue.main + '}' +

// frontpage
	// background
d + '#root > div:not([data-reactroot])' +
'{background:' + pc.bg.main + ';padding-top: 40px;}' +

	// text
d + '.waRHZ,' + // discussion title
d + '._2I7YD,' + // thread information
d + '._26Aq_,' + // popular new followed titles
d + '._3SMEv,' + // all topics
d + '._37foN' + // comment count
'{color:' + pc.text.main + '}' +

	// text (important)
d + '._2D8L4 a,' + // user name url
d + '._2wEnn[style*="color: rgb(175, 175, 175)"]' + // votes
'{color:' + pc.text.main + ' !important}' +

	// discussion icons
d + '._2iCtp' +
'{background-image: url("' + darkicons.discussion + '");background-repeat: no-repeat;background-size: 100%;background-position: center;overflow: hidden;padding: 30px 0 0 0;height: 30px;width: 30px;}' +

	// slit line
d + '._1UYQp,' + // topmost one
d + '._2Nbkz' + // between discussions
'{border-bottom: 2px solid ' + pc.text.main + '}' +

	// search box
d + 'input._10HmK' +
'{background:' + pc.bg.secondary + ';color:' + pc.text.lightest + '}' +

	// sidebar
		// background
d + '._2VdVL' +
'{background:' + pc.bg.secondary + '}' +

		// title
d + '._21J-t' +
'{color:' + pc.text.lightest + ' !important}' +

		// to language text
d + '.cL6o3' +
'{color:' + pc.text.lightest + '}' +

		// from language text
d + '._2LBIq' +
'{color:' + pc.text.lightest + '}' +
	
		// active subforum bg
d + '.K4oWn' +
'{background:' + pc.bg.main + ' !important;border-style:solid;border-color:' + pc.bg.dark +';}' +

		// hover subforum bg
d + '.slg8x:hover' +
'{background:' + pc.duoblue.main + '}' +

		// hover subforum language
d + '.slg8x:hover ._2LBIq' + // from language
'{color:' + pc.text.lightest + '}' +

	// manage subforums overlay buttons
d + '._3Ho-c button' +
'{background:' + pc.duoblue.darkest + '!important;}' +

	// titles
d + '._3ZcIW' +
'{color:' + pc.text.main + '}' +
		// hover
d + '._3ZcIW:hover,' + // topic title
d + '._3SMEv:hover' + // all topics
'{color:' + pc.duoblue.main + '}' +

	// title tag
d + '._2Nbkz > ._2wEnn' +
'{background:' + pc.duoblue.dark + ' !important;color:' + pc.text.lightest + ' !important}' +

// language dropdown
	// text
d + 'a.-kuuJ._2_YFb span' +
'{color:' + pc.text.main + '}' +

	// mouseover
d + 'a.-kuuJ._2_YFb:hover span' +
'{color:' + pc.text.lightest + '}' +

// posts
	// sidebar
		// background
d + '._1RSpr' +
'{background:' + pc.bg.secondary + '}' +

		// header and comments
d + '._1RSpr h2,' +
d + '._2q02F,' + // related discussions header
d + '._34sSH,' + // comments
d + 'a._1y1Vb' + // discussion link
'{color:' + pc.text.lightest + ' !important}' +

	// follow discussion button
d + '._13Bfz button' +
'{background:' + pc.duoblue.darkest + ' !important}' +

	// cancel button
d + '._3cCqs button' +
'{background:' + pc.bg.dark + ' !important;border-color:' + pc.bg.secondary + ' !important;}' +

	// text
d + 'h2[itemprop=name],' + // Threat title
d + 'h2.Gm8SO,' + // comment count
d + '._22FVR ._21PEz,' + // Language levels
d + '.iif_C,' + // posted x days ago thread
d + '.Xm7B-,' + // posted x days ago post
d + 'a._2xNPC,' + // give lingot
d + '.LuNpf,' + // sorted by
d + '._21PEz,' + // streak
d + '._16l38 span,' + // username
d + ' [itemprop=text] h2,' + // in text titles
d + ' [itemprop=text] h3,' + // in text titles
d + ' [itemprop=text] h4,' + // in text titles
d + ' [itemprop=text] h5,' + // in text titles
d + ' [itemprop=text] h6' + // in text titles
'{color:' + pc.text.main + '}' +

	// urls
d + '._2povu a' +
'{color:' + pc.text.url + '}' +

	// text (important)
d + '.uFNEM' + // reply button
'{color:' + pc.text.main + ' !important}' +

	// post button
d + '._2MxYS.RVg2m._2RUYT.sQkxE' +
'{color:' + pc.duoblue.main + ' !important;background:' + pc.duoblue.darkest + ' !important}' +

	// new post
		// text field
d + '._1DnKO' +
'{background:' + pc.bg.main + ';color:' + pc.text.main + '}' +

		// background
d + '._2GLSy' +
'{background:' + pc.bg.main + '}' +

// mobile
	// background
d + '.YxCgH,' + // main
d + '._1mAkH' + // posts
'{background:' + pc.bg.main + '}' +

	// text
		// all topics
d + '_3-xVp' +
'{color:' + pc.text.main + '}' +

// search results

// #################################################################
// ############################ words tab ##########################
// #################################################################

// background
d + '._3zjVe,' + // main
d + '.NYMhm._3zjVe' + // sidebar
'{background:' + pc.bg.main + '}' +

// sidebar text
d + '._14EgH,' + // title
d + '._2xYtL,' + // explanation
d + '._3Io2c' + // strength
'{color:' + pc.text.main + '}' +

// table
	// header
d + 'th._3PIPp.rxSYY' +
'{color:' + pc.text.main + '}' +

	// text
d + '._7xnlz' +
'{color:' + pc.text.main + '}' +

	// odd rows
d + '._1Xn1F>tbody>tr:nth-child(odd)>td' +
'{color:' + pc.text.light + ' !important;background:' + pc.bg.dark + ';}' +

	// mouseover
d + '._1Xn1F>tbody>tr:hover>td' +
//'{background-color: ' + pc.bg.secondary + ';border-top: 2px solid rgb(125,125,125);border-bottom: 2px solid rgb(125,125,125);color:' + pc.text.lightest + ' !important;}' +
'{background-color: ' + pc.duoblue.dark + ';color:' + pc.text.lightest + ' !important;}' +

// #################################################################
// ############################### labs ############################
// #################################################################

// headers
d + '._3gRs1,' +
d + '._2gvA1' +
'{color:' + pc.text.main + '}' +

// ##### story overview #####
// outer background
d + '.outer-whole-page,' +
d + 'body.vsc-initialized' +
'{background:' + pc.bg.secondary + '}' +

// inner background
d + '.home-page .story-grid .stories-header,' + // top banner
d + '.home-page .set' + // story sets
'{background:' + pc.bg.main + '}' +

// headers
d + '.home-page .story-grid .description h2,' + // top banner header 
d + '.set-header' + // set headers
'{color:' + pc.text.main + '}' +

// text
d + '.home-page .story-grid .description p,' + // top banner text
d + '.home-page .story-grid .story .title' + // story title
'{color:' + pc.text.main + '}' +

// star svg
d + '.progress-ring-container .completed-star' +
'{background-image: url("' + darkicons.star + '");}' +

// story complete icon
d + '.story-circle-illustration.complete' +
'{' + invert + '}' +

// update message
d + '.home-page-notification' +
'{color:' + pc.text.main + '}' +

// ##### story page #####
// outer bg
d + '.story-page' +
'{background:' + pc.bg.secondary + '}' +

// inner bg
d + '.transcription-container' +
'{background:' + pc.bg.main + '}' +

// progress bar
d + '.story-header' +
'{background:' + pc.bg.secondary + ';box-shadow: 0 0 14px 14px ' + pc.bg.secondary + '}' +

// text
d + '.synced-text.highlighted,' +
d + '.synced-text,' +
d + '.phrase.phrase-selector.highlighted .answer,' +
d + '.phrases-with-hints .phrase,' +
d + '.challenge-question.match-challenge-header,' +
d + '.challenge-question,' +
d + '.story-end-section h2' +
'{color:' + pc.text.main + '}' +

// continue arrow
d + '.play-controls .continue::before' +
'{' + invert + '}' +

// dropdown
d + '.phrase.phrase-selector .phrase-selector-dropdown' + // background
'{background:' + pc.bg.secondary + '}' +
d + 'li.phrase-selector-option' + // text
'{color:' + pc.text.lightest + ' !important;}' +
d + '.phrase.phrase-selector .phrase-selector-dropdown::before' + // icon
'{border-bottom: 16px solid ' + pc.bg.secondary + '}' +

// dropdown hover
d + '.phrase.phrase-selector .phrase-selector-dropdown li:hover' + // background
'{background:' + pc.bg.main + '}' +

// checkbox
//d + '.challenge-answers > li > button' +
//'{' + invert + '}' +
d + '.grade-correct.selected' + // correct checkbox
'{background:' + pc.correct.main + ';}' +
d + '.xxxxxxxxxxxxxxxxxxx' + // wrong checkbox
'{bacground:' + pc.wrong.main + '}' +

// correct tappable phrase
d + '.phrase.has-hint.grade-correct.tappable-phrase' +
'{background:' + pc.correct.main + ';}' +

// tappable phrase option
d + '.challenge-active.tap-challenge .tappable-phrase' + // background
'{background:' + pc.bg.secondary + ';}' +
d + 'span.point-to-phrase-synced-text.highlighted.has-time.has-text' + // text
'{color:' + pc.text.lightest + '}' +
d + '.phrase.has-hint.grade-correct.tappable-phrase' +
'{color:' + pc.correct.main + '}' +

// arrange exercise
d + '.arrange-challenge-line .phrase-bank .phrase' + // selection
'{background-color:' + pc.bg.secondary + ';color:' + pc.text.lightest + '}' +
d + '.arrange-challenge-line .selected-phrases li' + // solution bar
'{background-color:' + pc.bg.secondary + '}' +
d + '.arrange-challenge-line .phrase-bank .phrase.placed' + // exhausted option
'{background-color:' + pc.bg.dark + ';color:' + pc.text.likebg + '}' +

// match exercise
d + '.match-challenge .token.correct' + // used
'{background-color:' + pc.bg.dark + '}' +
d + '.match-challenge .token' + // unused
'{background-color:' + pc.bg.secondary + ';color:' + pc.text.lightest + '}' +

// typing field
d + '.graded-text-input > textarea' +
'{background-color:' + pc.bg.secondary + ';color:' + pc.text.lightest + '}' +
d + '.graded-text-input textarea.correct' + // correct
'{background-color:' + pc.bg.secondary + ';color:' + pc.text.lightest + '}' +

// end xp ring-container
d + '.ring-of-fire' +
'{' + invertBright2 + '}' +

// completed all stories message
d + '.completed-all-sets-notification h2, .completed-all-sets-notification p' +
'{color:' + pc.text.lightest + '}' +

// #################################################################
// ######################### stories ###############################
// #################################################################

// splash page language choice
	// background
d + '.juicy-experiment .splash-page .container' +
'{background:' + pc.bg.main + '}' +

	// duolingo stories logo
d + '.duolingo-stories' +
'{' + bright + '}' +

	// text
d + '.juicy-experiment .splash-page .container .body' +
'{color:' + pc.text.main + '}' +

	// language selection field background
d + '.juicy-experiment .splash-page .container .courses .course-group .course' +
'{background:' + pc.duoblue.darkest + '}' +

d + '.juicy-experiment .splash-page .container .courses .course-group .course .title' +
'{color:' + pc.text.main + '}' +

// main page
	// background
d + '.story-grid,' +
d + '.home-page .stories-header,' +
d + '.home-page .set' +
'{background:' + pc.bg.main + ' !important}' +

	// outer background
d + '.juicy-experiment .home-page' +
'{background:' + pc.bg.secondary + '}' +

	// text
d + '.juicy-experiment .home-page .story-grid .description h2,' + // title
d + '.juicy-experiment .home-page .story-grid .description p,' + // explanation
d + '.juicy-experiment .set-header,' + // set title
d + '.juicy-experiment .home-page .story-grid .story .title' + // story title
'{color:' + pc.text.main + '}' +

	// svg
		// star
d + '.juicy-experiment .progress-ring-container .completed-star' +
'{background-image: url("' + darkicons.star + '");}' +

		// reading owl
//d + '.juicy-experiment .home-page .story-grid .reading-duo' +
//'{background-image: url(' + darkicons.reading + ');}' +

	// stories completion
		// background
d + '.juicy-experiment .completed-all-sets-notification' +
'{background:' + pc.bg.main + '}' +

		// text
d + '.juicy-experiment .completed-all-sets-notification h2,' +
d + '.juicy-experiment .completed-all-sets-notification p' +
'{color:' + pc.text.light + '}' +

// story page
	// background
		// sides
d + '.juicy-experiment .story-page' +
'{background:' + pc.bg.secondary + '}' +

		// header
d + '.juicy-experiment .story-header' +
'{background:' + pc.duoblue.main + ';box-shadow: 0 0 14px 14px ' + pc.duoblue.main + ';}' +

	// progress bar
d + '.juicy-experiment .story-header .progress-bar' +
'{background:' + pc.bg.secondary + '}' +

	// close button
d + '.juicy-experiment .story-header .close-button' +
'{' + bright + '}' +

	// text
		// title
d + '.juicy-experiment .synced-text.highlighted' +
'{color:' + pc.text.main + '}' +

	// questions
		// text
d + '.juicy-experiment .challenge .challenge-question' +
'{color:' + pc.text.main + '}' +

		// arrange exercise
			// unpicked
d + '.juicy-experiment .arrange-challenge .phrase-bank .phrase' +
'{background:' + pc.bg.dark + ';color:' + pc.text.light + '}' +
				
			// picked
d + '.juicy-experiment .arrange-challenge .phrase-bank .phrase.placed' +
'{background:' + pc.bg.dark + ';color:' + pc.bg.dark + ';border-color:' + pc.bg.secondary + '}' +

			// sorted
d + '.juicy-experiment .arrange-challenge .selected-phrases .arrange-phrase' +
'{background:' + pc.bg.dark + ';color:' + pc.text.light + '}' +

		// multiple choice
d + '.juicy-experiment .multiple-choice-challenge .challenge-answers li button' +
'{background:' + pc.duoblue.darkest + '}' +

		// selection
d + '.juicy-experiment .challenge-active.tap-challenge .tappable-phrase,' + // tapp active
d + '.juicy-experiment .tap-challenge .tappable-phrase,' + // tapp
d + '.juicy-experiment .challenge .selectable-token,' + // select
d + '.juicy-experiment .challenge .selectable-token.grade-neutral,' + // select
d + '.juicy-experiment .challenge.match-challenge .tokens .selectable-token,' + // match
d + '.juicy-experiment .challenge.match-challenge .tokens .selectable-token.match-grade-correct' + // match
'{background:' + pc.bg.dark + ';color:' + pc.text.light + '}' +

			// correct
d + '.juicy-experiment .challenge .selectable-token.grade-correct,' +
d + '.juicy-experiment .challenge.match-challenge .tokens .selectable-token.grade-correct' +
'{background:' + pc.correct.dark + ';color:' + pc.correct.maintext + '}' +

	// solution
		// wrong
d + '.juicy-experiment .ribbon.incorrect-ribbon' +
'{background:' + pc.wrong.dark + '}' +

		// correct
d + '.juicy-experiment .ribbon.incorrect-ribbon' +
'{background:' + pc.correct.dark + '}' +

	// hints
		// background
d + '.juicy-experiment .hint' +
'{background:' + pc.bg.dark + ';color:' + pc.text.light + '}' +

	// continue button
d + '.juicy-experiment .play-controls .continue:disabled' +
'{background:' + pc.bg.secondary + '}' +

	// scoring
		// text
d + '.juicy-experiment .story-end-ring-of-fire .xp-goal-met,' + // goal met
d + '.juicy-experiment .story-end-section .part-complete-carousel p' + // part
'{color:' + pc.text.main + '}' +

		// lock symbol
		
		

	// tinycards
	
	// rate story
		// outer background
d + '.juicy-experiment .modal-background' +
'{background:' + pc.bg.secondary + '}' +

		// inner background
d + '.juicy-experiment .modal' +
'{background:' + pc.bg.main + '}' +

		// text
d + '.juicy-experiment .story-feedback .rating .least,' +
d + '.juicy-experiment .story-feedback .rating .most' +
'{color:' + pc.text.main + '}' +

		// score button
d + '.juicy-experiment .story-feedback .rating .buttons button' +
'{background:' + pc.bg.dark + ';color:' + pc.text.light + '}' +

		// improvement typing field
d + '.juicy-experiment .story-feedback .comment' +
'{background:' + pc.bg.dark + ';color:' + pc.text.light + '}' +

// #################################################################
// ######################### settings tab ##########################
// #################################################################

// text
d + '._3jbqt,' +
d + '._5wNXo,' +
d + '._3-YQ1,' +
d + '._26FX7' + // plus support
'{color:' + pc.text.main + '}' +

// input background
d + '._3jbqt input,' +
d + '._3jbqt textarea' +
'{background:' + pc.bg.secondary + ';color:' + pc.text.lightest + '}' +

// checked button background
d + '._3-hnY, ._3-hnY:checked' +
'{background:' + pc.bg.main + '}' +

// plus support email button
d + '._1naOl' +
'{' + invert + '}' +

// sidepanel
d + 'li._2kA5V._26YU4' + // active
'{background:' + pc.duoblue.dark + '}' +
d + 'li._2kA5V._26YU4 a' + // active
'{color:' + pc.text.lightest + '}' +
d + 'li._26YU4' + // not active
'{background:' + pc.bg.secondary + '}' +
d + 'li._26YU4:hover' + // hover
'{background:' + pc.duoblue.main + '}' +
d + 'li._2kA5V._26YU4:hover' + // hover active
'{background:' + pc.duoblue.dark + '}' +
d + 'li._2kA5V._26YU4' + // active text
'{color:' + pc.text.lightest + '}' +
d + 'li._26YU4 a' + // text
'{color:' + pc.text.main + '}' +
d + 'li._26YU4:hover a' + // hover text
'{color:' + pc.text.lightest + '}' +

// #################################################################
// ######################### settings tab update ###################
// #################################################################

// title
d + '._19UdC' +
'{color:' + pc.text.main + '}' +

// dialy goal text
d + '._2kWK0,' + // explanation
d + '._1JZqC,' + // choice text
d + '._3VJoK' + // xp text
'{color:' + pc.text.main + '}' +

// #################################################################
// ########################### profile #############################
// #################################################################

d + '._2MEyI .W547r,' + // name
d + '._2GU1P ._1SrQO ._1Cjfg,' + // achievements title
d + '._1JLPg,' +
d + '._3zECl' + // achievements text
'{color:' + pc.text.main + '}' +

d + '._1eGKg,' + // sidebar language
d + '._2Cgve' + // sidebar other text
'{color:' + pc.text.main + '}' +

// #################################################################
// ########################### store ###############################
// #################################################################

// headers
d + 'h4.MYxom,' +
d + 'h4._2ibXl' +
'{color:' + pc.text.main + '}' +

// text
d + '._1wcRC' +
'{color:' + pc.text.main + '}' +

// #################################################################
// ########################### store update ########################
// #################################################################

// store item text
d + 'h3.MYxom,' +	// header
d + 'p._1jeg_' +	// text
'{color:' + pc.text.main + '}' +

// lingot explanation
d + '._30DtD span' +
'{color:' + pc.text.main + '}' +

// streak repair icon
d + '.ruWN_' +
'{background-image: url("' + darkicons.shop.streakrepair + '");}' +

// timed practice icon
d + '._2blzV' +
'{background-image: url("' + darkicons.shop.clock + '");}' +

// double or nothing icon
d + '._3XMOl' +
'{background-image: url("' + darkicons.shop.calendar + '");}' +

// #################################################################
// ######################### podcast ###############################
// #################################################################

// background
d + 'body#index section#content' +
'{background:' + pc.bg.main + '}' +

// title
d + '.duo-title' +
'{' + invert + '}' +

// subtitle
d + '.subtitle' +
'{color:' + pc.text.lightest + '}' +

// text
d + '.entry-content p,' +
d + '.entry-content p a' + // also urls
'{color:' + pc.text.main + '}' +

// pagenumber
d + '.paginator' +
'{color:' + pc.text.main + '}' +

// #################################################################
// ############################ dictionary #########################
// #################################################################

// background
d + '._32Xju' +
'{background:' + pc.bg.main + '}' +

// search
	// search background
d + '.zAm0Z' +
'{background:' + pc.bg.dark + '}' +

	// search text
d + '._1TywF input' +
'{color:' + pc.text.main + '}' +

	// diacritic overlay background
d + '._1tSEs' +
'{background:' + pc.bg.main + ';color:' + pc.text.main + '}' +
d + '._1tSEs:hover' + // mouseover
'{background:' + pc.duoblue.dark + ';color:' + pc.white + ';transform:scale(1.5)}' +

	// language dropdown
		// background
d + '._2qQha' +
'{background:' + pc.bg.main + '}' +

		// text
d + '._1pYny._1KW3f' +		
'{color:' + pc.text.main + '}' +

		// mouseover
d + '._1KW3f:hover' +
'{background:' + pc.duoblue.main + ';color:' + pc.text.lightest + '}' +

	// suggestions
		// background
d + '._3Q-Mq' +
'{background:' + pc.bg.dark + '}' +

		// text
d + '._1FtVW,' + // language
d + '._1YG22' + // word
'{color:' + pc.text.main + '}' +

		// mouseover
d + '._1YG22:hover' + // word
'{background:' + pc.duoblue.dark + ';color:' + pc.text.lightest + '}' +
		
// results
	// searchbox background
d + '.sxmhN' +
'{background:' + pc.bg.secondary + '}' +

	// not found alternative messagge
// set directly instead
//d + '._1dRVw' +
//'{background:' + pc.whitebg + ';' + invert + '}' +

	// background
d + '._2Aw8b' +
'{background:' + pc.bg.main + '}' +

	// translation text
d + '.-yVBN,' +
d + '.-eGaL' +
'{color:' + pc.text.main + '}' +

	// Example sentence table
		// Word text
d + 'td.-FKlN._3GbZw._2lNnm' +
'{color:' + pc.text.main + '}' +

		// selected
d + 'tr._2gUgG td' +
'{background:' + pc.bg.dark + ';color:' + pc.text.light + '}' +

		// mouseover
d + 'tr:hover td' +
'{background:' + pc.duoblue.dark + ';color:' + pc.text.lightest + '}' +

	// verb conjugation table
d + 'ul._1Svfa ._1GPr_,' + // times
d + 'tr.ykflI,' + // header row text
d + 'table._2pPqS' + // cell text
'{color:' + pc.text.main + '}' +

// #################################################################
// ####################### language choice #########################
// #################################################################

// title
d + '._1h7Gp' +
'{color:' + pc.text.main + '}' +

// I speaker
d + '._3EKrk' +
'{color:' + pc.text.main + '}' +

// box bg
d + '._3Um6V' +
'{background:' + pc.bg.dark + '}' +

// text
d + '._3Um6V div span' +
'{color:' + pc.text.main + '}' +

// incubator explanation
d + '._3VpwX' +
'{color:' + pc.text.main + '}';
};

var sheet = document.createElement('style');
	sheet.id = "DuolingoThemeChanger";
	sheet.className = "DuolingoThemeChanger";
sf.construct.csselement = function(){
	var applyStyles = stylevars + darkCSS + settings.custom.css;
	//if (settings.enabled){
	//	if (settings.enabled == true){
	//		applyStyles += stylevars + darkCSS;
	//	};
	//	if (settings.custom.active != false){
	//		applyStyles += settings.custom.css;
	//	};
	//} else {
	//	console.log("TDC (css.js): Duolingo theme changer is disabled");
	//};
	var addStyle = document.createTextNode(applyStyles);
	sheet.appendChild(addStyle);
};

sf.addcss = function(){
	// add CSSS
	document.head.appendChild(sheet);
	// set CSS selector
	document.documentElement.setAttribute("mode", settings.enabled ? settings.theme.preset : "");
};

// add css on head creation
var attempt = 0;
sf.addonload = function(){
	if (attempt < 1000){
		attempt++;
		// try ensures the theme loads
		try {
			sf.addcss();
			console.log("TDC (css.js): True Dark loaded after " + attempt + " attempts.");
		} catch(err) {
			// if load fails try again
			setTimeout(function(){
				addCSSonload();
			}, 10);
		};
	};
};

// apply settings
sf.construct.all = function(){
	sf.construct.colorranges();
	sf.construct.cssrefs();
	sf.construct.cssvars();
	sf.construct.icons();
	sf.construct.otheroptions();
	sf.construct.css();
	sf.construct.csselement();
	sf.addonload();
};

sf.initiate = function(){
	chrome.storage.sync.get("TDsettings", function(obj) {
		// update default settings with stored ones
		if(obj && obj.TDsettings) {
			Object.assign(settings, JSON.parse(obj.TDsettings));
		} else {
			settings = defsettings;
		};
		// construct style
		sf.construct.all();
		console.log("TDC (css.js): style settings applied");
		// sign object
		settings.a = "css.js";
		// debugging
		console.log(settings);
	});
};
sf.initiate();

// catch popup messages
sf.receiver = function(){
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.data.target == "css"){
			sendResponse({data: request.data.target, success: true});
			if(request.data.payload == "update"){
				sf.initiate();
				preventdouble = document.getElementsByClassName("DuolingoThemeChanger");
				if(preventdouble.length > 1){
					preventdouble[0].remove();
				};
			}
		};
	});
};
sf.receiver();

})();