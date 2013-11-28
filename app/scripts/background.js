'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse)
	{
		console.log("Request from" + sender.tab.url);
		console.log("For link" + request.href);
		sendResponse("worked!");
	}
);