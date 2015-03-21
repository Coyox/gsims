var CreateStudentView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["createStudent.html"]);
	},	

	events: {
		"click #search": "searchExistingStudent",
		"click #clear": "clearForm",
		"click .view-student": "viewStudent",
		"click #save-student": "saveStudent",
	},

	searchExistingStudent: function(evt) {
		var view = this;
		var parent = this.$el.find("#quick-search");
		var firstName = parent.find("#first-name").val();
		var lastName = parent.find("#last-name").val();
		var bday = parent.find("#birthday").val();

		var student = new Student();
		student.fetch({
			url: student.getSearchStudentsUrl(),
			data: {
				firstName: firstName,
				lastName: lastName,
				//dateOfBirth: bday
			}
		}).then(function(data) {
			var elem = view.$el.find("#create-message");
			var message = capitalize(firstName) + " " + capitalize(lastName);
			if (data.length > 0) {
				var id = data[0].userid;
				message += " has already registered for the school.";
				message += " Click <a class='view-student' id='" + id + "'><strong>here</strong></a> to modify their information";
			} else {
				message += " has not registered for the school yet.";
				message += " Fill out the following form to register them into the school.";
				
				var formTemplate = html["viewStudent.html"]();
				formTemplate = $(formTemplate).find("#student-info").html();
				elem.parent().append(formTemplate);
				elem.parent().find(".form-buttons").remove();
				elem.parent().find(".delete").remove();
				view.populateForm(elem.parent(), {
					firstName: firstName, 
					lastName: lastName,
					dateOfBirth: bday
				});
			}
			elem.html(message);
			elem.parent().removeClass("hide").show();
			parent.hide();
		});
	},

	viewStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("students/" + id, {trigger:true});
	},

	populateForm: function(elem, prefilled) {
		this.model = new Student();
		_.each(this.model.toJSON(), function(value, attr) {
			if (this.model.nonEditable.indexOf(attr) == -1) {
				var filled = prefilled[attr];
				var value;
				if (filled) {
					value = filled;
					this.model.set(attr, value);
				} else {
					value = "";
				}
				new StudentRecordRowView({
					el: this.addRow(this.model, attr),
					action: "edit",
					name: attr,
					value: value,
					model: this.model,
				});
			}
		}, this);
	},

	saveStudent: function(evt) {
		Backbone.Validation.bind(this);	

		if (this.model.isValid(true)) {
			this.model.save().then(function(data) {
				console.log(data);
			}).fail(function(data) {
				new TransactionResponseView({
					title: "ERROR",
					status: "error",
					message: "TODO"
				})
			});
		}

		// this.model.set({
		// 	id: Math.floor(Math.random()*10000)
		// });

		// this.model.save(null, {
		// 	type: "POST",
		// 	url: "http://gobind-sarvar.rhcloud.com/api/students" // TODO: dont hardcode url
		// }).then(function() {
		// 	new TransactionResponseView({
		// 		message: "Record successfully created. Click the refresh button on the table to see your changes (or just refresh the page)."
		// 	});		
		// });
	},

	clearForm: function(evt) {
		this.$el.find("input").val("");
	},

	addRow: function(model, attr) {
        var container = $("<div class='form-group'></div>");
        var parent;
		if (model.addressProperties.indexOf(attr) > -1) {
			parent = "#address-table";
        } else if (model.parentProperties.indexOf(attr) > -1) {
        	parent = "#parent-table";
        } else if (model.emergencyProperties.indexOf(attr) > -1) {
        	parent = "#emergency-table";
        } else {
        	parent = "#student-info-table";
        }
        this.$el.find(parent + ".form-horizontal").append(container);
        return container;	
	},
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