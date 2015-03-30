var CourseManagement = Backbone.View.extend({
	initialize: function(options) {
		var view = this;
		this.results = options.results;
		this.userid = options.userid;
		this.render();
	},

	render: function() {
		var view = this;

		if (this.onlineReg) {
			this.$el.find("#save-sections").remove();
		}

		if (this.results) {
			var school = new School();
			school.fetch().then(function(data) {
				var menu = view.$el.find("#school-menu");
				menu.append($("<option selected disabled>-- Select a School --</option>"));
				_.each(data, function(object, index) {
					var option = $("<option></option>");
					option.attr("value", object.schoolid);
					option.text(object.location);
					menu.append(option);
				});
			});	
		} else {
			this.$el.html(html["manageCourses.html"]);
			this.populateDepartments();
		}

		if (this.userid) {
			var student = new Student();
			student.fetch({
				url: student.getPrevEnrolledSections(this.userid),
				data: {
					schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
				}
			}).then(function(data) {
				console.log(data);
			});
		}

		this.courseTable = this.$el.find("#course-list").DataTable({
			dom: "t",
			bAutoWidth: false,
			aoColumns: [
				{ sWidth: "15%" },
				{ sWidth: "35%" },
				{ sWidth: "20%" },
				{ sWidth: "30%" }
			],
			bSort: false
		});

		this.enrolledTable = this.$el.find("#enrolled-list").DataTable({
			dom: "t",
			bSort: false
		});
	},

	events: {
		"click #save-sections": "saveEnrolledSections",
		"change #school-menu": "populateDepartments",
		"click #save-sections": "saveEnrolledSections",

		"click #add-course": "addCourseToDept"
	},

	populateDepartments: function(evt) {
		var view = this;
		var schoolid = evt ? $(evt.currentTarget).find("option:selected").attr("value") :
			$("#school-options").find("option:selected").attr("id");

		// temp fix
		if (!schoolid) {
			schoolid = "412312";
		}

		this.schoolid = schoolid;
		
		var school = new School();
		school.fetch({
			url: school.getDepartmentsUrl(schoolid),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
			}
		}).then(function(data) {
			_.each(data, function(object, index) {
				var dept = new Dept(object, {parse:true});
				new DepartmentSelectionView({
					el: view.addDepartmentListItem(),
					model: dept,
					parent: view.$el,
					parentView: view
				});
			});
		});
	},

	addDepartmentListItem: function() {
		var container = $("<li class='dept-item pull-left'></li>");
		this.$el.find("#department-list").append(container);
		return container;
	},

	saveEnrolledSections: function() {
		var sections = [];
		var rows = this.$el.find("#enrolled-list tbody tr");
		var valid = false;
		_.each(rows, function(row, index) {
			if ($(row).find(".dataTables_empty").length) {
				valid = false;
			} else {
				valid = true;
				sections.push($(row).data("section").sectionid);
			}
		}, this);
		
		if (!valid) {
			new TransactionResponseView({
				title: "Course Selection",
				message: "Please select at least one section before proceeding."
			});
		} else {
			var view = this;
			var student = new Student();
			$.ajax({
				type: "POST",
				url: student.enrollStudentInSections(this.userid),
				data: {
					sectionids: JSON.stringify(sections),
					status: "pending",
					schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
				}
			}).then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					new TransactionResponseView({
						message: "Thank you for enrolling. An administrator will email you when your selected courses have been approved for registration.",
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
		}
	},

	addCourseToDept: function(evt) {
		var deptid = $(".department.active").attr("id");

		var view = this;

		this.$el.append(html["createCourse.html"]);

		var elem = $("#create-course-modal");
		var backdrop = $(".modal-backdrop");

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		this.model = new Course();
		Backbone.Validation.bind(this);

		elem.on("click", "#save", function() {
			view.model.set("deptid", deptid);
			view.model.set("courseName", view.$el.find("#courseName").val());
			view.model.set("description", view.$el.find("#description").val());
			view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
			view.model.set("status", "active");
			if (view.model.isValid(true)) {
				elem.remove();
				backdrop.remove();
				view.model.save().then(function(data) {
					if (data.status=="success") {
						new TransactionResponseView({
							message: "New course successfully created."
						});
						view.render();
					}
					else {
						new TransactionResponseView({
							title: "ERROR",
							status: "error",
							message: "Could not create a new course."
						});
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new course."
					});
				});
			}
		});
	}	
});

