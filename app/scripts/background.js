'use strict';

//we assume storage exists
var graphPromise = storage.getGraph();

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

var messageHandlers = {
	addEdge: function(message, sender, sendResponse){
		var from = new URI(sender.url).normalize();
		var to = new URI(message.url).normalize();
		if (to.is("relative")) {
			//if to is relative then it has to be the same host
			//as from, otherwise the link wouldn't work
			console.log("to is relative", to.href());
			//copy everything from FROM except for
			//path query and fragment which is taken from TO
			var basedOnFrom = from.clone();
			to = basedOnFrom.resource(to.resource());
		}
		graphPromise.then(function(graph){
			var fromHref = from.href();
			var toHref   = to.href();
			var updated = {
				from: false,
				to: false,
				edge: false
			};
			if (!graph.nodes(fromHref)) {
				graph.addNode({
					id: fromHref,
					timestamp: new Date()
				});
				updated.from = true;
			}

			if (!graph.nodes(toHref)) {
				graph.addNode({
					id: toHref,
					timestamp: new Date()
				});
				updated.to = true;
			}

			if (!graph.edges(fromHref+toHref)) {
				graph.addEdge({
					id: fromHref+toHref,
					target: fromHref,
					source: toHref,
					timestamp: new Date()
				});
				updated.edge = true;
			}
			return updated;
		}).then(sendResponse);
	},
	removeEdge: function(message, sender, sendResponse){
		var from = new URI(sender.url).normalize();
		var to = new URI(message.url).normalize();
		if (to.is("relative")) {
			//if to is relative then it has to be the same host
			//as from, otherwise the link wouldn't work
			console.log("to is relative", to.href());
			//copy everything from FROM except for
			//path query and fragment which is taken from TO
			var basedOnFrom = from.clone();
			to = basedOnFrom.resource(to.resource());
		}
		
	}
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
		console.log(message, sender, sendResponse);
	var handler = messageHandlers[message.action];
	if (handler) {
		handler(message, sender, sendResponse);
	}
	else {
		sendResponse({error: "Unknown action"});
	}
});