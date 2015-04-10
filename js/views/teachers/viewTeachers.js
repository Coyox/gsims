/**
 *	View to display the teacher search form.
 *	Route: findUsers
 */
var SearchTeachersView = Backbone.View.extend({
	initialize: function(options) {
		this.redirect = options.redirect;
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.backdrop = options.backdrop;
		this.elem = options.elem;
		this.parentView = options.parentView;
		this.both = options.both;
		this.usertype = options.usertype || "T";
		this.render();
	},

	render: function() {
		this.$el.html(html["searchTeachers.html"]);
	},

	events: {
		"click #search-teachers": "searchTeachers",
		"click #clear-fields": "clearFields",
	},

	/**
	 *	Read the inputs from the search form. For each value that is not
	 *	empty, add it to the form data object, and submit it as part of
	 *	the POST request
	 */
	searchTeachers: function(evt) {
		var view = this;
		var data = {};

		var firstName = this.$el.find("#first-name").val();
		if (firstName != "") {
			data.firstName = firstName;
		}

		var lastName = this.$el.find("#last-name").val();
		if (lastName != "") {
			data.lastName = lastName;
		}

		if (this.both) {
			data.both = this.both;
		}

		var teacher = new Teacher();
		teacher.fetch({
			url: teacher.getSearchTeachersUrl(this.usertype, sessionStorage.getItem("gobind-schoolid")),
			data: data
		}).then(function(data) {
			view.changeRoute(data);
		});
	},

	/**
	 *	Updates the URL and renders the teacher table results view
	 */
	changeRoute: function(data) {
		if (this.redirect == false) {
			var view = new AddTeacherTableView({
				el: this.$el,
				results: data,
				sectionid: this.sectionid,
				courseid: this.courseid,
				elem: this.elem,
				backdrop: this.backdrop,
				parentView: this.parentView,
				usertype: this.usertype
			});
		} else {
			if (this.usertype == "A" ) {
				app.Router.navigate("teachers/search/A");
			} else {
				app.Router.navigate("teachers/search");
			}
			var view = new TeachersTableView({
				el: $("#content"),
				results: data,
				usertype: this.usertype
			});
		}
	},

	/**
	 *	Clears all form inputs
	 */
	clearFields: function() {
		var parent = this.$el.find("#filter-teachers-container");
		parent.find("input[type='text']").val("");
	}
});

/**
 *	View to display a list of teachers
 *	Route: findUsers
 */
var TeachersTableView = Backbone.View.extend({
	initialize: function(options) {
		this.results = options.results;
		this.usertype = options.usertype;
		this.render();
	},

	render: function() {
		//storeContent();

		this.$el.html(html["viewTeachers.html"]);
		if (this.results) {
			this.populateQueryResults(this.results);
		} else {
			this.fetchAllResults();
		}
	},

	events: {
		"click #refresh": "refreshTable",
		"click .send-email": "openEmailModal",
		"change .toggle-checkboxes": "toggleCheckboxes"
	},

	/**
	 *	Populates the table with results from the search query
	 */
	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Teacher(object, {parse:true});
			new TeacherTableRowView({
				model: model,
				el: this.addRow(".results", model.get("emailAddr")),
				usertype: this.usertype
			});
		}, this);
		this.table = this.$el.find("table").dataTable({
			aoColumnDefs: [
				{ bSortable: false, aTargets: [ 4, 5 ] },
				{ sClass: "center", aTargets: [ 4, 5 ] },
				{ sWidth: "10%", aTargets: [ 5 ] }
			],
			dom: dataTables.exportDom,
			tableTools: {
				 aButtons: dataTables.buttons,
       			 sSwfPath: dataTables.sSwfPath
    		}
		});
		createEmailButton(this.$el);
	},

	/**
	 *	Populates the table with all teacher results (no search)
	 */
	fetchAllResults: function() {
		var view = this;

		var school = new School();
		var schoolid = sessionStorage.getItem("gobind-schoolid");
		school.fetch({
			url: this.usertype == "A" ? school.getAdminsUrl(schoolid) : school.getTeachersUrl(schoolid)
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Teacher(object, {parse:true});
				new TeacherTableRowView({
					model: model,
					el: view.addRow(".results", model.get("emailAddr")),
					usertype: view.usertype
				});
			}, view);
			view.table = view.$el.find("table").DataTable({
				aoColumnDefs: [
					{ bSortable: false, aTargets: [ 4, 5 ] },
					{ sClass: "center", aTargets: [ 4, 5 ] },
					{ sWidth: "10%", aTargets: [ 5 ] }
				],
				dom: dataTables.exportDom,
				tableTools: {
           			 aButtons: dataTables.buttons,
       			 	 sSwfPath: dataTables.sSwfPath
        		}
			});
			createEmailButton(view.$el);
		});
	},

	/**
	 *	Adds a row to the list of teachers
	 */
	addRow: function(selector, email) {
		var container = $("<tr></tr>");
		container.data("email", email);
		this.$el.find(selector).first().append(container);
		return container;
	},

	/**
	 *	Opens up an email popup
	 */
	openEmailModal: function(evt) {
		openEmailWrapper(this.table.fnGetNodes());
	},

	/**
	 *	Checks/unchecks all checkboxes
	 */
	toggleCheckboxes: function(evt) {
		toggleCheckboxes(this.table.fnGetNodes(), evt);
	},

	/**
	 *	Re-render the table
	 */
	refreshTable: function(evt) {
		evt.stopImmediatePropagation();
		this.table.fnDestroy();
		this.render();
	},
});

