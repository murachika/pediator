// デフォルト設定
if ( !localStorage["pediator-mode"] || !localStorage["pediator-dic"] || !localStorage["pediator-segment"] || !localStorage["pediator-show"] ){
	localStorage["pediator-mode"]    = "manual";
	localStorage["pediator-dic"]     = "wikipedia";
	localStorage["pediator-segment"] = "8";
	localStorage["pediator-show"]    = "iframe";
}

var pediator_icon_on;
var pediator_icon_off;
var pediator_url;
// 設定により各種パラメータ変更
if (localStorage["pediator-dic"] == "wikipedia") {
	pediator_url      = "http:\/\/ja.wikipedia.org\/wiki\/";
	pediator_icon_on  = "img/pediatorWon19.png";
	pediator_icon_off = "img/pediatorWoff19.png";
} else if (localStorage["pediator-dic"] == "uncycropedia"){
	pediator_url      = "http:\/\/ja.uncyclopedia.info\/wiki\/";
	pediator_icon_on  = "img/pediatorUon19.png";
	pediator_icon_off = "img/pediatorUoff19.png";
}

// モードによってアイコンの文字を変更
var pediator_status = {};
if (localStorage["pediator-mode"] == "auto") {
	chrome.browserAction.setBadgeText({text:"auto"});
	chrome.browserAction.setIcon({path:pediator_icon_on});
	chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 200]});
	pediator_status = {
		pediator_automode_status : "on",
		pediator_page_status     : "on"
	};
} else if (localStorage["pediator-mode"] == "manual"){
	chrome.browserAction.setBadgeText({text:""});
	pediator_status = {
		pediator_automode_status : "off",
		pediator_page_status     : "off"
	};
}

var currentTab;
// アイコンボタンをクリックした時
chrome.browserAction.onClicked.addListener(function(tab) {

	if ( pediator_status.pediator_page_status == "off" ) {
		// 拡張機能ページ、オプションページ以外（URLがchromeから始まるページは除外）
		chrome.tabs.query({active: true},
			function(current) {
				// search は文頭からマッチすると 0（偽）を返す。無かったら -1（真）
				if ( !current[0].url.search(/^chrome/) ) {
					alert("特殊ページでは動作しません");
				} else if ( !current[0].url.search(/^https\:\/\/chrome\.google\.com/) ) {
					alert("Chromeウェブストアでは動作しません");
				} else {
					chrome.browserAction.setIcon({path:pediator_icon_on});
					chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 200]});
					pediator_status.pediator_page_status     = "on";
					pediator_status.pediator_automode_status = "on";
					chrome.tabs.executeScript(null, {code: "pediatorInsert.insertMenu()",allFrames: false});
					chrome.tabs.executeScript(null, {file: "js/pediatorStart.js",allFrames: true});
				}
			}
		);
	} else if ( pediator_status.pediator_page_status == "on" ) {
		chrome.tabs.executeScript(null, {file: "js/pediatorOff.js",allFrames: true});
		chrome.browserAction.setIcon({path:pediator_icon_off});
		chrome.browserAction.setBadgeBackgroundColor({color:[200, 0, 0, 50]});
		pediator_status.pediator_page_status     = "off";
		pediator_status.pediator_automode_status = "off";
	}
});

// コンテントスクリプトからメッセージを受け取った時
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if ( request == "pediator_on" ) {
			chrome.browserAction.setIcon({path:pediator_icon_on});
			chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 200]});
			pediator_status.pediator_page_status = "on";
		} else if ( request == "pediator_off" ) {
			chrome.browserAction.setIcon({path:pediator_icon_off});
			chrome.browserAction.setBadgeBackgroundColor({color:[200, 0, 0, 50]});
			pediator_status.pediator_page_status = "off";
		} else if ( request == "current_pediator_status" ) {
			if ( sender.tab.id == currentTab.id ) {
				sendResponse(pediator_status);
			}
		} else if ( request == "LoadPediatorSettings" ) {
			sendResponse( {
				"pediator-mode"    : localStorage["pediator-mode"],
				"pediator-dic"     : localStorage["pediator-dic"],
				"pediator-segment" : localStorage["pediator-segment"],
				"pediator-show"    : localStorage["pediator-show"]
			} );
		} else {
			if ( localStorage["pediator-show"] == "iframe" ) {
				sendResponse("iframe");
			} else {
				var url = pediator_url + request;
				chrome.tabs.create({"url":url, "selected":true });
			}
		}
	}
);

