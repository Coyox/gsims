var StudentRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.action = options.action;
		this.id = options.id;
		this.parentContainer = options.parentContainer;
		this.render();
	},

	render: function() {
		var view = this;

		new Student({id: this.id}).fetch().then(function(data) {
			view.studentInformationTab(data);
			view.emailTab(data);

			// if (view.action == "edit") {
			// 	view.addRow("#student-record-table tbody");
			// 	view.$el.find("tr").last().append("<td></td><td><button class='btn btn-primary' id='save-student'>Save</button></td>");
			// }
		});
	},

	events: {
		"click #save-student": "saveStudent",
		"click .delete-student": "deleteStudent"
	},

	addRow: function(model, attr) {
        var container = $("<tr></tr>");
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
        parent = parent + " .results";
        this.$el.find(parent).append(container);
        return container;	
	},

	saveStudent: function(evt) {
		this.model.save().then(function(data) {
			new TransactionResponseView({
				message: "Record successfully saved. Click the refresh button on the table to see your changes (or just refresh the page)."
			});
		});
	},

	deleteStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new DeleteRecordView({
			id: id,
			el: $("#delete-container")
		});	
	},

	studentInformationTab: function(data) {
		var model = new Student(data, {parse:true});
		this.model = model;
		_.each(data, function(value, attr) {
			if (this.model.nonEditable.indexOf(attr) > -1) {
				// ignore these attributes
			} else if (this.action == "edit" && attr == "id") {
				// don't allow editing of ids
			} else {
				new StudentRecordRowView({
					el: this.addRow(model, attr),
					action: this.action,
					name: attr,
					value: value,
					model: model
				});
			}
		}, this);
	},

	emailTab: function(data) {
		new EmailView({
			el: $("#email"),
			emailAddr: data.emailAddr
		});
	}
});

var StudentRecordRowView = Backbone.View.extend({
	viewTemplate: _.template("<td><%= name %></td><td><%= value %></td>"),
	editTemplate: _.template("<td><%= name %></td><td><input type='text' class='form-control' value='<%= value %>'></td>"),

	initialize: function(options) {
		this.action = options.action;
		this.name = options.name;
		this.value = options.value;
		this.render();
	},

	render: function() {
		this.name = capitalize(this.name);
		this.name = splitChars(this.name);
		this.name = this.simplifyName(this.name);

		if (this.action == "view") {
			this.$el.html(this.viewTemplate({
				name: this.name,
				value: this.value
			}));
		} else {
			this.$el.html(this.editTemplate({
				name: this.name,
				value: this.value
			}));
		}
	},

	events: {
		"change input": "updateModel"
	},

	updateModel: function(evt) {
		var val = $(evt.currentTarget).val();
		this.model.set(this.name, val);
		console.log(this.model.toJSON());
	},

	simplifyName: function(str) {
		if (str.toLowerCase().indexOf("parent") > -1) {
			return str.slice(7);
		} else if (str.toLowerCase().indexOf("emergency") > -1) {
			return str.slice(18);
		}
		return str;
	}
});