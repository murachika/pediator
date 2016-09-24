if ("undefined" == typeof(pediatorMenuController)) {
	var pediatorMenuController = {};
};

pediatorMenuController = {

	timer             : 0,
	pediatorMenuState : "close",
	setPosition       : function () {
		var scrollheight = top.document.body.scrollTop + 5;
		var pediatorMenu = top.document.getElementById("jp-irts-pediator-menu");
		pediatorMenu.style.top = scrollheight + "px";

		var currentStyle = getComputedStyle(pediatorMenu, '');
		var menuwidth    = currentStyle.width;
		menuwidth = parseInt(menuwidth.replace(/px/g, ""));
		if ( pediatorMenuController.pediatorMenuState == "opened" ) {
			var pediatorMenuWidth;
			if ( window.innerWidth ) {
				pediatorMenuWidth = window.innerWidth;
			} else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
				pediatorMenuWidth = document.documentElement.clientWidth;
			} else if ( document.body ) {
				pediatorMenuWidth = document.body.clientWidth;
			}
			pediatorMenuWidth = Math.floor(pediatorMenuWidth * pediatorSettings.pediator_menu_width - 23);
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
	},

	ScrollPediatorMenu : function (from,to,flag){

	// 初回のみメニューバーがクリックされた時点で ページ読み込み
		if ( document.getElementById("jp-irts-pediator-iframe-contents").src == "" ) {
			document.getElementById("jp-irts-pediator-iframe-contents").src = pediatorSettings.pediator_url;
		}

	//二次関数グラフのスピードでメニューをスクロール
	// from は x、to は width
	// メニュークローズ時（y = 1/2 x^2 + 20 のグラフに沿って width が変化）
	//    width = Math.pow(x, 2) / 2 + 20
	//    x = Math.sqrt(2(width - 20))
	//    x を 0 に近付けて行く。x = 0 の時、y = 20
	// メニューオープン時
	//    メニュークローズ時のグラフを逆（マイナス）にして、
	//    y方向に iframewidth、x方向に Math.sqrt(2(iframewidth - 20)) 移動したもの
	//    width = -( Math.pow(x - Math.sqrt(2(iframewidth - 20)), 2) / 2 ) + iframewidth
	//    x を 0 から、y が width になるまで増やしていく
		var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
		var currentStyle = getComputedStyle(pediatorMenu, '');
		var menuwidth    = currentStyle.width;
		menuwidth = parseInt(menuwidth.replace(/px/g, ""));
		var iframewidth = Math.floor(window.innerWidth * pediatorSettings.pediator_menu_width - 23);
		var pediatormenustlye = pediatorMenu.style;
		if ( ( from != null ) || ( to != null ) ) {
			if ( (to == 20) && (from >= 0) ){
				// Close start
				pediatorMenuController.pediatorMenuState = "close";
				from--;
				var width = Math.floor(Math.pow(from, 2) / 2  + 20);
				pediatormenustlye.width = width + "px";
				pediatorMenuController.timer = setTimeout("pediatorMenuController.ScrollPediatorMenu(" + from + "," + to + ",'" + flag + "')",20);
			} else if ( (to == 20) && (from < 0) ){
				// Close end
				clearTimeout(pediatorMenuController.timer);
				document.getElementById("jp-irts-pediator-menu-img").style.backgroundImage="url('" + pediatorSettings.imgURLopen + "')";
				if ( flag == "close" ) {
					pediatorMenuController.HidePediatorMenu();
				}
			} else if ( (to > 20) && (menuwidth < to) ){
				// Open start
				from++;
				var width = -( Math.floor( Math.pow(from - Math.sqrt(2 * (iframewidth - 20) ), 2) / 2 )) + iframewidth;
				pediatormenustlye.width = width + "px";
				pediatorMenuController.timer = setTimeout("pediatorMenuController.ScrollPediatorMenu(" + from + "," + iframewidth + ")",20);
			} else if ( (to > 20) && (menuwidth >= to) ) {
				// Open end
				clearTimeout(pediatorMenuController.timer);
				pediatorMenuController.pediatorMenuState = "opened";
				document.getElementById("jp-irts-pediator-menu-img").style.backgroundImage="url('" + pediatorSettings.imgURLclose + "')";
			}
		} else {
			// AnimatePediatorMenu init
			if ( menuwidth > 20 ) {
				// close
				var x = Math.floor(Math.sqrt(2 * (menuwidth - 20)));
				pediatorMenuController.ScrollPediatorMenu(x,20,flag);
			} else {
				// open
				var x = 0;
				document.getElementById("jp-irts-pediator-menu-iframe").style.width = iframewidth - 23 + "px";
				pediatorMenuController.ScrollPediatorMenu(x,iframewidth);
			}
		}
	},

	timerId          : 0,
	ShowPediatorMenu : function (open) {
		var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
		var currentStyle = getComputedStyle(pediatorMenu, '');
		var menuwidth    = currentStyle.width;
		menuwidth = parseInt(menuwidth.replace(/px/g, ""));

		if ( currentStyle.visibility == "hidden" ) {
			pediatorMenu.style.width = "0px";
			pediatorMenu.style.visibility = 'visible';
		}
		if ( open && (menuwidth == 20) ) {
			pediatorMenuController.ScrollPediatorMenu(null,null);
		}
		if ( menuwidth < 20 ) {
			menuwidth++;
			pediatorMenu.style.width = menuwidth + "px";
			pediatorMenuController.timerId = setTimeout(pediatorMenuController.ShowPediatorMenu,10);
		} else if ( menuwidth >= 20 ) {
			clearTimeout(pediatorMenuController.timerId);
		}
	},
	HidePediatorMenu : function () {
		var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
		var currentStyle = getComputedStyle(pediatorMenu, '');
		var menuwidth    = currentStyle.width;
		menuwidth = parseInt(menuwidth.replace(/px/g, ""));
		if ( menuwidth > 20 ) {
			pediatorMenuController.ScrollPediatorMenu(null,null,"close");
		} else if ( (menuwidth <= 20) && ( menuwidth > 0 ) ) {
			menuwidth--;
			pediatorMenu.style.width = menuwidth + "px";
			pediatorMenuController.timerId = setTimeout(pediatorMenuController.HidePediatorMenu,20);
		} else if ( menuwidth <= 0 ) {
			clearTimeout(pediatorMenuController.timerId);
			document.getElementById('jp-irts-pediator-menu').style.visibility = 'hidden';
		}
	},


	// ここから下はフレームセット用
	timer_frame_frame         : 0,
	pediatorMenuFramesetState : "close",
	// フレームセット用 width 調整
	setPositionFrameset       : function () {
		var pediatorMenuFrame = document.getElementById("jp-irts-pediator-frameset");
		if ( pediatorMenuController.pediatorMenuFramesetState == "opened" ) {
			var pediatorMenuWidth;
			if ( window.innerWidth ) {
				pediatorMenuWidth = window.innerWidth;
			} else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
				pediatorMenuWidth = document.documentElement.clientWidth;
			} else if ( document.body ) {
				pediatorMenuWidth = document.body.clientWidth;
			}
			pediatorMenuWidth = Math.floor(pediatorMenuWidth * pediatorSettings.pediator_menu_width - 23);
			pediatorMenuFrame.cols = "*," + pediatorMenuWidth + "px";
			document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-frameset").style.width = pediatorMenuWidth + "px";
			document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-iframe-frameset").style.width = pediatorMenuWidth - 23 + "px";
		}
	},

	ScrollPediatorMenuFrameset : function (from,to,flag){
		if ( document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-iframe-contents-frameset").src == "" ) {
			document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-iframe-contents-frameset").src = pediatorSettings.pediator_url;
		}
		var pediatorMenuFrame = document.getElementById("jp-irts-pediator-frameset");
		var menuwidth    = pediatorMenuFrame.cols;
		menuwidth = parseInt(menuwidth.replace(/\*,/g, ""));
		var iframewidth = Math.floor(window.innerWidth * pediatorSettings.pediator_menu_width - 23);
		if ( ( from != null ) || ( to != null ) ) {
			if ( (to == 20) && (from >= 0) ){
				// Close start
				pediatorMenuController.pediatorMenuFramesetState = "close";
				from--;
				var width = Math.floor(Math.pow(from, 2) / 2  + 20);
				pediatorMenuFrame.cols = "*," + width + "px";
				document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-frameset").style.width = width + "px";
				timer_frame = setTimeout("pediatorMenuController.ScrollPediatorMenuFrameset(" + from + "," + to + ",'" + flag + "')",20);
			} else if ( (to == 20) && (from < 0) ){
				// Close end
				clearTimeout(timer_frame);
				document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-img-frameset").style.backgroundImage="url('" + pediatorSettings.imgURLopen + "')";
				if ( flag == "close" ) {
					pediatorMenuController.HidePediatorMenuFrameset();
				}
			} else if ( (to > 20) && (menuwidth < to) ){
				// Open start
				from++;
				var width = -( Math.floor( Math.pow(from - Math.sqrt(2 * (iframewidth - 20) ), 2) / 2 )) + iframewidth;
				pediatorMenuFrame.cols = "*," + width + "px";
				document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-frameset").style.width = width + "px";
				document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-iframe-frameset").style.width = iframewidth - 23 + "px";
				timer_frame = setTimeout("pediatorMenuController.ScrollPediatorMenuFrameset(" + from + "," + iframewidth + ")",20);
			} else if ( (to > 20) && (menuwidth >= to) ) {
				// Open end
				clearTimeout(timer_frame);
				pediatorMenuController.pediatorMenuFramesetState = "opened";
				document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-img-frameset").style.backgroundImage="url('" + pediatorSettings.imgURLclose + "')";
			}
		} else {
			// AnimatePediatorMenu init
			if ( menuwidth > 20 ) {
				// close
				var x = Math.floor(Math.sqrt(2 * (menuwidth - 20)));
				pediatorMenuController.ScrollPediatorMenuFrameset(x,20,flag);
			} else {
				// open
				var x = 0;
				pediatorMenuController.ScrollPediatorMenuFrameset(x,iframewidth);
			}
		}
	},

	timerId_frame            : 0,
	ShowPediatorMenuFrameset : function (open) {
		var pediatorMenuFrame = document.getElementById("jp-irts-pediator-frameset");
		var pediatorFrameMenu = document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-frameset");
		var currentStyle = getComputedStyle(pediatorFrameMenu, '');
		var menuwidth    = pediatorMenuFrame.cols;
		menuwidth = parseInt(menuwidth.replace(/\*,/g, ""));
		if ( currentStyle.visibility == "hidden" ) {
			pediatorFrameMenu.style.width = "20px";
			pediatorFrameMenu.style.visibility = 'visible';
		}
		if ( open && (menuwidth == 20) ) {
			pediatorMenuController.ScrollPediatorMenuFrameset(null,null);
		}
		if ( menuwidth < 20 ) {
			menuwidth++;
			pediatorMenuFrame.cols = "*," + menuwidth + "px";
			pediatorMenuController.timerId_frame = setTimeout(pediatorMenuController.ShowPediatorMenuFrameset,10);
		} else if ( menuwidth >= 20 ) {
			clearTimeout(pediatorMenuController.timerId_frame);
		}
	},
	HidePediatorMenuFrameset : function () {
		var pediatorMenuFrame = document.getElementById("jp-irts-pediator-frameset");
		var pediatorFrameMenu = document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-menu-frameset");
		var menuwidth    = pediatorMenuFrame.cols;
		menuwidth = parseInt(menuwidth.replace(/\*,/g, ""));
		if ( menuwidth > 20 ) {
			pediatorMenuController.ScrollPediatorMenuFrameset(null,null,"close");
		} else if ( (menuwidth <= 20) && ( menuwidth > 0 ) ) {
			menuwidth--;
			pediatorMenuFrame.cols = "*," + menuwidth + "px";
			pediatorMenuController.timerId_frame = setTimeout(pediatorMenuController.HidePediatorMenuFrameset,20);
		} else if ( menuwidth <= 0 ) {
			clearTimeout(pediatorMenuController.timerId_frame);
			pediatorFrameMenu.style.visibility = 'hidden';
		}
	},

}