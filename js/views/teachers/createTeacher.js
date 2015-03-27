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

		this.model.competency = [];
		new TeacherCompetencyView({
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
		console.log(this.model);
		if (this.model.isValid(true)) {
			new TransactionResponseView({
				message: "todo.."
			});
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

		} else {
			this.$el.html(this.editTemplate({
				model: this.model.toJSON(),
				label: this.label,
				name: this.name,
				value: this.value
			}));
		}
	},

	events: {
		"keyup input": "updateModel",
	},

	updateModel: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).val();
		this.model.set(name, val);
	},
});

var TeacherCompetencyView = Backbone.View.extend({
	initialize: function() {
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
				view.model.competency.push({
					deptName: dept.deptName,
					level: 0
				});
				new TeacherCompetencyRowView({
					el: view.addRow(index),
					model: view.model,
					index: index,
					deptModel: dept,
					action: "edit"
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
		this.deptModel = options.deptModel;
		this.render();
	},

	render: function() {
		if (this.action == "edit") {	
			this.$el.html(this.editTemplate({
				label: this.deptModel.deptName,
				index: this.index
			}));
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