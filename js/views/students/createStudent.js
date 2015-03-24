var CreateStudentView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["createStudent.html"]);

		populateMonthMenu(this.$el.find("#month-menu"));
		populateDayMenu(this.$el.find("#day-menu"));
		populateYearMenu(this.$el.find("#year-menu"));
	},	

	events: {
		"click #search": "searchExistingStudent",
		"click #clear": "clearForm",
		"click #skip": "skipSearchCheck",
	},

	searchExistingStudent: function(evt) {
		var view = this;
		var params = {};
		var parent = this.$el.find("#quick-search");

		var firstName = parent.find("#first-name").val();
		if (firstName != "") {
			params.firstName = firstName;
		}

		var lastName = parent.find("#last-name").val();
		if (lastName != "") {
			params.lastName = lastName;
		}

		var month = this.$el.find("#month-menu option:selected");
		var day = this.$el.find("#day-menu option:selected");
		var year = this.$el.find("#year-menu option:selected");

		if (!month.is(":disabled") && !day.is(":disabled") && !year.is(":disabled")) {
			params.dateOfBirth = year.val() + "-" + month.val() + "-" + day.val();
		}

		var student = new Student();
		student.fetch({
			url: student.getSearchStudentsUrl(),
			data: params
		}).then(function(data) {
			// STUDENT MAY EXIST
			if (data.length) {
				app.Router.navigate("students/search");
				new StudentsTableView({
					el: $("#content"),
					results: data,
					template: "createStudentSearch.html"
				});
			}
			// STUDENT DOESNT EXIST
			else {
				view.enrollmentForm({
					firstName: firstName,
					lastName: lastName,
					month: month.val(),
					day: day.val(),
					year: year.val()
				});
			}
		});
	},

	skipSearchCheck: function() {
		this.enrollmentForm();
	},

	enrollmentForm: function(params) {
		app.Router.navigate("enrollmentForm", {trigger:true});

		var el = app.enrollmentFormView.el;
		_.each(params, function(value, name) {
			if (name == "firstName" || name == "lastName") {
				$(el).find("[name='" + name + "']").val(value);
			} else {
				console.log("#" + name + "-menu option[value='" + value + "']");
				$(el).find("#" + name + "-menu option[value='" + value + "']").prop("selected", true);
			}
		}, this);
		//app.enrollmentFormView.populateForm(params);
	},

	// saveStudent: function(evt) {
	// 	Backbone.Validation.bind(this);	

	// 	if (this.model.isValid(true)) {
	// 		this.model.save().then(function(data) {
	// 			console.log(data);
	// 		}).fail(function(data) {
	// 			new TransactionResponseView({
	// 				title: "ERROR",
	// 				status: "error",
	// 				message: "TODO"
	// 			});
	// 		});
	// 	}
	// },

	clearForm: function(evt) {
		this.$el.find("input").val("");
	},

	// loadCourseEnrollment: function() {
	// 	Backbone.Validation.bind(this);	

	// 	if (this.model.isValid(true)) {
	// 		app.Router.navigate("courseEnrollment", {trigger:true});
	// 		// this.model.save().then(function(data) {
	// 		// 	console.log(data);
	// 		// }).fail(function(data) {
	// 		// 	new TransactionResponseView({
	// 		// 		title: "ERROR",
	// 		// 		status: "error",
	// 		// 		message: "TODO"
	// 		// 	})
	// 		// });
	// 	}
	// }
});

var EnrollmentFormView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["enrollmentForm.html"]);

		var formTemplate = html["viewStudent.html"]();
		formTemplate = $(formTemplate).find("#student-info").html();

		this.$el.find("#form").html(formTemplate);
		this.$el.find(".form-buttons").remove();
		this.$el.find(".delete").remove();
		this.populateForm();
	},

	events: {
		"click #to-enrollment": "loadCourseEnrollment"
	},

	populateForm: function(prefilled) {
		this.model = new Student();
		_.each(this.model.toJSON(), function(value, attr) {
			if (this.model.nonEditable.indexOf(attr) == -1) {
				var filled = prefilled ? prefilled[attr] : undefined;
				if (filled) {
					value = filled;
					this.model.set(attr, value);
				} 
				console.log(attr, value);
				new StudentRecordRowView({
					el: this.addRow(this.model, attr),
					action: "edit",
					name: attr,
					value: value,
					model: this.model,
				});
			}
		}, this);
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

	loadCourseEnrollment: function() {
		Backbone.Validation.bind(this);	

		if (this.model.isValid(true)) {
			app.Router.navigate("courseEnrollment", {trigger:true});
			// this.model.save().then(function(data) {
			// 	console.log(data);
			// }).fail(function(data) {
			// 	new TransactionResponseView({
			// 		title: "ERROR",
			// 		status: "error",
			// 		message: "TODO"
			// 	})
			// });
		}	
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