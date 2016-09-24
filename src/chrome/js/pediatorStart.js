function startPediator() {
	var pediatorMenu      = document.getElementById("jp-irts-pediator-menu");
	var pediatorMenuFrame = document.getElementById('jp-irts-pediator-frameset-menu');

	chrome.extension.sendRequest("current_pediator_status", function (response) {
		// pediator ボタンが押されている時、かつ pediatorメニュー内じゃない時
		if ( response.pediator_page_status == "on" && window.name != "jp-irts-pediator-iframe" ) {
			// トップページがフレームセットじゃない場合
			if ( pediatorMenu ){
				pediatorOn.PediatorAnalyze();
				pediatorOn.ShowProgressMenu();
				if (window.self == window.top) {
					if (pediatorSettings.pediator_option["pediator-show"] == "iframe") {
						pediatorMenuController.setPosition();
						pediatorMenuController.ShowPediatorMenu();
						chrome.extension.sendRequest("pediator_on");
					}
				}
			// トップページがフレームセットの場合
			} else if ( pediatorMenuFrame ) {
				if (window.self == window.top) {
					if (pediatorSettings.pediator_option["pediator-show"] == "iframe") {
						pediatorMenuController.setPositionFrameset();
						pediatorMenuController.ShowPediatorMenuFrameset();
						chrome.extension.sendRequest("pediator_on");
					}
				}
			} else {
				pediatorOn.PediatorAnalyzeFrame();
			}
		}
	});
};

startPediator();
