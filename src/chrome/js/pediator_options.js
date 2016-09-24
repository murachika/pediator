// EventListener
window.addEventListener("load", restore_options);
window.addEventListener("resize", setPosition);
window.addEventListener("scroll", setPosition);

document.getElementById("savebutton").addEventListener("click", save_options);

document.getElementById("changeImage-wiki").addEventListener("click", function(){changeImage('wikipedia')});
document.getElementById("changeImage-uncycro").addEventListener("click", function(){changeImage('uncycropedia')});

document.getElementById("pediator_demo-short").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-short"))});
document.getElementById("pediator_demo-short-dot").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-short-dot"))});
document.getElementById("pediator_demo-short-fields").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-short-fields"))});
document.getElementById("pediator_demo-short-dot2").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-short-dot2"))});
document.getElementById("pediator_demo-short-forever").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-short-forever"))});
document.getElementById("pediator_demo-std").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-std"))});
document.getElementById("pediator_demo-std-dot").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-std-dot"))});
document.getElementById("pediator_demo-std-forever").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-std-forever"))});
document.getElementById("pediator_demo-long").addEventListener("click", function(){pediator_demo(document.getElementById("pediator_demo-long"))});

document.getElementById("pediator-show-iframe").addEventListener("click", function(){ShowPediatorMenu();ScrollPediatorMenu(null,null)});
document.getElementById("pediator-show-window").addEventListener("click", HidePediatorMenu);

document.getElementById("jp-irts-pediator-menu-img").addEventListener("click", function(){ScrollPediatorMenu(null,null)});

document.getElementById("jp-irts-pediator-menu-iframe-img").addEventListener("click", function(){ScrollPediatorMenu(null,null)});

document.getElementById("jp-irts-pediator-menu-iframe-img-back").addEventListener("click", function(){history.back()});
document.getElementById("jp-irts-pediator-menu-iframe-img-forward").addEventListener("click", function(){history.forward()});

// Saves options to localStorage.
function save_options() {
	var mode = document.getElementsByName("pediator-mode");
	for ( var i = 0; i < mode.length; i++) {
		if ( mode[i].checked ) {
			localStorage["pediator-mode"] = mode[i].value;
		}
	}
	var dic = document.getElementsByName("pediator-dic");
	for ( var i = 0; i < dic.length; i++) {
		if ( dic[i].checked ) {
			localStorage["pediator-dic"] = dic[i].value;
		}
	}
	var segment = document.getElementsByName("pediator-segment");
	for ( var i = 0; i < segment.length; i++) {
		if ( segment[i].checked ) {
			localStorage["pediator-segment"] = segment[i].value;
		}
	}
	var show = document.getElementsByName("pediator-show");
	for ( var i = 0; i < show.length; i++) {
		if ( show[i].checked ) {
			localStorage["pediator-show"] = show[i].value;
		}
	}
	if (localStorage["pediator-mode"] == "auto") {
		chrome.browserAction.setBadgeText({text:"auto"});
		chrome.browserAction.setBadgeBackgroundColor({color:[200, 0, 0, 50]});
	} else if (localStorage["pediator-mode"] == "manual"){
		chrome.browserAction.setBadgeText({text:""});
	}
	chrome.tabs.executeScript(null, {file: "js/pediatorSettings.js"});
	alert("設定を保存しました。");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var modevalue = localStorage["pediator-mode"];
	if (modevalue) {
		var mode = document.getElementsByName("pediator-mode");
		for (var i = 0; i < mode.length; i++) {
			if (mode[i].value == modevalue) {
				mode[i].checked = "true";
				break;
			}
	}	
	} else {
		return;
	}
	var dicvalue = localStorage["pediator-dic"];
	if (dicvalue) {
		var dic = document.getElementsByName("pediator-dic");
		for (var i = 0; i < dic.length; i++) {
			if (dic[i].value == dicvalue) {
				dic[i].checked = "true";
				break;
			}
		changeImage(dicvalue);
	}	
	} else {
		return;
	}
	var segmentvalue = localStorage["pediator-segment"];
	if (segmentvalue) {
		var segment = document.getElementsByName("pediator-segment");
		for (var i = 0; i < segment.length; i++) {
			if (segment[i].value == segmentvalue) {
				segment[i].checked = "true";
				break;
			}
	}	
	} else {
		return;
	}
	var showvalue = localStorage["pediator-show"];
	if (showvalue) {
		var show = document.getElementsByName("pediator-show");
		for (var i = 0; i < mode.length; i++) {
			if (show[i].value == showvalue) {
				show[i].checked = "true";
				break;
			}
	}	
	} else {
		return;
	}
}

