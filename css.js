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
	lastsession: 0,
	remembersession: 6,
	brightness: {
		session: 0,
		day: 1,
		night: 0.8,
		dynamic: false,
		fadeearlier: 0.5
	},
	enable: {
		dynamic: false
	},
	userinput: {
		latitude: 0,
		longitude: 0
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
			contrast: "#ffb100",
			url: "#1cb0f6"
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
			contrast: 		"var(--contrasttext)"
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

darkicons.shop = {};
darkicons.shop.streakrepair = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='124' height='124' viewBox='0 0 124 124' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>streak_repair</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><path d='M62 123.99C27.764 123.99.01 96.235.01 62 .01 27.764 27.765.01 62 .01c34.236 0 61.99 27.754 61.99 61.99 0 34.236-27.754 61.99-61.99 61.99z' fill='%23FF9600' fill-rule='nonzero'/><path d='M62 114.938c29.237 0 52.938-23.701 52.938-52.938 0-29.237-23.701-52.938-52.938-52.938C32.763 9.062 9.062 32.763 9.062 62c0 29.237 23.701 52.938 52.938 52.938z' fill='" + settings.color.bg.range[0] + "' fill-rule='nonzero'/><path d='M37.807 69.21a4.38 4.38 0 0 1-.002-.142V45.99a4.692 4.692 0 0 1 7.21-3.96l5.197 3.303 9.285-11.76a4.692 4.692 0 0 1 7.366 0l16.092 20.38c.08.101.153.204.223.31 3.369 4.213 5.377 9.519 5.377 15.283 0 13.71-11.36 24.825-25.375 24.825-14.014 0-25.375-11.114-25.375-24.825 0-.113 0-.225.002-.337z' fill='%23FF9600'/><ellipse fill='%23FFC800' cx='63.18' cy='73.721' rx='10.829' ry='10.532'/><path d='M64.754 58.462l6.839 8.61a1.876 1.876 0 0 1-1.469 3.043H56.236a1.876 1.876 0 0 1-1.469-3.042l6.84-8.611a2.01 2.01 0 0 1 3.147 0z' fill='%23FFC800'/></g><script xmlns=''/></svg>";

darkicons.shop.clock = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' width='124' height='124' viewBox='0 0 124 124' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>timed_practice</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g transform='translate(20 20)'><circle stroke='%23A977F8' stroke-width='7.496' fill='" + settings.color.bg.range[0] + "' cx='42' cy='42' r='42'/><path d='M43.34 38.186l14.358 3.568a2.775 2.775 0 1 1-.961 5.452l-14.712-1.558a3.797 3.797 0 0 1-3.34-4.436 3.797 3.797 0 0 1 4.655-3.026z' fill='%23545454'/><rect fill='%23DEDEDE' x='40.127' y='6.42' width='4.28' height='8.561' rx='2.14'/><rect fill='%23DEDEDE' x='40.127' y='69.019' width='4.28' height='8.561' rx='2.14'/><path d='M77.847 42a2.14 2.14 0 0 1-2.14 2.14h-4.28a2.14 2.14 0 0 1 0-4.28h4.28a2.14 2.14 0 0 1 2.14 2.14zM15.248 42a2.14 2.14 0 0 1-2.14 2.14h-4.28a2.14 2.14 0 0 1 0-4.28h4.28a2.14 2.14 0 0 1 2.14 2.14zM72.44 60.854a2.14 2.14 0 0 1-2.948.681l-3.63-2.268a2.14 2.14 0 1 1 2.268-3.63l3.63 2.268a2.14 2.14 0 0 1 .68 2.95zM19.354 27.682a2.14 2.14 0 0 1-2.949.68l-3.63-2.267a2.14 2.14 0 1 1 2.268-3.63l3.63 2.268a2.14 2.14 0 0 1 .681 2.95z' fill='%23DEDEDE'/><path d='M46.27 42.586l-1.15 23.312a2.72 2.72 0 1 1-5.434 0l-1.152-23.312a3.873 3.873 0 0 1 3.868-4.064 3.873 3.873 0 0 1 3.868 4.064z' fill='%23545454'/><path d='M59.517 73.119a2.14 2.14 0 0 1-2.91-.835l-2.075-3.743a2.14 2.14 0 1 1 3.744-2.075l2.075 3.743a2.14 2.14 0 0 1-.834 2.91zM29.168 18.369a2.14 2.14 0 0 1-2.909-.835l-2.075-3.743a2.14 2.14 0 1 1 3.744-2.075l2.075 3.743a2.14 2.14 0 0 1-.835 2.91zM26.115 73.702a2.14 2.14 0 0 1-.936-2.879l1.944-3.814a2.14 2.14 0 1 1 3.814 1.943l-1.944 3.814a2.14 2.14 0 0 1-2.878.936z' fill='%23DEDEDE'/><circle fill='%23545454' transform='matrix(1 0 0 -1 0 85.07)' cx='42.535' cy='42.535' r='6.153'/><path d='M54.534 17.926a2.14 2.14 0 0 1-.935-2.879l1.943-3.813a2.14 2.14 0 0 1 3.814 1.943l-1.944 3.814a2.14 2.14 0 0 1-2.878.935zM11.455 59.79a2.14 2.14 0 0 1 .783-2.924l3.707-2.14a2.14 2.14 0 0 1 2.14 3.707l-3.707 2.14a2.14 2.14 0 0 1-2.923-.783zM65.667 28.49a2.14 2.14 0 0 1 .783-2.923l3.707-2.14a2.14 2.14 0 1 1 2.14 3.707l-3.707 2.14a2.14 2.14 0 0 1-2.923-.784z' fill='%23DEDEDE'/></g></g><script xmlns=''/></svg>";

darkicons.shop.calendar = imgsvg + "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='124' height='124' viewBox='0 0 124 124' version='1.1'><head xmlns=''/><head xmlns=''/><head xmlns=''/><title>double_or_nothing</title><defs><rect id='a' x='0' y='0' width='70' height='64' rx='4'/></defs><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g transform='translate(21 8)'><rect fill='%23FF9600' x='0' y='25.784' width='82' height='78' rx='7'/><path d='M64.916 13.095L75.5 45.271H20.75l37.691-33.9a4 4 0 0 1 6.475 1.724z' fill='%23FF9600'/><path d='M23.836 1.984L9 27.382h38c-5.187-5.28-8.645-9.402-10.375-12.364-1.264-2.163-3.139-6.334-5.625-12.51a4 4 0 0 0-7.164-.524zM66.125 17.221c1.688 5 5 8.563 7.375 8.563 1.583 0 1.375 1.583-.625 4.75l-11.063-4.75c1.75-9.042 3.188-11.896 4.313-8.563z' fill='%23FF9600'/><path d='M37.25 16.034c3.5 6.125 10 5.625 15.375.75 3.583-3.25 4.875-1.084 3.875 6.5L43.625 33.409l-12.75-11.625c1.916-7.917 4.04-9.834 6.375-5.75z' fill='%23FF9600'/><path d='M32.625 23.659c3 6.625 11.625 8.25 16.875 3.125 3.5-3.417 4.583-2.375 3.25 3.125L39 42.034 27.375 29.909c1.5-8.583 3.25-10.667 5.25-6.25z' fill='%23FFC800'/><path d='M23.836 18.768L9 44.166h38c-5.187-5.28-8.645-9.402-10.375-12.364-1.264-2.163-3.139-6.334-5.625-12.51a4 4 0 0 0-7.164-.524z' fill='%23FFC800'/><path d='M62.916 22.095L73.5 54.271H18.75l37.691-33.9a4 4 0 0 1 6.475 1.724z' fill='%23FFC800'/><path d='M15.375 16.471c-3 5.188-6.563 8.79-9.078 9.305-1.677.344-1.484 1.909.578 4.695 9.542-4.291 13.646-6.437 12.313-6.437-2 0-.813-12.75-3.813-7.563z' fill='%23FF9600'/><g transform='translate(6 33.784)'><mask id='b' fill='" + settings.color.bg.range[0] + "'><use xlink:href='%23a'/></mask><use fill='" + settings.color.bg.range[0] + "' xlink:href='%23a'/><path fill='%23F34848' mask='url(%23b)' d='M-6-3h81v21H-6z'/></g><circle fill='%23C22E2E' cx='24' cy='41.784' r='5'/><circle fill='%23C22E2E' cx='59' cy='41.784' r='5'/><g fill='%23F34848'><path d='M34.5 60.784h13a3.5 3.5 0 0 1 0 7h-13a3.5 3.5 0 0 1 0-7z'/><path d='M34.532 82.636l9.644-19.773a3.5 3.5 0 0 1 6.292 3.069l-9.644 19.773a3.5 3.5 0 0 1-6.292-3.069z'/></g><rect fill='" + settings.color.bg.range[0] + "' x='20' y='26.784' width='8' height='18' rx='4'/><rect fill='" + settings.color.bg.range[0] + "' x='55' y='26.784' width='8' height='18' rx='4'/><path d='M46.313 97.815c7.75 0 14.149-15.031 18.525-15.031 4.376 0 2.224 15.031 6.475 15.031 2.833 0 2.925.99.273 2.969h-22.75c-6.849-1.98-7.69-2.969-2.523-2.969z' fill='%23FF9600'/><path d='M39.187 97.8c-7.75 0-11.311-8.766-15.687-8.766-4.376 0-5.076 8.766-9.327 8.766-2.834 0-2.896.994-.186 2.984h22.749c6.8-1.99 7.618-2.984 2.451-2.984z' fill='%23FF9600'/></g></g><script xmlns=''/></svg>";

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

var invert = 'filter: invert(1) hue-rotate(180deg);-webkit-filter: invert(1) hue-rotate(180deg);',
	invertBright = 'filter: invert(1) hue-rotate(180deg) brightness(200%);-webkit-filter: invert(1) hue-rotate(180deg) brightness(200%);',
	invertBright2 = 'filter: invert(1) hue-rotate(180deg) brightness(200%);-webkit-filter: invert(1) hue-rotate(180deg) brightness(300%);',
	invertBright4 = 'filter: invert(1) hue-rotate(180deg) brightness(800%);-webkit-filter: invert(1) hue-rotate(180deg) brightness(800%)',
	bright = 'filter: brightness(800%);',
	bgGradient = 'background: radial-gradient(farthest-corner at 50% 40%, rgb(0,0,0,1), rgb(0,0,0,0.75), rgb(0,0,0,0.5), rgb(0,0,0,0.75));';

var darkCSS = "";
sf.construct.css = function(){
darkCSS = '' +

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
d + '._6t5Uh{opacity:.9}' +

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

// ##### sidebar #####
	// daily goal
d + '._3Ttma,' + // goal circle
d + '.Rbutm > .cCL9P' + // goal icon
'{' + invertBright + '}' +

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

// exercise tree
	// skill icons
		// entire skill icon
//d + '._2albn:first-child' +
//'{filter: brightness(0.9)}' +
	
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
d + '._1cw2r' +
'{color:' + pc.text.likebg + '}' +

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
'{background:' + pc.bg.darker + '}' +

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
'html' + ref + // topspace
'{background:' + pc.bg.main + '}' +

	// discussions title
d + '.waRHZ' +
'{color:' + pc.text.main + '}' +

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
'{color:' + pc.text.light + '}' +
	
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
d + '._3ZcIW:hover' +
'{color:' + pc.duoblue.main + '}' +

	// title tag
d + '._2Nbkz > ._2wEnn' +
'{background:' + pc.duoblue.dark + ' !important;color:' + pc.text.light + ' !important}' +

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
d + '._2q02F, ._34sSH' +
'{color:' + pc.text.main + ' !important}' +

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
d + ' [itemprop=text] h2,' + // in text titles
d + ' [itemprop=text] h3,' + // in text titles
d + ' [itemprop=text] h4,' + // in text titles
d + ' [itemprop=text] h5,' + // in text titles
d + ' [itemprop=text] h6' + // in text titles
'{color:' + pc.text.main + '}' +

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
	// try ensures the theme loads
	try {
		sf.addcss();
		console.log("TDC (css.js): True Dark loaded after " + attempt++ + " failed attempts.");
	} catch(err) {
		// if load fails try again
		setTimeout(function(){
			addCSSonload();
		}, 10);
	};
};

// apply settings
sf.construct.all = function(){
	sf.construct.colorranges();
	sf.construct.cssrefs();
	sf.construct.cssvars();
	sf.construct.icons();
	sf.construct.css();
	sf.construct.csselement();
	sf.addonload();
};

sf.initiate = function(){
	chrome.storage.sync.get("TDsettings", function(obj) {
		// update default settings with stored ones
		if(obj.TDsettings) {
			Object.assign(settings, JSON.parse(obj.TDsettings));
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