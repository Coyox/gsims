/** Object to hold all HTML templates (pre-loaded) */
var html = {};

/** On load function */
$(function() {
	loadTemplates();
});

/** Pre-fetches the specified templates located in the /templates directory in an
	html object (to be used by the views later) */
function loadTemplates() {
	var promises = [];
	var templates = [
		"viewStudents.html",
		"studentRecord.html",
		"createStudent.html",
		"confirmationModal.html",
		"transactionResponse.html"
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

/** Initialization function */
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

		this.$el.find("table").before("<button class='btn btn-primary' id='refresh'>Refresh Table</button><br><br>");

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

	events: {
		"click #refresh": "refreshTable"
	},

	refreshTable: function() {
		this.render();
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
		+	"<td><a class='delete-student' id='<%= model.id %>'>[ delete ]</a></td>"
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
		"click .edit-student": "editStudent",
		"click .delete-student": "deleteStudent"
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
	},

	deleteStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new DeleteRecordView({
			id: id,
			el: $("#delete-container")
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
				if (view.action == "edit" && attr == "id") {
					// don't allow editing of ids
				} else {
					new StudentRecordRowView({
						el: view.addRow("#student-record-table tbody"),
						action: view.action,
						name: attr,
						value: value,
						model: model
					});
				}
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
		this.model.save().then(function(data) {
			new TransactionResponseView({
				message: "Record successfully saved. Click the refresh button on the table to see your changes (or just refresh the page)."
			});
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

		// you would get these attributes from the student model, but i
		// don't want to do the entire list right now. 
		var attributes = [ "firstName", "lastName", "email" ];
		var model = new Student();
		this.model = model;

		_.each(attributes, function(name, index) {
			new CreateStudentRowView({
				name: name,
				value: "",
				model: model,
				el: this.addRow(this.$el.find(".form-horizontal"))
			})
		}, this);

		this.$el.find(".form-horizontal").append("<div class='form-group'><div class='col-sm-12'><button class='btn btn-primary pull-right' id='create-student'>Create Student</button></div></div>");
	},	

	events: {
		"click #create-student": "createStudent"
	},

	addRow: function(selector) {
        var container = $("<div class='form-group'></div>");
        this.$el.find(selector).first().append(container);
        return container;		
	},

	createStudent: function(evt) {
		this.model.set({
			id: Math.floor(Math.random()*10000)
		});

		this.model.save(null, {
			type: "POST",
			url: "http://gobind-sarvar.rhcloud.com/api/students" // TODO: dont hardcode url
		}).then(function() {
			new TransactionResponseView({
				message: "Record successfully created. Click the refresh button on the table to see your changes (or just refresh the page)."
			});		
		});
	}
});

var CreateStudentRowView = Backbone.View.extend({
	template: _.template("<label class='control-label col-sm-2'><%= name %></label>"
		+	"<div class='col-sm-10'>"
		+		"<input type='text' class='form-control <%= name %>'"
		+	"</div>"),

	initialize: function(options) {
		this.name = options.name;
		this.value = options.value;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			name: this.name,
			value: ""
		}));
	},

	events: {
		"keyup input": "updateModel"
	},

	updateModel: function(evt) {
		var val = $(evt.currentTarget).val();
		this.model.set(this.name, val);
	}
});

var DeleteRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.append(html["confirmationModal.html"]);


		$("#confirmation-modal").modal({
			show: true
		});
		
		$("#confirmation-modal").on("hidden.bs.modal", function() {
			$("#confirmation-modal").remove();
			$(".modal-backdrop").remove();
		});
		
		$("#confirmation-modal").on("click", "#confirm-yes", function() {
			$("#confirmation-modal").remove();
			$(".modal-backdrop").remove();

			new Student({id: view.id}).destroy({dataType: "text"}).then(function(data) {
				new TransactionResponseView({
					message: "The record has been successfully deleted. Click the refresh button on the table to see your changes (or just refresh the page)"
				});
			}).fail(function(data) {
				console.log("FAILED");
			});
		});
	},	
});

var TransactionResponseView = Backbone.View.extend({
	initialize: function(options) {
		this.message = options.message;
		this.render();
	},

	render: function() {
		$("#container").append(html["transactionResponse.html"]);

		$("#transaction-modal .modal-body").html(this.message);

		$("#transaction-modal").modal({
			show: true
		});

		$("#transaction-modal").on("hidden.bs.modal", function() {
			$("#transaction-modal").remove();
			$(".modal-backdrop").remove();
		});
	}
});
