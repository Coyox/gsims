var AdminRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.action = "view";
		this.render();
	},

	render: function() {
		var view = this;
		console.log(this.id);
		var teacher = new Teacher({id:this.id});
		teacher.fetch( {
			url: teacher.admin_urlRoot + "/" + this.id
		}
		).then(function(data) {
			console.log(data);

			view.$el.html(html["viewAdmin.html"]);
			view.$el.find("#admin-info-table").empty();
			view.$el.find("#comp-info, #comp2-info").empty();

			if (view.action == "view") {
				view.$el.find("#edit-admin").removeClass("hide").show();
				view.$el.find("#save-admin").hide();
			} else {
				view.$el.find("#save-admin").removeClass("hide").show();
				view.$el.find("#edit-admin").hide();
			}

			view.model = new Teacher(data, {parse:true});
			view.model.set("userid", view.id);
			view.emailTab(data);
			view.adminInformationTab(view.model);
			view.adminSectionsTab(view.model);
		});
	},

	events: {
		"click #edit-admin": "editAdmin",
		"click #save-admin": "saveAdmin",
	},

	adminInformationTab: function() {
		_.each(this.model.toJSON(), function(value, name) {
			if (this.model.nonEditable.indexOf(name) == -1) {
				console.log(name);
				new CreateAdminRowView({
					el: this.addRow(),
					model: this.model,
					name: name,
					value: value,
					action: this.action
				});
			}
		}, this);

		var view = this;
		var t = new Teacher();
		t.fetch({
			url: t.getCourseCompetencyUrl(view.model.get("userid"))
		}).then(function(data) {
			view.existingLevels = [];
			_.each(data, function(course, index) {
				view.existingLevels.push(course);
			});
			view.comptencyView = new TeacherCompetencyView({
				el: view.$el,
				model: view.model,
				action: view.action,
				existingLevels: view.existingLevels
			});
		});
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#admin-info-table").append(container);
		return container;
	},

	editAdmin: function(evt) {
		this.action = "edit";
		this.render();
	},

	saveAdmin: function() {
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
						message: "Admin successfully saved."
					});
					$.ajax({
						type: "POST",
						url: view.model.getCourseCompetencyUrl(view.model.get("userid")),
						data: params
					});
					view.action = "view";
					view.render();
				} else {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Sorry, there was a problem saving this admin. Please try again."
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

	adminSectionsTab: function(model) {
		new AdminTeachingSectionsView({
			el: this.$el.find("#course-info"),
			model: model
		});
	}
});

var AdminTeachingSectionsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["enrolledSections.html"]);

		var view = this;
		var id = this.model.get("userid");

		this.model.fetch({
			url: this.model.getTeachingSectionsUrl(id)
		}).then(function(data) {
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
				new AdminTeachingSectionsRowView({
					el: view.addRow(),
					model: section,
					teacherid: id
				});
			});
			view.$el.find("table").dataTable({
				dom: "t"
			});
		});
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find("#enrolled-sections-table .results").first().append(container);
		return container;
	}
});

var AdminTeachingSectionsRowView = Backbone.View.extend({
	template: _.template("<td><%= model.courseName %></td>"
		+	"<td><%= model.sectionCode %></td>"
		+	"<td><%= model.day %></td>"
		+	"<td><%= model.startTime %></td>"
		+	"<td><%= model.endTime %></td>"
		+   "<td><button class='drop-section btn btn-xs btn-primary center-block' id='<%= model.sectionid %>'>Drop Section</button></td>"),

	initialize: function(options) {
		this.teacherid = options.teacherid;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .drop-section": "dropSection"
	},

	dropSection: function(evt) {
		var sectionid = $(evt.currentTarget).attr("id");
		var section = new Section();
		section.set("id", sectionid);
		section.destroy({
			url: section.unassignTeacherUrl(sectionid, this.teacherid)
		}).then(function(data) {
			if (typeof data == "string") {
				data = JSON.parse(data);
			}
			if (data.status == "success") {
				new TransactionResponseView({
					message: "This teacher is no longer teaching this sectin."
				});
			} else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Sorry, we could not drop this teacher from this section. Please try again"
				});
			}
		});
	}
});