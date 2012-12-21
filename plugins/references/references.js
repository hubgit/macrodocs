$(document).on("article.ready", function(event, article){
	article = $(article);

	var popoverPlacement = function(tip, element) {
		var width = 400;
		var height = 200;

		var offset = $(element).offset();

		var top = offset.top - $window.scrollTop();
		var bottom = $window.scrollTop() + $window.height() - offset.top;
		var left = offset.left - $window.scrollLeft();
		var right = $window.width() - (offset.left + $(element).width());

		if (left < width / 2) {
			return "right";
		}

		if (left < width) {
			if (top < height) {
				return "bottom";
			}
			if (bottom < height) {
				return "top";
			}
			return "right";
		}

		if (right < width / 2) {
			return "left";
		}

		if (right < width) {
			if (top < height) {
				return "bottom";
			}
			if (bottom < height) {
				return "top";
			}
			return "left";
		}

		if (bottom < height) {
			return "top";
		}

		return "bottom";
	};

	/* add popover to references */
	$(".xref[href^=#]")
		.filter(function() {
			var id = $(this).attr("href").replace(/\./g, "\\.");
			return $(id).hasClass("ref");
		})
		.click(function() {
			//$(".popover").remove();
			return false;
		})
		.popover({
			html: true,
			title: function() {
				var id = $(this).attr("href").replace(/\./g, "\\.");
				return $(id).find(".article-title").clone();
			},
			trigger: "click",
			placement: popoverPlacement,
			content: function() {
				var id = $(this).attr("href").replace(/\./g, "\\.");
				return $(id).html();
			}
		});

	$("<div/>", { id: "links" }).hide().appendTo("body");

	/* build reference sources */
	article.find(".label").each(function() {
		var node = $(this);

		var id = node.closest("[id]").attr("id");

		var i = 0;
		var links = [];

		article.find("a[href='#" + id + "']").each(function() {
			var refid = "xref-" + id + "-" + i++;

			$(this).attr("id", refid);

			var link = $("<a/>", { href: "#" + refid })
			.text(i)
			.addClass("link");

			links.push(link);
		});

		node.data({ links: links, id: id });
	});

	/* show reference sources when clicked */
	article.on("click", ".badge", function(event) {
		var node = $(this);
		var links = $("#links");

		if (node.data("id") === links.data("id")) {
			links.hide();
			return;
		}

		var position = node.offset();

		links
		.data("id", node.data("id"))
		.html(node.data("links"))
		.css({ left: position.left + node.width() + 10, top: position.top - 6 })
		.show();
	});

	var refList = article.find(".ref-list");

	refList.find(".ref").sort(function(a, b) {
		return $(".year", b).text() - $(".year", a).text();
	}).appendTo(refList);
});