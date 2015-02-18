
var html = {};

$(function() {
	loadTemplates();
});

function loadTemplates() {
	var promises = [];
	var templates = [
		"viewStudents.html"
	];

	$.each(templates, function(i, name) {
		var promise = $.ajax("templates/" + name);
		promises.push(promise);
		$.when(promise).then(function(data) {
			html[name] = data;
		});
	});

	$.when.apply($, promises).then(function() {
		init();
	});
}

function init() {
	new FetchStudentsView({
		el: $("#students-container")
	});
	// new CreateStudentView({
	// 	el: $("#create-container")
	// });
	// new UpdateStudentView({
	// 	el: $("#update-container")
	// });
}

var FetchStudentsView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	render: function() {
		this.$el.html(html["viewStudents.html"]);

		var student = new Student();
		student.fetch().then(function(data) {
			console.log(data);
		});
	}
});
