$(document).on("article.ready", function(event, article){
	article = $(article);

	var url = article.find("a[rel=canonical]");

	if (!url.length) {
		return;
	}

	var matches = url.attr("href").match(/^https?:\/\/(?:dx\.)?doi\.org\/(.+)/);

	if (!matches) {
		return;
	}

	var doi = matches[1];

	var parent = article.find("nav");

	$("<div/>", {
		"data-badge-type": "medium-donut",
		"data-badge-details": "below",
		"data-hide-no-mentions": "true",
		"data-doi": doi,
	}).addClass("altmetric-embed").appendTo(parent);

	$.getScript("https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js");
});
