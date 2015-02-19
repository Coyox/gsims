var StudentRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.action = options.action;
		this.id = options.id;
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.empty();
		this.$el.html(html["studentRecord.html"]);

		new Student({id: this.id}).fetch().then(function(data) {
			var model = new Student(data, {parse:true});
			view.model = model;

			_.each(data, function(value, attr) {
				if (view.action == "edit" && attr == "id") {
					// don't allow editing of ids
				} else {
					new StudentRecordRowView({
						el: view.addRow("#student-record-table tbody"),
						action: view.action,
						name: attr,
						value: value,
						model: model
					});
				}
			});

			if (view.action == "edit") {
				view.addRow("#student-record-table tbody");
				view.$el.find("tr").last().append("<td></td><td><button class='btn btn-primary' id='save-student'>Save</button></td>");
			}
		});
	},

	events: {
		"click #save-student": "saveStudent"
	},

	addRow: function(selector) {
        var container = $("<tr></tr>");
        this.$el.find(selector).first().append(container);
        return container;	
	},

	saveStudent: function(evt) {
		this.model.save().then(function(data) {
			new TransactionResponseView({
				message: "Record successfully saved. Click the refresh button on the table to see your changes (or just refresh the page)."
			});
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
	}
});