// DEPARTMENTS ===========================================


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

		this.$el.html(html["manageCourses.html"]);
		this.populateDepartments();

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
	},

	events: {
		"click #save-sections": "saveEnrolledSections",
		"change #school-menu": "populateDepartments",
		"click #add-course": "addCourseToDept",
		"click #purge-courses": "purgeCourses"

	},

	// purgeCourses: function(){
	// 	var course = new Course();
	// 	course.fetch().then(function(data) {
	// 		var ids = [];
	// 		_.each(data, function(object, index) {
	// 			ids.push(object.courseid);
	// 		});
	// 		var purge = new Purge();
	// 		$.ajax({
	// 			type: "POST",
	// 			url: purge.purgeCourses(),
	// 			data: {
	// 				deptids: JSON.stringify(ids)
	// 			}
	// 		}).then(function(data) {
	// 	           // if (typeof data == "string") {
	// 	           //     data = JSON.parse(data);
	// 	           // }
	// 	           if (data.status == "success") {
	// 	           	new TransactionResponseView({
	// 	           		message: "The selected records have successfully been purged."
	// 	           	});
	// 	           } else {
	// 	           	new TransactionResponseView({
	// 	           		title: "ERROR",
	// 	           		status: "error",
	// 	           		message: "The selected could not be purged. Please try again."
	// 	           	});
	// 	           }
	// 	       }).fail(function(data) {
	// 	       	new TransactionResponseView({
	// 	       		title: "ERROR",
	// 	       		status: "error",
	// 	       		message: "The selected could not be purged. Please try again."
	// 	       	});
	// 	    });
	// 	});
	// },

	populateDepartments: function(evt) {
		var view = this;
		var school = new School();
		school.fetch({
			url: school.getDepartmentsUrl(sessionStorage.getItem("gobind-schoolid")),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
			}
		}).then(function(data) {
			view.deptList = data;
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

	// saveEnrolledSections: function() {
	// 	var sections = [];
	// 	var rows = this.$el.find("#enrolled-list tbody tr");
	// 	var valid = false;
	// 	_.each(rows, function(row, index) {
	// 		if ($(row).find(".dataTables_empty").length) {
	// 			valid = false;
	// 		} else {
	// 			valid = true;
	// 			sections.push($(row).data("section").sectionid);
	// 		}
	// 	}, this);

	// 	if (!valid) {
	// 		new TransactionResponseView({
	// 			title: "Course Selection",
	// 			message: "Please select at least one section before proceeding."
	// 		});
	// 	} else {
	// 		var view = this;
	// 		var student = new Student();
	// 		$.ajax({
	// 			type: "POST",
	// 			url: student.enrollStudentInSections(this.userid),
	// 			data: {
	// 				sectionids: JSON.stringify(sections),
	// 				status: "pending",
	// 				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
	// 			}
	// 		}).then(function(data) {
	// 			if (typeof data == "string") {
	// 				data = JSON.parse(data);
	// 			}
	// 			if (data.status == "success") {
	// 				new TransactionResponseView({
	// 					message: "Thank you for enrolling. An administrator will email you when your selected courses have been approved for registration.",
	// 					redirect: true,
	// 					url: view.regType == "online" ? "" : "home"
	// 				});
	// 			} else {
	// 				new TransactionResponseView({
	// 					title: "ERROR",
	// 					status: "error",
	// 					message: "Sorry, we could not process your request. Please try again."
	// 				});
	// 			}
	// 		});
	// 	}
	// },

	addCourseToDept: function(evt) {
		var deptid = $(".department.active").attr("id");

		var view = this;

		this.$el.append(html["createCourse.html"]);

		var elem = $("#create-course-modal");
		var backdrop = $(".modal-backdrop");
		elem.find("#dept-placeholder").text($(".department-name").text());

		var menu = elem.find("#prereqs-menu");
		_.each(this.deptList, function(department, index) {
			var deptid = department.deptid;
			var opt = "<optgroup id='" + deptid + "' label='Department: " + department.deptName + "'></optgroup>";
			menu.append(opt);

			var dept = new Dept();
			dept.fetch({
				url: dept.getCoursesUrl(department.deptid),
				data: {
					schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
				}
			}).then(function(data) {
				_.each(data, function(course, index) {
					menu.find("optgroup[id='" + deptid + "']").append("<option id='" + course.courseid + "'>" + course.courseName + "</option>");
				});
			});
		}, this);

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
				view.model.save().then(function(data) {
					if (data.status=="success") {
						var prereqs = $("#prereqs-menu :selected");
						var ids = [];
						_.each(prereqs, function(option, index) {
							console.log(option);
							ids.push($(option).attr("id"));
						});
	
						// Add pre reqs (if any)
						if (ids.length) {
							$.ajax({
								type: "POST",
								url: view.model.addCoursePrereqs(data.courseid),
								data: {
									prereqs: JSON.stringify(ids)
								}
							}).then(function(data) {
								console.log(data);
							});
						}

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
					elem.remove();
					backdrop.remove();
				}).fail(function(data) {
					elem.remove();
					backdrop.remove();					
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new course."
					});
				});
			} else {
				console.log("invalid");
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
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
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
							prereqs: data,
							deptid: id
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
		this.deptid = options.deptid;
		this.render();
	},

	render: function() {
		var prereqs;
		if (this.prereqs && this.prereqs.length) {
			prereqs = $.map(this.prereqs, function(object) {
				return object.courseName;
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

	viewCourse: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("viewCourse/" + id + "/" + this.deptid, {trigger:true});
	}
});

// var SectionSubView = Backbone.View.extend({
// 	initialize: function(options) {
// 		this.data = options.data;
// 		this.parentView = options.parentView;
// 		this.courseid = options.courseid;
// 		this.render();
// 	},

// 	render: function() {
// 		this.$el.find("#sections-container").prepend("<button class='add-section btn btn-primary btn-sm' data-courseid='" + this.courseid + "'>Add Section to Course</button><br><br>");

// 		if (this.data.length == 0) {
// 			this.$el.find("td").append("<div class='well'>There are currently no sections available.</div>");
// 		} else {
// 			_.each(this.data, function(object, index) {
// 				var section = new Section(object, {parse:true});
// 				new SectionTableRowView({
// 					el: this.addRow(),
// 					model: section,
// 					parentView: this.parentView
// 				});
// 			}, this);
// 		}
// 	},

// 	events: {
// 		"click .add-section": "addSectionToCourse",
// 		"keyup input": "updateSection"
// 	},

// 	addRow: function() {
// 		var row = $("<li></li>");
// 		this.$el.find("#sections-list").append(row);
// 		return row;
// 	},

// 	addSectionToCourse: function(evt) {
// 		var courseid = $(evt.currentTarget).data("courseid");

// 		var view = this;

// 		$("#container").append(html["createSection.html"]);

// 		var elem = $("#create-section-modal");
// 		var backdrop = $(".modal-backdrop");

// 		elem.modal({
// 			show: true
// 		});

// 		elem.on("hidden.bs.modal", function() {
// 			elem.remove();
// 			backdrop.remove();
// 		});

// 		this.model = new Section();
// 		Backbone.Validation.bind(this);

// 		elem.on("click", "#save", function() {
// 			view.model.set("deptid", deptid);
// 			view.model.set("courseName", view.$el.find("#courseName").val());
// 			view.model.set("description", view.$el.find("#description").val());
// 			view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
// 			view.model.set("status", "active");
// 			if (view.model.isValid(true)) {
// 				elem.remove();
// 				backdrop.remove();
// 				view.model.save().then(function(data) {
// 					if (data.status=="success") {
// 						new TransactionResponseView({
// 							message: "New course successfully created."
// 						});
// 						view.render();
// 					}
// 					else {
// 						new TransactionResponseView({
// 							title: "ERROR",
// 							status: "error",
// 							message: "Could not create a new course."
// 						});
// 					}
// 				}).fail(function(data) {
// 					new TransactionResponseView({
// 						title: "ERROR",
// 						status: "error",
// 						message: "Could not create a new course."
// 					});
// 				});
// 			}
// 		});
// 	},

// 	updateSection: function(evt) {
// 		var val = $(evt.currentTarget).val();
// 		var name = $(evt.currentTarget).attr("name");
// 		this.model.set(name, val);
// 	}
// });

// var SectionTableRowView = Backbone.View.extend({
// 	template: _.template("<span><strong>Time: </strong><span><%= model.day %> <%= model.startTime %> to <%= model.endTime %></span></span>"
// 		+	"<br>"
// 		+	"<strong>Location: </strong><span><%= model.roomLocation %></span>"
// 		+	"<br>"
// 		+	"<strong>Registered Students: <%= model.classSize %> (<%= model.roomCapacity %> spaces available)"
// 		+	"<br>"
// 		+	"<a class='enroll-link'>Edit this section</a>"
// 		+	"<br>"),

// 	initialize: function(options) {
// 		this.parentView = options.parentView;
// 		this.render();
// 	},

// 	render: function() {
// 		this.$el.html(this.template({
// 			model: this.model.toJSON()
// 		}));
// 	},

// 	events: {
// 		"click .enroll-link": "enrollInSection",
// 		"click .remove-section": "removeSection"
// 	},

// 	enrollInSection: function(evt) {
// 		var row = this.parentView.enrolledTable.row.add([
// 			this.model.get("courseName"),
// 			this.model.get("sectionCode"),
// 			this.model.get("day"),
// 			this.model.get("startTime"),
// 			this.model.get("endTime"),
// 			"<span class='remove-section link'>Remove</span>"
// 			]).draw().node();

// 		$(evt.currentTarget).append("<span class='glyphicon glyphicon-ok'></span>");
// 		$(row).attr("id", this.model.get("sectionid"))
// 		.data("section", this.model.toJSON());
// 	},

// 	removeSection: function(evt) {
// 		this.parentView.enrolledTable
// 		.row($(evt.currentTarget).parents("tr"))
// 		.remove()
// 		.draw();
// 	}
// });

var ViewCourse = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.deptid = options.deptid;
		this.action = "view";
		this.model = new Course({id: this.id});
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
		$("#course-selection").data("courseid", this.id);
		var courseid = this.id;
		this.model.fetch().then(function(data) {
			_.each(data, function(value, attr) {
				if (view.action == "edit" && view.model.nonEditable.indexOf(attr) > -1) {

				} else {
					new ViewCourseRow({
						el: view.addRow(),
						name: attr,
						value: value,
						action: view.action,
						model: view.model
					});
				}
			});

			view.preReqsForm(courseid, view.model);

			view.teachersForm(view.id);

			view.sectionsForm(view.model.get("courseName"));
		});
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#general").append(container);
		return container;
	},

	events: {
		"click #edit-course": "editCourse",
		"click #save-course": "saveCourse",
		"keyup input": "updateCourse",
		"change select": "updateStatus",
		"click #add-teacher": "addTeacherToCourse"
	},

	saveCourse: function(evt) {
		Backbone.Validation.bind(this);
		var view  = this;
		this.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
		this.model.set("deptid", this.deptid);
		if (this.model.isValid(true)) {
			this.model.save().then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					new TransactionResponseView({
						message: "Course was successfully updated."
					});
					view.action = "view";
					view.render();
				} else {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Course could not be updated. Please try again."
					});
				}
			}).fail(function(data) {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Course could not be updated. Please try again."
				});
			});
		} else {
			console.log("invalid");
		}
	},

	editCourse: function(evt) {
		this.action = "edit";
		this.render();
	},

	teachersForm: function(id) {
		new TeacherSectionView({
			el: $("#course-teachers"),
			courseid: id
		});
	},

	preReqsForm: function(id, model) {
		var view = this;
		new CoursePreReqsView({
			el: $("#prereqs"),
			courseid: id,
			model: model
		});
	},

	sectionsForm: function(courseName) {
		new CourseSectionView({
			el: $("#course-sections"),
			courseName: courseName,
		});
	},

	updateCourse: function(evt) {
		var val = $(evt.currentTarget).val();
		var name = $(evt.currentTarget).attr("name");
		this.model.set(name, val);
	},

	updateStatus: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).find("option:selected").val();
		this.model.set(name, val);
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

	statusTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<select id='status-menu' class='form-control input-sm' name='status'></select>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	initialize: function(options) {
		this.name = options.name;
		this.value = options.value;
		this.action = options.action;
		this.render();
	},

	render: function() {
		this.label = capitalize(this.name);
		this.label = splitChars(this.label);

		var template = this.action == "view" ? this.viewTemplate : this.editTemplate;
		if (this.action == "edit" && this.name == "status") {
			this.$el.html(this.statusTemplate({
				label: this.label,
			}));
			populateStatusMenu(this.$el.find("#status-menu"), this.model.courseStatuses, this.value);
		} else {
			this.$el.html(template({
				label: this.label,
				value: this.value,
				name: this.name
			}));
		}
	}
});



