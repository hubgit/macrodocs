$(document).on("article.ready", function(event, article){
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.text = "MathJax.Hub.Startup.onload()";
	script.setAttribute("src", "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML");
	document.getElementsByTagName("head")[0].appendChild(script);
});
