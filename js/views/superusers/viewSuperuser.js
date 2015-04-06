var SuperuserRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.action = "view";
		this.render();
	},

	render: function() {
		var view = this;
		console.log(this.id);
		var superuser = new Superuser({id:this.id});
		superuser.fetch().then(function(data) {
			//console.log(data);
			var template = html["viewSuperuser.html"];
			var usertype = sessionStorage.getItem("gobind-usertype");

			template = template({
				usertype: usertype
			});


	        view.$el.html(template);
			view.$el.find("#superuser-info-table").empty();
			view.$el.find("#comp-info, #comp2-info").empty();

			if (view.action == "view") {
				view.$el.find("#edit-superuser").removeClass("hide").show();
				view.$el.find("#save-superuser").hide();
			} else {
				view.$el.find("#save-superuser").removeClass("hide").show();
				view.$el.find("#edit-superuser").hide();
			}

			view.model = new Superuser(data, {parse:true});
			view.model.set("userid", view.id);
			view.emailTab(data);
			view.superuserInformationTab(view.model);
			view.superuserSectionsTab(view.model);
		});
	},

	events: {
		"click #edit-superuser": "editSuperuser",
		"click #save-superuser": "saveSuperuser",
	},

	superuserInformationTab: function() {
		_.each(this.model.toJSON(), function(value, name) {
			if (this.model.nonEditable.indexOf(name) == -1) {
				console.log(name);
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
		this.render();
	},

	saveSuperuser: function() {
		Backbone.Validation.bind(this);

		// Get existing department ids and competency levels
		var existingIds = {}
		_.each(this.existingLevels, function(comp, index) {
			existingIds[comp.deptid] = comp.level;
		});

		// For each competency level, either INSERT/UPDATE/DELETE a competency table row
		var updateComp = [];
		var insertComp = [];
		var deleteComp = [];
		_.each(this.model.competency, function(comp, index) {
			if (existingIds[comp.deptid]) {
				var level = existingIds[comp.deptid].level;
				if (existingIds[comp.deptid] != comp.level) {
					if (comp.level == 0) {
						deleteComp.push(comp.deptid);
					} else {
						updateComp.push({
							deptid: comp.deptid,
							level: comp.level
						});
					}
				}
			} else {
				if (comp.level != 0) {
					insertComp.push({
						deptid: comp.deptid,
						level: comp.level
					});
				}
			}
		});

		// Only send the array if its not empty
		var params = {};
		if (updateComp.length) {
			params.updateComps = JSON.stringify(updateComp);
		}
		if (insertComp.length) {
			params.insertComps = JSON.stringify(insertComp);
		}
		if (deleteComp.length) {
			params.deleteComps = JSON.stringify(deleteComp);
		}

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
	},

	superuserSectionsTab: function(model) {
		new TeachingSectionsView({
			el: this.$el.find("#course-info"),
			model: model
		});
	}
});

