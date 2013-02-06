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

	var getRefNode = function(node) {
		var id = $(node).data("rid").replace(/\./g, "\\.");

		return $("#" + id);
	};

	/* add popover to references */
	$(".xref.bibr")
		.filter(function() {
			return getRefNode(this).hasClass("ref");
		})
		.popover({
			html: true,
			trigger: "hover",
			placement: popoverPlacement,
			title: function() {
				return getRefNode(this).find(".article-title").clone();
			},
			content: function() {
				return nodegetRefNode(this).clone();
			}
		});

	//$("<div/>", { id: "links" }).hide().appendTo("body");

	/* build reference sources */
	/*
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
	*/

	/* show reference sources when clicked */
	/*
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
	*/

	var refList = article.find(".ref-list");

	refList.find(".ref").sort(function(a, b) {
		// http://my.opera.com/GreyWyvern/blog/show.dml/1671288#comment58061082
	    aa = $(".year", a).text().split(/(\d+)/);
	    bb = $(".year", b).text().split(/(\d+)/);

	    for(var x = 0; x < Math.max(aa.length, bb.length); x++) {
	      if(aa[x] != bb[x]) {
	        var cmp1 = (isNaN(parseInt(aa[x],10)))? aa[x] : parseInt(aa[x],10);
	        var cmp2 = (isNaN(parseInt(bb[x],10)))? bb[x] : parseInt(bb[x],10);
	        if(cmp1 == undefined || cmp2 == undefined)
	          return aa.length - bb.length;
	        else
	          return (cmp1 > cmp2) ? -1 : 1;
	      }
	    }
	    return 0;
  }).appendTo(refList);
});
