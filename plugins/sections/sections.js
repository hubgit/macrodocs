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

	var sections = {
		introduction: null,
		methods: null,
		results: null,
		references: null
	};

	article.find("main,footer").find(":header").each(function() {
		var node = $(this);

		var heading = $.trim(node.text().toLowerCase().replace(/^[^a-z]+/, "").replace(/\.$/, ""));

		node.text(heading.toProperCase().replace(/\b(And|Of|The)\b/g, function(text) { return text.toLowerCase() }));

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

		if (!section.length) {
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
			console.log(heading)
			section.attr("id", heading.toLowerCase().replace(/\W/g, "-"));
		//}

		sections[heading] = section;
	});

	if (sections["methods"] && sections["results"]) {
		sections["results"].after(sections["methods"]);
	}

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
});