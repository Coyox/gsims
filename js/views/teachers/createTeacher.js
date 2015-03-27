var CreateTeacherView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new Teacher();
		this.render();
	},

	render: function() {
		this.$el.html(html["createTeacher.html"]);

		this.model.nonEditable.push("status");

		_.each(this.model.toJSON(), function(value, name) {
			if (this.model.nonEditable.indexOf(name) == -1) {
				new CreateTeacherRowView({
					el: this.addRow(),
					model: this.model,
					name: name,
					value: value,
					action: "edit"
				});
			}
		}, this);

		this.competencyView = new TeacherCompetencyView({
			el: this.$el,
			model: this.model
		});
	},

	events: {
		"click #save-teacher": "saveTeacher"
	},

	addRow: function() {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#teacher-info").append(container);
		return container;
	},

	saveTeacher: function() {
		Backbone.Validation.bind(this);

		this.model.set("usertype", "T");
		this.model.set("schoolid", "412312");
		this.model.set("status",  "active");
		console.log(this.model);

		if (this.model.isValid(true)) {
			new TransactionResponseView({
				message: "todo..."
			});
			// this.model.save({
			// 	dataType: "json"
			// }).then(function(data) {
			// 	console.log(data);
			// 	if (typeof data == "string") {
			// 		data = JSON.parse(data);
			// 	}
			// 	if (data.status == "success") {
			// 		new TransactionResponseView({
			// 			message: "Teacher successfully created."
			// 		});
			// 		console.log(data);
			// 	}
			// }).fail(function(jqXHR) {
			// 	console.log(jqXHR.responseJSON);
			// });
		} else {

		}
	}
});

var CreateTeacherRowView = Backbone.View.extend({
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
				populateStatusMenu(this.$el.find("#status-menu"), this.model.teacherStatuses, this.value);
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

var TeacherCompetencyView = Backbone.View.extend({
	initialize: function(options) {
		this.model.competency = [];
		this.action = options.action;
		this.existingLevels = options.existingLevels;
		this.render();
	},

	render: function() {
		var view = this;
		var schoolid = $("#school-options option:selected").attr("id");
		var school = new School();
		school.fetch({
			url: school.getDepartmentsUrl("412312"),
			//url: school.getDepartmentsUrl(schoolid),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
			}
		}).then(function(data) {
			_.each(data, function(dept, index) {
				var level = 0;
				_.each(view.existingLevels, function(existing, index) {
					if (existing.deptid == dept.deptid) {
						level = existing.level;
					}
				});
				view.model.competency.push({
					deptName: dept.deptName,
					level: level
				});
				new TeacherCompetencyRowView({
					el: view.addRow(index),
					model: view.model,
					index: index,
					deptModel: dept,
					action: view.action,
					level: level
				});
			});
		});
	},

	addRow: function(index) {
		var parent = index % 2 == 0 ? "#comp-info" : "#comp2-info";
		var container = $("<div class='form-group'></div>");
		this.$el.find(parent).append(container);
		return container;
	}
});

var TeacherCompetencyRowView = Backbone.View.extend({

	viewTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<span><%= level %></span>"
		+	"</div>"),


	editTemplate: _.template("<label class='control-label col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<label class='radio-inline'><input type='radio' name='tcomp<%= index %>' value='0' data-name='<%= label %>' checked> 0 </label>"
		+		"<label class='radio-inline'><input type='radio' name='tcomp<%= index %>' value='1' data-name='<%= label %>'> 1 </label>"
		+		"<label class='radio-inline'><input type='radio' name='tcomp<%= index %>' value='2' data-name='<%= label %>'> 2 </label>"
		+		"<label class='radio-inline'><input type='radio' name='tcomp<%= index %>' value='3' data-name='<%= label %>'> 3 </label>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	initialize: function(options) {
		this.index = options.index;
		this.action = options.action;
		this.level = options.level;
		this.deptModel = options.deptModel;
		this.render();
	},

	render: function() {
		if (this.action == "view") {
			var level = this.level || "0 / Not specified";
			this.$el.html(this.viewTemplate({
				label: this.deptModel.deptName,
				level: level
			}));			
		} else {	
			this.$el.html(this.editTemplate({
				label: this.deptModel.deptName,
				index: this.index
			}));
			this.$el.find("input[type='radio'][value='" + this.level + "']").prop("checked", true);
		}
	},

	events: {
		"change input[type='radio']": "updateLevel"
	},

	updateLevel: function(evt) {
		var level = $(evt.currentTarget).attr("value");
		var name = $(evt.currentTarget).data("name");
		_.each(this.model.competency, function(dept, index) {
			if (dept.deptName == name) {
				dept.level = level;
			}
		}, this);
	}
});