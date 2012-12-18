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

	var transformXML = function(xsl, dom) {
		/* import the XSL stylesheet */
		var processor = new XSLTProcessor();
		processor.importStylesheet(xsl);

		if (app.source === "pmc") {
			dom = dom.getElementsByTagName("article")[0];
		}

		/* transform the XML document to an XHTML fragment */
		var fragment = processor.transformToFragment(dom, document);

		var node = document.createElement("div");
		node.appendChild(fragment);

		return node.firstChild;
	};

	/* convert the article xml to HTML and append it to the document */
	var transformDocument = function(xmlXHR, xslXHR){
		var html = transformXML(xslXHR[0], xmlXHR[0]);
		var article = $(html);

		document.title = article.find("h1").text();

		var published = article.find("header time");
		published.text(moment(published.text()).format("MMMM Do, YYYY"));

		/* fix up the document before inserting it */
		$(document).trigger("article.loaded", article);

		//article.find("img[position=float],figure[position=float] img").addClass("floating-image");

		/* insert the HTML fragment into the document */
		article.appendTo("body");

		$(document).trigger("article.ready", article);
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
			data[item[0]] = item[1].replace(/\/$/, "");
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
		fetchAndTransform(data.pmc);
	} else if (data.doi) {
		app.source = "pmc";
		fetchDOI(data.doi);
	} else if (data.gist) {
		app.source = "gist";
		fetchAndTransform(data.gist);
	}
});
