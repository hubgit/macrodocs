window.URL = window.URL || window.webkitURL;

var $window = $(window);

var fetchXSL = $.ajax({
	url: "/article.xsl",
	dataType: "xml"
});

var app = {
	source: null,
	id: null,
}

$(function() {
	var fetchAndTransform = function(id) {
		app.id = id;

		/* fetch XML and XSL */
		var fetchXML = $.ajax({
			url: xmlURL(id),
			dataType: "xml"
		});

		$.when(fetchXML, fetchXSL).done(transformDocument);
	};

	var transformXML = function(xsl, dom, callback) {
		if (app.source === "pmc") {
			var article = dom.getElementsByTagName("article")[0];

			var dom = document.implementation.createDocument(null, "article", null);

			while (article.firstChild) {
				var node = dom.adoptNode(article.firstChild);
				dom.documentElement.appendChild(node);
			}
		}

		var start = Date.now();
		/* import the XSL stylesheet */

		var processor = new XSLT2Processor();
		processor.importStylesheet(xsl).then(function() {
			var loaded = Date.now();
			var fragment = processor.transformToFragment(dom, document);
			var end = Date.now();

			if (typeof console != "undefined") {
				//console.log("loading the stylesheet took " + (loaded - start) + "ms, first transformation took " + (end - loaded) + "ms, second transformation took " + (second - end) + "ms,");
				console.log("loading the stylesheet took " + (loaded - start) + "ms, first transformation took " + (end - loaded) + "ms");
			}

			var node = document.createElement("div");
			node.appendChild(fragment);

			callback(node.firstChild);
		})
	};

	/* convert the article xml to HTML and append it to the document */
	var transformDocument = function(xmlXHR, xslXHR){
		transformXML(xslXHR[0], xmlXHR[0], function(html) {
			var article = $(html);
			console.log(article);
			document.title = article.find("h1").text();

			var published = article.find("header time");
			published.text(moment(published.text()).format("MMMM Do, YYYY"));

			/* fix up the document before inserting it */
			$(document).trigger("article.loaded", article);

			//article.find("img[position=float],figure[position=float] img").addClass("floating-image");

			/* insert the HTML fragment into the document */
			article.appendTo("body");

			$(document).trigger("article.ready", article);

			var id = location.hash;
			if (id) {
				var targetNode = $(id);
				//targetNode.removeClass("collapsed");

				if (targetNode.length) {
					window.setTimeout(function() {
						$("html, body").animate({
						   scrollTop: targetNode.offset().top
						}, 500);
					}, 500);
				}
			}
		});
	};

	var xmlURL = function() {
		switch (app.source) {
			case "gist":
				//return "https://api.github.com/gists/" + encodeURIComponent(app.id) + "/article.xml";
				return "http://xml.macropus.org/?scheme=gist&id=" + encodeURIComponent(app.id);

			case "pmc":
				return "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=" + encodeURIComponent(app.id);

			default:
				return app.id;
		}
	};

	var parseQueryString = function() {
		var data = {};

		location.search.substring(1).split("&").map(function(item) {
			return item.split("=").map(decodeURIComponent).map(function(text) {
				return text.replace(/\+/g, " ");
			});
		}).forEach(function(item) {
			if (item[1]) {
				data[item[0]] = item[1].replace(/\/$/, "");
			}
		});

		return data;
	};

	var fetchDOI = function(doi) {
		$.ajax({
			url: "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
			data: {
				tool: "macrodocs",
				email: "alf@hubmed.org",
				db: "pmc",
				retmax: 1,
				term: data.doi + "[DOI]"
			},
			dataType: "xml",
			success: function(doc) {
				var ids = doc.getElementsByTagName("Id");

				if (ids.length) {
					fetchAndTransform(ids.item(0).textContent);
				}
			}
		});
	};

	var data = parseQueryString();

	if (data.pmc) {
		app.source = "pmc";
		$("#index [name=pmc]").val(data.pmc);
		fetchAndTransform(data.pmc);
	} else if (data.doi) {
		app.source = "pmc";
		$("#index [name=doi]").val(data.doi);
		fetchDOI(data.doi);
	} else if (data.gist) {
		app.source = "gist";
		$("#index [name=gist]").val(data.gist);
		fetchAndTransform(data.gist);
	} else if (data.url) {
		app.source = "url";
		$("#index [name=url]").val(data.url);
		fetchAndTransform(data.url);
	} else {
		$("#index").show();

		if (data.q) {
			$("#index [name=q]").val(data.q);
			searchPMC(data.q);
		} else {
			searchPMC("plos one[ta]");
		}
	}
});
