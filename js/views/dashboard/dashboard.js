var DashboardView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["dashboard.html"]);

		var usertype = sessionStorage.getItem("gobind-usertype");

		if (usertype == "SU" || usertype == "A") {
			this.populateStats();
			this.populateNotifications();
		}

		this.populateUser();
	},

	events: {
		"click .view-notification": "viewNotification"
	},

	populateNotifications: function() {
		var view = this;
		var count = new Count();
		count.fetch({
			url: count.getCountUrl("S"),
			data: {
				status: "pending"
			}
		}).then(function(data) {
			var parent = view.$el.find("#pending-stats");
			parent.find(".count").text(data);
			if (data != "0") {
				parent.find(".alert").removeClass("alert-success").addClass("alert-danger");
			} else {
				parent.find(".alert").removeClass("alert-danger").addClass("alert-success");
			}
		});
		count.fetch({
			url: count.getCountUrl("S"),
			data: {
				status: "pending-test"
			}
		}).then(function(data) {
			var parent = view.$el.find("#pending-test-stats");
			parent.find(".count").text(data);
			if (data != "0") {
				parent.find(".alert").removeClass("alert-success").addClass("alert-danger");
			} else {
				parent.find(".alert").removeClass("alert-danger").addClass("alert-success");
			}
		});
	},

	populateUser: function() {
		var parent = this.$el.find("#user-panel");
		var object = JSON.parse(sessionStorage.getItem("gobind-login"));
		parent.find(".username").text(sessionStorage.getItem("gobind-username"));
		parent.find(".last-logged-in").text(object.lastLogin);
	},

	populateStats: function() {
		var parent = this.$el.find("#stats-panel");
		var count = new Count();
		count.fetch({
			url: count.getCountUrl("S")
		}).then(function(data) {
			parent.find(".students").text(data);
		});
		count.fetch({
			url: count.getCountUrl("T")
		}).then(function(data) {
			parent.find(".teachers").text(data);
		});
		count.fetch({
			url: count.getCountUrl("A")
		}).then(function(data) {
			parent.find(".administrators").text(data);
		});
		count.fetch({
			url: count.getCountUrl("SU")
		}).then(function(data) {
			parent.find(".superusers").text(data);
		});
		count.fetch({
			url: count.getSectionCountURL()
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
				schoolid: 412312//TODO
			}
		}).then(function(data) {
			parent.find(".sections").text(data);
		});
	},

	viewNotification: function() {
		app.Router.navigate("notifications", {trigger:true});
	}
});