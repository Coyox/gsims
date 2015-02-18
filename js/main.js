
var html = {};

$(function() {
	loadTemplates();
});

function loadTemplates() {
	var promises = [];
	var templates = [
		"viewStudents.html",
		"createStudent.html"
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
	new CreateStudentView({
		el: $("#create-container")
	});
	// new UpdateStudentView({
	// 	el: $("#update-container")
	// });
}

var FetchStudentsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.html(html["viewStudents.html"]);

		new Student().fetch().then(function(data) {
			_.each(data, function(object, index) {
				var model = new Student(object, {parse:true});
				new StudentRowView({
					model: model,
					el: view.addRow(".results")
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
	template: _.template("<td><a class='view-student' id='<%= model.id %>'>[ view ]</a></td>"
		+	"<td><a class='edit-student' id='<%= model.id %>'>[ edit ]</a></td>"
		+	"<td><%= model.id %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .view-student": "viewStudent",
		"click .edit-student": "editStudent"
	},

	viewStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new SingleStudentView({
			id: id
		});
	},

	editStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new EditStudentView({
			id: id
		});		
	}
});

var SingleStudentView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.render();
	},

	render: function() {
		this.$el.empty();
		new Student().fetch().then(function(data) {

		});
	}
});

var EditStudentView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.render();
	},

	render: function() {
		new Student({id: this.id}).fetch().then(function(data) {
			console.log(data);
		});
	}
});

var CreateStudentView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["createStudent.html"]);
	},	
});
