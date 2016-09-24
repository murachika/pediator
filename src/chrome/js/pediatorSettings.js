if ("undefined" == typeof(pediatorSettings)) {
	var pediatorSettings = {};
};

pediatorSettings = {

	elements            : 0,
	bitvector           : 0,
	hashfunctions       : 0,
	bloomfilter         : "",
	pediator_url        : "",
	pediator_menu_width : 0,
	pediator_option     : {},

	// 各種イメージURL
	//PediatorOn.js
	pediatorProgressImg : chrome.extension.getURL("img/loading.gif"),
	pediatorWorkingImg  : chrome.extension.getURL("img/pediatorworking.png"),
	pediatorPercentImg  : chrome.extension.getURL("img/pediatorpercent.png"),
	pediatorCloseImg    : chrome.extension.getURL("img/pediatorClose16.png"),
	//PediatorMenuController.js
	imgURLopen          : chrome.extension.getURL("../img/pediator_menubar_open.png"),
	imgURLclose         : chrome.extension.getURL("../img/pediator_menubar_close.png"),
	//PediatorInsert.js
	BackimgURL          : chrome.extension.getURL("img/pediatorBackOn24.png"),
	ForwardimgURL       : chrome.extension.getURL("img/pediatorForwardOn24.png"),
	CloseimgURL         : chrome.extension.getURL("img/pediatorClose24.png"),
	MenuimgURL          : chrome.extension.getURL("img/pediator_menubar_open.png"),
	PediatorCSS         : chrome.extension.getURL("css/pediator.css"),
	pediatorProgressImg : chrome.extension.getURL("img/loading.gif"),

	setPediatorSettings : function () {
		chrome.extension.sendRequest("LoadPediatorSettings", function (response) {
			pediatorSettings.pediator_option["pediator-mode"]    = response["pediator-mode"];
			pediatorSettings.pediator_option["pediator-dic"]     = response["pediator-dic"];
			pediatorSettings.pediator_option["pediator-segment"] = response["pediator-segment"];
			pediatorSettings.pediator_option["pediator-show"]    = response["pediator-show"];

			// 用意するhash関数の数（都合上 hashfunctionsの最大数は16）
			pediatorSettings.hashfunctions           = 15;

			// 設定により各種パラメータ変更
			if ( pediatorSettings.pediator_option["pediator-dic"] == "wikipedia" ) {
				// wikipedia項目数
				pediatorSettings.elements            = 1231017;
				// 用意するビット数（24の倍数）
				pediatorSettings.bitvector           = 29544408;
				pediatorSettings.bloomfilter         = wikipediaBF;
//				pediatorSettings.pediator_menu_width = 0.45;
//				pediatorSettings.pediator_url        = "http:\/\/ja.m.wikipedia.org\/wiki\/";
				pediatorSettings.pediator_menu_width = 0.8;
				pediatorSettings.pediator_url        = "http:\/\/ja.wikipedia.org\/wiki\/";
			} else if ( pediatorSettings.pediator_option["pediator-dic"] == "uncycropedia" ) {
				// uncycropedia項目数
				pediatorSettings.elements            = 22435;
				pediatorSettings.bitvector           = 538440;
				pediatorSettings.bloomfilter         = uncyclopediaBF;
				pediatorSettings.pediator_menu_width = 0.8;
				pediatorSettings.pediator_url        = "http:\/\/ja.uncyclopedia.info\/wiki\/";
			}
		});
	},

}

pediatorSettings.setPediatorSettings();

