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
		result = new Array();

	$.each($schema,function(index){
		console.log(this);
		var $this = $(this);
		result[index] = iterator($this);
	});

 	return result;
}

var iterator = function($scope)
{
	var result = {};
	result.id = $scope.attr('id');
	result.itemscope = $scope.attr('itemtype');
	result.properties = new Array();
	$.each($scope.find('[itemprop]'),function(index){
		var $this = $(this),
			item = {};

		if ($this.attr('itemscope'))
		{
			result.properties[index] = iterator($this);
		}
		else
		{
			if (!$this.data('rs-processed'))
			{
				item.propname = $this.attr('itemprop');
				item.propvalue = $this.text();

				result.properties[index] = item;

				$this.data('rs-processed',true);
			}
		}
	});

	return result;
}


