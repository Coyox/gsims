var RegistrationFormView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.html(html["registrationPage.html"]);

		this.regStudentInfo = new RegStudentInfo({
			el: this.$el.find("#info-form")
		});

		this.regSectionsView = new RegSectionsView({
			el: this.$el.find("#sections-form")
		});

		this.termsView = new RegTOCView({
			el: this.$el.find("#terms-form")
		});

		this.$el.find("#registration-page").easyWizard({
			buttonsClass: "btn",
			submitButton: false,
			prevButton: "< Previous",
			before: function(wizardObj, currentStepObj, nextStepObj) {
				var thisID = $(currentStepObj).attr("id");
				var nextID = $(nextStepObj).attr("id");
				if (thisID == "info-form" && nextID == "sections-form") {
					return view.regStudentInfo.validate();
				}
				else if (thisID == "sections-form" && nextID == "terms-form") {
					return view.regSectionsView.validate();
				}
				else if (thisID == "terms-form" && nextID == "finish-form") {
					var studentModel = view.regStudentInfo.model;
					var sections = view.regSectionsView.sections;
					var formIsValid = view.termsView.validate();
					if (formIsValid) {
						var finalView = new RegFinalView({
							el: view.$el.find("#finish-form"),
							studentModel: studentModel,
							sections: sections,
							schoolid: view.regSectionsView.schoolid
						});
						return true;
					} 
					return false;
				}
				return true;
			}
		});
	},

	events: {
		"click #finish-registration": "finishRegistration"
	},

	finishRegistration: function() {
		var view = this;
		var studentModel = this.regStudentInfo.model;
		var sections = this.regSectionsView.sections;
		studentModel.save().then(function(data) {
			console.log(data);
			if (data) {
				$.ajax({
					type: "POST",
					url: studentModel.enrollStudentInSections(studentModel.get("userid")),
					data: {
						sectionids: sections
					}
				}).then(function(data) {
					console.log(data);
					if (data) {
						new TransactionResponseView({
							message: "Thank you for registering. You will receieve an email (" + studentModel.get("emailAddr") + ") when an administrator has approved your request."
						});
					} else {
						new TransactionResponseView({
							title: "ERROR",
							status: "error",
							message: "Sorry, we could not process your request. Please try again."
						});
					}
				});
			} else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Sorry, we could not process your request. Please try again."
				});
			}
		});
	}
});

var RegStudentInfo = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.model = new Student();

		this.model.nonEditable.push("paid");
		this.model.nonEditable.push("status");		

		_.each(this.model.toJSON(), function(value, attr) {
			if (this.model.nonEditable.indexOf(attr) == -1) {
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

	validate: function() {
		Backbone.Validation.bind(this);
		setDateOfBirth(this.model);
		console.log(this.model);
		if (this.model.isValid(true)) {
			return true;
		}
		return false;
	}
});

var RegSectionsView = Backbone.View.extend({
	initialize: function() {
		this.sections = [];
		this.render();
	},

	render: function() {
		var view = this;
		this.courseEnrollmentView = new CourseEnrollmentView({
			el: this.el,
			results: true
		});
	},

	validate: function() {		
		var rows = this.$el.find("#enrolled-list tbody tr");
		var valid = false;
		_.each(rows, function(row, index) {
			if ($(row).find(".dataTables_empty").length) {
				valid = false;
			} else {
				valid = true;
				this.sections.push($(row).data("section"));
			}
		}, this);
		
		if (!valid) {
			new TransactionResponseView({
				title: "Course Selection",
				message: "Please select at least one section before proceeding."
			});
			return false;
		}
		return true;
	}
});

var RegTOCView = Backbone.View.extend({
	validate: function() {
		var agreed = this.$el.find("input[name='toc'][value='1']").is(":checked");
		if (!agreed) {
			new TransactionResponseView({
				title: "Terms and Conditions",
				message: "Please agree to our terms and conditions before proceeding."
			});
			return false;			
		}
		return true;
	}
});

var RegFinalView = Backbone.View.extend({
	initialize: function(options) {
		this.studentModel = options.studentModel;
		this.sections = options.sections;
		this.schoolid = options.schoolid;
		this.render();
	},

	render: function() {
		this.studentModel.nonEditable.push("paid");
		this.studentModel.nonEditable.push("status");		
		//this.studentModel.set("schoolid", this.schoolid);

		_.each(this.studentModel.toJSON(), function(value, attr) {
			if (this.studentModel.nonEditable.indexOf(attr) == -1) {
				new StudentRecordRowView({
					el: this.addRow(this.studentModel, attr),
					action: "view",
					name: attr,
					value: value,
					model: this.studentModel,
				});
			}
		}, this);

		new RegFinalSectionsView({
			el: this.$el.find("#final-sections"),
			sections: this.sections
		})
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
});

var RegFinalSectionsView = Backbone.View.extend({
	template: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<span><%= value %></span>"
		+	"</div>"),

	initialize: function(options) {
		this.sections = options.sections;
		this.render();
	},

	render: function() {
		_.each(this.sections, function(section, index) {
			var container = this.addRow();
			container.append(this.template({
				label: section.courseName,
				value: section.day + " " + section.startTime + " to " + section.endTime
			}));
		}, this);
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.append(container);
		return container;
	}
});