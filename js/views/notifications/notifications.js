var NotificationsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["notifications.html"]);

		new PendingRegistrationView({
			el: this.addContainer("Students Pending Registration Approval")
		});

		new PendingTestView({
			el: this.addContainer("Students Pending Tests")
		});
	},

	addContainer: function(title) {
		var container = $("<div class='panel panel-default'><div class='panel-heading'>" + title + "</div><div class='panel-body'></div></div>");
		this.$el.append(container);
		return container;
	}
});

var PendingRegistrationView = Backbone.View.extend({
	initialize: function(options) {
		this.list = [];
		this.render();
	},

	render: function() {
		this.$el.find(".panel-body").html(html["pendingRegistration.html"]);

		var view = this;
		var student = new Student();
		student.fetch({
			url: student.getSearchStudentsUrl(sessionStorage.getItem("gobind-schoolid")),
			data: {
				status: "pending"
			}
		}).then(function(data) {
			_.each(data, function(object, index) {
				var s = new Student(object, {parse:true});
				view.list.push(s);
				new PendingRowView({
					el: view.addRow(),
					model: s,
					index: index
				});
			});
			view.table = view.$el.find("table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 4 ] }
		       	]
			});
			createEmailButton(view.$el);
			createRefreshButton(view.$el);
			createExportButton(view.$el);
			addDTButtons(view.$el, "<button id='save-status' class='btn btn-primary btn-sm'>Save</button>");
		});
	},

	events: {
		"click #save-status": "saveStatuses",
		"click #refresh": "refreshTable",
		"click .send-email": "openEmailModal",
		"click #export-table": "exportTable",
		"change .toggle-checkboxes": "toggleCheckboxes"
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".results").append(container);
		return container;
	},

	saveStatuses: function(evt) {
		var view = this;
		var approved = [];
		var approvedEmails = [];
		var denied = [];
		var deniedEmails = [];
		_.each(this.list, function(model, index) {
			if (model.hasChanged("status")) {
				var status = model.get("status");
				if (status == "active") {
					approved.push(model.get("userid"));
					approvedEmails.push(model.get("emailAddr"));
				} else if (status == "inactive") {
					denied.push(model.get("userid"));
					deniedEmails.push(model.get("emailAddr"));
				}
			}
		});

		var params = {};
		if (approved.length) {
			params.approvedList = JSON.stringify(approved);
		}
		if (denied.length) {
			params.deniedList = JSON.stringify(denied);
		}

		console.log(approvedEmails);
		console.log(deniedEmails);

		var student = new Student();
		var xhr = $.ajax({
			type: "POST",
			url: student.updatePendingUrl(),
			data: params,
			success: function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					var to = [];
					_.each(approvedEmails, function(email, index) {
						to.push({
							email: email,
							name: "",
							type: "to"
						});
					});

					sendEmail({
						from: "info@gobindsarvar.com",
						to: to,
						subject: "Gobind Sarvar - Approved!",
						body: "Your student account at Gobind Sarvar has been approved."
					});

					var deniedTo = [];
					_.each(deniedEmails, function(email, index) {
						deniedTo.push({
							email: email,
							name: "",
							type: "to"
						});
					});					

					sendEmail({
						from: "info@gobindsarvar.com",
						to: deniedTo,
						subject: "Gobind Sarvar - Denied",
						body: "Your student account at Gobind Sarvar has been denied. Please contact us at info@gobindsarvar.com if you believe this is an error."
					});

					new TransactionResponseView({
						message: "Students successfully approved and/or denied. An email has been sent to notify the student of their status change."
					});	

					view.render();
				}
			}
		});
	},

	toggleCheckAll: function(evt) {
		toggleCheckboxes(this.table.fnGetNodes(), evt);
	},

	openEmailModal: function(evt) {
		openEmailWrapper(this.table.fnGetNodes());
	},

	refreshTable: function(evt) {
		evt.stopImmediatePropagation();
		this.table.fnDestroy();
		this.render();
	},
});

var PendingRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.status %></td>"
		+   "<td><label class='radio-inline'><input type='radio' name='status<%= index %>' value='1'> Approve</label><label class='radio-inline'><input type='radio' name='status<%= index %>' value='0'> Deny</label></td>"),

	initialize: function(options) {
		this.index = options.index;
		this.render();
	},

	events: {
		"change input[type='radio']": "updateRegStatus"
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON(),
			index: this.index
		}))
	},

	updateRegStatus: function(evt) {
		var status = $(evt.currentTarget).attr("value");
		status = status == 1 ? "active" : "inactive";
		this.model.set("status", status);
	}
});

var PendingTestView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.find(".panel-body").html(html["pendingTest.html"]);

		var view = this;
		var student = new Student();
		student.fetch({
			url: student.getSearchStudentsUrl(sessionStorage.getItem("gobind-schoolid")),
			data: {
				status: "pending-test"
			}
		}).then(function(data) {
			_.each(data, function(object, index) {
				var s = new Student(object, {parse:true});
				new PendingTestRowView({
					el: view.addRow(),
					model: s
				});
			});
			view.table = view.$el.find("table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 5 ] },
		          	{ sClass: "center", aTargets: [ 5 ] },
		          	{ sWidth: "10%", aTargets: [ 5 ] },
		          	{ sWidth: "20%", aTargets: [ 4 ] }
		       	]			
			});
			createEmailButton(view.$el);
			createRefreshButton(view.$el);
			createExportButton(view.$el);
		});
	},

	events: {
		"change .toggle-checkboxes": "toggleCheckAll",
		"click #refresh": "refreshTable",
		"click .send-email": "openEmailModal",
		"click #export-table": "exportTable"
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".results").append(container);
		return container;
	},

	toggleCheckAll: function(evt) {
		toggleCheckboxes(this.table.fnGetNodes(), evt);
	},

	openEmailModal: function(evt) {
		openEmailWrapper(this.table.fnGetNodes());
	},

	refreshTable: function(evt) {
		evt.stopImmediatePropagation();
		this.table.fnDestroy();
		this.render();
	},
});

var PendingTestRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+   "<td class='course-list'></td>"
		+   "<td><label class='radio-inline'><input type='radio' value='1'> Approve</label><label class='radio-inline'><input type='radio' value='0'> Deny</label></td>"
		+   "<td><input type='checkbox' name='email' id='<%= model.userid %>' checked/></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		var view = this;
		view.$el.html(view.template({
			model: view.model.toJSON()
		}));
		view.$el.data("email", view.model.get("emailAddr"));

		var student = new Student();
		student.fetch({
			url: student.getPendingTestsUrl(this.model.get("userid"))
		}).then(function(data) {
			var courses = "";
			_.each(data, function(course, index) {
				courses += course.courseName + "<br>"
			});
			courses = courses.slice(0,-1);
			view.$el.find(".course-list").html(courses);
		});
	}
});