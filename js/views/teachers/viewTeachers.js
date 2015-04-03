var SearchTeachersView = Backbone.View.extend({
	initialize: function(options) {
		this.redirect = options.redirect;
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.render();
	},

	render: function() {
		this.$el.html(html["searchTeachers.html"]);
	},

	events: {
		"click #search-teachers": "searchTeachers",
		"click #search-all-teachers": "searchAllTeachers",
		"click #clear-fields": "clearFields",
	},

	searchAllTeachers: function(evt) {
		var view = this;
		new Teacher().fetch().then(function(data) {
			view.changeRoute(data);
		});
	},

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

		var model = new Teacher();
		model.fetch({
			url: model.getSearchTeachersUrl(),
			data: data
		}).then(function(data) {
			view.changeRoute(data);
		});
	},

	changeRoute: function(data) {
		if (this.redirect == false) {
			var view = new AddTeacherTableView({
				el: this.$el,
				results: data,
				sectionid: this.sectionid
			});
		} else {
			app.Router.navigate("teachers/search");
			var view = new TeachersTableView({
				el: $("#content"),
				results: data
			});
		}
	},

	clearFields: function() {
		var parent = this.$el.find("#filter-teachers-container");
		parent.find("input[type='text']").val("");
	}
});

var AddTeacherTableView = Backbone.View.extend({
	initialize: function(options) {
		this.template = options.template;
		this.results = options.results;
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.render();
	},

	render: function() {
		this.$el.html(html["viewTeachers.html"]);
		this.populateQueryResults(this.results);
	},

	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Teacher(object, {parse:true});
			new AddTeacherTableRowView({
				model: model,
				el: this.addRow(".results", model.get("emailAddr")),
				sectionid: this.sectionid,
				courseid: this.courseid
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

	addRow: function(selector, email) {
        var container = $("<tr></tr>");
        container.data("email", email);
        this.$el.find(selector).first().append(container);
        return container;
	},
});

var AddTeacherTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><span class='add-teacher primary-link center-block' id='<%= model.userid %>'>[ Add Teacher ]</span></td>"
		+	"<td></td>"),

	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.courseid = options.courseid;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .add-teacher": "addTeacher"
	},

	addTeacher: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		if(typeof (this.sectionid) === 'undefined'){
			var course = new Course();
   			$.ajax({
 				type: "POST",
 				url: course.assignCourseTeacherUrl(this.courseid, id)
 			}).then(function(data) {
 				console.log(data);
 				new TransactionResponseView({
 					message: "This teacher has been added to this course."
 				});
 			}).fail(function(data) {
 				new TransactionResponseView({
 					title: "ERROR",
 					status: "error",
 					message: "This teacher could not be added to this course. Please try again."
 				});
 			});
 		}
 		else {
 			var section = new Section();
 			$.ajax({
 				type: "POST",
 				url: section.assignSectionTeacher(this.sectionid, id)
 			}).then(function(data) {
 				console.log(data);
 				new TransactionResponseView({
 					message: "This teacher has been added to this section."
 				});
 			}).fail(function(data) {
 				new TransactionResponseView({
 					title: "ERROR",
 					status: "error",
 					message: "This teacher could not be added to this section. Please try again."
 				});
 			});
 		}
 	}
 });


var TeachersTableView = Backbone.View.extend({
	initialize: function(options) {
		this.results = options.results;
		this.render();
	},

	render: function() {
		storeContent();

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

	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Teacher(object, {parse:true});
			new TeacherTableRowView({
				model: model,
				el: this.addRow(".results", model.get("emailAddr"))
			});
		}, this);
		this.table = this.$el.find("table").dataTable({
	      	aoColumnDefs: [
	          	{ bSortable: false, aTargets: [ 4, 5 ] },
	          	{ sClass: "center", aTargets: [ 4, 5 ] },
	          	{ sWidth: "10%", aTargets: [ 5 ] }
	       	]
		});
		this.$el.find(".dataTables_filter").append("<button class='send-email btn btn-sm btn-primary dt-btn'>Send Email</button>");
		this.$el.find(".dataTables_filter").append("<button id='refresh' class='btn btn-sm btn-primary dt-btn'>Refresh</button>");
	},

	fetchAllResults: function() {
		var view = this;
		new Teacher().fetch().then(function(data) {
			_.each(data, function(object, index) {
				var model = new Teacher(object, {parse:true});
				new TeacherTableRowView({
					model: model,
					el: view.addRow(".results", model.get("emailAddr"))
				});
			}, view);
			view.table = view.$el.find("table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 4, 5 ] },
		          	{ sClass: "center", aTargets: [ 4, 5 ] },
		          	{ sWidth: "10%", aTargets: [ 5 ] }
		       	]
			});
			view.$el.find(".dataTables_filter").append("<button class='send-email btn btn-sm btn-primary dt-btn'>Send Email</button>");
			view.$el.find(".dataTables_filter").append("<button id='refresh' class='btn btn-sm btn-primary dt-btn'>Refresh Table</button>");
		});
	},

	addRow: function(selector, email) {
        var container = $("<tr></tr>");
        container.data("email", email);
        this.$el.find(selector).first().append(container);
        return container;
	},

	openEmailModal: function(evt) {
		var recipients = [];
		_.each(this.table.fnGetNodes(), function(row, index) {
			var checkbox = $(row).find("input[type='checkbox']");
			if ($(checkbox).is(":checked")) {
				recipients.push($(checkbox).closest("tr").data("email"));
			}
		}, this);

		var numRecipients = recipients.length;
		openEmailModal(recipients, numRecipients, "S");
	},

	toggleCheckboxes: function(evt) {
		var nodes = this.table.fnGetNodes();
		var checked = $(evt.currentTarget).is(":checked");
		_.each(nodes, function(row, index) {
			var checkbox = $(row).find("input[type='checkbox']");
			checkbox.prop("checked", checked);
		}, this);
	},

	refreshTable: function(evt) {
		evt.stopImmediatePropagation();
		this.table.fnDestroy();
		this.render();
	},
});

var TeacherTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><span class='view-teacher primary-link center-block' id='<%= model.userid %>'>[ View Teacher ]</span></td>"
		+	"<td><input type='checkbox' class='user-row' checked></td>"),
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .view-teacher": "viewTeacher",
	},

	viewTeacher: function(evt) {
		storeContent();

		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("teachers/" + id, {trigger:true});
	}
});

function storeContent() {
	$("#content").children().detach().appendTo($("#hidden"));
}