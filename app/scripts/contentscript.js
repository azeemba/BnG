'use strict';
/*global $: true */

//in case the page already has a jquery, we bring it back
//by removing our jquery from $
var myJQuery = $.noConflict(true);

//add a clickable '+' after each link
var a = myJQuery('<a class="graphEdgeAction">+++</a>');
document.addEventListener('click', function(e){
	var link = myJQuery(e.target);
	if (link.hasClass('graphEdgeAction')) {
		var action = 'addEdge';
		
		if (link.text() === '+++') {
			link.text('---');
		}
		else {
			action = 'removeEdge';
			link.text('+++');
		}

		chrome.runtime.sendMessage({
			action: action,
			url: link.prev().attr("href")
		});
	}
});

myJQuery('a').after(a);
