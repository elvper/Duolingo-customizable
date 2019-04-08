// to do
// - cog icon for pages without the resource
// - first time use guide
// - Choose color - dynamic color
// - Adjust preview on settings change
// - mobile text size option
// - words tab

settings = {};
chrome.storage.sync.get("TDsettings", function(obj) {
	settings = JSON.parse(obj.TDsettings);
	console.log(settings);
	// update
});

// settings
var remembersession = 6; // hours: how long to remember the session settings for
var fadeearlier = 0.5; // hours: how long before sunsetstart to start fading to the night setting

var td = {};

td.version = "2.3.7";
td.f = {};
td.f.hourstojstime = (hours) => hours * 3600000;
td.f.sessionadjustment = (original) => (td.sessionexpired ?
	(original + td.settings.old.session) : original);
td.f.setoverlayopacity = (opacity) => document.getElementById("TurnDownLights").setAttribute("style", "background-color: rgba(0, 0, 0, " + opacity + ");");
td.f.calclightratio = x => (((10 * x) - 5) / (4 + (12 * Math.abs(x - 0.5))) + 0.5);
td.transitionprogress = (late, early) => ((late - td.now) / (late - early));

function createobj(){
	td.countr = 60;
	td.settings = {};
	td.settings.old = JSON.parse(localStorage.getItem('TrueDarkSettings')) || {};
	
	td.s = {};	
	td.s.old = JSON.parse(localStorage.getItem('TrueDarkStyle')) || {};
	
	td.now = new Date().getTime();
	td.tomorrow = td.now + 86400000;
	td.sessionlimit = td.f.hourstojstime(remembersession);
	td.sessionexpired = td.settings.old.sessionLast ?
		(td.now - td.settings.old.sessionLast < td.sessionlimit) : true;
	td.settings.old.session && (td.now - td.settings.old.sessionLast > td.sessionlimit) && (td.settings.old.session = 0);
	td.overlayopacity = {};
	td.overlayopacity.day = td.f.sessionadjustment(td.settings.old.day) / 100;
	td.overlayopacity.night = td.f.sessionadjustment(td.settings.old.day) / 100;
	td.settings.old.scale = td.settings.old.night - td.settings.old.day;
};
createobj();

function continueobj(){
	td.doadjust = td.settings.old.locationBased && td.settings.old.latitude != null && td.settings.old.longitude != null;
	td.sunposition = td.doadjust ?
		SunCalc.getTimes(td.now, td.settings.old.latitude, td.settings.old.longitude) : null;
	td.sunposition && (td.sunposition.startearlier = td.sunposition.sunsetStart - td.f.hourstojstime(fadeearlier));
};

function readFirst(){
	continueobj();
	loopfunctions();
};

function recalcobj(){
	createobj();
	continueobj();
	console.log(td);
}

