$(document).on("article.loaded", function(event, article){
	article = $(article);

	/* http://stackoverflow.com/a/5574446/145899 */
	String.prototype.toProperCase = function () {
	    return this.replace(/\w[^\s-\/]*/g, function(txt){
	    	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });
	};

	var refList = article.find("footer .ref-list-container");
	if (!refList.prev("h2").length) {
		$("<h2/>", { text: "References" }).addClass("heading").insertBefore(refList);
	}

	article.find("footer > section > h3").each(function() {
		var node = $(this);
		$("<h2/>", { text: node.text() }).addClass("heading").replaceAll(node);
	});

	article.find(".fn-group").each(function() {
		var node = $(this);
		$("<h2/>", { text: "Footnotes" }).addClass("heading").insertBefore(node);
	});

	article.find("main > p").wrapAll("<section/>");

	var sections = {
		introduction: null,
		methods: null,
		results: null,
		references: null
	};

	article.find("main,footer").find(":header").each(function() {
		var node = $(this);

		var text = node.text().replace(/^[^a-z]+/i, "");
		node.text(text);

		var heading = $.trim(text.toLowerCase().replace(/\.$/, ""));

		//node.text(heading.toProperCase().replace(/[\s-\/](A|And|Of|The|In|Is|For)\b/g, function(text) { return text.toLowerCase() }));

		if (!sections["methods"] && heading.match(/\bmethods\b/)) {
			heading = "methods";
		}

		if (!sections["results"] && heading.match(/\bresults\b/)) {
			heading = "results";
		}

		if (!sections["supporting"] && heading.match(/\b(supporting|supplement)\b/)) {
			heading = "supporting";
		}

		var section = node.parent("section");

		if (!section.length && node.get(0).tagName == "H2") {
			section = $("<section/>");
			node.before(section);

			node.nextAll().each(function() {
				if (this.tagName == "H2") {
					return false; // break
				}

				section.append(this);
			});

			section.prepend(node);
		}

		//if (!section.attr("id")) {
			section.attr("id", heading.toLowerCase().replace(/\W/g, "-"));
		//}

		sections[heading] = section;
	});

	var scrollToTop = function() {
		$("html, body").animate({ scrollTop: 0 }, "fast");
	}

	var addSectionTabs = function() {
		var navbar = $('<div class="navbar navbar-fixed-bottom"><div class="navbar-inner"><ul class="nav"></ul></div></div>');
		var tabs = navbar.find(".nav");

		article.addClass("tab-content");

		var main = article.find("main");
		var footer = article.find("footer");

		main
			.attr("id", "main")
			.addClass("active")
			.data("tab-heading", "Main");

		article.find("#methods, #references").each(function() {
			var node = $(this);
			var text = node.find("h2:first").text();
			
			if (text.match(/methods/i)) {
				text = "Methods";
			} else if (text.match(/references/i)) {
				text = "References";
			}
			
			node.addClass("pseudo-main")
				.data("tab-heading", text)
				.insertBefore(footer);
		});

		var sections = article.find("main, #methods, #references");

		//article.find("section[id] > h2").each(function() {
		sections.each(function() {
			var node = $(this);
			node.addClass("tab-pane");

			$("<a/>", { href: "#" + node.attr("id") })
				.attr("data-toggle", "tab")
				.text(node.data("tab-heading"))
				.wrap("<li/>")
				.parent()
				.appendTo(tabs)
				.click(scrollToTop);
		});

		tabs.find("li:first").addClass("active");

		/* add altmetric badges when the reference section is shown */
		var altmetricLoaded = false;
		tabs.find("a[href='#references']").on("click", function() {
			if (altmetricLoaded) {
				return;
			}

			altmetricLoaded = true;

			$(".altmetric-embed").each(function() {
				var node = $(this);
				var doi = node.data("doi");
				var pmid = node.data("pmid");
				var url;

				if (doi) {
					url = "http://api.altmetric.com/v1/doi/" + doi;
				} else if (pmid) {
					url = "http://api.altmetric.com/v1/pmid/" + pmid;
				}

				if (!url) {
					return true; // continue
				}

				$.ajax({
					url: url,
					dataType: "json",
					success: function(data) {
						var url = "http://www.altmetric.com/details.php?domain=" + window.location.host + "&citation_id=" + data.altmetric_id;
						var style = "display: inline-block; background-image: url(https://d1uo4w7k31k5mn.cloudfront.net/v2/" + Math.ceil(data.score) + ".png); width: 88px; height: 18px;";

						$("<a/>", { href: url, style: style, target: "_new" }).appendTo(node);
					}
				})
			});
		});

		navbar.appendTo("body");
	};

	addSectionTabs();
});

$(document).on("article.ready", function(event, article){
	article = $(article);
	
	var applyBalanceText = function() {
		article.find("h1").balanceText();
	}

	applyBalanceText();

	$(window).resize(applyBalanceText);
});
