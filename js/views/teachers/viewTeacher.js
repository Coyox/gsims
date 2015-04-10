/**
 *	View to display a teacher record. 
 *	Route: getTeacherById
 */
var TeacherRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.action = "view";
		this.usertype = options.usertype;
		this.render();
	},

	render: function() {
		var view = this;

		var def = $.Deferred();
		var teacher = new Teacher({id:this.id});
		
		// Fetch the teacher based on usertype
		if (this.usertype == "A") {
			teacher.fetch({
				url: teacher.admin_urlRoot + "/" + this.id
			}).then(function(data) {
				def.resolve(data);
			});
		} else {
			teacher.fetch().then(function(data) {
				def.resolve(data);
			});
		}

		$.when(def).then(function(data) {
	        view.$el.html(html["viewTeacher.html"]);

			view.model = new Teacher(data, {parse:true});
			view.model.set("userid", view.id);
			view.emailTab(data);
			view.teacherInformationTab(view.model);
			view.teacherSectionsTab(view.model);
		});
	},

	events: {
		"click #edit-teacher": "editTeacher",
		"click #save-teacher": "saveTeacher",
		"click #cancel": "cancelSave",
		"click #set-admin": "setAsAdmin",
		"click #delete-teacher": "deleteTeacher"
	},

	/**
	 *	Deletes a teacher record.
	 *	Route: deleteTeacher
	 */
	deleteTeacher: function(evt) {
		new Teacher({id: this.id}).destroy().then(function(data) {
			if (typeof data == "string") {
				data = JSON.parse(data);
			}
			if (data.status == "success") {
				new TransactionResponseView({
					message: "Teacher has been successfully deleted."
				});
			} else {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "Teacher has been successfully deleted."
				});
			}
		});
	},

	/**
	 *	Displays general information about a teacher/admin.
	 */
	teacherInformationTab: function() {
		var view = this;
		view.$el.find("#teacher-info-table").empty();
		view.$el.find("#comp-info, #comp2-info").empty();

		if (this.usertype == "A") {
			view.$el.find("#set-admin").remove();
		}

		if (view.action == "view") {
			view.$el.find("#edit-teacher").removeClass("hide").show();
			view.$el.find("#cancel").hide();
			view.$el.find("#save-teacher").hide();
		} else {
			view.$el.find("#save-teacher").removeClass("hide").show();
			view.$el.find("#cancel").removeClass("hide").show();
			view.$el.find("#edit-teacher").hide();
		}

		// Loop through all attributes and display them in a form
		_.each(this.model.toJSON(), function(value, name) {
			if (this.model.nonEditable.indexOf(name) == -1 && !isNumber(name)) {
				new CreateTeacherRowView({
					el: this.addRow(),
					model: this.model,
					untouched: JSON.stringify(this.model.attributes),
					name: name,
					value: value,
					action: this.action
				});
			}
		}, this);

		// Get the course competency level of the teacher/admin
		var view = this;
		var t = new Teacher();
		t.fetch({
			url: t.getCourseCompetencyUrl(view.model.get("userid"))
		}).then(function(data) {
			// Store any existing competency levels
			view.existingLevels = [];
			_.each(data, function(course, index) {
				view.existingLevels.push(course);
			});

			// Display all departments/competencies
			view.comptencyView = new TeacherCompetencyView({
				el: view.$el,
				model: view.model,
				action: view.action,
				existingLevels: view.existingLevels
			});
		});
	},

	/**
	 *	Adds a row to the general information form
	 */
	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#teacher-info-table").append(container);
		return container;
	},

	/**
	 *	Re-renders the view with all text fields as input fields. Stash
	 *	the current model so the changes can be undone if the user 
	 *	chooses to cancel
	 */
	editTeacher: function(evt) {
		this.action = "edit";
		this.model.untouched = JSON.stringify(this.model.toJSON());
		this.teacherInformationTab();
	},

	/**
	 *	Re-renders the view with all input fields and text fields. Ignore
	 *	any changes made; restore state prior to editting
	 */
	cancelSave: function() {
		this.model.attributes = JSON.parse(this.model.untouched);
		this.action = "view";
		this.teacherInformationTab();
	},

	/**
	 *	Saves a teacher record after editing.
	 *	Route: updateTeacher
	 */
	saveTeacher: function() {
		var view = this;

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

		// Update the teacher if the form is valid
		if (this.model.isValid(true)) {
			view.model.set("id", view.model.get("userid"));
			view.model.set("usertype", view.usertype);
			view.model.save().then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					new TransactionResponseView({
						message: view.usertype == "A" ? "Administrator succussfully created." : "Teacher successfully created."
					});

					// Update course competencies
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
						message: view.usertype == "A" ? "Sorry, there was a problem saving this administrator. Please try again." :
							"Sorry, there was a problem saving this teahcer. Please try again."
					});
				}
			});
		}
	},

	/**
	 *	Sets the teacher to an administrator by updating the usertype
	 *	Route: updateTeacher
	 */
	setAsAdmin: function() {
		var view = this;

		this.$el.append(html["confirmationModal.html"]);

		var elem = $("#confirmation-modal");

		elem.find(".modal-body p").text("Are you sure you want to set this teacher as an administrator? He/she will have full access to the school.");
		elem.find(".modal-title").text("Confirmation");

		elem.modal({
			show: true
		});

		elem.on("hidden.bs.modal", function() {
			elem.remove();
			$(".modal-backdrop").remove();
		});

		elem.on("click", "#confirm-yes", function() {
			elem.remove();
			$(".modal-backdrop").remove();

			view.model.set("usertype", "A");
			view.model.set("id", view.model.get("userid"));
			view.model.save().then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					new TransactionResponseView({
						message: "This teacher is now an administrator."
					});
				} else {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Sorry, there was a problem setting this teacher as an administrator. Please try again."
					});
				}
			});
		});
	},

	/**
	 *	Render the EmailView in the email tab
	 */
	emailTab: function(data) {
		new EmailView({
			el: $("#email"),
			emailAddr: data.emailAddr
		});
	},

	/**
	 *	Render a list of sections that the teacher is currently teaching
	 */
	teacherSectionsTab: function(model) {
		new TeachingSectionsView({
			el: this.$el.find("#course-info"),
			model: model
		});
	}
});

