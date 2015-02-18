
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
				var model = new Student(object, {parse:true});
				new StudentRowView({
					model: model,
					el: view.addRow(".results");
				});
			});
		});
	},

	addRow: function(selector) {
        var container = $("<tr></tr>");
        this.$el.find(selector).first().append(container);
        return container;
	}
});

var StudentRowView = Backbone.View.extend({
	template: _.template("<td><%= model.id %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"),

	initialize: function() {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model
		}));
	}
});
