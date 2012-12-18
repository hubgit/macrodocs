$(document).on("article.ready", function(event, article){
	var targets = {};

	$(article)
		.on("click", ".comments-toggle", function() {
			$(this).slideUp(100, "linear").next(".comments").slideDown(100, "linear");
		})
		.on("focus", ".comment-form [type=text]", function() {
			var container = $(this).closest(".comments");
			container.addClass("focussed");
			container.find(".comment-form-full textarea").focus();
		})
		.on("click", ".comment-form-full [type=reset]", function() {
			var container = $(this).closest(".comments");
			container.removeClass("focussed");
		})
		.on("click", ".comments-count", function() {
			var container = $(this).closest(".comments");
			container.toggleClass("comments-expanded");
		})
		.on("submit", ".comment-form,.comment-form-full", function(event) {
			event.preventDefault();
			alert("Hi!");
		});

	$("section > section").each(function() {
		var section = $(this);
		var sectionId = section.attr("id");

		var container = $("<div/>").addClass("comments");
		var inputForm = $(Templates.Input());
		var inputFormFull = $(Templates.InputFull({ image: "https://lh3.googleusercontent.com/-EHMuXvuZH1k/AAAAAAAAAAI/AAAAAAAAEcU/3z6LslnQ-U0/s32-c-k/photo.jpg" }));

		container.append(inputForm);
		container.append(inputFormFull);
		container.insertAfter(section);

		var toggle = $("<div/>").addClass("comments-toggle");
		toggle.insertAfter(section);

		targets[sectionId] = container;
	});

	$.getJSON("/plugins/comments/comments.json", function(data) {
		$.each(data.items, function(index, item) {
			var targetId = item.target.id;

			var targetNode = $("#" + targetId);

			if (!targetNode.length) {
				return false;
			}

			item.publishedText = moment(item.published).format("MMMM Do, YYYY");

			var comment = $(Templates.Comment(item));

			targets[targetId].prepend(comment);
			// TODO: sort by date
		});

		$.each(targets, function() {
			var node = $(this);

			var comments = node.find(".comment");
			var count = comments.length;

			if (!count) {
				return true; // continue
			}

			comments.sort(function(a,b){
				return $(a).data("published") < $(b).data("published");
			}).each(function(){
				node.prepend(this);
			}).each(function() {
				var comment = $(this);
				var reply = comment.data("reply-to");
				if (reply) {
					var parent = comments.filter(function() {
						return $(this).data("url") === reply;
					});

					parent.find(".comment-replies").append(comment);
				}
			});

			node.addClass("comments-expanded"); // temporary

			node.find(".comment:nth-last-child(2)").addClass("comment-last");

			var header = $(Templates.CommentsHeader({ count: count }));
			node.prepend(header);

			node.prev(".comments-toggle").css("opacity", 0.6);
		});
	});
});

