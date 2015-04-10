var SchoolYearView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new SchoolYear();
		this.action = options.action || "view";
		this.render();
	},

	render: function() {
		this.list = [];
        var usertype = sessionStorage.getItem("gobind-usertype");
		this.$el.html(html["viewSchoolYear.html"]);
        if(usertype == "SU"){
            $("#purge-year").removeClass("hide");
        }
		if (this.action == "view") {
			this.$el.find("#edit-year").removeClass("hide").show();
		} else {
			this.$el.find("#save-year").removeClass("hide").show();
			this.$el.find("#cancel").removeClass("hide").show();
		}

		var view = this;
		var schoolyear = new SchoolYear();
		schoolyear.fetch({
			data: {
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {

			var school = new School();
			school.set("id", sessionStorage.getItem("gobind-schoolid"));
			school.set("schoolid", sessionStorage.getItem("gobind-schoolid"));
			school.fetch().then(function(openForReg) {
				console.log(data);
				_.each(data, function(object, index) {
					var year = new SchoolYear(object, {parse: true});
					view.list.push(year);
					new SchoolYearRowView({
						el: view.addRow(),
						model: year,
						action: view.action,
						isActive: year.get("status") == "active",
						openForReg: openForReg.openForReg
					});
				});
				view.$el.find("table").dataTable({
					dom: "t",
			      	aoColumnDefs: [
			          	{ bSortable: false, aTargets: [ 1,2 ] }
			       	]
				});

			});
		});
	},

	events: {
		"click #create-year": "createSchoolYear",
		"click #edit-year": "editSchoolYear",
		"click #save-year": "saveSchoolYear",
        "click #purge-year": "purgeSchoolYear",
        "click #cancel": "cancel"
	},

	cancel: function() {
		this.model.attributes = JSON.parse(this.untouched);
		this.action = "view";
		this.render();
	},

    purgeSchoolYear: function(){
        var schoolyear = new SchoolYear();
		schoolyear.fetch().then(function(data) {
            var ids = [];
			_.each(data, function(object, index) {
                 ids.push(object.schoolyearid);
            });
            var purge = new Purge();
            $.ajax({
                type: "POST",
                url: purge.purgeSchoolYears(),
                data: {
                  schoolyearids: JSON.stringify(ids)
                }
            }).then(function(data) {
                if (data.status == "success") {
	                new TransactionResponseView({
	                    message: "The selected records have successfully been purged."
	                });
             	} else {
                  	new TransactionResponseView({
                    	title: "ERROR",
                    	status: "error",
                    	message: "The selected could not be purged. Please try again."
                    });               
                }
            }).fail(function(data) {
                new TransactionResponseView({
                    title: "ERROR",
                    status: "error",
                    message: "The selected could not be purged. Please try again."
                }); 
            });
        });
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
					data: {
						duplicate:1,
						currentSchoolYear:sessionStorage.getItem("gobind-activeSchoolYear")
					}
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
		this.untouched = JSON.stringify(this.model.toJSON());
		this.action = "edit";
		this.render();
	},

	saveSchoolYear: function(evt) {
		var view = this;
		var promises = [];

		var schoolid, openForReg;
		var schoolyearid;
		_.each(this.list, function(model, index) {
			if (model.get("schoolid")) {
				schoolid = model.get("schoolid");
				openForReg = model.get("openForReg");
			}
			if (model.get("activeschoolyearid")) {
				schoolyearid = model.get("activeschoolyearid");
			}
		}, this);

		var def1 = $.Deferred();
		var def2 = $.Deferred();

		if (schoolyearid) {
			var year = new SchoolYear();
			$.ajax({
				type: "POST",
				url: school.updateActiveYearUrl(schoolyearid),
				data: {
					schoolyearid: schoolyearid
				}
			}).then(function(data) {
				console.log(data);
				def1.resolve();
			});			
		} else {
			def1.resolve();
		}

		if (schoolid) {
			var school = new School();
			$.ajax({
				type: "PUT",
				url: school.updateOpenRegistration(schoolid),
				data: {
					openForReg: openForReg
				}
			}).then(function(data) {
				console.log(data);
				def2.resolve();
			});
		} else {
			def2.resolve();
		}

		$.when(def1, def2).then(function() {
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
		+	"<td><%= isOpen %></td>"),

	editTemplate: _.template("<td><%= model.schoolyear %></td>"
		+	"<td><input type='checkbox' id='<%= model.schoolyearid %>' name='active-switch' checked></td>"
		+	"<td><input type='checkbox' class='hide' id='<%= schoolid %>' name='reg-switch'></td>"),
	initialize: function(options) {
		this.action = options.action;
		this.openForReg = options.openForReg;
		this.isActive = options.isActive;
		this.schoolid = options.schoolid;
		this.render();
	},

	render: function() {
		var view = this;

		if (this.action == "view") {
			this.$el.html(this.viewTemplate({
				model: this.model.toJSON(),
				status: capitalize(this.model.get("status")),
				isOpen: this.isActive == true && this.openForReg == true ? "OPEN" : "CLOSED"
			}));
		} else {
			this.$el.html(this.editTemplate({
				model: this.model.toJSON(),
				schoolid: sessionStorage.getItem("gobind-schoolid")
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
					view.model.set("activeschoolyearid", id);
				}
			});
			if (this.isActive && this.openForReg) {
				console.log(this.openForReg);
				// registration switch
				this.$el.find("[name='reg-switch']").removeClass("hide");
				this.$el.find("[name='reg-switch']").bootstrapSwitch({
					size: "mini",
					onText: "open",
					offText: "closed",
					state: this.openForReg == 1 ? true : false,
					onSwitchChange: function(event, state) {
						var schoolid = $(event.currentTarget).attr("id");
						view.model.set("schoolid", schoolid);
						view.model.set("openForReg", state == true ? 1 : 0);
					}
				});
			}
		}
	}
});