// COURSE PRE REQS =============================================




var CoursePreReqsView = Backbone.View.extend({
	template: _.template("<ul class='list'></ul>"),

	initialize: function(options) {
		this.id = options.courseid;
		this.render();
	},

	events: {
		"click #add-prereq": "addPreReq"
	},

	render: function() {
		var view = this;

		this.$el.find(".form-horizontal").html(this.template());

		var courseid = this.id;
		view.model.fetch({
			url: view.model.getCoursePrereqs(courseid)
		}).then(function(data) {
			if (data.length) {
				view.preReqList = [];
				_.each(data, function(course, index) {
					new CoursePreReqsRowView({
						el: view.addPreReqRow(),
						model: view.model,
						course: course.courseName,
						pid: course.courseid,
						courseid: courseid,
						parentView: view
					});
					view.preReqList.push({
						courseName: course.courseName,
						courseid: course.courseid
					});
				});
			} else {
				var li = view.addPreReqRow();
				$(li).text("This course does not have any pre reqs.");
			}
		});
	},

	addPreReqRow: function() {
		var container = $("<li></li>");
		this.$el.find(".list").append(container);
		return container;
	},

	addPreReq: function(evt) {
		var courseid = Backbone.history.fragment.split("/")[1];

		var view = this;

		this.$el.append(html["addPreReq.html"]);

		var elem = $("#create-prereq-modal");
		var backdrop = $(".modal-backdrop");

		var menu = elem.find("#prereqs-menu");
		var school = new School();
		school.fetch({
			url: school.getDepartmentsUrl(sessionStorage.getItem("gobind-schoolid")),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
			}
		}).then(function(data) {
			var deptList = [];
			_.each(data, function(object, index) {
				deptList.push({
					deptid: object.deptid,
					deptName: object.deptName
				});
			});

			_.each(deptList, function(department, index) {
				var deptid = department.deptid;
				var opt = "<optgroup id='" + deptid + "' label='Department: " + department.deptName + "'></optgroup>";
				menu.append(opt);

				var dept = new Dept();
				dept.fetch({
					url: dept.getCoursesUrl(department.deptid),
					data: {
						schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
					}
				}).then(function(data) {
					_.each(data, function(course, index) {
						menu.find("optgroup[id='" + deptid + "']").append("<option id='" + course.courseid + "'>" + course.courseName + "</option>");
					});
				});
			}, this);
		});

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		Backbone.Validation.bind(this);

		elem.on("click", "#save", function() {
			var prereqs = $("#prereqs-menu :selected");
			var ids = [];
			_.each(prereqs, function(option, index) {
				ids.push($(option).attr("id"));
			});

			// Add pre reqs (if any)
			if (ids.length) {
				$.ajax({
					type: "POST",
					url: view.model.addCoursePrereqs(courseid),
					data: {
						prereqs: JSON.stringify(ids)
					}
				}).then(function(data) {
					new TransactionResponseView({
						message: "The selected courses have been added as a prereqs."
					})

					elem.remove();
					backdrop.remove();
					view.render();
				});
			} else {
				elem.remove();
				backdrop.remove();
			}
		});
	},
});

