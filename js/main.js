
var html = {};

$(function() {
	loadTemplates();
});

function loadTemplates() {
	var promises = [];
	var templates = [
		"viewStudents.html",
		"studentRecord.html",
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
				new StudentTableRowView({
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

var StudentTableRowView = Backbone.View.extend({
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
		new StudentRecordView({
			id: id,
			el: $("#student-container"),
			action: "view"
		});
	},

	editStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new StudentRecordView({
			id: id,
			el: $("#update-container"),
			action: "edit"
		});		
	}
});

var StudentRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.action = options.action;
		this.id = options.id;
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.empty();
		this.$el.html(html["studentRecord.html"]);

		new Student({id: this.id}).fetch().then(function(data) {
			var model = new Student(data, {parse:true});
			view.model = model;

			_.each(data, function(value, attr) {
				new StudentRecordRowView({
					el: view.addRow("#student-record-table tbody"),
					action: view.action,
					name: attr,
					value: value,
					model: model
				});
			});

			if (view.action == "edit") {
				view.addRow("#student-record-table tbody");
				view.$el.find("tr").last().append("<td></td><td><button class='btn btn-primary' id='save-student'>Save</button></td>");
			}
		});
	},

	events: {
		"click #save-student": "saveStudent"
	},

	addRow: function(selector) {
        var container = $("<tr></tr>");
        this.$el.find(selector).first().append(container);
        return container;	
	},

	saveStudent: function(evt) {
		this.model.save({
			sucess: function(model, response) {
				console.log("good", model, response);
			},
			error: function(model, response) {
				console.log("error", model, response);
			}
		});
	}
});

var StudentRecordRowView = Backbone.View.extend({
	viewTemplate: _.template("<td><%= name %></td><td><%= value %></td>"),
	editTemplate: _.template("<td><%= name %></td><td><input type='text' class='form-control' value='<%= value %>'></td>"),

	initialize: function(options) {
		this.action = options.action;
		this.name = options.name;
		this.value = options.value;
		this.render();
	},

	render: function() {
		if (this.action == "view") {
			this.$el.html(this.viewTemplate({
				name: this.name,
				value: this.value
			}));
		} else {
			this.$el.html(this.editTemplate({
				name: this.name,
				value: this.value
			}));
		}
	},

	events: {
		"change input": "updateModel"
	},

	updateModel: function(evt) {
		var val = $(evt.currentTarget).val();
		this.model.set(this.name, val);
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
