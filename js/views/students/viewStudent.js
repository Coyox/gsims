var StudentRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.action = options.action;
		this.id = options.id;
		this.render();
	},

	render: function() {
		var view = this;

		var student = new Student();
		student.set("id", this.id);
		student.fetch().then(function(data) {
			var model = new Student(data, {parse:true});
			view.model = model;
			Backbone.Validation.bind(view);	

			view.model.set("id", view.model.get("userid"));
			view.studentInformationTab(data, model);
			view.emailTab(data);
			view.coursesTab(data, model);
			view.reportCardTab(data, model);
		});
	},

	events: {
		"click #delete-student": "deleteStudent",
		"click .edit-btn": "editStudent",
		"click .save-btn": "saveStudent",
		"click .cancel-btn": "saveStudent"
	},

	addRow: function(model, attr) {
        var container = $("<div class='form-group'></div>");
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
        this.$el.find(parent + ".form-horizontal").append(container);
        return container;	
	},

	addEditRow: function(table) {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#" + table).append(container);
		return container;
	},

	editStudent: function(evt) {
		this.model.untouched = JSON.stringify(this.model.toJSON());

		var table = $(evt.currentTarget).closest(".student-component").find(".form-horizontal").attr("id");
		this.$el.find("#" + table).empty();

		$(evt.currentTarget).hide()
		$(evt.currentTarget).parent().find(".save-btn, .cancel-btn").removeClass("hide").show();

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
		var def = $.Deferred();
		
		if ($(evt.currentTarget).hasClass("cancel-btn")) {
			this.model.attributes = JSON.parse(this.model.untouched);
			def.resolve();
		} else {
			setDateOfBirth(this.model);
			if (this.model.isValid(true)) {
				if ($(evt.currentTarget).hasClass("save-btn")) {
					this.model.save().then(function(data) {
						new TransactionResponseView({
							message: "Record successfully saved."
						});
						def.resolve();
					});
				} 
			}
		}

		$.when(def).then(function() {
			var table = $(evt.currentTarget).closest(".student-component").find(".form-horizontal").attr("id");
			view.$el.find("#" + table).empty();

			$(evt.currentTarget).parent().find(".save-btn, .cancel-btn").hide();
			$(evt.currentTarget).parent().find(".edit-btn").removeClass("hide").show();

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
		new DeleteRecordView({
			id: this.model.get("id"),
			el: $("#container")
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
	viewTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<span><%= value %></span>"
		+	"</div>"),

	editTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<input type='text' class='form-control input-sm' value='<%= value %>' name='<%= name %>'>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	dobTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8 form-inline'>"
		+		"<select id='month-menu' class='form-control input-sm' name='month'></select>"
		+		"<select id='day-menu' class='form-control input-sm' name='day'></select>"
		+		"<select id='year-menu' class='form-control input-sm' name='year'></select>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	genderTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8 form-inline'>"
		+		"<input type='radio' class='form-control input-sm' name='<%= name %>' value='M'> Male"
		+		"<input type='radio' class='form-control input-sm' name='<%= name %>' value='F'> Female"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	statusTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<select id='status-menu' class='form-control input-sm' name='status'></select>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	paidTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8 form-inline'>"
		+		"<input type='radio' class='form-control input-sm' name='<%= name %>' value='1'> Paid"
		+		"<input type='radio' class='form-control input-sm' name='<%= name %>' value='0'> Unpaid"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

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

		var params = {
			name: this.name,
			label: this.label,
			value: this.value			
		};

		if (this.action == "view") {
			if (this.name == "prevAttendedGS") {
				params.value = "n/a";
			} 
			else if (this.name == "paid") {
				params.value = this.value == 1 ? "Paid" : "Unpaid";
			}
			else if (this.name == "status") {
				params.value = capitalize(this.value);
			}
			this.$el.html(this.viewTemplate(params));
		} else {
			// DOB month/day/year dropdown menu
			if (this.name == "dateOfBirth") {
				var month = "", day = "", year = "";
				if (this.value) {
					dob = this.value.split("-");
					month = dob[1];
					day = dob[2];
					year = dob[0];
				} 
				this.$el.html(this.dobTemplate(params));
				populateMonthMenu(this.$el.find("#month-menu"), month);
				populateDayMenu(this.$el.find("#day-menu"), day);
				populateYearMenu(this.$el.find("#year-menu"), year);
			} 
			// Gender radio boxes
			else if (this.name == "gender") {
				this.$el.html(this.genderTemplate(params));
				this.$el.find("[value='" + this.value + "']").prop("checked", true);
			} 
			// Status dropdown menu
			else if (this.name == "status") {
				this.$el.html(this.statusTemplate(params));
				populateStatusMenu(this.$el.find("#status-menu"), this.model.studentStatuses, this.value);
			}
			// Paid radio boxes
			else if (this.name == "paid") {
				this.$el.html(this.paidTemplate(params));
				this.$el.find("[value='" + this.value + "']").prop("checked", true);
			} 
			// Plain text field
			else {
				this.$el.html(this.editTemplate(params));
			}
		}
	},

	events: {
		"keyup input": "updateInput",
		"change select": "updateSelect",
		"change input[type='radio']": "updateRadio"
	},

	updateInput: function(evt) {
		var val = $(evt.currentTarget).val();
		this.model.set(this.name, val);
	},

	updateSelect: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).find("option:selected").val();
		this.model.set(name, val);
	},

	updateRadio: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).attr("value");
		this.model.set(name, val);
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
					model: section,
					studentid: id
				});
			});
			view.$el.find("table").dataTable({
				dom: "t"
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
		+   "<td><button class='drop-section btn btn-xs btn-primary center-block' id='<%= model.sectionid %>'>Drop Section</button></td>"),

	initialize: function(options) {
		this.studentid = options.studentid;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .drop-section": "dropSection"
	},

	dropSection: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		this.model.set("id", id);
		this.model.destroy({
			url: this.model.getDropStudentUrl(id, this.studentid)
		}).then(function(data) {
			console.log(data);
		});
	}
});

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
		+	"<td>[teacher name]</td>" // TODO: get these fields
		+	"<td>[student's grade]</td>"),

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