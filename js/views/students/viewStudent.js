var StudentRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.action = options.action;
		this.id = options.id;
		this.parentContainer = options.parentContainer;
		this.render();
	},

	render: function() {
		var view = this;

		new Student({id: this.id}).fetch().then(function(data) {
			var model = new Student(data, {parse:true});
			view.studentInformationTab(data, model);
			view.emailTab(data);
			view.coursesTab(data, model);
			view.reportCardTab(data, model);

			// if (view.action == "edit") {
			// 	view.addRow("#student-record-table tbody");
			// 	view.$el.find("tr").last().append("<td></td><td><button class='btn btn-primary' id='save-student'>Save</button></td>");
			// }
		});
	},

	events: {
		"click #save-student": "saveStudent",
		"click .delete-student": "deleteStudent"
	},

	addRow: function(model, attr) {
        var container = $("<tr></tr>");
        var parent;
		if (model.addressProperties.indexOf(attr) > -1) {
			parent = "#address-table";
        } else if (model.parentProperties.indexOf(attr) > -1) {
        	parent = "#parent-table";
        } else if (model.emergencyProperties.indexOf(attr) > -1) {
        	parent = "#emergency-table";
        } else {
        	parent = "#student-info-table";
        }
        parent = parent + " .results";
        this.$el.find(parent).append(container);
        return container;	
	},

	saveStudent: function(evt) {
		this.model.save().then(function(data) {
			new TransactionResponseView({
				message: "Record successfully saved. Click the refresh button on the table to see your changes (or just refresh the page)."
			});
		});
	},

	deleteStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new DeleteRecordView({
			id: id,
			el: $("#delete-container")
		});	
	},

	studentInformationTab: function(data, model) {
		this.model = model;
		_.each(data, function(value, attr) {
			if (this.model.nonEditable.indexOf(attr) > -1) {
				// ignore these attributes
			} else if (this.action == "edit" && attr == "id") {
				// don't allow editing of ids
			} else {
				new StudentRecordRowView({
					el: this.addRow(model, attr),
					action: this.action,
					name: attr,
					value: value,
					model: model
				});
			}
		}, this);
	},

	emailTab: function(data) {
		new EmailView({
			el: $("#email"),
			emailAddr: data.emailAddr
		});
	},

	coursesTab: function(data, model) {
		new EnrolledSectionsView({
			el: $("#course-info"),
			model: model
		});
	},
	
	reportCardTab: function(data, model) {
		new ReportCardView({
			el: $("#report-card"),
			model: model,
		});
	},
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
		this.name = capitalize(this.name);
		this.name = splitChars(this.name);
		this.name = this.simplifyName(this.name);

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
		console.log(this.model.toJSON());
	},

	simplifyName: function(str) {
		if (str.toLowerCase().indexOf("parent") > -1) {
			return str.slice(7);
		} else if (str.toLowerCase().indexOf("emergency") > -1) {
			return str.slice(18);
		}
		return str;
	}
});

var EnrolledSectionsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		console.log("render");
		this.$el.html(html["enrolledSections.html"]);

		var view = this;
		var id = this.model.get("userid");
		this.model.fetch({url:this.model.getEnrolledSectionsUrl(id)}).then(function(data) {
			console.log(data);
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
				console.log(section);
				new EnrolledSectionsRowView({
					el: view.addRow(),
					model: section
				});
			});
		});
	},

	addRow: function() {
        var container = $("<tr></tr>");
        this.$el.find("#enrolled-sections-table .results").first().append(container);
        return container;
	}
});

var EnrolledSectionsRowView = Backbone.View.extend({
	template: _.template("<td><%= model.courseName %></td>"
		+	"<td><%= model.sectionCode %></td>"
		+	"<td><%= model.day %></td>"
		+	"<td><%= model.startTime %></td>"
		+	"<td><%= model.endTime %></td>"
		+   "<td><button class='view-section btn btn-xs btn-primary center-block' id='<%= model.userid %>'>View Section</button></td>"),

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
		app.Router.navigate("students/" + id, {trigger:true});
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

// TODO: debug - copied from EnrolledSectionsView, etc, but not functioning fully yet
var ReportCardView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		console.log("render");
		this.$el.html(html["reportCard.html"]);

		var view = this;
		var id = this.model.get("userid");
		this.model.fetch({url:this.model.getEnrolledSectionsUrl(id)}).then(function(data) {
			console.log(data);
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
				console.log(section);
				new ReportCardRowView({
					el: view.addRow(),
					model: section
				});
			});
		});
	},

	addRow: function() {
        var container = $("<tr></tr>");
        this.$el.find("#report-card-table .results").first().append(container);
        return container;
	}
});

var ReportCardRowView = Backbone.View.extend({
	template: _.template("<td><%= model.courseName %></td>"
		+	"<td><%= model.sectionCode %></td>"
		// +	"<td><%= '[teacher name]' %></td>"
		// +	"<td><%= '[student's grade]' %></td>"
		+	"<td><%= model.day %></td>"
		+	"<td><%= model.startTime %></td>"),

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
		app.Router.navigate("students/" + id, {trigger:true});
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