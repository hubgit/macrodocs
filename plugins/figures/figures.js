$(document).on("article.loaded", function(event, article){
	var article = $(article);

	var supportingSection = article.find(".supplementary-material").closest("section");

	article.find("figure,.table-wrap,.supplementary-material").each(function() {
		var node = $(this);
		var id = node.attr("id");

		var links = article.find("a.xref").filter(function() {
			return $(this).data("rid") === id;
		});

		if (!links.length) {
			return;
		}

		var section = links.eq(0).closest("section");

		if (!node.closest("section").is(section)) {
			section.append(node);
		}
	});

	article.find("p").each(function() {
		$(this).find("figure,.table-wrap").insertAfter(this);
	});

	article.on("click", "figure img", function() {
		var href = $(this).attr("src");
		window.open(href);
	});

	if (!supportingSection.find(".supplementary-material").length) {
		supportingSection.remove();
	}
});

$(document).on("article.ready", function() {
	var $window = $(window);
	var figures = $("figure");
	var tables = $(".table-wrap table");

	$window.on("resize", function() {
		tables.each(function() {
			var table = $(this);
			var tableWidth = table.width();
			var parentWidth = table.parent().width();

			if (tableWidth > parentWidth) {
				var scale = parentWidth / tableWidth;

				table.css({
					'transform-origin': 'top left',
					'transform': 'scale(' + scale + ')',
				});
			}
		});

		var windowWidth = $window.width();

		figures.each(function() {
			var figure = $(this);
			var figureWidth = figure.outerWidth();
			var margin = (windowWidth - figureWidth) / 2;
			var marginText = -margin + "px";
			figure.css({ "margin-left": marginText, "margin-right": marginText });
		});
	}).trigger("resize");
});