var DepartmentSelectionView = Backbone.View.extend({
	template: _.template("<span id='<%= model.deptid %>' href='#' class='department btn btn-default btn-sm' data-name='<%= model.deptName %>'><%= model.deptName %></span>"),

	initialize: function(options) {
		var view = this;
		this.parent = options.parent;
		this.parentView = options.parentView;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .department": "showCoursesForDept"
	},

	showCoursesForDept: function(evt) {
		var view = this;
		var id = $(evt.currentTarget).attr("id");
		var name = $(evt.currentTarget).data("name");

		$(".department").removeClass("active");
		$(evt.currentTarget).addClass("active");

		$(".department-name").text(name);

		var dept = new Dept();
		dept.fetch({
			url: dept.getCoursesUrl(id),
			data: {
				schoolyearid: app.selectedSchoolYearId
			}
		}).then(function(data) {
			var table = $("#course-list");
			table.find(".results").empty();

			_.each(data, function(object, index) {
				var course = new Course(object, {parse:true});
				course.fetch({
					url: course.getCoursePrereqs(course.get("courseid"))
				}).then(function(data) {
					new CourseTableRowView({
						el: view.addCourseRow(),
						model: course,
						parentView: view.parentView,
						prereqs: data
					});
				});
			});
		});
	},

	addCourseRow: function() {
		var container = $("<tr></tr>");
		$("#course-list .results").append(container);
		return container;
	}
});

var CourseTableRowView = Backbone.View.extend({
	template: _.template("<td><span id='<%= model.courseid %>' class='view-course primary-link'>[ View Course ]</span></td>"
		+ 	"<td><%= model.courseName %></td>"
		+	"<td><%= model.description %></td>"
		+	"<td><%= prereqs %></td>"),

	initialize: function(options) {
		this.parentView = options.parentView;
		this.prereqs = options.prereqs;
		this.render();
	},

	render: function() {
		var prereqs;
		if (this.prereqs && this.prereqs.length) {
			prereqs = $.map(this.prereqs, function(object) {
				return object.prereq;
			}).join(",");
		} else {
			prereqs = "None";
		}

		this.$el.html(this.template({
			model: this.model.toJSON(),
			prereqs: prereqs
		}));
	},

	events: {
		"click td.details-control": "toggleRow",
		"click .view-course": "viewCourse"
	},

	toggleRow: function(evt) {
		var view = this;
		var tr = $(evt.currentTarget).closest("tr");
		var table = this.parentView.courseTable;
		var row = table.row(tr);

		if (tr.hasClass("shown")) {
			tr.next("tr").remove();
			tr.removeClass("shown");
		} else {
			var courseName = $(evt.currentTarget).data("name");
			var courseid = $(evt.currentTarget).data("courseid");
			var section = new Section();
			section.fetch({
				url: section.getSearchSectionsUrl(),
				data: {
					schoolyearid: app.selectedSchoolYearId,
					schoolid: app.selectedSchoolId,
					courseName: courseName
				}
			}).then(function(data) {
				tr.addClass("shown");

				new SectionSubView({
					el: view.createSubTable(tr),
					data: data,
					parentView: view.parentView,
					courseid: courseid
				});
			});			
		}
	},

	createSubTable: function(parent) {
		var row = $("<tr><td colspan='4'></td></tr>");
		parent.after(row);
		return row;
	},

	viewCourse: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("viewCourse/" + id, {trigger:true});
	}
});

