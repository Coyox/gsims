var CourseEnrollmentView = Backbone.View.extend({
	initialize: function(options) {
		console.log(options);
		this.results = options.results;
		this.userid = options.userid;
		this.regType = options.regType;
		this.render();
	},

	render: function() {
		var view = this;

		if (this.results) {
			var school = new School();
			school.fetch().then(function(data) {
				var menu = view.$el.find("#school-menu");
				menu.append($("<option selected disabled>-- Select a School --</option>"));
				_.each(data, function(object, index) {
					var option = $("<option></option>");
					option.attr("value", object.schoolid);
					option.text(object.location);
					if (view.regType == "admin") {
						option.prop("selected", object.schoolid == sessionStorage.getItem("gobind-schoolid"));
					}
					menu.append(option);
				});
				menu.trigger("change");
			});
		} else {
			this.$el.html(html["courseEnrollment.html"]);
			this.populateDepartments();
		}

		this.courseTable = this.$el.find("#course-list").DataTable({
			dom: "t",
			bAutoWidth: false,
			aoColumns: [
				{ sWidth: "10%" },
				{ sWidth: "40%" },
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
	},

	populateDepartments: function(evt) {
		var view = this;

		var schoolid = evt ? $(evt.currentTarget).find("option:selected").attr("value") :
			($("#school-options").find("option:selected").attr("id")? $("#school-options").find("option:selected").attr("id"): sessionStorage.getItem("gobind-schoolid"));

		this.schoolid = schoolid;

		var school = new School();
		school.fetch({
			url: school.getDepartmentsUrl(schoolid),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
			}
		}).then(function(data) {
			view.$el.find("#department-list").empty();
			if (data.length == 0) {
				view.$el.find("#department-list").text("There are no departments to display.");
			} else {
				_.each(data, function(object, index) {
					var dept = new Dept(object, {parse:true});
					new DepartmentListItem({
						el: view.addDepartmentListItem(),
						model: dept,
						parent: view.$el,
						parentView: view,
						schoolid: view.schoolid
					});
				});
			}
		});
	},

	addDepartmentListItem: function() {
		var container = $("<li class='dept-item pull-left'></li>");
		this.$el.find("#department-list").append(container);
		return container;
	},

	saveEnrolledSections: function() {
		var sections = [];
		var waitlists = [];
		var rows = this.$el.find("#enrolled-list tbody tr");
		var valid = false;
		_.each(rows, function(row, index) {
			if ($(row).find(".dataTables_empty").length) {
				valid = false;
			} else {
				valid = true;
				if ($(row).data("waitlist")){
					waitlists.push($(row).data("waitlist").courseid);
				}
				else {
					sections.push($(row).data("section").sectionid);
				}
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
			var success =1;
			if (sections.length > 0){
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
					success = (data.status == "success")? 1 : 0;
				});
			}
			if (waitlists.length > 0){
				$.ajax({
					type: "POST",
					url: student.enrollStudentInWaitlists(this.userid),
					data: {
						courseids: JSON.stringify(waitlists),
					}
				}).then(function(data) {
					if (typeof data == "string") {
						data = JSON.parse(data);
					}
					success = (data.status == "success")? success&&1 : 0;
				});

			}
			if (success == 1){
				new TransactionResponseView({
					message: "Thank you for enrolling. An administrator will email you when your selected courses have been approved for registration.",
					redirect: true,
					url: view.regType == "online" ? "" : "home"
				});
			}
			else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Sorry, we could not process your request. Please try again."
				});
			}
		}
	}
});

