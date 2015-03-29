var SchoolYearView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new SchoolYear();
		this.action = options.action || "view";
		this.render();
	},

	render: function() {
		this.list = [];
		this.$el.html(html["viewSchoolYear.html"]);

		if (this.action == "view") {
			this.$el.find("#edit-year").removeClass("hide").show();
		} else {
			this.$el.find("#save-year").removeClass("hide").show();
		}

		var view = this;
		var schoolyear = new SchoolYear();
		schoolyear.fetch().then(function(data) {
			_.each(data, function(object, index) {
				var year = new SchoolYear(object, {parse: true});
				view.list.push(year);
				new SchoolYearRowView({
					el: view.addRow(),
					model: year,
					action: view.action
				});
			});
			view.$el.find("table").dataTable({
				dom: "t",
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 1,2 ] }
		       	]
			});
		});
	},

	events: {
		"click #create-year": "createSchoolYear",
		"click #edit-year": "editSchoolYear",
		"click #save-year": "saveSchoolYear"
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".results").append(container);
		return container;
	},

	createSchoolYear: function(evt) {
		var view = this;
		Backbone.Validation.bind(this);

		this.$el.append(html["createSchoolYear.html"]);

		var elem = $("#create-year-modal");
		var backdrop = $(".modal-backdrop");

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			backdrop.remove();
		});

		elem.on("click", "#save", function() {
			view.model.set("schoolyear", $("#school-year").val());
			if (view.model.isValid(true)) {
				elem.remove();
				backdrop.remove();
				view.model.save({
					data: {duplicate:1,
						   currentSchoolYear:sessionStorage.getItem("gobind-activeSchoolYear")}
				}).then(function(data) {
					if (data.status=="success") {
						new TransactionResponseView({
							message: "New school year successfully created."
						});
						view.render();
					}
					else {
						new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new school year."
					});
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new school year."
					});
				});
			}
		});
	},

	editSchoolYear: function(evt) {
		this.action = "edit";
		this.render();
	},

	saveSchoolYear: function(evt) {
		var view = this;
		var promises = [];
		_.each(this.list, function(model, index) {
			var id = model.get("schoolyearid");
			if (model.hasChanged("status")) {
				var promise = model.save(null, {
					url: this.model.updateActiveYearUrl(id)
				});
				promises.push(promise);
			} else if (model.hasChanged("openForReg")) {
				var promise = model.save(null, {
					url: this.model.updateRegistrationUrl(id)
				});
				promises.push(promise);
			}
		}, this);

		// Wait for both queries to return
		$.when.apply($, promises).then(function() {
			new TransactionResponseView({
				message: "School year(s) successfully updated."
			});
			view.action = "view";
			view.render();
		}).fail(function(data) {
			new TransactionResponseView({
				title: "ERROR",
				error: "error",
				message: "School year(s) could not be updated."
			});
		});
	},

	refresh: function() {
		this.render();
	}
});

var SchoolYearRowView = Backbone.View.extend({
	viewTemplate: _.template("<td><%= model.schoolyear %></td>"
		+	"<td><%= status %></td>"
		+	"<td><%= openForReg %></td>"),

	editTemplate: _.template("<td><%= model.schoolyear %></td>"
		+	"<td><input type='checkbox' id='<%= model.schoolyearid %>' name='active-switch' checked></td>"
		+	"<td><input type='checkbox' id='<%= model.schoolyearid %>' name='reg-switch' checked></td>"),

	initialize: function(options) {
		this.action = options.action;
		this.render();
	},

	render: function() {
		var view = this;

		if (this.action == "view") {
			this.$el.html(this.viewTemplate({
				model: this.model.toJSON(),
				status: capitalize(this.model.get("status")),
				openForReg: this.model.get("openForReg") == 1 ? "Yes" : "No"
			}));
		} else {
			this.$el.html(this.editTemplate({
				model: this.model.toJSON()
			}));

			// active school year switch
			this.$el.find("[name='active-switch']").bootstrapSwitch({
				size: "mini",
				onText: "active",
				offText: "inactive",
				state: this.model.get("status") == "active" ? true : false,
				onSwitchChange: function(event, state) {
					var schoolyearid = $(event.currentTarget).attr("id");
					view.model.set("id", schoolyearid);
					view.model.set("status", state == true ? "active" : "inactive");
				}
			});

			// registration switch
			this.$el.find("[name='reg-switch']").bootstrapSwitch({
				size: "mini",
				onText: "open",
				offText: "closed",
				state: this.model.get("openForReg") == 1 ? true : false,
				onSwitchChange: function(event, state) {
					var schoolyearid = $(event.currentTarget).attr("id");
					view.model.set("id", schoolyearid);
					view.model.set("openForReg", state == true ? 1 : 0);
				}
			});
		}
	}
});