// Settings menu HTML
(function constructHTML(){
/* 	var tempele = document.createElement("div");
	tempele.id = "TrueDarkTheme";
	var newele = {}, eleobjs = {};
	toObj = arr => eleobjs[arr[1]] = {"type": arr[0], "id": arr[1], "class": arr[2], "parent": arr[3], "attr": arr[4], "inner": arr[5]};
	appendEles = obj => eval(obj.parent).appendChild(newele[obj.id]);

	function createEle(obj){
		addAttributes = objattr => newele[obj.id].setAttribute(objattr[0], objattr[1]);
		newele[obj.id] = document.createElement(obj.type);
		newele[obj.id].id = obj.id;
		newele[obj.id].className = obj.class;
		newele[obj.id].appendChild(document.createTextNode(obj.inner));
		obj.attr.forEach(addAttributes);
	};

	var tocreate = [
		// type		// id					// class		// parent						// attributes, innertext
		["div", 	"TurnDownLights", 		"", 			'tempele', 						[["style", "background-color: rgba(0, 0, 0, " + td.overlayopacity.day + ");"]], ""],
		["div", 	"TrueDarkSettings",		"", 			'tempele', 						[], ""],
		["div", 	"TDcog", 				"cCL9P", 		'newele["TrueDarkSettings"]', 	[["onmouseover", "javascript:void(document.getElementById('TDpop').className=(''),hidePop())"]], ""],
		["div", 	"TDpop", 				"hideEle", 		'newele["TrueDarkSettings"]', 	[], ""],
		["div", 	"sessiontitle",			"popExpl",		'newele["TDpop"]',				[], "Session brightness"],
		["input", 	"sessionDarknessValue", "dv",			'newele["TDpop"]',				[["type", "text"],["disabled", true]], ""],
		["input", 	"sessionDarkness", 		"dslider adj",	'newele["TDpop"]',				[["type", "range"],["oninput", "updateDarkness(this)"],["min", "-70"],["max", "70"],["value", "0"]], ""],
		["div", 	"daytitle",				"popExpl",		'newele["TDpop"]',				[], "Daytime brightness"],
		["input", 	"dayDarknessValue", 	"dv",			'newele["TDpop"]',				[["type", "text"],["disabled", true]], ""],
		["input", 	"dayDarkness", 			"dslider",		'newele["TDpop"]',				[["type", "range"],["oninput", "updateDarkness(this)"],["min", "0"],["max", "70"],["value", "0"]], ""],
		["hr", 		"popsplit", 			"popSplit", 	'newele["TDpop"]', 				[], ""],
		["div", 	"locationtitle",		"popExpl",		'newele["TDpop"]',				[], "Location for dynamic brightness"],
		["div", 	"locationcontainer",	"locContainer",	'newele["TDpop"]',				[], ""],
		["div", 	"poplatref",			"popRef",		'newele["locationcontainer"]',	[], "Lat "],
		["input", 	"latitudeDarkness",		"geoLoc",		'newele["locationcontainer"]',	[["type", "text"],["oninput", "updateDarkness(this)"]], ""],
		["div", 	"poplongref",			"popRef",		'newele["locationcontainer"]',	[], "Long "],
		["input", 	"longitudeDarkness",	"geoLoc",		'newele["locationcontainer"]',	[["type", "text"],["oninput", "updateDarkness(this)"]], ""],
		["div", 	"locationcheck",		"locContainer",	'newele["TDpop"]',				[], ""],
		["input", 	"locationBasedDarkness","popCheck",		'newele["locationcheck"]',		[["type", "checkbox"],["oninput", "updateDarkness(this)"]], ""],
		["label", 	"locationchecklabel"	,"",			'newele["locationcheck"]',		[["for", "locationBasedDarkness"]], "Enable dynamic day-night brightness?"],
		["div", 	"nighttitle",			"popExpl",		'newele["TDpop"]',				[], "Nighttime brightness"],
		["input", 	"nightDarknessValue", 	"dv",			'newele["TDpop"]',				[["type", "text"],["disabled", true]], ""],
		["input", 	"nightDarkness", 		"dslider",		'newele["TDpop"]',				[["type", "range"],["oninput", "updateDarkness(this)"],["min", "0"],["max", "70"],["value", "0"]], ""],
		["hr", 		"popsplit2", 			"popSplit", 	'newele["TDpop"]', 				[], ""],
		["div", 	"scaletitle",			"popExpl",		'newele["TDpop"]',				[], "Scale size"],
		["div", 	"poplatref",			"popRef",		'newele["TDpop"]',				[], "Lat "],
		["input", 	"forumScale",			"sizeScale",	'newele["TDpop"]',				[["type", "text"]], ""],
		["div", 	"poplatref",			"popRef",		'newele["TDpop"]',				[], "Lat "],
		["input", 	"exerciseScale",		"sizeScale",	'newele["TDpop"]',				[["type", "text"]], ""],
		["hr", 		"popsplit3", 			"popSplit", 	'newele["TDpop"]', 				[], ""],
		["div", 	"tdversion",			"popExpl",		'newele["TDpop"]',				[], ("Version: " + td.version)]
	];
	tocreate.forEach(toObj);

	for (var key in eleobjs) {
		createEle(eleobjs[key]);
		appendEles(eleobjs[key]);
	}; */
	
	var tempele = document.createElement('div');
	tempele.id = "TrueDarkTheme";
	tempele.innerHTML = '' +
'<div id="TurnDownLights" class="" style="background-color: rgba(0, 0, 0, 0.2);"></div>' +
'<div id="TrueDarkSettings" class="">' +
	'<div id="TDcog" class="cCL9P" onmouseover="javascript:void(document.getElementById(\'TDpop\').className=(\'\'),hidePop())" style=""></div>' +
	'<div id="TDpop" class="hideEle" style="opacity:1">' +
		'<div id="sessiontitle" class="popExpl">Session brightness</div>' +
		'<input id="sessionDarknessValue" class="dv" type="text" disabled="true">' +
		'<input id="sessionDarkness" class="dslider adj" type="range" oninput="updateDarkness(this)" min="-20" max="70" value="0">' +
		'<div id="daytitle" class="popExpl">Daytime brightness</div>' +
		'<input id="dayDarknessValue" class="dv" type="text" disabled="true">' +
		'<input id="dayDarkness" class="dslider" type="range" oninput="updateDarkness(this)" min="0" max="70" value="0">' +
		'<hr id="popsplit" class="popSplit"><div id="locationtitle" class="popExpl">Location for dynamic brightness</div>' +
		'<div id="locationcontainer" class="locContainer">' +
			'<input id="latitudeDarkness" class="geoLoc" type="text" oninput="updateDarkness(this)">' +
			'<div id="poplongref" class="popRef">Long </div>' +
			'<input id="longitudeDarkness" class="geoLoc" type="text" oninput="updateDarkness(this)">' +
		'</div>' +
		'<div id="poplatref" class="popRef">Lat </div>' +
		'<div id="locationcheck" class="locContainer">' +
			'<input id="locationBasedDarkness" class="popCheck" type="checkbox" oninput="updateDarkness(this)">' +
			'<label id="locationchecklabel" class="" for="locationBasedDarkness">Enable dynamic day-night brightness?</label>' +
		'</div>' +
		'<div id="nighttitle" class="popExpl">Nighttime brightness</div>' +
		'<input id="nightDarknessValue" class="dv" type="text" disabled="true">' +
		'<input id="nightDarkness" class="dslider" type="range" oninput="updateDarkness(this)" min="0" max="70" value="0">' +
//		'<hr id="popsplit2" class="popSplit">' +
//		'<div id="scaletitle" class="popExpl">Scale size</div>' +
//		'<input id="scale" class="sizeScale" type="text">' +
		'<hr id="popsplit3" class="popSplit">' +
		'<div id="tdversion" class="popExpl">Version: 2.3.3</div>' +
	'</div>' +
'</div>';
	
	document.body.appendChild(tempele);
})();

