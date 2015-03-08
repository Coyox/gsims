var LoginView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["login.html"]);
	},

	events: {
		"click #login": "validateCredentials"
	},

	validateCredentials: function(evt) {
		var username = this.$el.find("#username").val();
		var password = this.$el.find("#password").val();
		console.log(username, password);
		new User().fetch({
			data: {
				username: username,
				password: password
			}
		}).then(function(data) {
			console.log(data);
		});
	}
});