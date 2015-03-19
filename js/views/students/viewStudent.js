var StudentRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.action = options.action;
		this.id = options.id;
		this.render();
	},

	render: function() {
		var view = this;

		new Student({id: this.id}).fetch().then(function(data) {
			var model = new Student(data, {parse:true});
			view.model = model;
			view.model.set("id", view.model.get("userid"));
			view.studentInformationTab(data, model);
			view.emailTab(data);
			view.coursesTab(data, model);
			view.reportCardTab(data, model);
		});
	},

	events: {
		"click .delete-student": "deleteStudent",
		"click .edit-btn": "editStudent",
		"click .save-btn": "saveStudent"
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

	addEditRow: function(table) {
		var container = $("<tr></tr>");
		this.$el.find("#" + table).append(container);
		return container;
	},

	editStudent: function(evt) {
		var table = $(evt.currentTarget).closest(".student-component").find("table").attr("id");
		this.$el.find("#" + table).empty();

		$(evt.currentTarget).text("Save").removeClass("edit-btn").addClass("save-btn");

		var props = this.getPropertiesByType(table);

		_.each(this.model.toJSON(), function(value, attr) {
			if (props.indexOf(attr) > -1 && this.model.nonEditable.indexOf(attr) == -1) {
				new StudentRecordRowView({
					el: this.addEditRow(table),
					action: "edit",
					name: attr,
					value: value,
					model: this.model,
				});
			}
		}, this);
	},

	saveStudent: function(evt) {
		var view = this;
		this.model.save().then(function(data) {
			new TransactionResponseView({
				message: "Record successfully saved."
			});
			var table = $(evt.currentTarget).closest(".student-component").find("table").attr("id");
			view.$el.find("#" + table).empty();

			$(evt.currentTarget).text("Edit").removeClass("save-btn").addClass("edit-btn");

			var props = view.getPropertiesByType(table);

			_.each(view.model.toJSON(), function(value, attr) {
				if (props.indexOf(attr) > -1 && view.model.nonEditable.indexOf(attr) == -1) {
					new StudentRecordRowView({
						el: view.addEditRow(table),
						action: "view",
						name: attr,
						value: value,
						model: view.model,
					});
				}
			}, view);
		});
	},

	getPropertiesByType: function(type) {
		var props;
		if (type == "address-table") {
			props = this.model.addressProperties;
		} else if (type == "parent-table") {
			props = this.model.parentProperties;
		} else if (type == "emergency-table") {
			props = this.model.emergencyProperties;
		} else {
			props = this.model.studentProperties;
		}
		return props;
	},

	deleteStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new DeleteRecordView({
			id: id,
			el: $("#delete-container")
		});	
	},

	studentInformationTab: function(data, model) {
		_.each(data, function(value, attr) {
			if (this.model.nonEditable.indexOf(attr) > -1) {
				// ignore these attributes
			} else {
				new StudentRecordRowView({
					el: this.addRow(model, attr),
					action: this.action,
					name: attr,
					label: attr,
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

	/** TODO: Attendance tab */
	attendanceTab: function(data) {

	}
});

var StudentRecordRowView = Backbone.View.extend({
	viewTemplate: _.template("<td><%= name %></td><td><%= value %></td>"),
	editTemplate: _.template("<td><%= name %></td><td><input type='text' class='form-control input-sm' value='<%= value %>'></td>"),

	initialize: function(options) {
		this.action = options.action;
		this.name = options.name;
		this.label = options.label;
		this.value = options.value;
		this.render();
	},

	render: function() {
		this.label = capitalize(this.name);
		this.label = splitChars(this.label);
		this.label = this.simplifyName(this.label);

		if (this.action == "view") {
			this.$el.html(this.viewTemplate({
				name: this.label,
				value: this.value
			}));
		} else {
			this.$el.html(this.editTemplate({
				name: this.label,
				value: this.value
			}));
		}
	},

	events: {
		"keyup input": "updateModel"
	},

	updateModel: function(evt) {
		var val = $(evt.currentTarget).val();
		this.model.set(this.name, val);
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
		this.$el.html(html["enrolledSections.html"]);

		var view = this;
		var id = this.model.get("userid");
		this.model.fetch({url:this.model.getEnrolledSectionsUrl(id)}).then(function(data) {
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
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
		+   "<td><button class='view-section btn btn-xs btn-primary center-block' id='<%= model.userid %>'>Drop Section</button></td>"),

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