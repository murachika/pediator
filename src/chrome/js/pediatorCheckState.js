function pediatorCheckState() {
	// トップページがフレームセットじゃない場合
	if ( document.getElementsByTagName('frameset').length == 0 ) {
		var pediatorMenu = document.getElementById("jp-irts-pediator-menu");
		if ( pediatorMenu ){
			chrome.extension.sendRequest("pediator_on");
		} else {
			chrome.extension.sendRequest("pediator_off");
		}

	// トップページがフレームセットの場合
	} else {
		var pediatorMenu = document.getElementById('jp-irts-pediator-frameset-menu');
		if ( pediatorMenu ){
			chrome.extension.sendRequest("pediator_on");
		} else {
			chrome.extension.sendRequest("pediator_off");
		}
	}
};

pediatorCheckState();
