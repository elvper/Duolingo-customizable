(function(){

let gid = (e) => document.getElementById(e);
let gcl = (e) => document.getElementsByClassName(e);
let html = document.documentElement;

var settings = {};
var suntimes = null;

// functions
f = {};

// add brightness overlay
f.overlay = function(){
	var overlay = document.createElement("div");
	overlay.id = "brightness";
	overlay.style = "";
	document.body.appendChild(overlay);
};
f.overlay();

// change overlay opacity
f.setoverlayopacity = (opacity) => gid("brightness").style.setProperty("background", "rgba(0, 0, 0, " + opacity + ")");

// calculate how far between the transition of day and night
f.sunprogress = (late, early, now) => ((late - now) / (late - early));

// calculate how much darkening to apply
f.calclightratio = x => (((10 * x) - 5) / (4 + (12 * Math.abs(x - 0.5))) + 0.5);

// convert hours to js time (microseconds)
f.hourstojstime = (hours) => hours * 3600000;

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
			//console.log(request.data);
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
	},
	
	brightness: function(data){
		settings.lastsession = new Date().getTime();
		if(data.slider == "session"){
			settings.brightness.session = data.settings.session;
			clearTimeout(recalcbrightness);
			f.calcbrightness();
		} else if (data.slider == "day"){
			settings.brightness.day = data.settings.day;
			settings.brightness.night = data.settings.night;
			settings.brightness.session = data.settings.session;
			clearTimeout(recalcbrightness);
			f.setoverlayopacity(1 - data.settings.day);
			recalcbrightness = setTimeout(function(){f.calcbrightness()}, 3000);
		} else if (data.slider == "night"){
			settings.brightness.night = data.settings.night;
			settings.brightness.session = data.settings.session;
			clearTimeout(recalcbrightness);
			f.setoverlayopacity(1 - data.settings.night);
			recalcbrightness = setTimeout(function(){f.calcbrightness()}, 3000);
		};
	}
};

f.getsettings = function(){
	chrome.storage.sync.get("TDsettings", function(obj) {
		// update default settings with stored ones
		if(obj.TDsettings) {
			Object.assign(settings, JSON.parse(obj.TDsettings));
		};
	});
};

var recalcbrightness;
var recalccounter = 0;
f.calcbrightness = function(){
	//console.log("DTC (dynamic.js): recalculating brightness");
	clearTimeout(recalcbrightness);
	var now = new Date().getTime(),
		opacity = null, // opacity of overlay (as brightness)
		daypart = null, // moment of the day
		timeout = 1000; // default brightness recalculation rate
	var sessionexpired = now - settings.lastsession > settings.remembersession;
	// no session adjustment if session expired
	var sessionadj = sessionexpired ? 0 : settings.brightness.session;
	// add session adjustment to day value (can't be more than 1)
	var day = Math.min(1, settings.brightness.day - sessionadj);
	// add session adjustment to night value (can't be less than 0.3)
	var night = Math.max(0.3, settings.brightness.night - sessionadj);
	// opacity to brightness %
	var brightnesspct = () => ((1 - opacity) * 100).toFixed(2) + " %.";
	// if dynamic brightness is enabled
	if(settings.brightness.dynamic && day != night){
		// get the times of sunrise and sunset
		var fadeearlier = suntimes.sunsetStart - f.hourstojstime(settings.brightness.fadeearlier);
		recalccounter++;
		
		// darkening ratio based on the time of the day
		if (now > suntimes.sunriseEnd && now < fadeearlier){
			daypart = "daylight";
			opacity = 1 - day;
			timeout = fadeearlier - now; // recalculate at sundown
			recalccounter = 1;
		} else if (now > suntimes.dusk || now < suntimes.dawn){
			daypart = "night";
			opacity = 1 - night;
			tomorrowdawn = SunCalc.getTimes(now + 86400000, settings.userinput.latitude, settings.userinput.longitude).dawn;
			timeout = tomorrowdawn - now; // recalculate at sunrise
			recalccounter = 1;
		} else if (now > fadeearlier && now < suntimes.dusk){
			daypart = "sundown";
			var darkRatio = f.calclightratio(f.sunprogress(suntimes.dusk, fadeearlier, now));
			opacity = 1 - (night + darkRatio * (day - night));
		} else if (now > suntimes.dawn && now < suntimes.sunriseEnd){
			daypart = "sunrise";
			var darkRatio = f.calclightratio(1 - f.sunprogress(suntimes.sunriseEnd, suntimes.dawn, now));
			opacity = 1 - (night + darkRatio * (day - night));
		};
		
		// print the dynamic brightness applied to console
		if (recalccounter % 60 === 1){
			console.log("DTC (dynamic.js): " + daypart + ", brightness set to " + brightnesspct());
		};
		// set timeout for next calculation
		recalcbrightness = setTimeout(function(){f.calcbrightness()}, timeout);
		// apply brightness by setting the opacity of the overlay
		f.setoverlayopacity(opacity);
	} else {
		// if dynamic brightness is disabled just apply the day setting (adjusted to session)
		f.setoverlayopacity(1 - day);
	};
};










