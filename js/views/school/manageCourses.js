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
		"click #add-course": "addCourseToDept",
		"click #purge-courses": "purgeCourses"

	},

	purgeCourses: function(){
		var course = new Course();
		course.fetch().then(function(data) {
			var ids = [];
			_.each(data, function(object, index) {
				ids.push(object.courseid);
			});
			var purge = new Purge();
			$.ajax({
				type: "POST",
				url: purge.purgeCourses(),
				data: {
					deptids: JSON.stringify(ids)
				}
			}).then(function(data) {
           // if (typeof data == "string") {
           //     data = JSON.parse(data);
           // }
           if (data.status == "success") {
           	new TransactionResponseView({
           		message: "The selected records have successfully been purged."
           	});
           } else {
           	new TransactionResponseView({
           		title: "ERROR",
           		status: "error",
           		message: "The selected could not be purged. Please try again."
           	});
           }
       }).fail(function(data) {
       	new TransactionResponseView({
       		title: "ERROR",
       		status: "error",
       		message: "The selected could not be purged. Please try again."
       	});
       });
   });
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

		$("#course-container").removeClass("hide");

		var dept = new Dept();
		dept.fetch({
			url: dept.getCoursesUrl(id),
			data: {
				schoolyearid: app.selectedSchoolYearId
			}
		}).then(function(data) {
			var table = $("#course-list");
			table.find(".results").empty();

			if (data.length == 0) {
				table.hide();
				table.after("<br><div class='alert alert-danger'>No courses were found for this department.</div>");
			} else {
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
			}
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
		this.model = new Section();
		this.render();
	},

	render: function() {
		this.$el.html(html["viewCourse.html"]);

		if (this.action == "view") {
			this.$el.find("#edit-course").removeClass("hide").show();
			this.$el.find("#save-course").hide();
		} else {
			this.$el.find("#save-course").removeClass("hide").show();
			this.$el.find("#edit-course").hide();
		}
		var view = this;
		var course = new Course({id:this.id});
		$("#course-selection").data("courseid", this.id);
		var courseid = this.id;
		course.fetch().then(function(data) {
			_.each(data, function(value, attr) {
				new ViewCourseRow({
					el: view.addRow(),
					name: attr,
					value: value
				});
			});
			view.teachersForm(view.id);

			var section = new Section();
			section.fetch({
				url: section.getSearchSectionsUrl(),
				data: {
					schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
					schoolid: "412312",
					courseName: course.get("courseName")
				}
			}).then(function(data) {
				if (data.length == 0) {
					var table = view.$el.find("#sections-table");
					table.hide();
					table.after("<div class='alert alert-danger'>No sections were found for this course.</div>");
				}
				_.each(data, function(sec, index) {
					var section = new Section(sec, {parse:true});
					new CourseSectionView({
						el: view.addCourseSection(),
						model: section
					})
				});
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
		"click #edit-course": "editCourse",
		"click #save-course": "saveCourse",
		"click #add-section": "addSectionToCourse",
		"keyup input": "updateSection",
		"click #add-teacher": "addTeacherToCourse"
	},

	saveCourse: function(evt) {
		// Backbone.Validation.bind(this);
		// var view  = this;
		// if (this.model.isValid(true)) {
		// 	this.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
		// 	this.model.save().then(function(data) {
		// 		console.log(data);
		// 		if (typeof data == "string") {
		// 			data = JSON.parse(data);
		// 		}
		// 		if (data.status == "success") {
		// 			new TransactionResponseView({
		// 				message: "Course was successfully updated."
		// 			});
		// 			view.action = "view";
		// 			view.render();
		// 		} else {
		// 			new TransactionResponseView({
		// 				title: "ERROR",
		// 				status: "error",
		// 				message: "Course could not be updated. Please try again."
		// 			});
		// 		}
		// 	}).fail(function(data) {
		// 		new TransactionResponseView({
		// 			title: "ERROR",
		// 			status: "error",
		// 			message: "Course could not be updated. Please try again."
		// 		});
		// 	});
		// }
	},

	editCourse: function(evt) {
		// this.action = "edit";
		// this.render();
	},

	teachersForm: function(id) {
		new TeacherSectionView({
			el: $("#course-teachers-form"),
			courseid: id
		});
	},

	addSectionToCourse: function(evt) {
		var courseid = Backbone.history.fragment.split("/")[1];

		var view = this;

		this.$el.append(html["createSection.html"]);

		var elem = $("#create-section-modal");
		var backdrop = $(".modal-backdrop");

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		Backbone.Validation.bind(this);

		elem.on("click", "#save", function() {
			var days = [];
			_.each($(".day"), function(day, index) {
				if ($(day).is(":checked")) {
					days.push($(day).data("day").toUpperCase());
				}
			});
			days = days.join(",");
			view.model.set("day", days);
			view.model.set("courseid", courseid);
			view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
			view.model.set("status", "active");

			console.log(view.model);
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
},

addTeacherToCourse: function() {
	$("#container").append(html["addTeacherToSection.html"]);

	var elem = $("#add-teacher-modal");
	var backdrop = $(".modal-backdrop");

	new SearchTeachersView({
		el: $(".modal-body"),
		redirect: false,
		courseid: this.id
	});

	elem.modal({
		show: true
	});

	elem.on("hidden.bs.modal", function() {
		elem.remove();
		backdrop.remove();
	});

	this.model = new Course();
	Backbone.Validation.bind(this);

}
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
			_.each(data, function(value, attr) {
				new ViewSectionRow({
					el: view.addRow(),
					name: attr,
					value: value,
					action: view.action,
					model: view.model
				});
			});
			view.teachersForm(view.id);
			view.enrolledStudentsTab(view.id);
			view.attendanceTab(view.id);
			view.assignmentTab(view.id);
		});
	},

	events: {
		"click #edit-section": "editSection",
		"click #save-section": "saveSection",
		"click #add-student": "addStudent",
		"click #delete-section": "deleteSection",
		"click #add-teacher": "addTeacherToSection"
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

	teachersForm: function(id) {
		new TeacherSectionView({
			el: $("#section-teachers-form"),
			sectionid: id
		});
	},

	attendanceTab: function(id) {
		new AttendanceView({
			el: $("#attendance"),
			sectionid: id
		});
	},

	assignmentTab: function(id) {
		console.log("tab");
		new DocumentsView({
			el: $("#documents"),
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

	addTeacherToSection: function() {
		$("#container").append(html["addTeacherToSection.html"]);

		var elem = $("#add-teacher-modal");
		var backdrop = $(".modal-backdrop");

		new SearchTeachersView({
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
			// view.model.set("deptid", deptid);
			// view.model.set("courseName", view.$el.find("#courseName").val());
			// view.model.set("description", view.$el.find("#description").val());
			// view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
			// view.model.set("status", "active");
			// if (view.model.isValid(true)) {
			// 	elem.remove();
			// 	backdrop.remove();
			// 	view.model.save().then(function(data) {
			// 		if (data.status=="success") {
			// 			new TransactionResponseView({
			// 				message: "New course successfully created."
			// 			});
			// 			view.render();
			// 		}
			// 		else {
			// 			new TransactionResponseView({
			// 				title: "ERROR",
			// 				status: "error",
			// 				message: "Could not create a new course."
			// 			});
			// 		}
			// 	}).fail(function(data) {
			// 		new TransactionResponseView({
			// 			title: "ERROR",
			// 			status: "error",
			// 			message: "Could not create a new course."
			// 		});
			// 	});
			// }
		});
}


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

var TeacherSectionView = Backbone.View.extend({
	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.render();
	},

	render: function() {
		var view = this;
		if(typeof (this.sectionid) === 'undefined'){
			var course = new Course({id: this.courseid});
			course.fetch({
				url: course.getCourseTeachersUrl(this.courseid)
			}).then(function(data) {
				if (data.length == 0) {
					var table = view.$el.find("table");
					table.hide();
					table.after("<div class='alert alert-danger'>There are currently no teachers teaching this course.</div>");
				} else {
					_.each(data, function(teach, index) {
						var model = new Teacher(teach, {parse:true});
						new TeacherSectionRowView({
							el: view.addRow(),
							model: model,
							courseid: view.courseid,
							parent: view
						});
					});
				}
			});
		}
		else{
			var section = new Section({id: this.sectionid});
			section.fetch({
				url: section.getSectionTeachersUrl(this.sectionid)
			}).then(function(data) {
				if (data.length == 0) {
					var table = view.$el.find("table");
					table.hide();
					table.after("<div class='alert alert-danger'>There are currently no teachers teaching this section.</div>");
				} else {
					_.each(data, function(teach, index) {
						var model = new Teacher(teach, {parse:true});
						new TeacherSectionRowView({
							el: view.addRow(),
							model: model,
							sectionid: view.sectionid,
							parent: view
						});
					});
				}
			// view.table = view.$el.find("table").dataTable({
			// 	dom: "t"
			// });
		});


		}
	},

	addRow: function(evt) {
		var container = $("<tr></tr>");
		this.$el.find("table tbody").append(container);
		return container;
	}
});

var TeacherSectionRowView = Backbone.View.extend({
	template: _.template("<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+   "<td><span class='unassign-teacher primary-link center-block' id='<%= model.userid %>'>[ Unassign ]</span></td>"),

	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.parent = options.parent;
		this.render();
	},

	events: {
		"click .unassign-teacher": "unassignTeacher"
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	unassignTeacher: function(evt) {
		var view = this;
		var id = $(evt.currentTarget).attr("id");
		if(typeof (this.sectionid) === 'undefined'){
			var course = new Course();
			$.ajax({
				type: "DELETE",
				url: course.unassignCourseTeacherUrl(this.courseid, id),
			}).then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status=="success") {
					new TransactionResponseView({
						message: "Teacher was successfully unassigned."
					});
					view.parent.render();
				}
				else {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Cound not unassign teacher. Please try again."
					});
				}
			});


		}
		else {

			var section = new Section();
			$.ajax({
				type: "DELETE",
				url: section.unassignTeacherUrl(this.sectionid, id),
			}).then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status=="success") {
					new TransactionResponseView({
						message: "Teacher was successfully unassigned."
					});
					view.parent.render();
				}
				else {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Cound not unassign teacher. Please try again."
					});
				}
			});


		}

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
			if (data.length == 0) {
				var table = view.$el.find("table");
				table.hide();
				table.after("<div class='alert alert-danger'>There are currently no registered in this section.</div>");
			} else {
				_.each(data, function(student, index) {
					var model = new Student(student, {parse:true});
					new StudentsEnrolledRowView({
						el: view.addRow(),
						model: model,
						userid: model.get("userid"),
						sectionid: view.sectionid
					});
				});
				// view.table = view.$el.find("table").dataTable({
				// 	dom: "t"
				// });
			}
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
		+	"<td><%= grade %></td>"
		+   "<td><span class='drop-student primary-link center-block' id='<%= model.userid %>'>[ Drop Student ]</span></td>"),

	initialize: function(options) {
		this.userid = options.userid;
		this.sectionid = options.sectionid;
		this.render();
	},

	events: {
		"click .drop-student": "dropStudent"
	},

	render: function() {
		this.$el.find("tbody").empty();
		var view = this;
		var sectionid = this.model.get("sectionid");
		var userid = this.userid;
		var section = new Section();
		section.fetch({
			url: section.getStudentGradeForSection(sectionid, userid)
		}).then(function(data) {
			view.$el.html(view.template({
				model: view.model.toJSON(),
				grade: data.studentGrade || ""
			}));
		});
	},

	dropStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		var view = this;
		var sec = new Section({id: id});
		sec.destroy({
			url: sec.getDropStudentUrl(this.sectionid, id)
		}).then(function(data) {
			if (data.status=="success") {
				new TransactionResponseView({
					message: "Student has been successfully dropped."
				});
				view.render();
			}
			else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Student could not be dropped. Please try again."
				});
			}
		}).fail(function(data) {
			new TransactionResponseView({
				title: "ERROR",
				status: "error",
				message: "Student could not be dropped. Please try again."
			});
		});
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
		this.$el.find("table tbody").empty();
		$("#date").datepicker({
			dateFormat: "yy-mm-dd"
		});

		var view = this;
		var section = new Section();
		section.fetch({
			url: section.getStudentsEnrolled(this.sectionid),
		}).then(function(data) {
			if (data.length == 0) {
				var table = view.$el.find("table");
				table.hide();
				table.after("<div class='alert alert-danger'>There are currently no registered in this section.</div>");
			} else {
				_.each(data, function(student, index) {
					var model = new Student(student, {parse:true});
					new AttendanceRowView({
						el: view.addRow(model.get("userid")),
						model: model,
						userid: model.get("userid")
					});
				});
				//view.table = view.$el.find("table").dataTable({
				// 	dom: "t"
				// });
	}
});
	},

	events: {
		"change .toggle-checkboxes": "toggleCheckboxes",
		"click #update-attendance": "updateAttendance"
	},

	addRow: function(id) {
		var container = $("<tr></tr>");
		container.attr("id", id);
		this.$el.find("table tbody").append(container);
		return container;
	},

	updateAttendance: function() {
		var view = this;
		var rows = this.$el.find("table tbody tr");
		var attended = [];
		_.each(rows, function(row, index) {
			if ($(row).find("input[type='checkbox']").is(":checked")) {
				attended.push($(row).attr("id"));
			}
		}, this);

		var section = new Section();
		$.ajax({
			type: "POST",
			url: section.inputAttendance(this.sectionid),
			data: {
				date: this.$el.find("#date").val(),
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
				userids: JSON.stringify(attended)
			}
		}).then(function(data) {
			if (typeof data == "string") {
				data = JSON.parse(data);
			}
			if (data.status=="success") {
				new TransactionResponseView({
					message: "Attendance successfully inputted."
				});
				view.table.fnDestroy();
				view.render();
			}
			else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Could not input attendance. Please try again."
				});
			}
		}).fail(function(data) {
			new TransactionResponseView({
				title: "ERROR",
				status: "error",
				message: "Could not input attendance. Please try again."
			});
		});
	},

	toggleCheckboxes: function(evt) {
		var nodes = this.table.fnGetNodes();
		var checked = $(evt.currentTarget).is(":checked");
		_.each(nodes, function(row, index) {
			var checkbox = $(row).find("input[type='checkbox']");
			checkbox.prop("checked", checked);
		}, this);
	},
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


