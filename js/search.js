var searchPMC = function(term) {
	var resultsContainer = $("#search-results").html("Searching&hellip;");

	var data = {
	    tool: "macrodocs",
	    email: "alf@hubmed.org",
	    db: "pubmed",
	    retmode: "xml",
	    term: term + " AND pubmed pmc open access[filter]"
	};

	$.ajax({
		url: "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
		data: data,
		dataType: "xml",
		success: function(doc) {
			var template = [
				"/eSearchResult/IdList/Id",
				{ id: "." }
			];

			var result = Jath.parse(template, doc);

			if (!result.length) {
				resultsContainer.text("No articles matched the search terms");
				return;
			}

			resultsContainer.html("Fetching details&hellip;");

			/* fetch pubmed doc details */
			var data = {
			    tool: "macrodocs",
			    email: "alf@hubmed.org",
			    db: "pubmed",
			    retmode: "xml",
			    id: result.map(function(item) { return item.id }).join(","),
			};

			$.ajax({
				url: "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi",
				data: data,
				dataType: "xml",
				success: function(doc) {
					resultsContainer.empty();

					var template = [
						"/eSummaryResult/DocSum",
						{
							id: "Id",
							doi: "Item[@Name='ArticleIds']/Item[@Name='doi']",
							pmc: "Item[@Name='ArticleIds']/Item[@Name='pmc']",
							title: "Item[@Name='Title']",
						}
					];

					var result = Jath.parse(template, doc);

					var container = $("<ul/>", { id: "matching-articles" });

					result.forEach(function(item) {
						var url = item.doi ? $.param({ doi: item.doi }) : $.param({ pmc: item.pmc.replace(/^PMC/, "") })
						var title = $("<a/>").attr("href", "./?" + url).text(item.title);
						$("<li/>").append(title).appendTo(container);
					});

					resultsContainer.append(container);
				}
			});
		}
	});
};