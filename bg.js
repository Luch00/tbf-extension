var search = /vid.*hls.*(\/hls.*.ts)/;

var countries = {
    "US": "United States",
    "SE": "Sweden",
    "UK": "United Kingdom",
    "NL": "Netherlands",
    "FR": "France",
    "DE": "Germany",
    "CZ": "Czech Republic",
};

var replacements = [
        ["US",    "San Francisco",    "video-edge-2ca3e4.sfo01.hls.ttvnw.net"],
        ["US",    "Seattle",          "video-edge-7ea618.sea01.hls.ttvnw.net"],
        ["US",    "San Jose",         "video-edge-7e96ac.sjc01.hls.ttvnw.net"],
        ["US",    "Chicago",          "video-edge-835140.ord02.hls.ttvnw.net"],
        ["US",    "Washington",       "video20.iad02.hls.ttvnw.net"],
        ["US",    "New York",         "video20.jfk01.hls.ttvnw.net"],
        ["US",    "Los Angeles",      "video20.lax01.hls.ttvnw.net"],
        ["US",    "Dallas",           "video20.dfw01.hls.ttvnw.net"],
        
        ["SE",    "Stockholm",        "video20.arn01.hls.ttvnw.net"],
        
        ["UK",    "London",           "video20.lhr02.hls.ttvnw.net"],
        
        ["NL",    "Amsterdam",        "video20.ams01.hls.ttvnw.net"],
        
        ["FR",    "Paris",            "video16.cdg01.hls.ttvnw.net"],
        
        ["DE",    "Frankfurt",        "video20.fra01.hls.ttvnw.net"],
        
        ["CZ",    "Prague",           "video20.prg01.hls.ttvnw.net"],
    ];
var using = 0;

var per_country = {};
for (var i = 0; i < replacements.length; i++) {
    var country = replacements[i][0];
    if (typeof per_country[country] == 'undefined') {
        per_country[country] = [];
    }
    per_country[country].push(i);
}

function updateButton() {
    var cluster = replacements[using][2].replace(/([\s\S]*([a-z]{3})0[\s\S]*)/, "$2");
    chrome.browserAction.setBadgeText({
        text: cluster.toString()
    });
}

function changeServer(id) {
    using = id;
    updateButton();
}

function init() {
    chrome.webRequest.onBeforeRequest.addListener(
        function(info) {
            if (info.url.indexOf(".ts") > -1){
                var conf;
                var subject = info.url;
                
                conf = replacements[using][2];
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

    updateButton();
}

init();