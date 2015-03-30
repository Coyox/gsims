var CreateSuperuserView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new Superuser();
		this.render();
	},

	render: function() {
		this.$el.html(html["createSuperuser.html"]);

		this.model.nonEditable.push("status");

		_.each(this.model.toJSON(), function(value, name) {
			if (this.model.nonEditable.indexOf(name) == -1) {
				new CreateSuperuserRowView({
					el: this.addRow(),
					model: this.model,
					name: name,
					value: value,
					action: "edit"
				});
			}
		}, this);

		this.competencyView = new AdminCompetencyView({
			el: this.$el,
			model: this.model
		});
	},

	events: {
		"click #save-superuser": "saveSuperuser"
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#superuser-info").append(container);
		return container;
	},

	saveSuperuser: function() {
		Backbone.Validation.bind(this);
		var view = this;
		this.model.set("usertype", "T");
		this.model.set("schoolid", "412312");
		this.model.set("status",  "active");
		console.log(this.model);

		if (this.model.isValid(true)) {
			this.model.save({
				dataType: "json"
			}).then(function(data) {
				console.log(data);
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					var insertComp = [];
					_.each(view.model.competency, function(dept, index) {
						if (dept.level != 0) {
							insertComp.push({
								deptid: dept.deptid,
								level: dept.level
							});
						}
					});
					if (insertComp.length) {
						$.ajax({
							type: "POST",
							url: view.model.addCourseCompetencyUrl(data.userid),
							data: {
								competencies: JSON.stringify(insertComp)
							}
						}).then(function(data) {
							if (typeof data == "string") {
								data = JSON.parse(data);
							}
							if (data.status == "success") {
								new TransactionResponseView({
									message: "Superuser successfully created. " + insertComp.length + " competency levels updated."
								});
							} else {
								new TransactionResponseView({
									title: "ERROR",
									status: "error",
									message: "Superuser successfully created, but the competency levels could not be updated."
								});
							}
						})
					} else {
						new TransactionResponseView({
							message: "Superuser successfully created."
						});
					}
					view.render();
				} else {
					new TransactionResponseView({
						message: "Sorry, the superuser could not be created. Please try again."
					});
				}
			}).fail(function(jqXHR) {
				new TransactionResponseView({
					message: "Sorry, the superuser could not be created. Please try again."
				});
			});
		} else {

		}
	}
});

var CreateSuperuserRowView = Backbone.View.extend({
	viewTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<span><%= value %></span>"
		+	"</div>"),

	editTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<input type='text' class='form-control input-sm' value='<%= value %>' name='<%= name %>'>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	statusTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<select id='status-menu' class='form-control input-sm' name='status'></select>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	initialize: function(options) {
		this.name = options.name;
		this.value = options.value;
		this.action = options.action;
		this.render();
	},

	render: function() {
		this.label = capitalize(this.name);
		this.label = splitChars(this.label);

		if (this.name == "emailAddr") {
			this.label = "Email Address";
		}

		if (this.action == "view") {
			if (this.name == "status") {
				this.value = capitalize(this.value);
			}
			this.$el.html(this.viewTemplate({
				model: this.model.toJSON(),
				label: this.label,
				name: this.name,
				value: this.value
			}));
		} else {

			var params = {
				model: this.model.toJSON(),
				label: this.label,
				name: this.name,
				value: this.value
			}
			if (this.name == "status") {
				this.$el.html(this.statusTemplate(params));
				populateStatusMenu(this.$el.find("#status-menu"), this.model.superuserStatuses, this.value);
			} else {
				this.$el.html(this.editTemplate(params));
			}
		}
	},

	events: {
		"keyup input": "updateModel",
		"change select": "updateSelect"
	},

	updateModel: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).val();
		this.model.set(name, val);
	},

	updateSelect: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).find("option:selected").val();
		this.model.set(name, val);
	}
});

