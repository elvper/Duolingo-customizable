(function (){
	
// add contrast bg text color variable (white on duoblue)?
// add style re-add on preview (delayed)
	
version = "3.0.2";

let gid = (e) => document.getElementById(e);
let gcl = (e) => document.getElementsByClassName(e);
let html = document.documentElement;

var settings = {};

f = {};

// convert hours to js time (microseconds)
f.hourstojstime = (hours) => hours * 3600000;

// rgb to array
f.rgbsplit = (rgb) => rgb.match(/\d+/g).map(Number);
// array to rgb
f.rgbjoin = (parts) => "rgb(" + parts + ")";
// rgba to rgb
f.rgbareduce = (rgba) => f.rgbjoin(f.rgbsplit(rgba).slice(0, 3));
// rgb to hex
f.rgbhex = (c) => "#" + f.rgbsplit(c).map((c) => c.toString(16).padStart(2, "0")).join("");

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

// console messages
cs = {
	settings: {
		stored: {
			default: "Default settings stored",
			new: "Changed settings stored"
		},
		read: "Stored settings read"
	}
};

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
		active: false
	}
};

// brightness slider limits and values
f.brightnesssliders = function() {
	expiredornot = settings.lastsession + f.hourstojstime(settings.remembersession) < new Date().getTime();
	settings.brightness.night = settings.brightness.night > settings.brightness.day ? settings.brightness.day : settings.brightness.night;
	settings.calc = {
		slider: {
			day: {
				min: 0,
				max: 70,
				value: Math.round((1 - settings.brightness.day) * 100)
			},
			night: {
				min: Math.round((1 - settings.brightness.day) * 100),
				max: 70,
				value: Math.round((1 - settings.brightness.night) * 100)
			},
			session: {
				min: Math.round((1 - settings.brightness.night) * -100),
				max: Math.round(100 - (1 - settings.brightness.day) * 100 - 30),
				value: expiredornot ? 0 : Math.round(settings.brightness.session * 100)
			}
		},
		sessionexpired: expiredornot
	};
};

f.update = function(target, payload = settings){
	var message = {
		target: target,
		payload: payload
	};
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {data: message}, function(response) {
			//console.log(response);
		});
	});
};

// set menu values based on settings
f.apply = {
	// enable button
	enabled: function(){
		document.documentElement.style.setProperty("--enabled",
			settings.enabled ? "rgb(0,128,0)" : "rgb(175,0,0)");
	},
	
	// set slider min, max and value
	sliders: function(elements){
		for(var slider in elements) {
			for(var property in elements[slider]) {
				document.getElementById(slider).setAttribute(property, elements[slider][property]);
	}	}	},
	
	// set the value of the slider display field
	values: function(elements){
		for(var slider in elements) {
			if(["day", "night"].includes(slider)){
				var fieldvalue = (100 - elements[slider].value);
			} else if(["session"].includes(slider)){
				var fieldvalue = elements[slider].value > 0 ? "+" + elements[slider].value : elements[slider].value;
			}
			document.getElementById(slider + "value").setAttribute("value", fieldvalue + "%");
	}	},
	
	// set editable textfields value
	text: function(){
		for(var e in settings.userinput) {
			document.getElementById(e).setAttribute("value", Number(settings.userinput[e]).toFixed(5));
	}	},
	
	// set checkmarks
	check: function(){
		for(var e in settings.enable) {
			
	}	},
	
	// set color styles
	color: function(){
		for(var e in settings.color) {
			for(var p in settings.color[e]) {
				// CSS variables
				html.style.setProperty("--" + e + "." + p, settings.color[e][p]);
				// color pick field values
				if(!["bgtransparent"].includes(e + p)){
					gid(e + "." + p).setAttribute("value", settings.color[e][p]);
					gid(e + "." + p).value = f.rgbhex(settings.color[e][p]);
					var ev = document.createEvent('Event');
					ev.initEvent('keypress');
					ev.which = ev.keyCode = 13;
					gid(e + "." + p).dispatchEvent(ev);
	}	}	}	},
	
	// set dynamic day/night brightness toggle button value
	dynamic: function(){
		gid("dynamicdaynight").checked = settings.brightness.dynamic;
	}
};