var timer;
var pediatorMenuState = "close";
function ScrollPediatorMenu(from,to,flag){
	setPosition();
	var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
	var currentStyle = getComputedStyle(pediatorMenu, '');
	var menuwidth    = currentStyle.width;
	menuwidth = parseInt(menuwidth.replace(/px/g, ""));
	var iframewidth = Math.floor(window.innerWidth * 0.4 - 23);
	var pediatormenustlye = pediatorMenu.style;
	if ( ( from != null ) || ( to != null ) ) {
		if ( (to == 20) && (from >= 0) ){
			pediatorMenuState = "close";
			from--;
			var width = Math.floor(Math.pow(from, 2) / 2  + 20);
			pediatormenustlye.width = width + "px";
			var timer = setTimeout(function(){ScrollPediatorMenu(from, to, flag)},20);
		} else if ( (to == 20) && (from < 0) ){
			clearTimeout(timer);
			document.getElementById("jp-irts-pediator-menu-img").style.backgroundImage="url(img/pediator_menubar_open.png)";
			if ( flag == "close" ) {
				HidePediatorMenu();
			}
		} else if ( (to > 20) && (menuwidth < to) ){
			from++;
			var width = -( Math.floor( Math.pow(from - Math.sqrt(2 * (iframewidth - 20) ), 2) / 2 )) + iframewidth;
			pediatormenustlye.width = width + "px";
			var timer = setTimeout(function(){ScrollPediatorMenu(from, iframewidth)},20);
		} else if ( (to > 20) && (menuwidth >= to) ) {
			clearTimeout(timer);
			pediatorMenuState = "opened";
			document.getElementById("jp-irts-pediator-menu-img").style.backgroundImage="url(img/pediator_menubar_close.png)";
		}
	} else {
		if ( menuwidth > 20 ) {
			var x = Math.floor(Math.sqrt(2 * (menuwidth - 20)));
			ScrollPediatorMenu(x,20,flag);
		} else {
			var x = 0;
			document.getElementById("jp-irts-pediator-menu-iframe").style.width = iframewidth - 23 + "px";
			ScrollPediatorMenu(x,iframewidth);
		}
	}
}

var timerId;
function ShowPediatorMenu(open) {
	var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
	var currentStyle = getComputedStyle(pediatorMenu, '');
	var menuwidth    = currentStyle.width;
	menuwidth = parseInt(menuwidth.replace(/px/g, ""));
	if ( document.getElementById("jp-irts-pediator-iframe-contents").src == "" ) {
		document.getElementById("jp-irts-pediator-iframe-contents").src = "http://ja.m.wikipedia.org/";
	}
	if ( currentStyle.visibility == "hidden" ) {
		pediatorMenu.style.width = "0px";
		pediatorMenu.style.visibility = 'visible';
	}
	if ( open && (menuwidth == 20) ) {
		ScrollPediatorMenu(null,null);
	}
	if ( menuwidth < 20 ) {
		menuwidth++;
		pediatorMenu.style.width = menuwidth + "px";
		timerId = setTimeout(ShowPediatorMenu,10);
	} else if ( menuwidth >= 20 ) {
		clearTimeout(timerId);
	}
}

