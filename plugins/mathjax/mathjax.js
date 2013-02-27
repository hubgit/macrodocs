$(document).on("article.ready", function(event, article){
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.text = "MathJax.Hub.Startup.onload()";
	script.setAttribute("src", "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML");
	document.getElementsByTagName("head")[0].appendChild(script);
});