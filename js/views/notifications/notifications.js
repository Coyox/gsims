var NotificationsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		// TODO: dashboard based on user type
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
				new PendingRowView({
					el: view.addRow(),
					model: s,
					index: index
				});
			});
			view.$el.find("table").dataTable();
		});
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".results").append(container);
		return container;
	}
});

var PendingRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.status %></td>"
		+   "<td><label class='radio-inline'><input type='radio' name='status<%= index %>'> Approve</label><label class='radio-inline'><input type='radio' name='status<%= index %>'> Deny</label></td>"),

	initialize: function(options) {
		this.index = options.index;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON(),
			index: this.index
		}))
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

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".results").append(container);
		return container;
	}
});

var PendingTestRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.status %></td>"
		+   "<td><%= model.emailAddr %></td>"
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