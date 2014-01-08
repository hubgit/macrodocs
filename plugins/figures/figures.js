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
  var $figures = $("figure, .table-wrap");
  var $contained = $("main > section > p").eq(0); // TODO: article?
  var $window = $(window);
  
  $window.on("resize", function() {
    var margin = ($window.width() - $contained.width()) / 2;
    var marginText = -margin + "px";
    $figures.css({ "margin-left": marginText, "margin-right": marginText });
  }).trigger("resize");	
});
