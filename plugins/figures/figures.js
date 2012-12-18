$(document).on("article.loaded", function(event, article){
	var article = $(article);

	article.find("figure,.table-wrap").each(function() {
		var node = $(this);
		var id = node.attr("id");

		var link = article.find("a.xref").filter(function() {
			return $(this).attr("rid") === id;
		});

		if (!link.length) {
			return;
		}

		var section = link.eq(0).closest("section");

		if (!node.closest("section").is(section)) {
			section.append(node);
		}
	});
});