(function (){
	
version = "3.0.0";

let gid = (e) => document.getElementById(e);
let gcl = (e) => document.getElementsByClassName(e);
	
f = {};
f.c = {};

f.c.hourstojstime = (hours) => hours * 3600000;

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
	}
};
settings = defsettings;

// brightness slider limits and values
f.brightnesssliders = function() {
	expiredornot = settings.lastsession + f.c.hourstojstime(settings.remembersession) < new Date().getTime();
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
}

// get stored settings
chrome.storage.sync.get("TDsettings", function(obj) {
	var storedsettings = null;
	if(obj.TDsettings) {
		storedsettings = JSON.parse(obj.TDsettings);
	} else {
		// get default settings
		storedsettings = defsettings;
	}
	document.getElementById("TDpop").style.setProperty("opacity", 1);
	
	Object.assign(settings, f.brightnesssliders(storedsettings));
	console.log(settings);
});

// apply settings to popup
f.popupSettings = function() {
	
}

f.apply = {
	// enable button
	enabled: function(){
		document.documentElement.setAttribute("style",
		"--enabled: rgb(" + (settings.enabled ? "0,128,0" : "175,0,0") + ")");
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
		}
	},
	
	// set editable textfields value
	text: function(){
		for(var e in settings.userinput) {
			document.getElementById(e).setAttribute("value", settings.userinput[e]);
		}
	},
	
	// set checkmarks
	check: function(){
		for(var e in settings.enable) {
			
		}
	}
};

f.listener = {
	slider: function(){
		Array.from(gcl("TDbrightslider")).forEach(
			// set value field
			function(element, i, a) {
				// change settings
				element.addEventListener("input", function(e){
					if(["day", "night"].includes(e.target.id)){
						settings.brightness[e.target.id] = Number((1 - Number(e.target.value) / 100).toFixed(2));
					} else if (["session"].includes(e.target.id)){
						settings.lastsession = new Date().getTime();
						settings.brightness[e.target.id] = Number((Number(e.target.value) / 100).toFixed(2));
					};
					// change visible slider values
					f.brightnesssliders()
					f.apply.sliders(settings.calc.slider);
					f.apply.values(settings.calc.slider);
				});
				// save changes
				element.addEventListener("change", function(e){
					f.savesettings();
				});
			}
		)
	},
	
	enabled: function(){
		Array.from(gcl("enable")).forEach(
			function(e, i, a) {
				e.addEventListener("click", function(e){
					settings.enabled = !settings.enabled;
					f.apply.enabled();
				});
			}
		)
	}
};

f.savesettings = function(){
	chrome.storage.sync.set({"TDsettings": JSON.stringify(settings), function() {
		console.log(cs.settings.stored.default);
	}});
};





















chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {data: settings}, function(response) {
		console.log(response);
	});
});


























// get stored settings
chrome.storage.sync.get("TDsettings", function(obj) {
	var storedsettings = null;
	if(obj.TDsettings) {
		settings = defsettings;
		Object.assign(settings, JSON.parse(obj.TDsettings));
	} else {
		// get default settings
		settings = defsettings;
		// save default settings
		//chrome.storage.sync.set({"TDsettings": JSON.stringify(settings), function() {
		//	console.log(cs.settings.stored.default);
		//}});
	}
	
	Object.assign(settings, f.brightnesssliders());
	console.log(settings);
	f.apply.sliders(settings.calc.slider);
	f.apply.values(settings.calc.slider);
	f.apply.text();
	document.getElementById("version").innerHTML = "Version: " + version;
	f.apply.enabled();
	
	f.listener.slider();
	f.listener.enabled();
});

}());






























































































































