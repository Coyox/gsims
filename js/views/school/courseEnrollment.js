var CourseEnrollmentView = Backbone.View.extend({
	initialize: function(options) {
		var view = this;
		this.results = options.results;
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
			this.$el.html(html["courseEnrollment.html"]);
			this.populateDepartments();
		}

		this.courseTable = this.$el.find("#course-list").DataTable({
			dom: "t",
			bAutoWidth: false,
			aoColumns: [
				{ sWidth: "20%" },
				{ sWidth: "40%" },
				{ sWidth: "40%" }
			]
		});

		this.enrolledTable = this.$el.find("#enrolled-list").DataTable({
			dom: "t"
		});
	},

	events: {
		"click #save-sections": "saveEnrolledSections",
		"change #school-menu": "populateDepartments"
	},

	populateDepartments: function(evt) {
		var view = this;
		var schoolid = evt ? $(evt.currentTarget).find("option:selected").attr("value") :
			$("#school-options").find("option:selected").attr("id");
			console.log(schoolid);

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
				new DepartmentListItem({
					el: view.addDepartmentListItem(),
					model: dept,
					parent: view.$el,
					parentView: view
				});
			});
		});
	},

	addDepartmentListItem: function() {
		var container = $("<span></span>");
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
				sections.push($(row).data("section"));
			}
		}, this);
		
		if (!valid) {
			new TransactionResponseView({
				title: "Course Selection",
				message: "Please select at least one section before proceeding."
			});
		} else {
			new TransactionResponseView({
				title: "Course Selection",
				message: "todo.."
			});	
		}
	}
});

var DepartmentListItem = Backbone.View.extend({
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
				new CourseTableRowView({
					el: view.addCourseRow(),
					model: course,
					parentView: view.parentView
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
	template: _.template("<td class='details-control' data-name='<%= model.courseName %>'></td>"
		+ 	"<td><%= model.courseName %></td>"
		+	"<td><%= model.description %></td>"),

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

			// fix this
	    	var height = $("#course-selection").height() + 60;
	    	$('.wizard .content').css("height", height);
		} else {
			var courseName = $(evt.currentTarget).data("name");
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

				new SectionTableView({
					el: view.createSubTable(tr),
					data: data,
					parentView: view.parentView
				});
			});			
		}
	},

	createSubTable: function(parent) {
		var row = $("<tr><td colspan='3'></td></tr>");
		parent.after(row);
		return row;
	}
});

var SectionTableView = Backbone.View.extend({
	initialize: function(options) {
		this.data = options.data;
		this.parentView = options.parentView;
		this.render();
	},

	render: function() {
		this.$el.find("td").html(html["viewSections.html"]);

		if (this.data.length == 0) {
			this.$el.find("td").html("<div class='alert alert-danger'>There are currently no sections available.</div>");
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

	addRow: function() {
		var row = $("<li></li>");
		this.$el.find("#sections-list").append(row);
		return row;
	}
});

var SectionTableRowView = Backbone.View.extend({
	template: _.template("<span><strong>Time: </strong><span><%= model.day %> <%= model.startTime %> to <%= model.endTime %></span></span>"
		+	"<br>"
		+	"<strong>Location: </strong><span><%= model.roomLocation %></span>"
		+	"<br>"
		+	"<strong>Registered Students: <%= model.classSize %> (<%= model.roomCapacity %> spaces available)" 
		+	"<br>"
		+	"<a class='enroll-link'>Enroll in this section</a>"
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