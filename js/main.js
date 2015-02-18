
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

		new Student().fetch().then(function(data) {
			_.each(data, function(object, index) {
				var s = new Student(object, {parse:true});
				console.log(object);
				console.log(s);
			});
		});
	}
});

var StudentRowView = Backbone.View.extend({
	initialize: function() {
		this.firstName = id;
	},

	render: function() {

	}
});
