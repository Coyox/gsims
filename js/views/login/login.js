var LoginView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["login.html"]);
	},

	events: {
		"click #login": "validateCredentials",
		"keyup #password, #username": "loginOnEnter",
		"click #forgot": "forgotPassword"
	},

	validateCredentials: function(evt) {
		var view = this;
		var username = this.$el.find("#username").val();
		var password = this.$el.find("#password").val();
		new User().fetch({
			data: {
				username: username,
				password: password
			}
		}).then(function(data) {
			view.$el.find(".alert").addClass("hide");
			if (typeof data == "object") {
				app.username = data.username;
				app.usertype = data.usertype;
				sessionStorage.setItem("gobind-username", app.username);
				sessionStorage.setItem("gobind-usertype", app.usertype);
				app.Router.navigate("home", {trigger:true});
			} else {
				setTimeout(function() {
					view.$el.find(".alert").removeClass("hide");
				}, 300);
			}
		});
	},

	forgotPassword: function(evt) {
		app.Router.navigate("forgotPassword", {trigger:true});
	},

	loginOnEnter: function(evt) {
		if(evt.keyCode == 13){
			console.log("Logging in with enter key.");
			this.validateCredentials();
		}
	}
});

var ForgotPasswordView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {

	}
});