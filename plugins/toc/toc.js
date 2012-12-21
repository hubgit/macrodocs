$(document).on("article.ready", function(event, article){
	article = $(article);

	var parent = article.find("nav");

	var buildContents = function(node) {
		node = $(node);

		var toc = $("<ol/>").addClass("toc").appendTo(parent);

		node.find("> section").each(function() {
			var section = $(this);

			if (!section.is(":visible")) {
				return;
			}

			var heading = section.find("> :header:first");

			var link = $("<a/>", { href: "#" + section.attr("id") }).html(heading.html());
			$("<li/>").append(link).appendTo(toc);

			parent = $("<li/>").appendTo(toc);

			buildContents(section);
		});

		return toc;
	};

	buildContents(article.find("main"));
});