// add the necessary functions to the page
(function elementFuncs(){
	// update settings to changes
	function updateDarkness(ele) {
		clearTimeout(updateSettings);
		updateSettings = setTimeout(function(){
			storeSettings();
		}, 2000);
		var dayVal = parseInt(document.getElementById("dayDarkness").value),
			nightVal = parseInt(document.getElementById("nightDarkness").value),
			[largeVal, smallVal] = dayVal > nightVal ?
				[dayVal, dayVal] : [nightVal, dayVal];
		if (ele.className == "dslider"){
			document.getElementById(ele.id + "Value").value = (100 - parseInt(ele.value)) + "%";
			document.getElementById("TurnDownLights").setAttribute("style", "background-color: rgba(0, 0, 0, " + (parseInt(ele.value) / 100) + ");");
				
			// set session adjustment range
			var sessionslider = document.getElementById("sessionDarkness");
			sessionslider.setAttribute("min", 0 - largeVal);
			sessionslider.setAttribute("max", 70 - smallVal);
			sessionslider.value = 0;
			document.getElementById("sessionDarknessValue").value = 0;
			newSetting.session = 0;
			if (ele.id == "dayDarkness"){
				document.getElementById("nightDarkness").setAttribute("min", ele.value);
				if (!(nightVal >= dayVal)){
					document.getElementById("nightDarknessValue").value = (100 - parseInt(ele.value)) + "%";
					newSetting.night = parseInt(ele.value);
				};
			};
		};
		if (ele.id == "locationBasedDarkness"){
			newSetting[ele.id.replace("Darkness", "")] = ele.checked;
		} else {
			newSetting[ele.id.replace("Darkness", "")] = parseInt(ele.value);
		};
		if (ele.id == "sessionDarkness"){
			var eleVal = parseInt(ele.value) < 0 ? "+" + (-parseInt(ele.value)) : (-parseInt(ele.value));
			document.getElementById(ele.id + "Value").value = eleVal;
			document.getElementById("TurnDownLights").setAttribute("style", "background-color: rgba(0, 0, 0, " + ((dayVal + parseInt(ele.value)) / 100) + ");");
			newSetting.sessionLast = new Date() - 0;
		};
	};
		
	// hide the settings menu
	function hidePop(){
		if (popOpen == 0){
			popOpen = 1;
			document.addEventListener("mousemove", setOpacity = function calcOpacity(e) {
				function removeListener(){
					storeSettings();
					document.getElementById("TDcog").setAttribute("style", "");
					popOpen = 0;
					document.removeEventListener("mousemove", setOpacity);
				};
				if (document.getElementById("TDpop").className == ""){
					document.getElementById("TDcog").setAttribute("style", "opacity:1;");
					var mouse = {},
						opacity = 1,
						ratio = 200,
						popEle = document.getElementById("TDpop"),
						ele = popEle.getBoundingClientRect();
					
					mouse.x = e.clientX;
					mouse.y = e.clientY;
					
					ele.xp = mouse.x < ele.left ?
						ele.left : mouse.x < ele.right ?
							mouse.x: ele.right;
					ele.yp = mouse.y > ele.bottom ?
						ele.bottom : mouse.y > ele.top ?
							mouse.y : ele.top;
							
					if (Math.abs(ele.xp - mouse.x) > opacity * ratio || Math.abs(ele.yp - mouse.y) > opacity * ratio){
						document.getElementById("TDpop").className = "hideEle";
						ele.opacity = opacity;
						popEle.setAttribute("style", "opacity:" + ele.opacity);
						removeListener();
					} else if (ele.xp == mouse.x && ele.yp == mouse.y){
						ele.opacity = opacity;
					} else if (ele.xp == mouse.x){
						ele.opacity = opacity - (Math.abs(ele.yp - mouse.y)/ratio);
					} else if (ele.yp == mouse.y){
						ele.opacity = opacity - (Math.abs(ele.xp - mouse.x)/ratio);
					} else {
						ele.opacity = opacity -	Math.sqrt((ele.xp - mouse.x) ** 2 + (ele.yp - mouse.y) ** 2) / ratio;
					};
					
					popEle.setAttribute("style", "opacity:" + ele.opacity);
				} else {
					removeListener();
					alert("event listener failed to stop #1");
				};
			});
		};
	};

	// save changes to the settings in local storage
	function storeSettings(){
		try {
			var interSS = JSON.parse(localStorage.getItem('TrueDarkSettings'));
			storedSettings = interSS ? interSS : {};
		} catch(err) {};
		
		newSetting.latitude = typeof newSetting.latitude != "number" ?
			null : newSetting.latitude > 90 ?
				null : newSetting.latitude < -90 ?
					null : newSetting.latitude;
		newSetting.longitude = typeof newSetting.longitude != "number" ?
			null : newSetting.longitude > 180 ?
				null : newSetting.longitude < -180 ?
					null : newSetting.longitude;
					
		var TDsettings = {};
			TDsettings.session = newSetting.session != null ?
				newSetting.session : storedSettings.session != null ?
					storedSettings.session : 0;
			TDsettings.sessionLast = newSetting.sessionLast != null ?
				newSetting.sessionLast : storedSettings.sessionLast != null ?
					storedSettings.sessionLast : 0;
			TDsettings.day = newSetting.day != null ?
				newSetting.day : storedSettings.day != null ?
					storedSettings.day : 0;
			TDsettings.night = newSetting.night != null ?
				newSetting.night : storedSettings.night != null ?
					storedSettings.night : 0;
			TDsettings.latitude = newSetting.latitude != null ?
				newSetting.latitude : storedSettings.latitude != null ?
					storedSettings.latitude : null;
			TDsettings.longitude = newSetting.longitude != null ?
				newSetting.longitude : storedSettings.longitude != null ?
					storedSettings.longitude : null;
			TDsettings.locationBased = newSetting.locationBased != null ?
				newSetting.locationBased : storedSettings.locationBased != null ?
					storedSettings.locationBased : false;
		
		localStorage.setItem('TrueDarkSettings', JSON.stringify(TDsettings));
	};

	// add element functions to the page
	var scriptEle = document.createElement('script');
		scriptEle.type = "text/javascript";
		scriptEle.appendChild(document.createTextNode(hidePop + updateDarkness + storeSettings + "var newSetting = {};newSetting.session = null;newSetting.sessionLast = null;newSetting.day = null;newSetting.night = null;newSetting.latitude = null;newSetting.longitude = null;newSetting.locationBased = null;var popOpen = 0;var goBack;var updateSettings;var storedSettings;"));
	document.getElementsByTagName('head')[0].appendChild(scriptEle);
})();

