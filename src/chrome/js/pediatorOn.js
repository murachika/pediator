// setTimeout with a shorter delay
// http://dbaron.org/log/20100309-faster-timeouts
(function() {
    var timeouts = [];
    var messageName = "zero-timeout-message";
    // Like setTimeout, but only takes a function argument.  There's
    // no time argument (always zero) and no arguments (you have to
    // use a closure).
    function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, "*");
    }
    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                var fn = timeouts.shift();
                fn();
            }
        }
    }
    window.addEventListener("message", handleMessage, true);
    // Add the one thing we want added to the window object.
    window.setZeroTimeout = setZeroTimeout;
})();


// XPath で全てのテキストノードを取得する
var allTextNodeXpath  = document.evaluate('descendant::text()[not(ancestor::textarea) and not(ancestor-or-self::comment) and not(ancestor-or-self::script) and not(ancestor-or-self::style) and not (ancestor-or-self::noscript)]', document.body, null, 7, null);
var allTextNodeLength = allTextNodeXpath.snapshotLength;

if ("undefined" == typeof(pediatorOn)) {
	var pediatorOn = {};
};

pediatorOn = {

	base64hash : {
		'A':0x00, 'B':0x01, 'C':0x02, 'D':0x03, 'E':0x04, 'F':0x05, 'G':0x06, 'H':0x07,
		'I':0x08, 'J':0x09, 'K':0x0A, 'L':0x0B, 'M':0x0C, 'N':0x0D, 'O':0x0E, 'P':0x0F,
		'Q':0x10, 'R':0x11, 'S':0x12, 'T':0x13, 'U':0x14, 'V':0x15, 'W':0x16, 'X':0x17,
		'Y':0x18, 'Z':0x19, 'a':0x1A, 'b':0x1B, 'c':0x1C, 'd':0x1D, 'e':0x1E, 'f':0x1F,
		'g':0x20, 'h':0x21, 'i':0x22, 'j':0x23, 'k':0x24, 'l':0x25, 'm':0x26, 'n':0x27,
		'o':0x28, 'p':0x29, 'q':0x2A, 'r':0x2B, 's':0x2C, 't':0x2D, 'u':0x2E, 'v':0x2F,
		'w':0x30, 'x':0x31, 'y':0x32, 'z':0x33, '0':0x34, '1':0x35, '2':0x36, '3':0x37,
		'4':0x38, '5':0x39, '6':0x3A, '7':0x3B ,'8':0x3C, '9':0x3D, '+':0x3E, '/':0x3F
	},

	// 表記ゆれ実装
	variants : {
		// トリミング
	//	trim : function (str) {
	//		str = str.replace(/(^\s+)|(\s+$)/g, "");
	//		return str;
	//	},
		
		// スペースをアンダーバーに変更
		sp2ub : function (str) {
			str = str.replace(/ /g, "_");
			return str;
		},

	// 必要に応じて追加
	},

	BFExists : function (md5) {
		for (var j=0; j < pediatorSettings.hashfunctions; j++){
			// md5 から 10桁の文字列を取得し16進数→10進数に変換
			var num_k = md5.slice(j,j + 10);
			num_k = parseInt(num_k,16);
			num_k = num_k % pediatorSettings.bitvector;
			
			// num_k bit目のフラグをチェック
			bflist1 = Math.floor(num_k / 24);
			bflist2 = num_k % 24;

			// num_k bit目を含む 24 bitブロックを取得
			str0 = bflist1 * 4;

			str1 = pediatorSettings.bloomfilter[str0];
			str2 = pediatorSettings.bloomfilter[str0 + 1];
			str3 = pediatorSettings.bloomfilter[str0 + 2];
			str4 = pediatorSettings.bloomfilter[str0 + 3];

			str1 = pediatorOn.base64hash[str1] << 18;
			str2 = pediatorOn.base64hash[str2] << 12;
			str3 = pediatorOn.base64hash[str3] << 6;
			str4 = pediatorOn.base64hash[str4];
			
			str5 = str1 | str2 | str3 | str4;

			bfbin1 = str5;
			bfbin2 = 1 << bflist2;

			if ( bfbin1 & bfbin2 ){
				// num_k bit 目が 1 だった
				result = "1";
			} else {
				// num_k bit 目が 0 だった
				result = "0";
				break;
			}
		}

		if ( result == "1" ){
			return 1;
		} else {
			return 0;
		}
	},

	PediatorAnalyzeFrame : function () {
//		console.time("PediatorOn");
		// テキストノードの走査
		for (var i = 0; i <allTextNodeLength; i++) {
			var textnode = allTextNodeXpath.snapshotItem(i).textContent;
			if ( textnode.match(/[^\s\0　 ]/g)) {
				var segmentedary = segment(textnode);
				var num1    = "";
				var num2    = "";
				var linestr = "";
				// segmenterを通した単語ごとにループ
				for (var j=0; j < segmentedary.length; j++ ){
					// 設定したgram数で単語を結合してからmd5にする
					// 最長一致なので単語のチェックは j + ngram から開始
					var str = "";
					Loop1:
					for (var k=pediatorSettings.pediator_option["pediator-segment"]; k > 0; k-- ) {
						// 1gramの時はそのままループ
						if ( pediatorSettings.pediator_option["pediator-segment"] == 1 ) {
							str = segmentedary[j];
						} else {
							// gram数が1以上の場合はgram数で単語を結合
							if ( j + k <= segmentedary.length ) {
							// 最長が文末に満たない場合
								str = segmentedary.slice(j,j + k).join("");
							} else if ( k == 1 ) {
							// 最短まで一致しなかった場合
								str = segmentedary[j];
							} else {
							// ngramが文末を超える場合は文末まで
								str = segmentedary.slice(j).join("");
							}
						}
						
						num1 = utf16to8(str);
						num1 = CybozuLabs.MD5.calc(num1);
						num2 = pediatorOn.BFExists(num1);
						str  = str.replace(/</g, "&lt;");
						str  = str.replace(/>/g, "&gt;");
						if ( num2 == "1" ){
							encstr = encodeURI(str);
							encstr = encstr.replace(/\'/g, "%27");
							linestr += "<span class='jp-irts-pediator' onclick='parent.fireCustomEvent(\"" + encstr + "\");return false'>" + str + "</span>";
							j += k - 1;
							break;
						} else {
							// ヒットしなかった場合、表記ゆれで再サーチ
							for (var l in pediatorOn.variants) {
								strv = pediatorOn.variants[l](str);
								num1 = utf16to8(strv);
								num1 = CybozuLabs.MD5.calc(num1);
								num2 = pediatorOn.BFExists(num1);
								if ( num2 == "1" ){
									encstr = encodeURI(strv);
									encstr = encstr.replace(/\'/g, "%27");
									linestr += "<span class='jp-irts-pediator' onclick='fireCustomEvent(\"" + encstr + "\");return false'>" + str + "</span>";
									j += k - 1;
									break Loop1;
								}
							} // l（表記ゆれループ）ここまで
							if ( k == 1 ) {
								linestr += str;
							}
						} // 一回目の if(num2=="1")句 ここまで
					} // k（Loop1: ngramループ）ここまで
				} // j（segmenterを通した単語ごとループ）ここまで
				
				// Range Object を作成し、snapshotItem を置換
				textnode = textnode.replace(/</g, "&lt;");
				textnode = textnode.replace(/>/g, "&gt;");
//				try {
					if ( textnode != linestr ) {
						var range = document.createRange();
						range.selectNodeContents(document.body);
						var cCF  = range.createContextualFragment(linestr);
						var temp = allTextNodeXpath.snapshotItem(i);
						var parent = allTextNodeXpath.snapshotItem(i).parentNode;
						// parentNode が存在しない場合、replceChild メソッドがエラーになるので
						if ( parent ) {
							parent.replaceChild(cCF, temp);
						}
					}
//				} catch ( e ) {
//					console.log( e );
//				}
			} // end if
		} // snapshotItem(i).textContent ループここまで

//	console.timeEnd("PediatorOn");
	},

	ptimer          : 0,
	pcount          : 0,
	PediatorAnalyze : function () {
//		console.time("PediatorOn");
		var pediatorProgressPercent = document.getElementById("jp-irts-pediator-Progress-Percent");
		var i;
		var callback = function(){
			i = pediatorOn.pcount;
			
			var Progress = Math.round(i / allTextNodeLength * 100);
			pediatorProgressPercent.textContent = Progress;
			
			if ( i < allTextNodeLength ) {
				var textnode = allTextNodeXpath.snapshotItem(i).textContent;
				if ( textnode.match(/[^\s\0　 ]/g) ) {
					var segmentedary = segment(textnode);
					var num1    = "";
					var num2    = "";
					var linestr = "";
					// segmenterを通した単語ごとにループ
					for (var j=0; j < segmentedary.length; j++ ){
						// 設定したgram数で単語を結合してからmd5にする
						// 最長一致なので単語のチェックは j + ngram から開始
						var str = "";
						Loop1:
						for (var k=pediatorSettings.pediator_option["pediator-segment"]; k > 0; k-- ) {
							// 1gramの時はそのままループ
							if ( pediatorSettings.pediator_option["pediator-segment"] == 1 ) {
								str = segmentedary[j];
							} else {
								// gram数が1以上の場合はgram数で単語を結合
								if ( j + k <= segmentedary.length ) {
								// 最長が文末に満たない場合
									str = segmentedary.slice(j,j + k).join("");
								} else if ( k == 1 ) {
								// 最短まで一致しなかった場合
									str = segmentedary[j];
								} else {
								// ngramが文末を超える場合は文末まで
									str = segmentedary.slice(j).join("");
								}
							}
							num1 = utf16to8(str);
							num1 = CybozuLabs.MD5.calc(num1);
							num2 = pediatorOn.BFExists(num1);
							str    = str.replace(/</g, "&lt;");
							str    = str.replace(/>/g, "&gt;");
							if ( num2 == "1" ){
								encstr = encodeURI(str);
								encstr = encstr.replace(/\'/g, "%27");
								linestr += "<span class='jp-irts-pediator' onclick='fireCustomEvent(\"" + encstr + "\");return false'>" + str + "</span>";
								j += k - 1;
								break;
							} else {
								// ヒットしなかった場合、表記ゆれで再サーチ
								for (var l in pediatorOn.variants) {
									strv = pediatorOn.variants[l](str);
									num1 = utf16to8(str);
									num1 = CybozuLabs.MD5.calc(num1);
									num2 = pediatorOn.BFExists(num1);
									if ( num2 == "1" ){
										encstr = encodeURI(strv);
										encstr = encstr.replace(/\'/g, "%27");
										linestr += "<span class='jp-irts-pediator' onclick='fireCustomEvent(\"" + encstr + "\");return false'>" + str + "</span>";
										j += k - 1;
										break Loop1;
									}
								} // l（表記ゆれループ）ここまで
								if ( k == 1 ) {
									linestr += str;
								}
							} // 一回目の if(num2=="1")句 ここまで
						} // k（Loop1: ngramループ）ここまで
					} // j（segmenterを通した単語ごとループ）ここまで
					
					// Range Object を作成し、snapshotItem を置換
					textnode = textnode.replace(/</g, "&lt;");
					textnode = textnode.replace(/>/g, "&gt;");
//					try {
						if ( textnode != linestr ) {
							var range = document.createRange();
							range.selectNodeContents(document.body);
							var cCF  = range.createContextualFragment(linestr);
							var temp = allTextNodeXpath.snapshotItem(i);
							var parent = allTextNodeXpath.snapshotItem(i).parentNode;
							// parentNode が存在しない場合、replceChild メソッドがエラーになるので
							if ( parent ) {
								parent.replaceChild(cCF, temp);
							}
						}
//					} catch ( e ) {
//						console.log( e );
//					}
				} // end if
				
				pediatorOn.pcount++;
				setZeroTimeout(callback);
				
			} else {
			 	
			 	pediatorOn.SPMtimer = clearTimeout(pediatorOn.SPMtimer);
			 	pediatorOn.HideProgressMenu();
			 	pediatorOn.ptimer = clearTimeout(pediatorOn.ptimer);
				
//				console.timeEnd("PediatorOn");
			}
			
		}
		
		pediatorOn.ptimer = setTimeout(callback, 0);
		
	},

	// プログレスメニュー表示
	SPMtimer            : 0,
	progressMenuOpacity : 0,
	ShowProgressMenu : function () {
		var callback = function(){
			if ( pediatorOn.progressMenuOpacity < 0.8 ) {
				pediatorOn.progressMenuOpacity = pediatorOn.progressMenuOpacity + 0.1;
				document.getElementById("jp-irts-pediator-Progress").style.opacity = pediatorOn.progressMenuOpacity;
				pediatorOn.SPMtimer = setTimeout(callback, 20);
			} else {
				pediatorOn.SPMtimer = clearTimeout(pediatorOn.SPMtimer);
			}
		}
		pediatorOn.SPMtimer = setTimeout(callback, 20);
	},
	// プログレスメニュー閉
	HPMtimer : 0,
	HideProgressMenu : function () {
		var callback = function(){
			if ( pediatorOn.progressMenuOpacity > 0 ) {
				pediatorOn.progressMenuOpacity = pediatorOn.progressMenuOpacity - 0.1;
				document.getElementById("jp-irts-pediator-Progress").style.opacity = pediatorOn.progressMenuOpacity;
				pediatorOn.HPMtimer = setTimeout(callback, 20);
			} else {
			 	pediatorOn.HPMtimer = clearTimeout(pediatorOn.HPMtimer);
			}
		}
		pediatorOn.HPMtimer = setTimeout(callback, 20);
	},
}