var DepartmentListItem = Backbone.View.extend({
	template: _.template("<span id='<%= model.deptid %>' href='#' class='department btn btn-default btn-sm' data-name='<%= model.deptName %>'><%= model.deptName %></span>"),

	initialize: function(options) {
		var view = this;
		this.parent = options.parent;
		this.parentView = options.parentView;
		this.schoolid = options.schoolid;
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

		$(".department-name").text(name);

		var dept = new Dept();
		dept.fetch({
			url: dept.getCoursesUrl(id),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
			}
		}).then(function(data) {
			var table = $("#course-list");
			table.find(".results").empty();

			_.each(data, function(object, index) {
				var course = new Course(object, {parse:true});
				course.fetch({
					url: course.getCoursePrereqs(course.get("courseid"))
				}).then(function(data) {
					new RCourseTableRowView({
						el: view.addCourseRow(),
						model: course,
						parentView: view.parentView,
						prereqs: data,
						schoolid: view.schoolid
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

var RCourseTableRowView = Backbone.View.extend({
	template: _.template("<td class='details-control' data-name='<%= model.courseName %>'></td>"
		+ 	"<td><%= model.courseName %></td>"
		+	"<td><%= model.description %></td>"
		+	"<td><%= prereqs %></td>"),

	initialize: function(options) {
		this.parentView = options.parentView;
		this.prereqs = options.prereqs;
		this.schoolid = options.schoolid;
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
		"click td.details-control": "toggleRow"
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
			var section = new Section();
			section.fetch({
				url: section.getSearchSectionsUrl(view.schoolid),
				data: {
					schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
					schoolid: view.schoolid,
					courseName: courseName
				}
			}).then(function(data) {
				tr.addClass("shown");

				new RSectionSubView({
					el: view.createSubTable(tr),
					data: data,
					parentView: view.parentView
				});
			});
		}
	},

	createSubTable: function(parent) {
		var row = $("<tr><td colspan='4'></td></tr>");
		parent.after(row);
		return row;
	}
});

var RSectionSubView = Backbone.View.extend({
	initialize: function(options) {
		this.data = options.data;
		this.parentView = options.parentView;
		this.render();
	},

	render: function() {
		var view = this;
		this.$el.find("td").html(html["subSection.html"]);

		if (this.data.length == 0) {
			this.$el.find("td").html("<div class='alert alert-danger'>There are currently no sections available.</div>");
		} else {
			_.each(this.data, function(object, index) {
				var section = new Section(object, {parse:true});

				section.fetch({
					url: section.getStudentCount(section.get("sectionid"))
				}).then(function(data) {
					var full = parseInt(data) >= parseInt(section.get("classSize"));
					new RSectionTableRowView({
						el: view.addRow(),
						model: section,
						parentView: view.parentView,
						isFull: full,
						enrolledStudents: data
					});
				});
			}, this);
		}
	},

	addRow: function() {
		var row = $("<li></li>");
		this.$el.find("#sections-list").append(row);
		return row;
	}
});

var RSectionTableRowView = Backbone.View.extend({
	template: _.template("<span><strong>Time: </strong><span><%= model.day %> <%= model.startTime %> to <%= model.endTime %></span></span>"
		+	"<br>"
		+	"<strong>Location: </strong><span><%= model.roomLocation %></span>"
		+	"<br>"
		+	"<strong>Registered Students: <%= enrolledStudents %> (<%= model.classSize %> spaces available)"
		+	"<br>"
		+	"<a class='enroll-link'>Enroll in this section</a>"
		+	"<br>"),

	initialize: function(options) {
		this.parentView = options.parentView;
		this.isFull = options.isFull;
		this.enrolledStudents = options.enrolledStudents;	
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON(),
			enrolledStudents: this.enrolledStudents
		}));

		if (this.isFull) {
			this.$el.find(".enroll-link").text("THIS SECTION IS FULL - Enroll in wait list");
			this.$el.find(".enroll-link").attr("id", this.model.get("courseid"));
		} else {
			this.$el.find(".enroll-link").attr("id", this.model.get("sectionid"));
		}
	},

	events: {
		"click .enroll-link": "enrollInSection",
	},

	enrollInSection: function(evt) {
		var parent = $(evt.currentTarget).parent();
		if (parent.find(".glyphicon-ok").length == 0) {
			$(evt.currentTarget).append("<span class='glyphicon glyphicon-ok'></span>");
		
			if (this.isFull){
				new EnrolledSectionSelection({
					el: this.addRow(this.model.get("courseid"), this.model.toJSON()),
					model: this.model,
					parentView: this.parentView,
					waitlist: true
				});
			}
			else {
				new EnrolledSectionSelection({
					el: this.addRow(this.model.get("sectionid"), this.model.toJSON()),
					model: this.model,
					parentView: this.parentView
				});
			}
		}
	},

	addRow: function(id, section, course) {
		var parent = $("#enrolled-list");
		if (parent.find(".dataTables_empty").length) {
			parent.find(".dataTables_empty").closest("tr").remove();
		}

		var container = $("<tr></tr>");
		container.attr("id", id);
		container.data("waitlist", course);
		container.data("section", section);
		parent.append(container);

		return container;
	}
});

var EnrolledSectionSelection = Backbone.View.extend({
	template: _.template("<td><%= model.courseName %></td>"
		+	"<td><%= model.sectionCode %></td>"
		+	"<td><%= model.day %></td>"
		+	"<td><%= model.startTime %></td>"
		+	"<td><%= model.endTime %></td>"
		+	"<td><span class='remove-section link'>Remove</span></td>"),

	waitlistTemplate: _.template("<td><%= name %></td>"
		+	"<td></td>"
		+	"<td></td>"
		+	"<td></td>"
		+	"<td></td>"
		+	"<td><span class='remove-section link'>Remove</span></td>"),


	initialize: function(options) {
		this.parentView = options.parentView;
		this.waitlist = options.waitlist;
		this.render();
	},

	render: function() {
		if (this.waitlist) {
			this.$el.html(this.waitlistTemplate({
				name: this.model.get("courseName") + " Waitlist",
				model: this.model.toJSON()
			}));
		} else {
			this.$el.html(this.template({
				model: this.model.toJSON()
			}));
		}
	},

	events: {
		"click .remove-section": "removeSection"
	},

	removeSection: function(evt) {
		var id = $(evt.currentTarget).closest("tr").attr("id");
		$(evt.currentTarget).closest("tr").remove();
		
		$("#sections-list").find("#" + id).find(".glyphicon-ok").remove();

		var parent = $("#enrolled-list");
		if (parent.find("tbody tr").length == 0) {
			parent.find("tbody").append("<tr class='odd'><td valign='top' colspan='6' class='dataTables_empty'>No data available in table</td></tr>")
		}
	},
});