// apply stored settings
td.f.applySettings = (function(){
	if(td.settings.old){
		var as = td.settings.old;
		var lightAdj = false;
		document.getElementById("sessionDarknessValue").value = as.session < 0 ? "+" + (0 - as.session) : (0 - as.session);
		document.getElementById("sessionDarkness").value = as.session;
		document.getElementById("sessionDarkness").setAttribute("min", 0 - (as.day > as.night ? as.day : as.night));
		document.getElementById("sessionDarkness").setAttribute("max", 70 - as.day);
		document.getElementById("dayDarknessValue").value = (100 - as.day) + "%";
		document.getElementById("dayDarkness").value = as.day;
		document.getElementById("nightDarknessValue").value = (100 - as.night) + "%";
		document.getElementById("nightDarkness").value = as.night;
		document.getElementById("latitudeDarkness").value = as.latitude;
		document.getElementById("longitudeDarkness").value = as.longitude;
		document.getElementById("locationBasedDarkness").checked = as.locationBased ? true : false;
	}
});

// add the svg radial definitions
td.f.checkSVG = function(){
	if (!document.getElementById("goldRadial") && document.getElementsByClassName("_2xGPj").length > 0){
		document.getElementsByClassName("_2xGPj")[0].getElementsByTagName("defs")[0].innerHTML += '<radialGradient id="goldRadial" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="rgb(255,176,84)"></stop><stop offset="80%" stop-color="rgb(255,176,84)"></stop><stop offset="85%" stop-color="rgb(50,50,50)"></stop><stop offset="95%" stop-color="rgb(50,50,50)"></stop><stop offset="100%" stop-color="rgb(255,176,84)"></stop></radialGradient><radialGradient id="grayRadial" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="rgb(75,75,75)"></stop><stop offset="90%" stop-color="rgb(75,75,75)"></stop><stop offset="100%" stop-color="rgb(90,90,90)"></stop></radialGradient>';
	};
};

