var TeacherRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.action = "view";
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.find("#teacher-info-table").empty();
		this.$el.find("#comp-info, #comp2-info").empty();

		if (this.action == "view") {
			this.$el.find("#edit-teacher").removeClass("hide").show();
			this.$el.find("#save-teacher").hide();
		} else {
			this.$el.find("#save-teacher").removeClass("hide").show();
			this.$el.find("#edit-teacher").hide();
		}

		var teacher = new Teacher();
		this.model = teacher;
		this.model.set("id", this.id);
		this.model.fetch().then(function(data) {
			var teacher = new Teacher(data, {parse:true});
			view.model = teacher;

			view.teacherInformationTab(teacher);
		});
	},

	events: {
		"click #edit-teacher": "editTeacher",
		"click #save-teacher": "saveTeacher",
		"click #set-admin": "setAsAdmin"
	},

	teacherInformationTab: function() {
		_.each(this.model.toJSON(), function(value, name) {
			if (this.model.nonEditable.indexOf(name) == -1) {
				new CreateTeacherRowView({
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
			var existingLevels = [];
			_.each(data, function(course, index) {
				existingLevels.push(course);
			});
			view.comptencyView = new TeacherCompetencyView({
				el: view.$el,
				model: view.model,
				action: view.action,
				existingLevels: existingLevels
			});
		});
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#teacher-info-table").append(container);
		return container;
	},	

	editTeacher: function(evt) {
		this.action = "edit";
		this.render();
	},

	saveTeacher: function() {
		Backbone.Validation.bind(this);
		console.log(this.model);
		var view = this;
		if (this.model.isValid(true)) {
			view.model.set("id", view.model.get("userid"));
			view.model.save().then(function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.status == "success") {
					new TransactionResponseView({
						message: "Teacher successfully saved."
					});		
					view.action = "view";
					view.render();			
				} else {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Sorry, there was a problem saving this teacher. Please try again."
					});		
				}
			});
		}
	},

	setAsAdmin: function() {
		var view = this;

		this.$el.append(html["confirmationModal.html"]);

		$("#confirmation-modal .modal-body p").text("Are you sure you want to set this teacher as an administrator? He/she will have full access to the school.");
		$("#confirmation-modal .modal-title").text("Confirmation");

		$("#confirmation-modal").modal({
			show: true
		});
		
		$("#confirmation-modal").on("hidden.bs.modal", function() {
			$("#confirmation-modal").remove();
			$(".modal-backdrop").remove();
		});
		
		$("#confirmation-modal").on("click", "#confirm-yes", function() {
			$("#confirmation-modal").remove();
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
	}
});

// var TeacherRecordView = Backbone.View.extend({
// 	initialize: function(options) {
// 		this.action = options.action;
// 		this.id = options.id;
// 		this.render();
// 	},

// 	render: function() {
// 		var view = this;

// 		var teacher = new Teacher();
// 		teacher.set("id", this.id);
// 		teacher.fetch().then(function(data) {
// 			console.log(data);
// 			var model = new Teacher(data, {parse:true});
// 			view.model = model;
// 			Backbone.Validation.bind(view);

// 			view.model.set("id", view.model.get("userid"));
// 			view.teacherInformationTab(data, model);
// 			view.coursesTab(data, model);
// 			view.emailTab(data);
// 		});
// 	},

// 	events: {
// 		"click #delete-teacher": "deleteTeacher",
// 		"click .edit-btn": "editTeacher",
// 		"click .save-btn": "saveTeacher",
// 		"click .cancel-btn": "saveTeacher"
// 	},

// 	addRow: function(model, attr) {
//         var container = $("<div class='form-group'></div>");
//         this.$el.find("teacher-info-table.form-horizontal").append(container);
//         return container;
// 	},

// 	addEditRow: function() {
// 		var container = $("<div class='form-group'></div>");
// 		this.$el.find("#teacher-info-table").append(container);
// 		return container;
// 	},

// 	editTeacher: function(evt) {
// 		this.model.untouched = JSON.stringify(this.model.toJSON());

// 		var table = $(evt.currentTarget).closest(".teacher-component").find(".form-horizontal").attr("id");
// 		this.$el.find("#" + table).empty();

// 		$(evt.currentTarget).hide()
// 		$(evt.currentTarget).parent().find(".save-btn, .cancel-btn").removeClass("hide").show();

// 		_.each(this.model.toJSON(), function(value, attr) {
// 			if (this.model.nonEditable.indexOf(attr) == -1) {
// 				new TeacherRecordRowView({
// 					el: this.addEditRow(),
// 					action: "edit",
// 					name: attr,
// 					value: value,
// 					model: this.model,
// 				});
// 			}
// 		}, this);
// 	},

// 	saveTeacher: function(evt) {
// 		var view = this;
// 		var def = $.Deferred();

// 		if ($(evt.currentTarget).hasClass("cancel-btn")) {
// 			this.model.attributes = JSON.parse(this.model.untouched);
// 			def.resolve();
// 		} else {
// 			if (this.model.isValid(true)) {
// 				if ($(evt.currentTarget).hasClass("save-btn")) {
// 					this.model.save().then(function(data) {
// 						new TransactionResponseView({
// 							message: "Record successfully saved."
// 						});
// 						def.resolve();
// 					});
// 				}
// 			}
// 		}

// 		$.when(def).then(function() {
// 			var table = $(evt.currentTarget).closest(".teacher-component").find(".form-horizontal").attr("id");
// 			view.$el.find("#teacher-info").empty();

// 			$(evt.currentTarget).parent().find(".save-btn, .cancel-btn").hide();
// 			$(evt.currentTarget).parent().find(".edit-btn").removeClass("hide").show();

