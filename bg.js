var search = /vid.*hls.*(\/hls.*.ts)/;
var replacements = ["video-edge-2ca3e4.sfo01.hls.ttvnw.net",
        "video20.ams01.hls.ttvnw.net",
        "video20.arn01.hls.ttvnw.net",
        "video16.cdg01.hls.ttvnw.net",
        "video20.dfw01.hls.ttvnw.net",
        "video20.fra01.hls.ttvnw.net",
        "video20.iad02.hls.ttvnw.net",
        "video20.jfk01.hls.ttvnw.net",
        "video20.lax01.hls.ttvnw.net",
        "video20.prg01.hls.ttvnw.net",
        "video-edge-7ea618.sea01.hls.ttvnw.net",
        "video-edge-7e96ac.sjc01.hls.ttvnw.net",
        "video-edge-835140.ord02.hls.ttvnw.net",
        "video20.lhr02.hls.ttvnw.net"
    ];
var using = 0;

function updateButton(cluster) {
    chrome.browserAction.setBadgeText({
        text: cluster.toString()
    });
}

function click() {
    if (using > 12)
        using = 0
    else
        using += 1;
    var server = replacements[using].replace(/([\s\S]*([a-z]{3})0[\s\S]*)/, "$2");
    updateButton(server);
}

function init() {
    chrome.webRequest.onBeforeRequest.addListener(
        function(info) {
			if (info.url.indexOf(".ts") > -1){
				var conf, i, subjectPriorToReplacement;
				var subject = info.url;
				
				conf = replacements[using];
				subject = subject.replace(search, conf + "$1");
				
				if (subject !== info.url) {
					return {
						redirectUrl: subject
					};
				}
				}
			else
				return {};
        }, {
            urls: [
                "*://*/*"
            ]
        }, ["blocking"]
    );

    chrome.browserAction.onClicked.addListener(click);

    var server = replacements[using].replace(/([\s\S]*([a-z]{3})0[\s\S]*)/, "$2");
    updateButton(server);
}

init();