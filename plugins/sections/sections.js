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

	//article.addClass("root");
	//article.find("main,footer").addClass("root");

	var collapseSections = function() {
		var collapsedSections = ["methods", "references", "supporting", "acknowledgements", "acknowledgments"];

		$.each(collapsedSections, function(index, item) {
			if (typeof sections[item] !== "undefined" && sections[item]) {
				sections[item].addClass("collapsed");
			}
		});

		article.find("section.collapsed").each(function() {
			$("<div/>", { html: "show section&hellip;" }).addClass("show").appendTo(this);
			$(this).closest("main,footer").append(this);
		});

		article.on("click", ".show", function(event) {
			$(this).closest("section").removeClass("collapsed");
		});
	};

	//collapseSections();

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
			
			node.addClass("pseudo-main")
				.data("tab-heading", node.find("h2:first").text())
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
				.appendTo(tabs);
		});

		tabs.find("li:first").addClass("active");

		navbar.appendTo("body");
	};

	addSectionTabs();
});