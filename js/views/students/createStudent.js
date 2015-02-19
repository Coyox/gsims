var CreateStudentView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["createStudent.html"]);

		// you would get these attributes from the student model, but i
		// don't want to do the entire list right now. 
		var attributes = [ "firstName", "lastName", "email" ];
		var model = new Student();
		this.model = model;

		_.each(attributes, function(name, index) {
			new CreateStudentRowView({
				name: name,
				value: "",
				model: model,
				el: this.addRow(this.$el.find(".form-horizontal"))
			})
		}, this);

		this.$el.find(".form-horizontal").append("<div class='form-group'><div class='col-sm-12'><button class='btn btn-default pull-right' id='clear'>Clear Form</button><button class='btn btn-primary pull-right' id='create-student'>Create Student</button></div></div>");
	},	

	events: {
		"click #create-student": "createStudent",
		"click #clear": "clearForm"
	},

	addRow: function(selector) {
        var container = $("<div class='form-group'></div>");
        this.$el.find(selector).first().append(container);
        return container;		
	},

	createStudent: function(evt) {
		this.model.set({
			id: Math.floor(Math.random()*10000)
		});

		this.model.save(null, {
			type: "POST",
			url: "http://gobind-sarvar.rhcloud.com/api/students" // TODO: dont hardcode url
		}).then(function() {
			new TransactionResponseView({
				message: "Record successfully created. Click the refresh button on the table to see your changes (or just refresh the page)."
			});		
		});
	},

	clearForm: function(evt) {
		this.$el.find("input").val("");
	}
});

var CreateStudentRowView = Backbone.View.extend({
	template: _.template("<label class='control-label col-sm-2'><%= name %></label>"
		+	"<div class='col-sm-10'>"
		+		"<input type='text' class='form-control <%= name %>'"
		+	"</div>"),

	initialize: function(options) {
		this.name = options.name;
		this.value = options.value;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			name: this.name,
			value: ""
		}));
	},

	events: {
		"keyup input": "updateModel"
	},

	updateModel: function(evt) {
		var val = $(evt.currentTarget).val();
		this.model.set(this.name, val);
	}
});