var SectionSubView = Backbone.View.extend({
	initialize: function(options) {
		this.data = options.data;
		this.parentView = options.parentView;
		this.courseid = options.courseid;
		this.render();
	},

	render: function() {
		this.$el.find("td").html(html["subSection.html"]);

		this.$el.find("#sections-container").prepend("<button class='add-section btn btn-primary btn-sm' data-courseid='" + this.courseid + "'>Add Section to Course</button><br><br>");

		if (this.data.length == 0) {
			this.$el.find("td").append("<div class='well'>There are currently no sections available.</div>");
		} else {
			_.each(this.data, function(object, index) {
				var section = new Section(object, {parse:true});
				new SectionTableRowView({
					el: this.addRow(),
					model: section,
					parentView: this.parentView
				});
			}, this);
		}
	},

	events: {
		"click .add-section": "addSectionToCourse",
		"keyup input": "updateSection"
	},

	addRow: function() {
		var row = $("<li></li>");
		this.$el.find("#sections-list").append(row);
		return row;
	},

	addSectionToCourse: function(evt) {
		var courseid = $(evt.currentTarget).data("courseid");

		var view = this;

		$("#container").append(html["createSection.html"]);

		var elem = $("#create-section-modal");
		var backdrop = $(".modal-backdrop");

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		this.model = new Section();
		Backbone.Validation.bind(this);

		elem.on("click", "#save", function() {
			view.model.set("deptid", deptid);
			view.model.set("courseName", view.$el.find("#courseName").val());
			view.model.set("description", view.$el.find("#description").val());
			view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
			view.model.set("status", "active");
			if (view.model.isValid(true)) {
				elem.remove();
				backdrop.remove();
				view.model.save().then(function(data) {
					if (data.status=="success") {
						new TransactionResponseView({
							message: "New course successfully created."
						});
						view.render();
					}
					else {
						new TransactionResponseView({
							title: "ERROR",
							status: "error",
							message: "Could not create a new course."
						});
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new course."
					});
				});
			}
		});
	},

	updateSection: function(evt) {
		var val = $(evt.currentTarget).val();
		var name = $(evt.currentTarget).attr("name");
		this.model.set(name, val);
		console.log(this.model.toJSON());
	}
});

var SectionTableRowView = Backbone.View.extend({
	template: _.template("<span><strong>Time: </strong><span><%= model.day %> <%= model.startTime %> to <%= model.endTime %></span></span>"
		+	"<br>"
		+	"<strong>Location: </strong><span><%= model.roomLocation %></span>"
		+	"<br>"
		+	"<strong>Registered Students: <%= model.classSize %> (<%= model.roomCapacity %> spaces available)" 
		+	"<br>"
		+	"<a class='enroll-link'>Edit this section</a>"
		+	"<br>"),

	initialize: function(options) {
		this.parentView = options.parentView;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .enroll-link": "enrollInSection",
		"click .remove-section": "removeSection"
	},

	enrollInSection: function(evt) {
		var row = this.parentView.enrolledTable.row.add([
			this.model.get("courseName"),
			this.model.get("sectionCode"),
			this.model.get("day"),
			this.model.get("startTime"),
			this.model.get("endTime"),
			"<span class='remove-section link'>Remove</span>"
		]).draw().node();

		$(evt.currentTarget).append("<span class='glyphicon glyphicon-ok'></span>");
		$(row).attr("id", this.model.get("sectionid"))
			.data("section", this.model.toJSON());
	},

	removeSection: function(evt) {
		this.parentView.enrolledTable
			.row($(evt.currentTarget).parents("tr"))
			.remove()
			.draw();
	}
});

var ViewCourse = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.action = "view";
		this.render();
	},

	render: function() {
		this.$el.html(html["viewCourse.html"]);

		var view = this;
		var course = new Course({id:this.id});
		course.fetch().then(function(data) {
			console.log(data);
			_.each(data, function(value, attr) {
				new ViewCourseRow({
					el: view.addRow(),
					name: attr,
					value: value
				});
			});

			var section = new Section();
			section.fetch({
				url: section.getSearchSectionsUrl(),
				data: {
					schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
					schoolid: "412312",
					courseName: course.get("courseName")
				}
			}).then(function(data) {
				console.log(data);
				_.each(data, function(sec, index) {
					var section = new Section(sec, {parse:true});
					new CourseSectionView({
						el: view.addCourseSection(),
						model: section
					})
				})
			});	
		});
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find(".form-horizontal").append(container);
		return container;
	},

	addCourseSection: function() {
		var container = $("<tr></tr>");
		this.$el.find("table tbody").append(container);
		return container;
	},

	events: {
		"click #add-section": "addSectionToCourse",
		"keyup input": "updateSection"
	},

	addSectionToCourse: function(evt) {
		var courseid = $(evt.currentTarget).data("courseid");

		var view = this;

		$("#container").append(html["createSection.html"]);

		var elem = $("#create-section-modal");
		var backdrop = $(".modal-backdrop");

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		this.model = new Section();
		Backbone.Validation.bind(this);

		elem.on("click", "#save", function() {
			view.model.set("deptid", deptid);
			view.model.set("courseName", view.$el.find("#courseName").val());
			view.model.set("description", view.$el.find("#description").val());
			view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
			view.model.set("status", "active");
			if (view.model.isValid(true)) {
				elem.remove();
				backdrop.remove();
				view.model.save().then(function(data) {
					if (data.status=="success") {
						new TransactionResponseView({
							message: "New course successfully created."
						});
						view.render();
					}
					else {
						new TransactionResponseView({
							title: "ERROR",
							status: "error",
							message: "Could not create a new course."
						});
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new course."
					});
				});
			}
		});
	},
});


