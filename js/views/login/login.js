var LoginView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new User();
		Backbone.Validation.bind(this);	
		this.render();
	},

	render: function() {
		var view = this;
		var schoolyear = new SchoolYear();
		schoolyear.fetch({
			url: schoolyear.getActiveSchoolYearUrl()
		}).then(function(data) {
			view.$el.html(html["login.html"]);  
			if (data.openForReg == 1) {
				view.$el.find("#reg-open").removeClass("hide").show();
			} else {
				view.$el.find("#reg-closed").removeClass("hide").show();
			}
			app.openForReg = data.openForReg;
		});
	},

	events: {
		"click #login": "validateCredentials",
		"keyup #password, #username": "loginOnEnter",
		"click #forgot-password": "forgotPassword",
		"click #register": "registerPage"
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
					sessionStorage.setItem("gobind-login", JSON.stringify(data));
					view.model.fetch({
						url: view.model.getUsers(data.userid, data.usertype)
					}).then(function (data) {
						sessionStorage.setItem("gobind-email", data.emailAddr);
						sessionStorage.setItem("gobind-user", JSON.stringify(data));
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
	},

	registerPage: function(evt) {
		app.Router.navigate("registrationForm", {trigger:true});
	}
});

var ForgotPasswordView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["forgotPassword.html"]);
	},

	events: {
		"click #send-link": "sendPasswordLink"
	},

	sendPasswordLink: function(evt) {
		var email = this.$el.find("#email").val();

		var user = new User();
		user.fetch({
			url: user.getUsers("341231", "SU")
		}).then(function(data) {
			if (typeof data !== undefined) {
				if (data.emailAddr == email) {
					var link = "https://gobind-sarvar.rhcloud.com/#reset" + data.userid + "/username1";
					sendEmail({
						from: "info@gobindsarvar.com",
						to: [{
							email: email,
							name: "Gobind Sarvar",
							type: "to"
						}],
						subject: "Gobind Sarvar - Reset Account Password",
						body: link
					}, function() {
						new TransactionResponseView({
							message: "An email has been sent to: " + email + ". Please follow the link to reset your password."
						});
					});
				} else {
					// No user exists with the specified email
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "No user exists with the email address: " + email + ". Please provide a valid email address."
					});
				}
			} else {
				// No user exists with the specified email
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "No user exists with the email address: " + email + ". Please provide a valid email address."
				});
			}
		});
	}
});

var ResetPasswordView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.username = options.username;
		this.render();
	},

	render: function() {
		this.$el.html(html["resetPassword.html"]);
	},

	events: {
		"click #save-password": "savePassword"
	},

	savePassword: function(evt) {
		var password1 = this.$el.find("#password1").val();
		var password2 = this.$el.find("#password2").val();
		if (password1 == password2) {
			var user = new User();
			user.set("username", this.username);
			user.set("password", password1);
			user.set("id", this.id);
			user.set("userid", this.id);
			user.save().then(function(data) {
				console.log(data);
			});
		
		}
	}
});