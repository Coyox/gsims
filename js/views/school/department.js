var SchoolYearView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new SchoolYear();
		this.render();
	},

	render: function() {
		this.$el.html(html["viewSchoolYear.html"]);

		var view = this;
		var schoolyear = new SchoolYear();
		schoolyear.fetch().then(function(data) {
			_.each(data, function(object, index) {
				var year = new SchoolYear(object, {parse: true});
				new SchoolYearRowView({
					el: view.addRow(),
					model: year
				});
			});
			view.$el.find("table").dataTable({
				dom: "t"
			});
		});
	},

	events: {
		"click #create-year": "createSchoolYear",
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

		$("#create-year-modal").modal({
			show: true
		});
		
		$("#create-year-modal").on("hidden.bs.modal", function() {
			$("#create-year-modal").remove();
			$(".modal-backdrop").remove();
		});
		
		$("#create-year-modal").on("click", "#save", function() {
			view.model.set("schoolyear", $("#school-year").val());
			if (view.model.isValid(true)) {
				$("#create-year-modal").remove();
				$(".modal-backdrop").remove();
				view.model.save({
					dataType: "text"
				}).then(function(data) {
					if (data) {
						new TransactionResponseView({
							message: "New school year successfully created."
						});
						view.render();
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

	refresh: function() {
		this.render();
	}
});

var SchoolYearRowView = Backbone.View.extend({
	template: _.template("<td><%= model.schoolyear %></td>"
		+	"<td><input type='checkbox' id='<%= model.schoolyearid %>' name='active-switch' checked></td>"
		+	"<td><input type='checkbox' id='<%= model.schoolyearid %>' name='reg-switch' checked></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		var view = this; 

		this.$el.html(this.template({
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
				view.model.save(null, {
					url: view.model.updateActiveYearUrl(schoolyearid)
				}).then(function(data) {
					console.log(data);
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not update active school year."
					});
				});
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
				view.model.save(null, {
					url: view.model.updateRegistrationUrl(schoolyearid)
				}).then(function(data) {
					console.log(data);
					new TransactionResponseView({
						message: "School year successfully updated."
					});
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not update registration status."
					});
				});
			}
		});
	}
});