var ViewCourseRow = Backbone.View.extend({
	viewTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<span><%= value %></span>"
		+	"</div>"),

	editTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<input type='text' class='form-control input-sm' value='<%= value %>' name='<%= name %>'>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	initialize: function(options) {
		this.name = options.name;
		this.value = options.value;
		this.render();
	},

	render: function() {
		this.label = capitalize(this.name);
		this.label = splitChars(this.label);

		this.$el.html(this.viewTemplate({
			label: this.label,
			value: this.value
		}));
	}
});

var CourseSectionView = Backbone.View.extend({
	template: _.template("<td><span id='<%= model.sectionid %>' class='view-section primary-link'>[ View Section ]</span></td>"
		+	"<td><%= model.courseName %></td>"
		+	"<td><%= model.sectionCode %></td>"
		+	"<td><%= model.day %></td>"
		+	"<td><%= model.startTime %></td>"
		+	"<td><%= model.endTime %></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .view-section": "viewSection"
	},

	viewSection: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("viewSection/" + id, {trigger:true});
	}
});

var SectionView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.action = "view";
		this.render();
	},

	render: function() {
		this.$el.html(html["viewSection.html"]);

		if (this.action == "view") {
			this.$el.find("#edit-section").removeClass("hide").show();
			this.$el.find("#save-section").hide();
		} else {
			this.$el.find("#save-section").removeClass("hide").show();
			this.$el.find("#edit-section").hide();
		}

		var view = this;
		this.model = new Section({id: this.id});
		this.model.fetch().then(function(data) {
			console.log(data);
			_.each(data, function(value, attr) {
				new ViewSectionRow({
					el: view.addRow(),
					name: attr,
					value: value,
					action: view.action,
					model: view.model
				});
			});
			view.enrolledStudentsTab(view.id);
			view.attendanceTab(view.id);
		});
	},

	events: {
		"click #edit-section": "editSection",
		"click #save-section": "saveSection",
		"click #add-student": "addStudent",
		"click #delete-section": "deleteSection"
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find(".form-horizontal").append(container);
		return container;
	},

	addCourseSection: function() {
		var container = $("<tr></tr>");
		this.$el.find("table tbody").append(container);
		return container;
	},

	enrolledStudentsTab: function(id) {
		new StudentsEnrolledView({
			el: $("#student-enrolled"),
			sectionid: id
		});
	},

	attendanceTab: function(id) {
		new AttendanceView({
			el: $("#attendance"),
			sectionid: id
		});
	},

	editSection: function(evt) {
		this.action = "edit";
		this.render();
	},

	deleteSection: function(evt) {
		this.model.set("id", this.id);
		this.model.destroy().then(function(data) {
			if (typeof data == "string") {
				data = JSON.parse(data);
			}
			if (data.status == "success") {
				new TransactionResponseView({
					message: "Section was successfully deleted."
				});
				view.action = "view";
				view.render();
			} else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Section could not be deleted. Please try again."
				});			
			}
		}).fail(function(data) {
			new TransactionResponseView({
				title: "ERROR",
				status: "error",
				message: "Section could not be deleted. Please try again."
			});	
		});
	},

	saveSection: function(evt) {
		Backbone.Validation.bind(this);
		var view  = this;
		if (this.model.isValid(true)) {
			this.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
			this.model.save().then(function(data) {
				console.log(data);
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					new TransactionResponseView({
						message: "Section was successfully updated."
					});
					view.action = "view";
					view.render();
				} else {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Section could not be updated. Please try again."
					});			
				}
			}).fail(function(data) {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Section could not be updated. Please try again."
				});		
			});
		}
	},

	addStudent: function() {
		$("#container").append(html["addStudentToSection.html"]);

		var elem = $("#add-student-modal");
		var backdrop = $(".modal-backdrop");

		new SearchStudentsView({
			el: $(".modal-body"),
			redirect: false,
			sectionid: this.id
		});

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		this.model = new Section();
		Backbone.Validation.bind(this);

		elem.on("click", "#save", function() {
			view.model.set("deptid", deptid);
			view.model.set("courseName", view.$el.find("#courseName").val());
			view.model.set("description", view.$el.find("#description").val());
			view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
			view.model.set("status", "active");
			if (view.model.isValid(true)) {
				elem.remove();
				backdrop.remove();
				view.model.save().then(function(data) {
					if (data.status=="success") {
						new TransactionResponseView({
							message: "New course successfully created."
						});
						view.render();
					}
					else {
						new TransactionResponseView({
							title: "ERROR",
							status: "error",
							message: "Could not create a new course."
						});
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new course."
					});
				});
			}
		});	
	},


});

