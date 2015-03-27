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
			url: student.getSearchStudentsUrl(),
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
			view.$el.find("table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 4 ] }
		       	]
			});
		});
	},

	events: {
		"click #save-status": "saveStatuses"
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
	}
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
			url: student.getSearchStudentsUrl(),
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
			view.$el.find("table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 5 ] }
		       	]				
			});
		});
	},

	events: {
		"change .toggle-checkboxes": "toggleCheckAll",
		"click #email-students": "emailStudents"
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".results").append(container);
		return container;
	},

	toggleCheckAll: function(evt) {
		var checked = $(evt.currentTarget).is(":checked");
		var rows = this.$el.find("table tbody tr");
		_.each(rows, function(row, index) {
			var checkbox = $(row).find("input[type='checkbox']");
			checkbox.prop("checked", checked);
		}, this);
	},

	emailStudents: function() {
		var recipients = [];
		var rows = this.$el.find("table tbody tr");
		_.each(rows, function(row, index) {
			var checkbox = $(row).find("input[type='checkbox']");
			if ($(checkbox).is(":checked")) {
				recipients.push($(checkbox).closest("tr").data("email"));
			}
		}, this);	
		openEmailModal(recipients);
	}
});

var PendingTestRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+   "<td><%= model.emailAddr %></td>"
		+   "<td><%= model.courses %></td>"
		+   "<td><input type='checkbox' name='email' id='<%= model.userid %>'/></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		this.$el.data("email", this.model.get("emailAddr"));
	}
});