f.listener = {
	// brightness slider move
	slider: function(){
		Array.from(gcl("TDbrightslider")).forEach(
			// set value field
			function(element, i, a) {
				// change settings live
				element.addEventListener("input", function(e){
					if(["day", "night"].includes(e.target.id)){
						settings.brightness[e.target.id] = Number((1 - Number(e.target.value) / 100).toFixed(2));
					} else if (["session"].includes(e.target.id)){
						settings.lastsession = new Date().getTime();
						settings.brightness[e.target.id] = Number((Number(e.target.value) / 100).toFixed(2));
					};
					// change visible slider values
					f.brightnesssliders();
					f.apply.sliders(settings.calc.slider);
					f.apply.values(settings.calc.slider);
					// preview the change
					f.update("dynamic", {
						type: "brightness",
						data: {
							slider: e.target.id,
							settings: settings.brightness,
							lastsession: settings.lastsession,
							remembersession: settings.remembersession,
							loc: settings.userinput
						}
					});
				});
				// save changes at change end
				element.addEventListener("change", function(e){
					if(e.target.id === "night"){
						settings.brightness.dynamic = true;
						gid("dynamicdaynight").checked = true;
					};
					f.savesettings();
				});
			}
		)
	},
	
	// on on/off button press
	enabled: function(){
		Array.from(gcl("enable")).forEach(
			function(e, i, a) {
				e.addEventListener("click", function(e){
					settings.enabled = !settings.enabled;
					f.apply.enabled();
					f.savesettings();
					f.applychange.enable();
				});
			}
		)
	},
	
	// on color input change (don't save)
	color: function(){
		Array.from(gcl("colorpicker")).forEach(
			function(e, i, a) {
				e.addEventListener("updatecolor", function(e){
					f.applychange.color(e.target);
				});
			}
		)
	},
	
	// save color changes
	savecolors: function(){
		gid("savecolors").addEventListener("click", function(e){
			newcolors = {};
			for(e of gcl("colorpicker")){
				var item = e.id.split(".");
				newcolors[item[0]] = newcolors[item[0]] || {};
				newcolors[item[0]][item[1]] = f.rgbareduce(e.getAttribute("value"));
			};
			// add non choosable color transparent
			newcolors.bg.transparent = "rgba(0,0,0,0)";
			Object.assign(settings.color, newcolors);
			f.savesettings();
		});
	},
	
	// restore default colors
	defaultcolors: function(){
		gid("restorecolors").addEventListener("click", function(e){
			Object.assign(settings.color, defsettings.color);
			f.savesettings();
			f.apply.color();
			for(e of gcl("colorpicker")){
				f.applychange.color(e);
			};
			f.update("css", "update");
		});
	},
	
	// turn dynamic brightness on/off
	dynamic: function(){
		gid("dynamicdaynight").addEventListener("change", function(e){
			settings.brightness.dynamic = !settings.brightness.dynamic;
			f.savesettings();
			// update css? ############################################################
		});
	},
	
	// entering coordinates
	locationinput: function(){
		gid("latitude").addEventListener("input", function(e){
			var val = Number(e.target.value);
			if(val && val <= 90 && val >= -90){
				settings.userinput.latitude = val;
				f.savesettings();
				gid("dynamicdaynight").checked = true;
				settings.brightness.dynamic = true;
			} else {
				e.target.value = e.target.value.substring(0, e.target.value.length - 1);
			};
		});
		gid("longitude").addEventListener("change", function(e){
			var val = Number(e.target.value);
			if(val && val <= 180 && val >= -180){
				settings.userinput.longitude = val;
				f.savesettings();
				gid("dynamicdaynight").checked = true;
				settings.brightness.dynamic = true;
			} else {
				e.target.value = e.target.value.substring(0, e.target.value.length - 1);
			};
		});
		// recalc brightness ##########################################################
		// apply to map if open? ######################################################
	},
	
	// pick location on map button
	picklocation: function(){
		gid("picklocation").addEventListener("click", function(e){
			gid("picklocation").style.setProperty("display", "none");
			gid("map").style.setProperty("display", "inherit");
			f.googlemaps();
		});
	},
};