var DocumentsView = Backbone.View.extend({
	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.render();
	},

	render: function() {
		this.$el.find("table tbody").empty();

		var view = this;
		var doc = new Document();
		this.model = doc;
		doc.fetch({
			data: {
				sectionid: this.sectionid
			}
		}).then(function(data) {
			if (data.length == 0) {
				var table = view.$el.find("table");
				table.hide();
				table.after("<br><br><div class='alert alert-danger'>There are currently no documents/assignments/quizzes for this section.</div>");
			} else {
				_.each(data, function(doc, index) {
					var d1 = new Document(doc, {parse:true});
					new DocumentRowView({
						el: view.addRow(),
						model: d1,
					});
				});
				// view.table = view.$el.find("table").dataTable({
				// 	dom: "t"
				// });
	}
});
	},

	events: {
		"change .toggle-checkboxes": "toggleCheckboxes",
		"click #update-attendance": "updateAttendance",
		"click #add-document": "createDocument",
		"change input": "updateModel"
	},

	addRow: function(id) {
		var container = $("<tr></tr>");
		container.attr("id", id);
		this.$el.find("table tbody").append(container);
		return container;
	},

	createDocument: function() {
		this.$el.append(html["createDocument.html"]);
		var view = this;
		var elem = $("#create-doc-modal");
		var backdrop = $(".modal-backdrop");

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		Backbone.Validation.bind(this);

		elem.on("click", "#save", function() {
			view.model.set("sectionid", view.sectionid);
			view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
			view.model.set("userid", JSON.parse(sessionStorage.getItem("gobind-user")).userid);
			view.model.set("status", "active");
			console.log(view.model.toJSON());
			if (view.model.isValid(true)) {
				elem.remove();
				backdrop.remove();
				view.model.save().then(function(data) {
					if (data.status=="success") {
						new TransactionResponseView({
							message: "New document successfully created."
						});
						view.table.fnDestroy();
						view.render();
					}
					else {
						new TransactionResponseView({
							title: "ERROR",
							status: "error",
							message: "Could not create a new document."
						});
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new document."
					});
				});
			}
		});
	},

	updateModel: function(evt) {
		var val = $(evt.currentTarget).val();
		var name = $(evt.currentTarget).attr("name");
		this.model.set(name, val);
		console.log(this.model.toJSON());
	}
});

