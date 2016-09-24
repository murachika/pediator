if ("undefined" == typeof(pediatorInsert)) {
	var pediatorInsert = {};
};

pediatorInsert = {

	insertAfter : function (newNode, node) {
		node.parentNode.insertBefore(newNode, node.nextSibling)
	},

	// pediatorメニュー埋め込みファンクション
	MakePediatorMenu : function () {
		var pediatornemu = document.getElementById('jp-irts-pediator-menu');
		if ( pediatornemu ) {
			document.getElementById('jp-irts-pediator-menu').style.visibility = 'hidden';
		} else {
			var insert  = "<div id='jp-irts-pediator-menu-navi'><div id='jp-irts-pediator-menu-img' onclick='fireCustomEvent(\"jp-irts-pediator-scrollmenu\");'>　</div><div id='jp-irts-pediator-menu-iframe'>　　<a href='javascript:void(0);' onclick='fireCustomEvent(\"jp-irts-pediator-scrollmenu\");'><img src='" + pediatorSettings.CloseimgURL + "' title='メニューを閉じる'></a>　　<a href='javascript:void(0);'><img src='" + pediatorSettings.BackimgURL + "' title='戻る' onclick='history.back();'></a>　　<a href='javascript:void(0);'><img src='" + pediatorSettings.ForwardimgURL + "' title='進む' onclick='history.forward();'></a><iframe frameborder='no' name='jp-irts-pediator-iframe' id='jp-irts-pediator-iframe-contents'></iframe></div></div>";
			var divmenu = document.createElement('div');
			divmenu.id  = "jp-irts-pediator-menu";
			document.body.appendChild(divmenu);
			document.getElementById('jp-irts-pediator-menu').innerHTML = insert;
			document.getElementById("jp-irts-pediator-menu-img").style.backgroundImage = "url('" + pediatorSettings.MenuimgURL + "')";
			document.getElementById('jp-irts-pediator-menu').style.visibility = 'hidden';
		}
	},

	// フレームセット用pediatorメニュー埋め込みファンクション
	MakePediatorFramesetMenu : function () {
		// 新しいフレームを作成
		var menuframeset = document.createElement('frameset');
		var menuframe    = document.createElement('frame');
		var tempframe    = document.createElement('frameset');
		menuframeset.id   = "jp-irts-pediator-frameset";
		menuframeset.cols = "*,0px";
		menuframe.id  = "jp-irts-pediator-frameset-menu";
		tempframe.id  = "jp-irts-pediator-frameset-temp";
		var head = document.getElementsByTagName('html')[0];
		pediatorInsert.insertAfter(menuframeset, head.firstChild);
		document.body.appendChild(tempframe);
		document.body.appendChild(menuframe);
		document.getElementsByTagName('frameset')[0].replaceChild(document.getElementsByTagName('frameset')[2], document.getElementById('jp-irts-pediator-frameset-temp'));
	//	document.getElementById('jp-irts-pediator-frameset-menu').noResize=true;

		// 作成したフレームにメニューを作成
		var insert  = "<div id='jp-irts-pediator-menu-navi-frameset'><div id='jp-irts-pediator-menu-img-frameset' onclick='fireCustomEvent(\"jp-irts-pediator-scrollmenu\");'>　</div><div id='jp-irts-pediator-menu-iframe-frameset'>　　<a href='javascript:void(0);' onclick='fireCustomEvent(\"jp-irts-pediator-scrollmenu\");'><img src='" + pediatorSettings.CloseimgURL + "' title='メニューを閉じる'></a> 　　<a href='javascript:void(0);'><img src='" + pediatorSettings.BackimgURL + "' title='戻る' onclick='history.back();'></a>　　<a href='javascript:void(0);'><img src='" + pediatorSettings.ForwardimgURL + "' title='進む' onclick='history.forward();'></a><iframe frameborder='no' name='jp-irts-pediator-iframe' id='jp-irts-pediator-iframe-contents-frameset'></iframe></div></div>";
		var menuframe = document.getElementById('jp-irts-pediator-frameset-menu').contentDocument;
		var divmenu = document.createElement('div');
		var head = menuframe.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = pediatorSettings.PediatorCSS;
		head.appendChild(link);

		// 作成したフレームにページ対話用 javascirpt を埋め込み
		// フレーム内コンテンツの場合、parentフレームに対してイベントを投げつける
		var insertScript = "var customEvent = document.createEvent('Event');customEvent.initEvent('pediatorCustomEvent', true, true);function fireCustomEvent(data) {var hiddenInput = parent.document.getElementById('pediatorDomMessenger');hiddenInput.value = data;hiddenInput.dispatchEvent(customEvent);}";
		var insertPediator = document.createElement("script");
		insertPediator.type = "text/javascript";
		insertPediator.text = insertScript;
		head.appendChild(insertPediator);

		divmenu.id  = "jp-irts-pediator-menu-frameset";
		menuframe.body.appendChild(divmenu);
		menuframe.getElementById('jp-irts-pediator-menu-frameset').innerHTML = insert;
		menuframe.getElementById("jp-irts-pediator-menu-img-frameset").style.backgroundImage = "url('" + pediatorSettings.MenuimgURL + "')";
	},

	insertMenu : function () {
		// トップページがフレームセットじゃない場合
		if ( document.getElementsByTagName('frameset').length == 0 ) {
			// インラインフレーム対策
			if (window.self == window.top) {
				
				// Pediatorメニュー作成
				pediatorInsert.MakePediatorMenu();
				
				// 位置合わせ
				window.onscroll = function(){
					pediatorMenuController.setPosition();
				}
				window.onresize = function(){
					pediatorMenuController.setPosition();
				}
				
				// ページ対話用 hidden input 埋め込み
				var pediatorCustomDom = document.createElement('input');
				pediatorCustomDom.id  = "pediatorDomMessenger";
				pediatorCustomDom.type  = "hidden";
				document.body.appendChild(pediatorCustomDom);
				
				// ページ対話用 javascirpt 埋め込み
				var insertScript = "var customEvent = document.createEvent('Event');customEvent.initEvent('pediatorCustomEvent', true, true);function fireCustomEvent(data) {var hiddenInput = document.getElementById('pediatorDomMessenger');hiddenInput.value = data;hiddenInput.dispatchEvent(customEvent);}";
				var insertPediator = document.createElement("script");
				insertPediator.type = "text/javascript";
				insertPediator.text = insertScript;
				document.body.appendChild(insertPediator);

				// ページ対話用 リスナ作成
				document.getElementById('pediatorDomMessenger').addEventListener('pediatorCustomEvent', function() {
					var eventData = document.getElementById('pediatorDomMessenger').value;
					if ( eventData == "jp-irts-pediator-scrollmenu") {
						pediatorMenuController.ScrollPediatorMenu(null,null);
					} else {
						chrome.extension.sendRequest(eventData, function (response) {
							if ( response == "iframe" ) {
								pediatorMenuController.ShowPediatorMenu("open");
								var url = pediatorSettings.pediator_url + eventData;
								document.getElementById("jp-irts-pediator-iframe-contents").src = url;
							}
						});
					}
				})
				
				// pediator progress 埋め込み
				var pediatorProgress = document.createElement('div');
				pediatorProgress.id  = "jp-irts-pediator-Progress";
				pediatorProgress.innerHTML = "<img src='" + pediatorSettings.pediatorWorkingImg + "'><br><br><img src='" + pediatorSettings.pediatorProgressImg + "'><br><br><span id='jp-irts-pediator-Progress-Percent'> </span><img src='" + pediatorSettings.pediatorPercentImg + "'>　<a href='javascript:void(0);'><img src='" + pediatorSettings.pediatorCloseImg + "' title='キャンセル' onclick='location.reload();'></a>";
				document.body.appendChild(pediatorProgress);
			
			}

		// トップページがフレームセットだった場合
		} else if ( document.getElementsByTagName('frameset').length > 0 ) {
			// フレームセットページでの挙動
			if (window.self == window.top) {
				// 新しいフレームセットを作成
				pediatorInsert.MakePediatorFramesetMenu();

				// 位置合わせ
				window.onresize = function(){
					pediatorMenuController.setPositionFrameset();
				}

				// トップフレームにページ対話用 hidden input 埋め込み
				var pediatorCustomDom = document.createElement('input');
				pediatorCustomDom.id  = "pediatorDomMessenger";
				pediatorCustomDom.type  = "hidden";
				var head = document.getElementsByTagName('html')[0];
		//		pediatorInsert.insertAfter(pediatorCustomDom, head.firstChild);
				document.body.appendChild(pediatorCustomDom);

				// ページ対話用 javascirpt 埋め込み
				var insertScript = "var customEvent = document.createEvent('Event');customEvent.initEvent('pediatorCustomEvent', true, true);function fireCustomEvent(data) {var hiddenInput = document.getElementById('pediatorDomMessenger');hiddenInput.value = data;hiddenInput.dispatchEvent(customEvent);}";
				var insertPediator = document.createElement("script");
				insertPediator.type = "text/javascript";
				insertPediator.text = insertScript;
				document.body.appendChild(insertPediator);

				// ページ対話用 リスナ作成
				document.getElementById('pediatorDomMessenger').addEventListener('pediatorCustomEvent', function() {
					var eventData = document.getElementById('pediatorDomMessenger').value;
					if ( eventData == "jp-irts-pediator-scrollmenu") {
						pediatorMenuController.ScrollPediatorMenuFrameset(null,null);
					} else {
						chrome.extension.sendRequest(eventData, function (response) {
							if ( response == "iframe" ) {
								pediatorMenuController.ShowPediatorMenuFrameset("open");
								var url = pediatorSettings.pediator_url + eventData;
								document.getElementById('jp-irts-pediator-frameset-menu').contentDocument.getElementById("jp-irts-pediator-iframe-contents-frameset").src = url;
							}
						});
					}
				})
			}
		}
	},
}
