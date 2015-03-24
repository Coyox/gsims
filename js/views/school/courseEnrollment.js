var CourseEnrollmentView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["courseEnrollment.html"]);

		this.populateDepartments();

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
		"click #save-sections": "saveEnrolledSections"
	},

	populateDepartments: function() {
		var view = this;
		var schoolid = $("#school-options").find("option:selected").attr("id");
		var school = new School();
		school.fetch({
			url: school.getDepartmentsUrl(app.selectedSchoolId),
			data: {
				schoolyearid: app.selectedSchoolYearId
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
		var container = $("<div></div>");
		this.$el.find("#department-list").append(container);
		return container;
	},

	saveEnrolledSections: function() {
		var rows = this.$el.find("#enrolled-list tbody tr");
		var ids = [];
		_.each(rows, function(row, index) {
			ids.push($(row).attr("id"));
		}, this);
		console.log(ids);
		// Send the list of section ids, and the user id to the server
		new TransactionResponseView({
			message: "still todo ...."
		});
	}
});

var DepartmentListItem = Backbone.View.extend({
	template: _.template("<button id='<%= model.deptid %>' class='department btn btn-default btn-sm btn-block' data-name='<%= model.deptName %>'><%= model.deptName %></button>"),

	initialize: function(options) {
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
		this.parent.find(".department-name").text(name);

		var dept = new Dept();
		dept.fetch({
			url: dept.getCoursesUrl(id),
			data: {
				schoolyearid: app.selectedSchoolYearId
			}
		}).then(function(data) {
			var table = view.parent.find("#course-list");
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
		this.parent.find("#course-list .results").append(container);
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
				})
			});			
		}

        // var tr = $(evt.currentTarget).closest('tr');
        // var row = table.row( tr );
 
        // if ( row.child.isShown() ) {
        //     // This row is already open - close it
        //     row.child.hide();
        //     tr.removeClass('shown');
        // }
        // else {
        //     // Open this row
        //     row.child( format(row.data()) ).show();
        //     tr.addClass('shown');
        // }
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
		"click span.remove-section": "removeSection"
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
		$(row).attr("id", this.model.get("sectionid"));
	},

	removeSection: function(evt) {
		this.parentView.enrolledTable
			.row($(evt.currentTarget).parents("tr"))
			.remove()
			.draw();
	}
});