var DocumentRowView = Backbone.View.extend({
	template: _.template("<td><%= model.docName %></td>"
		+	"<td><%= model.description %></td>"
		+	"<td><%= model.link %></td>"
		+	"<td><%= model.fullmark %></td>"
		+	"<td><%= model.status %></td>"
		// +	"<td><span id='<%= model.docid %>' class='edit-doc primary-link'>[ Edit ]</span></td>"
		+	"<td><span id='<%= model.docid %>' class='delete-doc primary-link'>[ Delete ]</span></td>"),

	initialize: function(options) {
		this.userid = options.userid;
		this.render();
	},

	events: {
		//"click .edit-doc": "editDocument",
		"click .delete-doc": "deleteDocument"
	},

	render: function() {
		var view = this;
		var sectionid = this.model.get("sectionid");
		var userid = this.userid;

		view.$el.html(view.template({
			model: view.model.toJSON()
		}));
	},

	editDocument: function(evt) {
		var id = $(evt.currentTarget).attr("id");

	},

	deleteDocument: function(evt) {
		var view = this;
		var id = $(evt.currentTarget).attr("id");
		$.ajax({
			type: "DELETE",
			url: this.model.urlRoot + "/" + id,
		}).then(function(data) {
			if (data.status=="success") {
				new TransactionResponseView({
					message: "Document successfully deleted."
				});
				view.table.fnDestroy();
				view.render();
			}
			else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Could not delete the document."
				});
			}
		}).fail(function(data) {
			new TransactionResponseView({
				title: "ERROR",
				status: "error",
				message: "Could not delete the document."
			});
		});
	}
});