var CoursePreReqsRowView = Backbone.View.extend({
	template: _.template("<li><%= courseName %> <span id='<%= courseid %>' class='delete-prereq pull-right primary-link'>[ Delete ]</span></li>"),

	initialize: function(options) {
		this.courseName = options.course;
		this.pid = options.pid;
		this.courseid = options.courseid;
		this.parentView = options.parentView;
		this.render();
	},

	events: {
		"click .delete-prereq": "deletePrereq"
	},

	render: function() {
		this.$el.html(this.template({
			courseName: this.courseName,
			courseid: this.pid
		}));
	},

	deletePrereq: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		var course = new Course();
		var view = this;
		$.ajax({
			type: "DELETE",
			url: course.deleteCoursePrereq(this.courseid, id)
		}).then(function(data) {
			new TransactionResponseView({
				message: "This prereq has been deleted."
			});
			view.parentView.render();
		}).fail(function(data) {
			new TransactionResponseView({
				title: "ERROR",
				status: "error",
				message: "This prereq has been deleted."
			});
			view.parentView.render();
		});
	}
});




// SECTIONS =============================================



var CourseSectionView = Backbone.View.extend({
	template: _.template("<br>"
		+	"<button id='add-section' class='btn btn-primary btn-sm'>Add Section to Course</button>"
		+	"<br><br>"
		+	"<table id='sections-table' class='table table-striped table-bordered'>"
		+		"<thead>"
		+			"<tr>"
		+				"<th>View</th>"
		+				"<th>Section Code</th>"
		+				"<th>Day</th>"
		+				"<th>Start Time</th>"
		+				"<th>End Time</th>"
		+			"</tr>"
		+		"</thead>"
		+		"<tbody class='results'></tbody>"
		+	"</table>"),

	initialize: function(options) {
		this.courseName = options.courseName;
		this.model = new Section();
		this.render();
	},

	events: {
		"click #add-section": "addSectionToCourse",
		"keyup input": "updateModel"
	},

	render: function() {
		this.$el.html(this.template());

		var view = this;
		var section = new Section();
		section.fetch({
			url: section.getSearchSectionsUrl(sessionStorage.getItem("gobind-schoolid")),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
				courseName: this.courseName
			}
		}).then(function(data) {
			if (data.length == 0) {
				var table = view.$el.find("#sections-table");
				table.hide();
				table.after("<br><div class='alert alert-danger'>No sections were found for this course.</div>");
			}
			_.each(data, function(sec, index) {
				var section = new Section(sec, {parse:true});
				new CourseSectionRowView({
					el: view.addCourseSection(),
					model: section
				})
			});
		});
	},

	addCourseSection: function() {
		var container = $("<tr></tr>");
		this.$el.find("#sections-table tbody").append(container);
		return container;
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
			view.model.set("deptid", this.deptid);

			if (view.model.isValid(true)) {
				elem.remove();
				backdrop.remove();

				var section = new Section();
				view.model.save(null, {
					type: "POST",
					url: section.urlRoot
				}).then(function(data) {
					if (data.status=="success") {
						new TransactionResponseView({
							message: "New section successfully created."
						});
						view.render();
					}
					else {
						new TransactionResponseView({
							title: "ERROR",
							status: "error",
							message: "Could not create a new section."
						});
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new section."
					});
				});
			}
		});
	},

	updateModel: function(evt) {
		var val = $(evt.currentTarget).val();
		var name = $(evt.currentTarget).attr("name");
		this.model.set(name, val);		
	}

});