/**
 *	View to display a list of all sections a teacher is currently teaching
 *	Route: getTeachingSections
 */
var TeachingSectionsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["teachingSections.html"]);

		var view = this;
		var id = this.model.get("userid");
		this.model.fetch({
			url: this.model.getTeachingSectionsUrl(id)
		}).then(function(data) {
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
				new TeachingSectionsRowView({
					el: view.addRow(),
					model: section,
					teacherid: id,
					parentView: view
				});
			});
			view.$el.find("table").dataTable({
				dom: "t"
			});
		});
	},

	/**
	 *	Adds a table row to the list of sections
	 */
	addRow: function() {
        var container = $("<tr></tr>");
        this.$el.find("table").first().append(container);
        return container;
	}
});

/**
 *	Renders a single table row with data pertaining to a section that the teacher
 *	is currently teaching.
 */
var TeachingSectionsRowView = Backbone.View.extend({
	template: _.template("<td><%= model.courseName %></td>"
		+	"<td><%= model.sectionCode %></td>"
		+	"<td><%= model.day %></td>"
		+	"<td><%= model.startTime %></td>"
		+	"<td><%= model.endTime %></td>"
		+   "<td><button class='drop-section btn btn-xs btn-primary center-block' id='<%= model.sectionid %>'>Drop Section</button></td>"),

	initialize: function(options) {
		this.teacherid = options.teacherid;
		this.parentView = options.parentView;
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

	/**
	 *	Removes a teacher from the list of courses he/she is teaching
	 *	Route: unassignTeacherUrl
	 */
	dropSection: function(evt) {
		var view = this;
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
					message: "This teacher is no longer teaching this section."
				});
				view.parentView.render();
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
