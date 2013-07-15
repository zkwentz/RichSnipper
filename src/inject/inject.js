chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		window.$schemaItems = consumeSchema();

		if ($schemaItems.length > 0)
		{
			console.log("Schema markup is on this page.");
		}

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});

// When a page is loaded, consumeSchema runs, returning a JSON-like
// object made up of all the schema elements on the page.
var consumeSchema = function() {
	var $schema = $('[itemscope]'),
		result = {};

	if ($schema.length >= 1)
	{
		var $context = $schema.first();

		result.id = $context.attr('id');
		result.itemscope = $context.attr('itemscope');
		result.properties = new Array();
		result.properties[0] = {};
		result.properties[0].propname = $context.attr('itemprop');
		result.properties[0].propvalue = $context.html();

		var $properties = $context.find('[itemprop]');

		$.each($properties,function(index){
			var $this = $(this);
			console.log(index);
			console.log($this);
			if (!$this.attr('itemscope'))
			{
				result.properties[index+1] = {};
				result.properties[index+1].propname = $this.attr('itemprop');
				result.properties[index+1].propvalue = $this.html();
			}
			else
			{
				//do it again
			}
		});
	}

 	return result;
}