/**
 *	Renders a single table row with data pertaining to a teacher
 */
var TeacherTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><span class='view-teacher primary-link center-block' id='<%= model.userid %>'>[ View <%= type %> ]</span></td>"
		+	"<td><input type='checkbox' class='user-row' checked></td>"),
	initialize: function(options) {
		this.usertype = options.usertype;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON(),
			type: this.usertype == "A" ? "Admin" : "Teacher"
		}));
	},

	events: {
		"click .view-teacher": "viewTeacher",
	},

	/**
	 *	Change the URL to the viewTeacher form when a row is selected
	 */
	viewTeacher: function(evt) {
		//storeContent();

		var id = $(evt.currentTarget).attr("id");

		if (this.usertype == "A") {
			app.Router.navigate("teachers/" + id + "/A", {trigger:true});
		} else {
			app.Router.navigate("teachers/" + id, {trigger:true});
		}
	}
});

/**
 *	View to display a list of teachers (from a section/course)
 *	Route: findUsers
 */
var AddTeacherTableView = Backbone.View.extend({
	initialize: function(options) {
		this.template = options.template;
		this.results = options.results;
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.elem = options.elem;
		this.backdrop = options.backdrop;
		this.parentView = options.parentView;
		this.usertype = options.usertype;
		this.render();
	},

	render: function() {
		this.$el.html(html["viewTeachers.html"]);
		this.populateQueryResults(this.results);
	},

	/**
	 *	Populates the table with results from the search query
	 */
	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Teacher(object, {parse:true});
			new AddTeacherTableRowView({
				model: model,
				el: this.addRow(".results", model.get("emailAddr")),
				sectionid: this.sectionid,
				courseid: this.courseid,
				elem: this.elem,
				backdrop: this.backdrop,
				parentView: this.parentView,
				usertype: this.usertype
			});
		}, this);
		this.table = this.$el.find("table").dataTable({
			aoColumnDefs: [
			{ bSortable: false, aTargets: [ 4, 5 ] },
			{ sClass: "center", aTargets: [ 4, 5 ] },
			{ sWidth: "10%", aTargets: [ 5 ] }
			]
		});
	},

	/**
	 *	Adds a row to the list of teachers
	 */
	addRow: function(selector, email) {
		var container = $("<tr></tr>");
		container.data("email", email);
		this.$el.find(selector).first().append(container);
		return container;
	},
});

/**
 *	Renders a single table row with data pertaining to a teacher (from a section/course)
 */
var AddTeacherTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><span class='add-teacher primary-link center-block' id='<%= model.userid %>'>[ Add <%= type %> ]</span></td>"
		+	"<td></td>"),

	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.elem = options.elem;
		this.backdrop = options.backdrop;
		this.parentView = options.parentView;
		this.usertype = options.usertype;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON(),
			type: this.usertype == "A" ? "Admin" : "Teacher"
		}));
	},

	events: {
		"click .add-teacher": "addTeacher"
	},

	/**
	 *	Adds a teacher to a particular course/section
	 *	Route: assignCourseTeacher
	 */
	addTeacher: function(evt) {
		var view = this;
		var id = $(evt.currentTarget).attr("id");
		if(typeof (this.sectionid) === 'undefined'){
			var course = new Course();
			$.ajax({
				type: "POST",
				url: course.assignCourseTeacherUrl(this.courseid, id)
			}).then(function(data) {
				try {
					if (typeof data == "string"){
						data = JSON.parse(data);
					}
					if (data.status=="success") {
						new TransactionResponseView({
							message: "This teacher has been added to this course."
						});
					}
					else {
						new TransactionResponseView({
							title: "ERROR",
							status: "error",
							message: "This teacher could not be added to this course. Please try again."
						});
					}
				}
				catch(err){
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "This teacher could not be added to this course. Please try again."
					});

				}
				view.elem.remove();
				view.backdrop.remove();
				view.parentView.render();
			}).fail(function(data) {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "This teacher is already assigned to this course. Please try again."
				});
				view.elem.remove();
				view.backdrop.remove();
				view.parentView.render();
			});
		}
		else {
			var section = new Section();
			$.ajax({
				type: "POST",
				url: section.assignSectionTeacher(this.sectionid, id)
			}).then(function(data) {
				new TransactionResponseView({
					message: "This teacher has been added to this section."
				});
				view.elem.remove();
				view.backdrop.remove();
				view.parentView.render();
			}).fail(function(data) {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "This teacher could not be added to this section. Please try again."
				});
				view.elem.remove();
				view.backdrop.remove();
				view.parentView.render();
			});
		}
	}
});


function storeContent() {
	$("#content").children().detach().appendTo($("#hidden"));
}