// 違うタブを選択した時、あるいは新しいタブを開いた時
chrome.tabs.onSelectionChanged.addListener(
	function() {

		chrome.tabs.query({active: true},
			function(current) {
				currentTab = current[0];
			}
		);

		// 設定により各種パラメータ変更
		if (localStorage["pediator-dic"] == "wikipedia") {
			pediator_url      = "http:\/\/ja.wikipedia.org\/wiki\/";
			pediator_icon_on  = "img/pediatorWon19.png";
			pediator_icon_off = "img/pediatorWoff19.png";
		} else if (localStorage["pediator-dic"] == "uncycropedia"){
			pediator_url      = "http:\/\/ja.uncyclopedia.info\/wiki\/";
			pediator_icon_on  = "img/pediatorUon19.png";
			pediator_icon_off = "img/pediatorUoff19.png";
		}
		
		// 拡張機能ページ、オプションページ以外（URLがchromeから始まるページは除外）、Chromeウェブストア以外
		chrome.tabs.query({active: true},
			function(current) {
				// search は文頭からマッチすると 0（偽）を返す。無かったら -1（真）
				if ( current[0].url.search(/^chrome/) && current[0].url.search(/^https\:\/\/chrome\.google\.com/) ) {
					chrome.tabs.executeScript(null, {file: "js/pediatorCheckState.js",allFrames: false});
					if (localStorage["pediator-mode"] == "auto") {
						pediatorAutoMode("onSelectionChanged");
					}
				} else {
					chrome.browserAction.setIcon({path:pediator_icon_off});
					chrome.browserAction.setBadgeBackgroundColor({color:[200, 0, 0, 50]});
					pediator_status.pediator_page_status = "off";
				}
			}
		);
	}
);

// タブが更新された時
chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tab) {
		pediator_status.pediator_page_status = "off";
		// 設定により各種パラメータ変更
		if (localStorage["pediator-dic"] == "wikipedia") {
			pediator_url      = "http:\/\/ja.wikipedia.org\/wiki\/";
			pediator_icon_on  = "img/pediatorWon19.png";
			pediator_icon_off = "img/pediatorWoff19.png";
		} else if (localStorage["pediator-dic"] == "uncycropedia"){
			pediator_url      = "http:\/\/ja.uncyclopedia.info\/wiki\/";
			pediator_icon_on  = "img/pediatorUon19.png";
			pediator_icon_off = "img/pediatorUoff19.png";
		}
		
		// 拡張機能ページ、オプションページ以外（URLがchromeから始まるページは除外）、Chromeウェブストア以外
		chrome.tabs.query({active: true},
			function(current) {
				if ( current[0].url.search(/^chrome/) && current[0].url.search(/^https\:\/\/chrome\.google\.com/) ) {
					chrome.tabs.executeScript(null, {file: "js/pediatorCheckState.js",allFrames: false});
					if ( changeInfo.status == "complete" ) {
						if (localStorage["pediator-mode"] == "auto") {
							pediatorAutoMode("onUpdated");
						}
					}
				} else {
					chrome.browserAction.setIcon({path:pediator_icon_off});
					chrome.browserAction.setBadgeBackgroundColor({color:[200, 0, 0, 50]});
					pediator_status.pediator_page_status = "off";
				}
			}
		);
	}
);

// automode用
function pediatorAutoMode(callfrom){
	chrome.tabs.executeScript(null, {file: "js/pediatorCheckState.js",allFrames: false}, function () {
		if ( pediator_status.pediator_page_status == "off" && pediator_status.pediator_automode_status == "on" ) {
			chrome.browserAction.setIcon({path:pediator_icon_on});
			chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 200]});
			pediator_status.pediator_page_status = "on";
			chrome.tabs.executeScript(null, {code: "pediatorInsert.insertMenu()",allFrames: false});
			chrome.tabs.executeScript(null, {file: "js/pediatorStart.js",allFrames: true});
		}
	});
};

