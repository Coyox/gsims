var LoginView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new User();
		Backbone.Validation.bind(this);	
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

		this.model.set("username", this.$el.find("#username").val());
		this.model.set("password", this.$el.find("#password").val());
		
		if (this.model.isValid(true)) {
			this.model.fetch({
				data: {
					username: this.model.get("username"),
					password: this.model.get("password")
				}
			}).then(function(data) {
				view.$el.find(".alert").addClass("hide");
				if (typeof data == "object") {
					app.username = data.username;
					app.usertype = data.usertype;
					sessionStorage.setItem("gobind-username", app.username);
					sessionStorage.setItem("gobind-usertype", app.usertype);

					view.model.fetch({
						url: view.model.getUsers(data.userid, data.usertype)
					}).then(function (data) {
						sessionStorage.setItem("gobind-email", data.emailAddr);
						app.Router.navigate("home", {trigger:true});
					});
				} else {
					setTimeout(function() {
						view.$el.find(".alert").removeClass("hide");
					}, 300);
				}
			});
		}
	},

	forgotPassword: function(evt) {
		app.Router.navigate("forgotPassword", {trigger:true});
	},

	loginOnEnter: function(evt) {
		if (evt.keyCode == 13) {
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