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
		Backbone.Validation.bind(this);
		this.model.set("id", this.model.get("userid"));
		this.model.save().then(function(data) {
			if (typeof data == "string") {
				data = JSON.parse(data);
			}
			if (data.status == "success") {
				new TransactionResponseView({
					message: "Account successfully updated."
				});
			} else {
				new TransactionResponseView({
					message: "Account could not be updated.",
					title: "ERROR",
					status: "error"
				});				
			}
		});
	},

	updateModel: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).val();
		this.model.set(name, val);
	}
});