$(document).on("article.ready", function(event, article){
	article = $(article);

    /* fetch pmc -> pubmed id */
	var data = {
	    tool: "macrodocs",
	    email: "alf@hubmed.org",
	    dbfrom: "pmc",
	    db: "pubmed",
	    linkname: "pmc_pubmed",
	    retmode: "xml",
	    id: app.id,
	};

	$.ajax({
		url: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi",
		data: data,
		dataType: "xml",
		success: function(doc) {
			var template = [
				"/eLinkResult/LinkSet/LinkSetDb/Link",
				{ id: "Id" }
			];

			var result = Jath.parse(template, doc);

			if (!result.length) {
				return;
			}

			/* fetch pubmed -> pubmed neighbors */
			var data = {
			    tool: "macrodocs",
			    email: "alf@hubmed.org",
			    dbfrom: "pubmed",
			    db: "pubmed",
			    linkname: "pubmed_pubmed",
			    retmode: "xml",
			    id: result[0].id,
			    term: "pubmed pmc open access[filter] AND free full text[filter]"
			};

			$.ajax({
				url: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi",
				data: data,
				dataType: "xml",
				success: function(doc) {
					var template = [
						"/eLinkResult/LinkSet/LinkSetDb/Link",
						{ id: "Id" }
					];

					var result = Jath.parse(template, doc);

					if (!result.length) {
						return;
					}

					/* fetch pubmed doc details */
					var data = {
					    tool: "macrodocs",
					    email: "alf@hubmed.org",
					    db: "pubmed",
					    retmode: "xml",
					    id: result.map(function(item) { return item.id }).join(","),
					};

					$.ajax({
						url: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi",
						data: data,
						dataType: "xml",
						success: function(doc) {
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

							var container = $("<ul/>");

							result.forEach(function(item) {
								var url = item.doi ? $.param({ doi: item.doi }) : $.param({ pmc: item.pmc.replace(/^PMC/, "") })
								var title = $("<a/>").attr("href", "./?" + url).text(item.title);
								$("<li/>").append(title).appendTo(container);
							});

							var heading = $("<h2/>", { text: "Related Articles" }).addClass("heading");
							var section = $("<section/>", { id: "related-articles" }).append(heading).append(container);

							article.after(section);
						}
					});
				}
			});
		}
	});
});