var ViewSectionRow = Backbone.View.extend({
	viewTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<span><%= value %></span>"
		+	"</div>"),

	editTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<input type='text' class='form-control input-sm' value='<%= value %>' name='<%= name %>'>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	initialize: function(options) {
		this.action = options.action;
		this.name = options.name;
		this.value = options.value;
		this.render();
	},

	events: {
		"change input": "updateModel",
	},

	render: function() {
		this.label = capitalize(this.name);
		this.label = splitChars(this.label);

		if (this.action == "view") {
			this.$el.html(this.viewTemplate({
				label: this.label,
				value: this.value,
				name: this.name
			}));
		} else {
			this.$el.html(this.editTemplate({
				label: this.label,
				value: this.value,
				name: this.name
			}));
		}
	},

	updateModel: function(evt) {
		var val = $(evt.currentTarget).val();
		var name = $(evt.currentTarget).attr("name");
		this.model.set(name, val);
	}
});

var StudentsEnrolledView = Backbone.View.extend({
	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.render();
	},

	render: function() {
		var view = this;
		var section = new Section();
		section.fetch({
			url: section.getStudentsEnrolled(this.sectionid),
		}).then(function(data) {
			console.log(data);
			_.each(data, function(student, index) {
				var model = new Student(student, {parse:true});
				new StudentsEnrolledRowView({
					el: view.addRow(),
					model: model,
					userid: model.get("userid")
				});
			});
		});	
	},

	addRow: function(evt) {
		var container = $("<tr></tr>");
		this.$el.find("table tbody").append(container);
		return container;
	}
});

var StudentsEnrolledRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+	"<td>grade</td>"
		+   "<td><span class='view-student primary-link center-block' id='<%= model.userid %>'>[ Drop Student ]</span></td>"),

	initialize: function(options) {
		this.userid = options.userid;
		this.render();
	},

	render: function() {
		var view = this;
		var sectionid = this.model.get("sectionid");
		var userid = this.userid;
		var section = new Section();
		section.fetch({
			url: section.getStudentGradeForSection(sectionid, userid)
		}).then(function(data) {
			console.log(data);
		});

		view.$el.html(view.template({
			model: view.model.toJSON()
		}));
	}
});


var AttendanceView = Backbone.View.extend({
	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.render();
	},

	events: {
		"click #update-attendance": "updateAttendance"
	},

	render: function() {
		var view = this;
		var section = new Section();
		section.fetch({
			url: section.getStudentsEnrolled(this.sectionid),
		}).then(function(data) {
			console.log(data);
			_.each(data, function(student, index) {
				var model = new Student(student, {parse:true});
				new AttendanceRowView({
					el: view.addRow(model.get("userid")),
					model: model,
					userid: model.get("userid")
				});
			});
		});	
	},

	addRow: function(id) {
		var container = $("<tr></tr>");
		container.attr("id", id);
		this.$el.find("table tbody").append(container);
		return container;
	},

	updateAttendance: function() {
		var rows = this.$el.find("table tbody tr");
		var attended = [];
		_.each(rows, function(row, index) {
			if ($(row).find("input[type='checkbox']").is(":checked")) {
				attended.push($(row).data("id"));
			}
		}, this);

		$.ajax({
			type: "POST",
			url: section.inputAttendance(this.sectionid),
			data: {
				
			}
		})

    inputAttendance: function(sectionid){
    	return this.urlRoot + "/" + sectionid + "/attendance";
	}
});

var AttendanceRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><input type='checkbox' class='attendnace' checked></td>"),

	initialize: function(options) {
		this.userid = options.userid;
		this.render();
	},

	render: function() {
		var view = this;
		var sectionid = this.model.get("sectionid");
		var userid = this.userid;

		view.$el.html(view.template({
			model: view.model.toJSON()
		}));
	}
});











