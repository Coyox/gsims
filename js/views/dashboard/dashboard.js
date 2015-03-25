var DashboardView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		// TODO: dashboard based on user type
		this.$el.html(html["dashboard.html"]);
		this.populateStats();
		this.populateNotifications();
		this.populateUser();
	},

	populateNotifications: function() {
		var parent = this.$el.find("#stats-panel");
		var count = new Count();
		count.fetch({
			url: count.getCountUrl("S")
		}).then(function(data) {
			parent.find(".students").text(data);
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
	}
});