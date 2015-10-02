var simple = false;
var timeStamps = {};
var times = [];
var using = 0;
var avgTime = 0;
var search = /vid.*hls.*(\/hls.*.ts)/;

var countries = {
    "none": "Default/None",
    "GL": "Global Server",
    "US": "United States",
    "SE": "Sweden",
    "UK": "United Kingdom",
    "NL": "Netherlands",
    "FR": "France",
    "DE": "Germany",
    "CZ": "Czech Republic",
};

var replacements = [
	["none", "Local server", "none"],
	["GL", "Level3 cdn", "twitch2-live.hls.adaptive.level3.net", ".level3."],

	["US-1", "San Francisco", "video-edge-2ca3e4.sfo01.hls.ttvnw.net", ".sfo0."],
	["US-2", "Seattle", "video-edge-7ea618.sea01.hls.ttvnw.net", ".sea01."],
	["US-3", "San Jose", "video-edge-7e96ac.sjc01.hls.ttvnw.net", ".sjc01."],
	["US-4", "Chicago", "video-edge-835140.ord02.hls.ttvnw.net", ".ord02."],
	["US-5", "Washington", "video20.iad02.hls.ttvnw.net", ".iad02."],
	["US-6", "New York", "video20.jfk01.hls.ttvnw.net", ".jfk01."],
	["US-7", "Los Angeles", "video20.lax01.hls.ttvnw.net", ".lax01."],
	["US-8", "Dallas", "video20.dfw01.hls.ttvnw.net", ".dfw01."],

	["SE", "Stockholm", "video20.arn01.hls.ttvnw.net", ".arn01."],

	["UK", "London", "video20.lhr02.hls.ttvnw.net", ".lhr02."],

	["NL", "Amsterdam", "video20.ams01.hls.ttvnw.net", ".ams01."],

	["FR", "Paris", "video16.cdg01.hls.ttvnw.net", ".cdg01."],

	["DE", "Frankfurt", "video20.fra01.hls.ttvnw.net", ".fra01."],

	["CZ", "Prague", "video20.prg01.hls.ttvnw.net", ".prg01."]
];

var per_country = {};
for (var i = 0; i < replacements.length; i++) {
    var country = replacements[i][0].replace(/^([a-zA-Z]+).*$/, "$1");
    if (typeof per_country[country] == 'undefined') {
        per_country[country] = [];
    }
    per_country[country].push(i);
}

function updateButton() {
    var cluster = replacements[using][0];
    chrome.browserAction.setBadgeText({
        text: cluster.toString()
    });
}

function changeServer(id) {
    using = parseInt(id);
    chrome.storage.local.set({ 'server': using });
    updateButton();
}

function click() {
    if (using > replacements.length - 2)
        using = 0
    else
        using += 1;
    updateButton();
}

function init() {
    chrome.webRequest.onBeforeRequest.addListener(
		function (info) {
		    if (info.url.indexOf(".ts") > -1) {
		        var conf;
		        var subject = info.url;

		        if (using == 0) {
		            return {};
		        }

		        conf = replacements[using][2];
		        subject = subject.replace(search, conf + "$1");
		        if (subject !== info.url && info.url.indexOf(replacements[using][3]) == -1) {

		            return {
		                redirectUrl: subject
		            };
		        }
		        else {
		            timeStamps[info.url] = info.timeStamp;
		        }
		    } else
		        return {};
		}, {
		    urls: [
				"*://*/*"
		    ]
		}, ["blocking"]
	);

    chrome.webRequest.onCompleted.addListener(
		function (info) {
		    if (info.url.indexOf(".ts") > -1) {
		        if (info.url in timeStamps) {
		            var ts = timeStamps[info.url];
		            delete timeStamps[info.url];
		            var ms = Math.round(info.timeStamp - ts);
		            setBadgeText(ms.toString(), info.tabId);

		            if (times.push(ms) > 9) {
		                var total = 0;
		                for (var i = 0; i < times.length; i++) {
		                    total = total + times[i];
		                }
		                avgTime = Math.round(total / times.length);
		                times.shift();
		            }
		        }
		        if (Object.keys(timeStamps).length > 20) {
		            timeStamps = {};
		        }
		    }
		}, {
		    urls: [
				"*://*/*"
		    ]
		}, ["responseHeaders"]
	);
    updateButton();
}

function setBadgeText(text, tabid) {
    chrome.browserAction.setBadgeText({
        text: text,
        tabId: tabid
    });
}

function getStorage() {
    chrome.storage.local.get('server', function (data) {
        if (chrome.runtime.lasterror) {
            using = 0;
        }
        else {
            using = data.server;
            if (typeof using == 'undefined') {
                using = 0;
            }
        }
        init();
    });
}

chrome.browserAction.onClicked.addListener(click);

getStorage();