// initial page load
chrome.storage.sync.get("TDsettings", function(obj) {
	// update default settings with stored ones
	if(obj.TDsettings) {
		Object.assign(settings, JSON.parse(obj.TDsettings));
	};
	suntimes = SunCalc.getTimes(
		new Date().getTime(),
		settings.userinput.latitude,
		settings.userinput.longitude
	);
	console.log(suntimes);
	f.calcbrightness();
});











































// #############################################################
// ####################### suncalc #############################
// #############################################################

// Github: https://github.com/mourner/suncalc/blob/master/LICENSE

// Copyright (c) 2014, Vladimir Agafonkin
// All rights reserved.

// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:

   // 1. Redistributions of source code must retain the above copyright notice, this list of
      // conditions and the following disclaimer.

   // 2. Redistributions in binary form must reproduce the above copyright notice, this list
      // of conditions and the following disclaimer in the documentation and/or other materials
      // provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
// TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/*
 (c) 2011-2015, Vladimir Agafonkin
 SunCalc is a JavaScript library for calculating sun/moon position and light phases.
 https://github.com/mourner/suncalc
*/

(function () { 'use strict';

// shortcuts for easier to read formulas

var PI   = Math.PI,
    sin  = Math.sin,
    cos  = Math.cos,
    tan  = Math.tan,
    asin = Math.asin,
    atan = Math.atan2,
    acos = Math.acos,
    rad  = PI / 180;

// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

// date/time constants and conversions

var dayMs = 1000 * 60 * 60 * 24,
    J1970 = 2440588,
    J2000 = 2451545;

function toJulian(date) { return date.valueOf() / dayMs - 0.5 + J1970; }
function fromJulian(j)  { return new Date((j + 0.5 - J1970) * dayMs); }
function toDays(date)   { return toJulian(date) - J2000; }

// general calculations for position

var e = rad * 23.4397; // obliquity of the Earth

function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
function declination(l, b)    { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }

function azimuth(H, phi, dec)  { return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)); }
function altitude(H, phi, dec) { return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H)); }

function siderealTime(d, lw) { return rad * (280.16 + 360.9856235 * d) - lw; }

function astroRefraction(h) {
    if (h < 0) // the following formula works for positive altitudes only.
        h = 0; // if h = -0.08901179 a div/0 would occur.

    // formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
    // 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
    return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
}

// general sun calculations

function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }

function eclipticLongitude(M) {

    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
        P = rad * 102.9372; // perihelion of the Earth

    return M + C + P + PI;
}

function sunCoords(d) {

    var M = solarMeanAnomaly(d),
        L = eclipticLongitude(M);

    return {
        dec: declination(L, 0),
        ra: rightAscension(L, 0)
    };
}

var SunCalc = {};

// calculates sun position for a given date and latitude/longitude

SunCalc.getPosition = function (date, lat, lng) {

    var lw  = rad * -lng,
        phi = rad * lat,
        d   = toDays(date),

        c  = sunCoords(d),
        H  = siderealTime(d, lw) - c.ra;

    return {
        azimuth: azimuth(H, phi, c.dec),
        altitude: altitude(H, phi, c.dec)
    };
};

// sun times configuration (angle, morning name, evening name)

var times = SunCalc.times = [
    [  -0.3, 'sunriseEnd',    'sunsetStart' ],
    [    -6, 'dawn',          'dusk'        ]
];

// adds a custom time to the times config

SunCalc.addTime = function (angle, riseName, setName) {
    times.push([angle, riseName, setName]);
};

// calculations for sun times

var J0 = 0.0009;

function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * PI)); }

function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * PI) + n; }
function solarTransitJ(ds, M, L)  { return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L); }

function hourAngle(h, phi, d) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }

// returns set time for the given sun altitude
function getSetJ(h, lw, phi, dec, n, M, L) {

    var w = hourAngle(h, phi, dec),
        a = approxTransit(w, lw, n);
    return solarTransitJ(a, M, L);
}

// calculates sun times for a given date and latitude/longitude

SunCalc.getTimes = function (date, lat, lng) {

    var lw = rad * -lng,
        phi = rad * lat,

        d = toDays(date),
        n = julianCycle(d, lw),
        ds = approxTransit(0, lw, n),

        M = solarMeanAnomaly(ds),
        L = eclipticLongitude(M),
        dec = declination(L, 0),

        Jnoon = solarTransitJ(ds, M, L),

        i, len, time, Jset, Jrise;


    var result = {};

    for (i = 0, len = times.length; i < len; i += 1) {
        time = times[i];

        Jset = getSetJ(time[0] * rad, lw, phi, dec, n, M, L);
        Jrise = Jnoon - (Jset - Jnoon);

        result[time[1]] = fromJulian(Jrise);
        result[time[2]] = fromJulian(Jset);
    }

    return result;
};

// export as Node module / AMD module / browser variable
if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = SunCalc;
else if (typeof define === 'function' && define.amd) define(SunCalc);
else window.SunCalc = SunCalc;

}());

})();



