// 			_.each(view.model.toJSON(), function(value, attr) {
// 				if (view.model.nonEditable.indexOf(attr) == -1) {
// 					new TeacherRecordRowView({
// 						el: view.addEditRow(),
// 						action: "view",
// 						name: attr,
// 						value: value,
// 						model: view.model,
// 					});
// 				}
// 			}, view);
// 		});
// 	},

// 	deleteTeacher: function(evt) {
// 		new DeleteRecordView({
// 			id: this.model.get("id"),
// 			el: $("#container")
// 		});
// 	},

// 	teacherInformationTab: function(data, model) {
// 		_.each(data, function(value, attr) {
// 			if (this.model.nonEditable.indexOf(attr) > -1) {
// 				// ignore these attributes
// 			} else {
// 				new TeacherRecordRowView({
// 					el: this.addRow(model, attr),
// 					action: this.action,
// 					name: attr,
// 					label: attr,
// 					value: value,
// 					model: model
// 				});
// 			}
// 		}, this);
// 	},

// 	emailTab: function(data) {
// 		new EmailView({
// 			el: $("#email"),
// 			emailAddr: data.emailAddr
// 		});
// 	},

// 	coursesTab: function(data, model) {
// 		new TeachingSectionsView({
// 			el: $("#course-info"),
// 			model: model
// 		});
// 	}
// });

// var TeacherRecordRowView = Backbone.View.extend({
// 	viewTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
// 		+	"<div class='col-sm-8'>"
// 		+		"<span><%= value %></span>"
// 		+	"</div>"),

// 	editTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
// 		+	"<div class='col-sm-8'>"
// 		+		"<input type='text' class='form-control input-sm' value='<%= value %>' name='<%= name %>'>"
// 		+		"<span class='help-block hidden'></span>"
// 		+	"</div>"),

// 	statusTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
// 		+	"<div class='col-sm-8'>"
// 		+		"<select id='status-menu' class='form-control input-sm' name='status'></select>"
// 		+		"<span class='help-block hidden'></span>"
// 		+	"</div>"),


// 	initialize: function(options) {
// 		this.action = options.action;
// 		this.name = options.name;
// 		this.label = options.label;
// 		this.value = options.value;
// 		this.render();
// 	},

// 	render: function() {
// 		this.label = capitalize(this.name);
// 		this.label = splitChars(this.label);

// 		var params = {
// 			name: this.name,
// 			label: this.label,
// 			value: this.value
// 		};

// 		if (this.action == "view") {
// 			if (this.name == "status") {
// 				params.value = capitalize(this.value);
// 			}
// 			this.$el.html(this.viewTemplate(params));
// 		} else {
// 			// Status dropdown menu
// 			if (this.name == "status") {
// 				this.$el.html(this.statusTemplate(params));
// 				populateStatusMenu(this.$el.find("#status-menu"), this.model.teacherStatuses, this.value);
// 			}
// 			// Plain text field
// 			else {
// 				this.$el.html(this.editTemplate(params));
// 			}
// 		}
// 	},

// 	events: {
// 		"keyup input": "updateInput",
// 		"change select": "updateSelect",
// 	},

// 	updateInput: function(evt) {
// 		var val = $(evt.currentTarget).val();
// 		this.model.set(this.name, val);
// 	},

// 	updateSelect: function(evt) {
// 		var name = $(evt.currentTarget).attr("name");
// 		var val = $(evt.currentTarget).find("option:selected").val();
// 		this.model.set(name, val);
// 	},
// });

// var TeachingSectionsView = Backbone.View.extend({
// 	initialize: function(options) {
// 		this.render();
// 	},

// 	render: function() {
// 		this.$el.html(html["enrolledSections.html"]);

// 		var view = this;
// 		var id = this.model.get("userid");
// 		this.model.fetch({url:this.model.getTeachingSectionsUrl(id)}).then(function(data) {
// 			_.each(data, function(object, index) {
// 				var section = new Section(object, {parse:true});
// 				new TeachingSectionsRowView({
// 					el: view.addRow(),
// 					model: section,
// 					teacherid: id
// 				});
// 			});
// 			view.$el.find("table").dataTable({
// 				dom: "t"
// 			});
// 		});
// 	},

// 	addRow: function() {
//         var container = $("<tr></tr>");
//         this.$el.find("#enrolled-sections-table .results").first().append(container);
//         return container;
// 	}
// });

// var TeachingSectionsRowView = Backbone.View.extend({
// 	template: _.template("<td><%= model.courseName %></td>"
// 		+	"<td><%= model.sectionCode %></td>"
// 		+	"<td><%= model.day %></td>"
// 		+	"<td><%= model.startTime %></td>"
// 		+	"<td><%= model.endTime %></td>"
// 		+   "<td><button class='drop-section btn btn-xs btn-primary center-block' id='<%= model.sectionid %>'>Drop Section</button></td>"),

// 	initialize: function(options) {
// 		this.teacherid = options.teacherid;
// 		this.render();
// 	},

// 	render: function() {
// 		this.$el.html(this.template({
// 			model: this.model.toJSON()
// 		}));
// 	},

// 	// events: {
// 	// 	"click .drop-section": "dropSection"
// 	// }//,

// 	// dropSection: function(evt) {
// 	// 	var id = $(evt.currentTarget).attr("id");
// 	// 	this.model.set("id", id);
// 	// 	this.model.destroy({
// 	// 		url: this.model.getUnassingTeacherUrl(id, this.teacherid)
// 	// 	}).then(function(data) {
// 	// 		console.log(data);
// 	// 	});
// 	//}
// });
