'use strict';

function constructFullPath(relativePath)
{
	return window.location.protocol + 
			'//' +
			window.location.host +
			relativePath;
}

function linkClickedHandler(event)
{
	event.preventDefault();
	var source 	=  constructFullPath(window.location.pathname);
	var href 	=  constructFullPath($(this).attr("href"));
	var text	=  $(this).text();

	var that = this;

	chrome.runtime.sendMessage(
	{
		source: source,
		href: href,
		text: text 
	}, function(response) {
		//change the style depending on the response.
		//so the user knows if the node is already visited,
		//already added to the graph, or just added to the graph
		//also if this is the first click, just go through
		$(that).css("color", "green");
	});
}

$(document).ready(function(){
	$('a').click(linkClickedHandler);
});