function HidePediatorMenu() {
	var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
	var currentStyle = getComputedStyle(pediatorMenu, '');
	var menuwidth    = currentStyle.width;
	menuwidth = parseInt(menuwidth.replace(/px/g, ""));
	if ( menuwidth > 20 ) {
		ScrollPediatorMenu(null,null,"close");
	} else if ( (menuwidth <= 20) && ( menuwidth > 0 ) ) {
		menuwidth--;
		pediatorMenu.style.width = menuwidth + "px";
		timerId = setTimeout(HidePediatorMenu,20);
	} else if ( menuwidth <= 0 ) {
		clearTimeout(timerId);
		pediatorMenu.style.visibility = 'hidden';
	}
}

function pediator_demo(obj) {
	var encstr = encodeURI(obj.innerHTML);
	encstr = encstr.replace(/\'/g, "%27");
	var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
	var currentStyle = getComputedStyle(pediatorMenu, '');
	var menuwidth    = currentStyle.width;
	menuwidth = parseInt(menuwidth.replace(/px/g, ""));
	if ( document.getElementsByName("pediator-show")[0].checked ) {
		var url = "http:\/\/ja.m.wikipedia.org\/wiki\/" + encstr;
		if ( currentStyle.visibility == "hidden" ) {
			ShowPediatorMenu();
			ScrollPediatorMenu(null,null);
		} else if ( menuwidth == 20 ) {
			ScrollPediatorMenu(null,null);
		}
		document.getElementById("demotext").value = url;
		document.getElementById("jp-irts-pediator-iframe-contents").src = url;
	} else {
		var url = "http:\/\/ja.wikipedia.org\/wiki\/" + encstr;
		document.getElementById("demotext").value = url;
		window.open(url,null);
	}
}

function setPosition() {
	var scrollheight = document.body.scrollTop + 5;
	var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
	pediatorMenu.style.top = scrollheight + "px";

	var currentStyle = getComputedStyle(pediatorMenu, '');
	var menuwidth    = currentStyle.width;
	menuwidth = parseInt(menuwidth.replace(/px/g, ""));
	if ( pediatorMenuState == "opened" ) {
		var pediatorMenuWidth;
		if ( window.innerWidth ) {
			pediatorMenuWidth = window.innerWidth;
		} else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
			pediatorMenuWidth = document.documentElement.clientWidth;
		} else if ( document.body ) {
			pediatorMenuWidth = document.body.clientWidth;
		}
		pediatorMenuWidth = Math.floor(pediatorMenuWidth * 0.4 - 23);
		pediatorMenu.style.width = pediatorMenuWidth + "px";
		document.getElementById("jp-irts-pediator-menu-iframe").style.width = pediatorMenuWidth - 23 + "px";
	}

	var pediatorMenuHeight;
	if ( window.innerHeight ) {  
		pediatorMenuHeight = window.innerHeight;
	} else if ( document.documentElement && document.documentElement.clientHeight != 0 ) {
		pediatorMenuHeight =  document.documentElement.clientHeight;
	} else if ( document.body ) {  
		pediatorMenuHeight =  document.body.clientHeight;
	}
	pediatorMenuHeight = Math.floor(pediatorMenuHeight * 0.99);
	pediatorMenu.style.height = pediatorMenuHeight + "px";
}

function changeImage(dic) {
	if ( dic == "wikipedia" ) {
		document.getElementById("pediatorWon128").src = "img/pediatorWon128.png";
		document.getElementById("pediatorWon24").src  = "img/pediatorWon24.png";
		chrome.browserAction.setIcon({path:"img/pediatorWoff19.png"});
	} else if ( dic == "uncycropedia" ) {
		document.getElementById("pediatorWon128").src = "img/pediatorUon128.png";
		document.getElementById("pediatorWon24").src  = "img/pediatorUon24.png";
		chrome.browserAction.setIcon({path:"img/pediatorUoff19.png"});
	}
}

function openFromPediatorMenu() {
	if ( document.getElementById("jp-irts-pediator-iframe-contents").src != "" ) {
		var url = document.getElementById("demotext").value;
		url = url.replace(/ja\.m\.wikipedia\.org/, "ja.wikipedia.org");
		window.open(url,null);
	}
}

