var NotificationsView = Backbone.View.extend({
	panelTemplate: _.template("<div class='panel panel-default'><div class='panel-heading'><%= title %></div><div class='panel-body'></div></div>"),

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
		var container = $(this.panelTemplate({
			title: title
		}));
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
				status: "pending",
				pendingEnrollment: "1"
			}
		}).then(function(data) {
			_.each(data, function(object, index) {
				var s = new Student(object, {parse:true});
				view.list.push(s);
				new PendingRowView({
					el: view.addRow(s.get("userid"), s.get("emailAddr")),
					model: s,
					index: index
				});
			});
			view.table = view.$el.find("#pending-reg-table").dataTable({
		      	aoColumnDefs: [
		      		{ sClass: "center", aTargets: [ 0, 5 ] },
		          	{ bSortable: false, aTargets: [ 3, 4, 5 ] },
		          	{ sWidth: "5%", aTargets: [ 5 ] }
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

	addRow: function(userid, email) {
		var container = $("<tr data-userid='" + userid + "' data-email='" + email + "'></tr>");
		this.$el.find(".results").append(container);
		return container;
	},

	saveStatuses: function(evt) {
		var view = this;

		var approvedEmails = [];
		var deniedEmails = [];

		var tempApproved = [];
		var tempDenied = [];
		var tempTest = [];

		var students = [];

		var isValid = false;

		_.each(this.table.fnGetNodes(), function(row, index) {
			var user = {
				userid: $(row).data("userid"),
				emailAddr: $(row).data("emailAddr"),
				approvedList: [],
				deniedList: [],
				testList: []
			};
			var found = false;
			var subrows = $(row).find(".sections tbody tr");
			var numrows = subrows.length;
			var count = 0;
			_.each(subrows, function(subrow, index) {
				var sectionid = $(subrow).data("sectionid");
				var courseName = $(subrow).data("coursename");
				var checked = $(subrow).find("input[type='radio']:checked").get(0);
				if (checked) {
					if ($(checked).attr("value") == "a") {
						user.approvedList.push(sectionid);
						tempApproved.push(courseName);
					} else if ($(checked).attr("value") == "d") {
						user.deniedList.push(sectionid);
						tempDenied.push(courseName);
					} else if ($(checked).attr("value") == "t") {
						user.testList.push(sectionid);
						tempTest.push(courseName);
					}
					found = true;
					count++;
				}
			});
			if (found) {
				if (count != numrows) {
					$(row).find(".sections").prepend("<div class='alert alert-danger'>Please select an option for all sections listed below. </div>");
				} else {
					if (user.approvedList.length == 0 && user.testList.length == 0) {
						user.status = "denied";
						approvedEmails.push(user.emailAddr);
					} else {
						user.status = $(row).data("status");
						deniedEmails.push(user.emailAddr);
					}
					students.push(user);
					isValid = true;
				}
			}
		});

		if (isValid) {
			var student = new Student();
			var xhr = $.ajax({
				type: "POST",
				url: student.updatePendingUrl(),
				data: {
					students: JSON.stringify(students)
				},
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

						var approvedBody = "";
						approvedBody += "Your student account at Gobind Sarvar has been approved.<br><br>";

						var emailbody = "The following sections have been approved:<br>";
						_.each(tempApproved, function(name, index) {
							emailbody += name + ",";
						});
						emailbody = emailbody.slice(0,-1);

						emailbody += "The following sections have been denied:<br>";
						_.each(tempDenied, function(name, index) {
							emailbody += name + ",";
						});
						emailbody = emailbody.slice(0,-1);

						emailbody += "You a pending a test for the following courses:<br>";
						_.each(tempTest, function(name, index) {
							emailbody += name + ",";
						});
						emailbody = emailbody.slice(0,-1);

						sendEmail({
							from: "info@gobindsarvar.com",
							to: to,
							subject: "Gobind Sarvar - Account Approved!",
							body: emailbody
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
		}
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
	template: _.template("<td><span class='view-student primary-link center-block' id='<%= model.userid %>'>[ View Student ]</span></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.status %></td>"
		+	"<td class='sections'>"
		+		"<table class='section-table table-bordered table'>"
		+			"<thead><th>Sections</th><th>Approve</th><th>Deny</th><th>Test</th></thead>"
		+			"<tbody></tbody>"
		+		"</table>"
		+	"</td>"
		+	"<td><input type='checkbox' class='user-row' checked></td>"),

	sectionTemplate: _.template("<tr data-sectionid='<%= sectionid %>' data-course='<%= courseName %>'>"
		+	"<td><%= courseName %></td>"
		+	"<td><input type='radio' name='status<%= index %>' value='a'></td>"
		+	"<td><input type='radio' name='status<%= index %>' value='d'></td>"
		+	"<td><input type='radio' name='status<%= index %>' value='t'></td>"
		+	"</tr>"),

	initialize: function(options) {
		this.index = options.index;
		this.render();
	},

	events: {
		"change input[type='radio']": "updateRegStatus",
		"click .view-student": "viewStudent"
	},

	render: function() {
		var view = this;

		this.$el.html(this.template({
			model: this.model.toJSON(),
			index: this.index
		}));

		this.model.fetch({
			url: this.model.getEnrolledSectionsUrl(this.model.get("userid")),
			data: {
				status: "pending"
			}
		}).then(function(data) {
			_.each(data, function(course, index) {
				view.$el.find(".section-table").append(view.sectionTemplate({
					sectionid: course.sectionid,
					courseName: course.courseName,
					index: + view.model.get("userid") + index
				}));
			});
		});

	},

	updateRegStatus: function(evt) {
		var status = $(evt.currentTarget).attr("value");
		status = status == 1 ? "active" : "inactive";
		this.model.set("status", status);
	},

	viewStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("students/" + id, {trigger:true});
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
					el: view.addRow(s.get("userid")),
					model: s
				});
			});
			view.table = view.$el.find("#pending-test-table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 5 ] },
		          	{ sClass: "center", aTargets: [ 0, 5 ] },
		          	{ sWidth: "5%", aTargets: [ 5 ] },
		       	]
			});
			createEmailButton(view.$el);
			createRefreshButton(view.$el);
			createExportButton(view.$el);
			addDTButtons(view.$el, "<button id='save-status' class='btn btn-primary btn-sm'>Save</button>");
		});
	},

	events: {
		"change .toggle-checkboxes": "toggleCheckAll",
		"click #refresh": "refreshTable",
		"click .send-email": "openEmailModal",
		"click #export-table": "exportTable",
		"click #save-status": "saveStatuses"
	},

	addRow: function(userid) {
		var container = $("<tr data-userid='" + userid + "'></tr>");
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

	saveStatuses: function(evt) {
		var view = this;

		var approvedEmails = [];
		var deniedEmails = [];

		var tempApproved = [];
		var tempDenied = [];
		var tempTest = [];

		var students = [];

		var found = false;

		_.each(this.table.fnGetNodes(), function(row, index) {
			var user = {
				userid: $(row).data("userid"),
				emailAddr: $(row).data("emailAddr"),
				approvedList: [],
				deniedList: [],
			};
			var subrows = $(row).find(".sections tbody tr");
			_.each(subrows, function(subrow, index) {
				var sectionid = $(subrow).data("sectionid");
				var courseName = $(subrow).data("coursename");
				var checked = $(subrow).find("input[type='radio']:checked").get(0);
				if (checked) {
					if ($(checked).attr("value") == "a") {
						user.approvedList.push(sectionid);
						tempApproved.push(courseName);
					} else if ($(checked).attr("value") == "d") {
						user.deniedList.push(sectionid);
						tempDenied.push(courseName);
					}
					found = true;
				}
			});
			if (found) {
				if (user.approvedList.length == 0 && user.testList.length == 0) {
					user.status = "denied";
					approvedEmails.push(user.emailAddr);
				} else {
					user.status = "active";
					deniedEmails.push(user.emailAddr);
				}
				students.push(user);
			}
		});

		console.log(students);

		var student = new Student();
		var xhr = $.ajax({
			type: "POST",
			url: student.updatePendingUrl(),
			data: {
				students: JSON.stringify(students)
			},
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

					var approvedBody = "";
					approvedBody += "Your student account at Gobind Sarvar has been approved.<br><br>";

					var emailbody = "The following sections have been approved:<br>";
					_.each(tempApproved, function(name, index) {
						emailbody += name + ",";
					});
					emailbody = emailbody.slice(0,-1);

					emailbody += "The following sections have been denied:<br>";
					_.each(tempDenied, function(name, index) {
						emailbody += name + ",";
					});
					emailbody = emailbody.slice(0,-1);

					emailbody += "You a pending a test for the following courses:<br>";
					_.each(tempTest, function(name, index) {
						emailbody += name + ",";
					});
					emailbody = emailbody.slice(0,-1);

					sendEmail({
						from: "info@gobindsarvar.com",
						to: to,
						subject: "Gobind Sarvar - Account Approved!",
						body: emailbody
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
});

var PendingTestRowView = Backbone.View.extend({
	template: _.template("<td><span class='view-student primary-link center-block' id='<%= model.userid %>'>[ View Student ]</span></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.status %></td>"
		+	"<td class='sections'>"
		+		"<table class='section-table table-bordered table'>"
		+			"<thead><th>Sections</th><th>Approve</th><th>Deny</th></thead>"
		+			"<tbody></tbody>"
		+		"</table>"
		+	"</td>"
		+	"<td><input type='checkbox' class='user-row' checked></td>"),

	sectionTemplate: _.template("<tr data-sectionid='<%= sectionid %>' data-course='<%= courseName %>'>"
		+	"<td><%= courseName %></td>"
		+	"<td><input type='radio' name='status<%= index %>' value='a'></td>"
		+	"<td><input type='radio' name='status<%= index %>' value='d'></td>"
		+	"</tr>"),

	initialize: function(options) {
		this.render();
	},

	events: {
		"click .view-student": "viewStudent"
	},

	render: function() {
		var view = this;
		view.$el.html(view.template({
			model: view.model.toJSON()
		}));
		view.$el.data("email", view.model.get("emailAddr"));

		var student = new Student();
		student.fetch({
			url: student.getEnrolledSectionsUrl(this.model.get("userid")),
			data: {
				status: "pending-test"
			}
		}).then(function(data) {
			_.each(data, function(course, index) {
				view.$el.find(".section-table").append(view.sectionTemplate({
					sectionid: course.sectionid,
					courseName: course.courseName,
					index: + view.model.get("userid") + index
				}));
			});
		});
	},

	viewStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("students/" + id, {trigger:true});
	}
});