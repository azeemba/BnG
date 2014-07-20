'use strict';

console.log('\'Allo \'Allo! Option');

var port = chrome.runtime.connect({name: "graphUpdates"});
port.postMessage({action: "getGraph"});
var sig;

port.onMessage.addListener(function(message){
	console.log("Got a message back", message);
	if (message.action === "getGraph") {

	}
});

		sig = new sigma({
			renderers: [{
				container: document.getElementById("graph")
			}],

		});		
		sig.startForceAtlas2();
		sig.graph.read({
			nodes: [{id: 'yoo', size: 1, x: 0, y: 0}, {id: 'y', size: 1}],
			edges: [{id: 'edge', source: 'yoo', target: 'y'}]
		});
		sig.stopForceAtlas2();

		sig.refresh();
