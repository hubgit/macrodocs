$(document).on("article.loaded", function(event, article){
	article = $(article);

	var sections = {
		introduction: null,
		methods: null,
		results: null,
		references: null
	};

	article.find("h2").each(function() {
		var node = $(this);

		var heading = node.text().toLowerCase();

		if (!sections["methods"] && heading.match(/\bmethods\b/)) {
			heading = "methods";
		}

		sections[heading] = node.closest("section");
	});

	if (sections["methods"] && sections["results"]) {
		sections["results"].after(sections["methods"]);
	}
});