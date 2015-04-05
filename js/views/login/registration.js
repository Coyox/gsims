var RegistrationFormView = Backbone.View.extend({
	initialize: function(options) {
		this.regType = options.regType;
		this.status = options.status;
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.html(html["registrationPage.html"]);

		if (this.regType == "admin") {
			this.regSearch = new RegSearchView({
				el: this.$el.find("#search-form")
			});
		} else {
			this.$el.find("#search-form").remove();
			this.$el.find("#results-form").remove();
		}

		this.regStudentInfo = new RegStudentInfo({
			el: this.$el.find("#info-form"),
			regType: this.regType
		});

		this.regSectionsView = new RegSectionsView({
			el: this.$el.find("#sections-form")
		});

		if (this.regType == "online") {
			this.termsView = new RegTOCView({
				el: this.$el.find("#terms-form")
			});
		} else {
			this.$el.find("#terms-form").remove();
		}

		this.$el.find("#registration-page").easyWizard({
			buttonsClass: "btn",
			submitButton: false,
			prevButton: "< Previous",
			stepClassName: "dude",
			before: function(wizardObj, currentStepObj, nextStepObj) {
				var elem = view.regType == "online" ? "#container" : "#test-reg";
				$(elem + ", html, body").scrollTop(0);

				var thisID = $(currentStepObj).attr("id");
				var nextID = $(nextStepObj).attr("id");
				if (thisID == "search-form" && nextID == "results-form") {
					var def = $.Deferred();
					view.regSearch.validate(def);
					$.when(def).then(function(validation) {
						if (validation && validation.data) {
							view.regResultsView = new RegResultsView({
								el: view.$el.find("#results-form"),
								data: validation.data
							});
							view.$el.find("#found").removeClass("hide").show();
							view.$el.find("#not-found").hide();
						} else {
							view.$el.find("#not-found").removeClass("hide").show();
							view.$el.find("#found").hide();
						}
						return true;
					});
				}
				else if (thisID == "results-form" && nextID == "info-form") {
					return true; // ?
				}
				else if (thisID == "info-form" && nextID == "sections-form") {
					return view.regStudentInfo.validate();
				}
				else if (thisID == "sections-form" && nextID == "terms-form") {
					return view.regSectionsView.validate();
				}
				else if (thisID == "sections-form" && nextID == "finish-form") {
					var studentModel = view.regStudentInfo.model;
					var sections = view.regSectionsView.sections;
					var formIsValid = view.regSectionsView.validate();
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
		var sectionids = [];
		var schoolid = this.regSectionsView.courseEnrollmentView.schoolid;
		_.each(sections, function(section, index) {
			sectionids.push(section.sectionid);
		}, this);
		studentModel.set("schoolid", schoolid);
		studentModel.set("status", this.status);
		studentModel.save().then(function(data) {
			if (typeof data == "string") {
				data = JSON.parse(data);
			}
			if (data.status == "success") {
				$.ajax({
					type: "POST",
					url: studentModel.enrollStudentInSections(studentModel.get("userid")),
					data: {
						sectionids: JSON.stringify(sectionids),
						status: view.status,
						schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
					}
				}).then(function(data) {
					if (typeof data == "string") {
						data = JSON.parse(data);
					}
					if (data.status == "success") {
						new TransactionResponseView({
							message: "Thank you for registering. You will receieve an email (" + studentModel.get("emailAddr") + ") when an administrator has approved your request.",
							redirect: true,
							url: view.regType == "online" ? "" : "home"
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

var RegSearchView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	render: function() {
		populateMonthMenu(this.$el.find("#month-menu"));
		populateDayMenu(this.$el.find("#day-menu"));
		populateYearMenu(this.$el.find("#year-menu"));
	},

	validate: function(def) {
		var view = this;
		var firstName = this.$el.find("#first-name").val();
		var lastName = this.$el.find("#last-name").val();
		var month = this.$el.find("#month-menu option:selected");
		var day = this.$el.find("#day-menu option:selected");
		var year = this.$el.find("#year-menu option:selected");

		if (firstName !== "" || lastName !== "" ||
				(!month.is(":disabled") && !day.is(":disabled") && !year.is(":disabled"))) {

			var params = {};
			if (firstName !== "") {
				params.firstName = firstName;
			}
			if (lastName !== "") {
				params.lastName = lastName;
			}
			if (!month.is(":disabled") && !day.is(":disabled") && !year.is(":disabled")) {
				var month = month.val();
				var day = day.val();
				var year = year.val();
				var dob = month + "-" + day + "-" + year;
				params.dateOfBirth = dob;
			}

			var student = new Student();
			student.fetch({
				url: student.getSearchStudentsUrl(sessionStorage.getItem("gobind-schoolid")),
				data: params
			}).then(function(data) {
				var ret;
				if (data.length == 0) {
					ret = true;
				} else {
					ret = {
						results: true,
						data: data
					}
				}
				def.resolve(ret);
			});	
		} else {
			def.resolve(true);
		}
	}
});

var RegResultsView = Backbone.View.extend({
	initialize: function(options) {
		this.data = options.data;
		this.render();
	},

	render: function() {
		var table = this.$el.find("#found table").dataTable();
		_.each(this.data, function(object, index) {
			table.dataTable().fnAddData([
				object.userid,
				object.firstName,
				object.lastName,
				object.emailAddr,
				"<span id='" + object.userid + "' class='view-student primary-link'>[ View Student ]</span>"
			]);
		});
	},
	
	events: {
		"click .view-student": "viewStudent"
	},

	viewStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("students/" + id, {trigger:true});
	}
});

var RegStudentInfo = Backbone.View.extend({
	initialize: function(options) {
		this.regType = options.regType;
		this.render();
	},

	render: function() {
		this.model = new Student();

		if (this.regType == "online") {
			this.model.nonEditable.push("paid");
		}
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
		console.log(this.studentModel);
		console.log(this.sections);
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