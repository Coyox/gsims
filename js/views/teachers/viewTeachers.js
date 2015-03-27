var SearchTeachersView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["searchTeachers.html"]);
	},

	events: {
		"click #search-teachers": "searchTeachers",
		"click #search-all-teachers": "searchAllTeachers",
		"click #clear-fields": "clearFields",
	},

	searchAllTeachers: function(evt) {
		var view = this;
		new Teacher().fetch().then(function(data) {
			view.changeRoute(data);
		});
	},

	searchTeachers: function(evt) {
		var view = this;
		var data = {};

		var firstName = this.$el.find("#first-name").val();
		if (firstName != "") {
			data.firstName = firstName;
		}

		var lastName = this.$el.find("#last-name").val();
		if (lastName != "") {
			data.lastName = lastName;
		}

		var model = new Teacher();
		model.fetch({
			url: model.getSearchTeachersUrl(),
			data: data
		}).then(function(data) {
			view.changeRoute(data);
		});
	},

	changeRoute: function(data) {
		app.Router.navigate("teachers/search");
		var view = new TeachersTableView({
			el: $("#content"),
			results: data
		});
	},

	clearFields: function() {
		var parent = this.$el.find("#filter-teachers-container");
		parent.find("input[type='text']").val("");
	}
});

var TeachersTableView = Backbone.View.extend({
	initialize: function(options) {
		this.results = options.results;
		this.render();
	},

	render: function() {
		storeContent();

		this.$el.html(html["viewTeachers.html"]);
		if (this.results) {
			this.populateQueryResults(this.results);
		} else {
			this.fetchAllResults();
		}
	},

	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Teacher(object, {parse:true});
			new TeacherTableRowView({
				model: model,
				el: this.addRow(".results")
			});
		}, this);
		this.$el.find("table").dataTable();
	},

	fetchAllResults: function() {
		var view = this;
		new Teacher().fetch().then(function(data) {
			_.each(data, function(object, index) {
				var model = new Teacher(object, {parse:true});
				new TeacherTableRowView({
					model: model,
					el: view.addRow(".results")
				});
			}, view);
			view.$el.find("table").dataTable();
		});
	},

	addRow: function(selector) {
        var container = $("<tr></tr>");
        this.$el.find(selector).first().append(container);
        return container;
	}
});

var TeacherTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><button class='view-teacher btn btn-xs btn-primary center-block' id='<%= model.userid %>'>View Teacher</button></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .view-teacher": "viewTeacher",
	},

	viewTeacher: function(evt) {
		storeContent();

		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("teachers/" + id, {trigger:true});
	}
});

function storeContent() {
	$("#content").children().detach().appendTo($("#hidden"));
}