var CourseSectionRowView = Backbone.View.extend({
	template: _.template("<td><span id='<%= model.sectionid %>' class='view-section primary-link'>[ View Section ]</span></td>"
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



// VIEW SECTION ===========================================



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
		"click #delete-section": "deleteSection",
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
			el: $("#course-teachers"),
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
	template: _.template("<div id='course-teachers-form'>"
		+	"<br>"
		+	"<button id='add-teacher' class='btn btn-sm btn-primary'>Add Teacher(TA) to Course</button>"
		+	"<br><br>"
		+	"<table class='table table-striped table-bordered'>"
		+		"<thead>"
		+			"<tr>"
		+				"<th>First Name</th>"
		+				"<th>Last Name</th>"
		+				"<th>Unassign</th>"
		+			"</tr>"
		+		"</thead>"
		+		"<tbody class='results'></tbody>"
		+	"</table>"
		+ "</div>"),

	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.render();
	},

	events: {
		"click #add-teacher": "addTeacherToSection"
	},

	render: function() {
		var view = this;

		this.$el.html(this.template());

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
	},

	addTeacherToSection: function() {
		$("#container").append(html["addTeacherToSection.html"]);

		var elem = $("#add-teacher-modal");
		var backdrop = $(".modal-backdrop");

		new SearchTeachersView({
			el: $(".modal-body"),
			redirect: false,
			sectionid: this.sectionid,
			courseid: this.courseid,
			elem: elem,
			backdrop: backdrop,
			parentView: this
		});

		elem.modal({
			show: true
		});
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
		if (typeof (this.sectionid) === 'undefined'){
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
	template: _.template("<button id='add-student' class='btn btn-sm btn-primary'>Add Student</button>"
		+	"<br><br>"
		+	"<table class='table table-striped table-bordered'>"
		+		"<thead>"
		+			"<tr>"
		+				"<th>ID</th>"
		+				"<th>First Name</th>"
		+				"<th>Last Name</th>"
		+				"<th>Email Address</th>"
		+				"<th>Grade</th>"
		+				"<th>Drop</th>"
		+			"</tr>"
		+		"</thead>"
		+		"<tbody class='results'></tbody>"
		+	"</table>"),

	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.render();
	},

	events: {
		"click #add-student": "addStudent",
	},

	render: function() {
		this.$el.html(this.template());

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
						sectionid: view.sectionid,
						parentView: view
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
	},

	addStudent: function() {
		$("#container").append(html["addStudentToSection.html"]);

		var elem = $("#add-student-modal");
		var backdrop = $(".modal-backdrop");

		new SearchStudentsView({
			el: $(".modal-body"),
			redirect: false,
			sectionid: this.sectionid,
			elem: elem,
			backdrop: backdrop,
			parentView: this
		});

		elem.modal({
			show: true
		});

		$("#general").removeClass("col-sm-6").addClass("col-sm-8")
		$("#advanced").remove();


		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});
	},
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
		this.parentView = options.parentView;
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
				view.parentView.render();
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
	template: _.template("<div class='col-sm-6'>"
		+	"<h4 class='o-auto'>Number of Students: <span class='num-students'></span>"
		+		"<div class='pull-right'>"
		+			"<button id='add-attendance' class='btn btn-primary btn-sm'>Add Attendance</button>"
		+		"</div>"
		+	"</h4>"
		+	"<table id='attendance-table' class='table table-striped table-bordered'>"
		+		"<thead>"
		+			"<tr>"
		+				"<th>Date</th>"
		+				"<th># Attended</th>"
		+				"<th>Average Attendance</th>"
		+				"<th></th>"
		+			"</tr>"
		+		"</thead>"
		+		"<tbody class='results'></tbody>"
		+	"</table>"
		+ "</div>"),

	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.render();
	},

	events: {
		"click #update-attendance": "updateAttendance",
		"click #add-attendance": "addAttendance",
		"change .toggle-checkboxes": "toggleCheckboxes",
		"click #update-attendance": "updateAttendance"
	},

	render: function() {
		this.$el.html(this.template());

		var view = this;

		// Get enrolled students
		var enrolledStudents = [];
		var section = new Section();
		section.fetch({
			url: section.getStudentsEnrolled(this.sectionid),
		}).then(function(data) {
			view.$el.find(".num-students").text(data.length);
			_.each(data, function(user, index) {
				enrolledStudents.push(user.userid);

				var model = new Student(user, {parse:true});
				new AttendanceRecordView({
					el: view.addAttendanceRow(model.get("userid")),
					model: model,
					userid: model.get("userid")
				});				
			});
			view.enrolledStudents = data;
		});

		// Get all the attendance records for each unique date
		section.fetch({
			url: section.getSectionDates(this.sectionid),
		}).then(function(sectionDates) {
			_.each(sectionDates, function(obj, index) {

				section.fetch({
					url: section.getSectionAttendance(view.sectionid),
					data: {
						date: obj.date
					}
				}).then(function(attendanceRecords) {
					var attendedStudents = 0;
					_.each(attendanceRecords, function(record, index) {
						if (record.usertype == "S" && enrolledStudents.indexOf(record.userid) > -1) {
							attendedStudents++;
						}
					});
				
					section.fetch({
						url: section.getAverageAttendance(view.sectionid)
					}).then(function(avgAttendance) {

						var numStudents = enrolledStudents.length;
						var avg = (attendedStudents / numStudents) * 100;
						var avgString = attendedStudents + " / " + numStudents + " = " + avg;

						new AttendanceRowView({
							el: view.addRow(),
							date: obj.date,
							numStudents: numStudents,
							attendedStudents: attendedStudents,
							avg: avgString + "%",
							sectionid: view.sectionid,
							enrolledStudents: view.enrolledStudents
						});
					});	
				});
			});
		});
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find("#attendance-table tbody").append(container);
		return container;
	},

	addAttendanceRow: function(id) {
		var container = $("<tr></tr>");
		container.attr("id", id);
		this.$el.find("#enrolled-table tbody").append(container);
		return container;	
	},

	updateAttendance: function(elem, backdrop) {
		var view = this;
		var rows = this.$el.find("#enrolled-table tbody tr");
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
			}
			else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Could not input attendance. Please try again."
				});
			}
			view.render();
			elem.remove();
			backdrop.remove();
		}).fail(function(data) {
			new TransactionResponseView({
				title: "ERROR",
				status: "error",
				message: "Could not input attendance. Please try again."
			});
			view.render();
			elem.remove();
			backdrop.remove();
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

	addAttendance: function(evt) {
		var view = this;

		this.$el.append(html["addAttendance.html"]);

		var elem = $("#add-attendnace-modal");
		var backdrop = $(".modal-backdrop");

		elem.find("#date").datepicker({
			dateFormat: "yy-mm-dd"
		});

		var section = new Section();
		section.fetch({
			url: section.getStudentsEnrolled(this.sectionid),
		}).then(function(data) {
			view.$el.find(".num-students").text(data.length);
			_.each(data, function(user, index) {
				var model = new Student(user, {parse:true});
				new AttendanceRecordView({
					el: view.addAttendanceRow(model.get("userid")),
					model: model,
					userid: model.get("userid")
				});				
			});
		});

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		elem.on("click", "#save", function() {
			view.updateAttendance(elem, backdrop);
		});
	}
});

