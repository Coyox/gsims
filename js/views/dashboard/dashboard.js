var DashboardView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		// TODO: dashboard based on user type
		this.$el.html(html["dashboard.html"]);
	}
});