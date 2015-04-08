var UserSettingsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["settings.html"]);

		this.login = JSON.parse(sessionStorage.getItem("gobind-login"));
		this.model = new User(this.login, {parse:true});
		this.$el.find("#username").val(this.login.username);
	},

	events: {
		"click #save-user": "saveUser",
		"keyup input": "updateModel"
	},

	saveUser: function() {
		var view = this;
		Backbone.Validation.bind(this);
		this.model.set("id", this.model.get("userid"));
		if (this.model.isValid(true)) {
			this.model.save().then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					new TransactionResponseView({
						message: "Account credentials successfully updated."
					});
					$("#header .username").text(view.model.get("username"));
				}
				else if (data.status == "duplicate"){
					new TransactionResponseView({
						message: "The entered username has been taken, please enter a different one."
					});
				}
				else {
					new TransactionResponseView({
						message: "Account credentials could not be updated.",
						title: "ERROR",
						status: "error"
					});
				}
			});
		}
	},

	updateModel: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).val();
		this.model.set(name, val);
	}
});