// loop
function loopfunctions(){
	td.now = new Date().getTime();
	td.f.checkSVG();
	
	// remove
	//toLast();
	
	var pophidden = document.getElementById("TDpop").className == "hideEle";
	td.popchange = pophidden != td.pophidden;
	td.popchange && (recalcobj());
	if ((td.doadjust && pophidden) || td.popchange){
		td.currentratio = lightTransition();
	};
	td.pophidden = document.getElementById("TDpop").className == "hideEle";
	setTimeout(function(){
		loopfunctions();
	}, 1000);
};

// set the darkRatio by the moment of the day
function calcbrightness(){
	if (!td.doadjust){
		darkRatio = 0;
	} else if (td.now > td.sunposition.sunriseEnd && td.now < td.sunposition.startearlier){
		darkRatio = 0;
	} else if (td.now > td.sunposition.dusk || td.now < td.sunposition.dawn){
		darkRatio = 1;
	} else if (td.now > td.sunposition.startearlier && td.now < td.sunposition.dusk){
		darkRatio = 1 - td.f.calclightratio(td.transitionprogress(td.sunposition.dusk, td.sunposition.startearlier));
	} else if (td.now > td.sunposition.dawn && td.now < td.sunposition.sunriseEnd){
		darkRatio = td.f.calclightratio(td.transitionprogress(td.sunposition.sunriseEnd, td.sunposition.dawn));
	};
	return darkRatio;
};

// apply ratio
function lightTransition(){
	var darkRatio = calcbrightness();
	if (darkRatio != td.currentratio || td.popchange){
		var newAdj = (td.overlayopacity.day + ((td.settings.old.scale * darkRatio) / 100));
		if (newAdj > 0.7) newAdj = 0.7;
		td.f.setoverlayopacity(newAdj);
		if (td.countr++ == 60){
			console.log("Adjusting brightness, " + (darkRatio * 10000) / 100 + " % of extra dynamic darkening applied.");
			td.countr = 0;
		};
	};
	return darkRatio;
};

// keep style last
function toLast(){
	if (document.head.childNodes[document.head.childElementCount - 1].id != "TrueDarkStyle"){
		try {
			document.head.appendChild(document.getElementById("TrueDarkStyle"));
			console.log("Loaded TrueDark theme last");
		} catch(err) {
			console.log("Failed to load TrueDark theme last");
		};
	}
};

// #############################################################
// #############################################################
// #############################################################
// #############################################################
// #############################################################

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

// #############################################################
// #############################################################
// #############################################################
readFirst();
td.f.applySettings();









chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    console.log("Updated settings received");
	console.log(request.data);
    var data = request.data || {};
    sendResponse({data: data, success: true});
});