var AttendanceRowView = Backbone.View.extend({
	template: _.template("<td><%= date %></td>"
		+	"<td><%= attendedStudents %></td>"
		// +	"<td><%= numStudents %></td>"
		+	"<td><%= avg %></td>"
		+	"<td><span data-date='<%= date %>' class='view-attendance primary-link'>[ View ]</span></td>"),

	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.date = options.date;
		this.numStudents = options.numStudents;
		this.attendedStudents = options.attendedStudents;
		this.avg = options.avg;
		this.enrolledStudents = options.enrolledStudents;
		this.render();
	},

	events: {
		"click .view-attendance": "viewAttendance"
	},

	render: function() {
		var view = this;
		this.$el.html(this.template({
			date: this.date,
			numStudents: this.numStudents,
			attendedStudents: this.attendedStudents,
			avg: this.avg
		}));
	},

	viewAttendance: function(evt) {
		var view = this;
		var date = $(evt.currentTarget).data("date");
		var section = new Section();
		section.fetch({
			url: section.getStudentAttendance(this.sectionid),
			data: {
				date: date
			}
		}).then(function(data) {
			view.viewAttendanceRecord(view.enrolledStudents, data, date);
		});
	},

	viewAttendanceRecord: function(all, attended, date) {
		var view = this;

		this.$el.append(html["addAttendance.html"]);

		var elem = $("#add-attendnace-modal");
		var backdrop = $(".modal-backdrop");

		elem.find("#date").remove();
		elem.find("h4").append(" for " + date)

		_.each(all, function(user, index) {
			var model = new Student(user, {parse:true});
			var userid = model.get("userid");

			var checked = false;
			_.each(attended, function(student, index) {
				if (student.userid == user.userid) {
					checked = true;
				}
			});

			new AttendanceRecordView({
				el: view.addAttendanceRow(userid),
				model: model,
				userid: userid,
				checked: checked == true ? "P" : "A",
				action: "view"
			});				
		});

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		elem.on("click", "#save", function() {
			view.updateAttendance(elem, backdrop);
		});
	},

	addAttendanceRow: function(id) {
		var container = $("<tr></tr>");
		container.attr("id", id);
		this.$el.find("#enrolled-table tbody").append(container);
		return container;	
	}
});

var AttendanceRecordView = Backbone.View.extend({
	template: _.template("<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><input id='<%= model.userid %>' type='checkbox' class='attendance' checked></td>"),

	viewTemplate: _.template("<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= attended %></td>"),

	initialize: function(options) {
		this.userid = options.userid;
		this.checked = options.checked;
		this.action = options.action;
		this.render();
	},

	render: function() {
		var view = this;
		var sectionid = this.model.get("sectionid");
		var userid = this.userid;

		if (this.action == "view") {
			this.$el.html(this.viewTemplate({
				model: this.model.toJSON(),
				attended: this.checked
			}));
		} else {
			this.$el.html(this.template({
				model: this.model.toJSON(),
			}));
		}
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







