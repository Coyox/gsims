var SuperuserRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.action = "view";
		this.render();
	},

	render: function() {
		var view = this;
		var superuser = new Superuser({id:this.id});
		superuser.fetch().then(function(data) {
			var template = html["viewSuperuser.html"];
			var usertype = sessionStorage.getItem("gobind-usertype");

			template = template({
				usertype: usertype
			});

	        view.$el.html(template);
			view.$el.find("#superuser-info-table").empty();

			if (view.action == "view") {
				view.$el.find("#edit-superuser").removeClass("hide").show();
				view.$el.find("#cancel").hide();
				view.$el.find("#save-superuser").hide();
			} else {
				view.$el.find("#save-superuser").removeClass("hide").show();
				view.$el.find("#cancel").removeClass("hide").show();
				view.$el.find("#edit-superuser").hide();
			}

			view.model = new Superuser(data, {parse:true});
			view.model.set("userid", view.id);
			view.emailTab(data);
			view.superuserInformationTab(view.model);
		});
	},

	events: {
		"click #edit-superuser": "editSuperuser",
		"click #save-superuser": "saveSuperuser",
		"click #cancel": "cancel"
	},

	cancel: function() {
		this.model.attributes = JSON.parse(this.untouched);
		this.action = "view";
		this.render();
	},

	superuserInformationTab: function() {
		_.each(this.model.toJSON(), function(value, name) {
			if (this.model.nonEditable.indexOf(name) == -1) {
				new CreateSuperuserRowView({
					el: this.addRow(),
					model: this.model,
					name: name,
					value: value,
					action: this.action
				});
			}
		}, this);
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#superuser-info-table").append(container);
		return container;
	},

	editSuperuser: function(evt) {
		this.action = "edit";
		this.untouched = JSON.stringify(this.model.toJSON());
		this.render();
	},

	saveSuperuser: function() {
		Backbone.Validation.bind(this);

		var view = this;
		if (this.model.isValid(true)) {
			view.model.set("id", view.model.get("userid"));
			view.model.save().then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					new TransactionResponseView({
						message: "Superuser successfully saved."
					});
					view.action = "view";
					view.render();
				} else {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Sorry, there was a problem saving this superuser. Please try again."
					});
				}
			});
		}
	},

	emailTab: function(data) {
		new EmailView({
			el: $("#email"),
			emailAddr: data.emailAddr
		});
	}
});

