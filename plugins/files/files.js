$(document).on("article.loaded", function(event, article){
	var $article = $(article);

	/* tranform image URLs to PMC URLs */
	var setFileURL = function(index, node) {
		var node = $(node);
		node.attr("href", fileURL(node.attr("href")));
	};

	/* tranform image URLs to PMC URLs */
	var setImageURL = function(index, node) {
		var node = $(node);
		node.attr("src", imageURL(node.data("src")));
	};

	var basedURL = function(src) {
		//var matches = $article.find("a[rel=canonical]").attr("href").match(/^(.+)\//);
		// var base = matches[1];

		var base = app.id.replace(/.xml$/, "");

		return base + "/" + src;
	};

	var fileURL = function(src) {
		switch (app.source) {
			case "gist":
				return "https://api.github.com/gists/" + encodeURIComponent(app.id) + "/" + src;

			case "pmc":
				return "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC" + app.id + "/bin/" + src;

			case "url":
				return basedURL(src);

			default:
				return src;
		}
	};

	var imageURL = function(src) {
		switch (app.source) {
			case "gist":
				return "https://gist.github.com/raw/" + encodeURIComponent(app.id) + "/" + src;

			case "pmc":
				return "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC" + app.id + "/bin/" + src.replace(/\.jpg$/, "") + ".jpg";

			case "url":
				return basedURL(src);

			default:
				return src;
		}
	};

	$article.find("[data-src]").each(setImageURL);
});