f.savesettings = function(){
	chrome.storage.sync.set({"TDsettings": JSON.stringify(settings), function() {
		console.log(cs.settings.stored.default);
	}});
	// recalc stylesheet to include icon changes
	f.update("css", "update");
};

// apply changes live to the duolingo website
f.applychange = {
	color: function(e){
		html.style.setProperty("--" + e.id, e.value);
		var item = e.id.split("."),
			colors = {type: item[0]};
			colors[item[0]] = {};
		if(["min", "max"].includes(item[1])){
			colors[item[0]].min = f.rgbareduce(gid(item[0] + ".min").getAttribute("value"));
			colors[item[0]].max = f.rgbareduce(gid(item[0] + ".max").getAttribute("value"));
		} else {
			colors[item[0]][item[1]] = f.rgbareduce(e.getAttribute("value"));
		};
		f.update("dynamic", {type: "color", data: colors});
	},
	
	enable: function(){
		f.update("dynamic", {type: "enable", data: settings.enabled ? settings.theme.preset : ""});
	}
};

var gmaps = {},
	attempt = 0;
// load google maps
gmaps.load = function() {
	if (attempt < 1000){
		attempt++;
		try {
			gmaps.initialize();
			console.log("Loaded Google maps after " + attempt + " attempts.");
		} catch(err) {
			// if load fails try again
			setTimeout(function(){
				gmaps.load();
			}, 10);
		};
	};
};
	
gmaps.initialize = function() {
	var latitude = settings.userinput.latitude || 40,
		longitude = settings.userinput.longitude || -95;
	var zoomlevel = latitude == 40 && longitude == -95 ? 3 : 12;
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: zoomlevel,
		mapTypeControl: false,
		streetViewControl: false,
		center: {lat: latitude, lng: longitude}
	});
	if(zoomlevel == 12) gmaps.addMarker({lat: latitude, lng: longitude}, map);
	google.maps.event.addListener(map, 'click', function(event) {
		gmaps.addMarker(event.latLng, map);
		gid("latitude").value = event.latLng.lat().toFixed(5);
		gid("longitude").value = event.latLng.lng().toFixed(5);
		settings.userinput.latitude = event.latLng.lat();
		settings.userinput.longitude = event.latLng.lng();
		f.savesettings();
	});
}


var marker;
// Adds a marker to the map.
gmaps.addMarker = function(location, map) {
	if(!marker){
	marker = new google.maps.Marker({
	  position: location,
	  map: map
	});
  } else {
	marker.setPosition(location);
  }
}

// add google maps to the menu
f.googlemaps = function(){
	var gmapsscript = document.createElement("script");
	gmapsscript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCDehCVbzJ7oF6YSmN8_aZHZmEtKAzxtXY";
	document.head.appendChild(gmapsscript);
	gmaps.load();
}




































// get stored settings
chrome.storage.sync.get("TDsettings", function(obj) {
	var storedsettings = null;
	if(obj && obj.TDsettings) {
		settings = JSON.parse(JSON.stringify(defsettings));
		Object.assign(settings, JSON.parse(obj.TDsettings));
	} else {
		// get default settings
		settings = defsettings;
	};
	
	Object.assign(settings, f.brightnesssliders());
	console.log(settings);
	f.apply.sliders(settings.calc.slider);
	f.apply.values(settings.calc.slider);
	f.apply.text();
	document.getElementById("version").innerHTML = "Version: " + version;
	f.apply.enabled();
	f.apply.color();
	f.apply.dynamic();
	
	// enable color picker for color fields
	var colorpickers = KellyColorPicker.attachToInputByClass('colorpicker', {alpha_slider: false, size: 200});
	
	f.listener.slider();
	f.listener.enabled();
	f.listener.color();
	f.listener.savecolors();
	f.listener.defaultcolors();
	f.listener.dynamic();
	f.listener.picklocation();
	f.listener.locationinput();
});


















}());































































































































