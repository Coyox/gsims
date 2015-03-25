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
		var approved = [];
		var denied = [];
		_.each(this.list, function(model, index) {
			if (model.hasChanged("status")) {
				var status = model.get("status");
				if (status == "active") {
					approved.push(model.get("userid"));
				} else if (status == "inactive") {
					denied.push(model.get("userid"));
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

		var student = new Student();
		var xhr = $.ajax({
			type: "POST",
			url: student.updatePendingUrl(),
			data: params,
			success: function(data) {
				if (data) {
					new TransactionResponseView({
						message: "Students successfully approved and/or denied"
					});	
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
		          	{ bSortable: false, aTargets: [ 6 ] }
		       	]				
			});
		});
	},

	events: {
		"click input[name='all']": "toggleCheckAll"
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".results").append(container);
		return container;
	},

	toggleCheckAll: function() {

	}
});

var PendingTestRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.status %></td>"
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
	}
});