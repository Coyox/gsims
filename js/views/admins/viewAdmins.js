var SearchAdminsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["searchAdmins.html"]);
	},

	events: {
		"click #search-admins": "searchAdmins",
		"click #search-all-admins": "searchAllAdmins",
		"click #clear-fields": "clearFields",
	},

	searchAllAdmins: function(evt) {
		var view = this;
		new Teacher().fetch().then(function(data) {
			view.changeRoute(data);
		});
	},

	searchAdmins: function(evt) {
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
			url: model.getSearchTeachersUrl("A"),
			data: data
		}).then(function(data) {
			view.changeRoute(data);
		});
	},

	changeRoute: function(data) {
		app.Router.navigate("admins/search");
		var view = new AdminsTableView({
			el: $("#content"),
			results: data
		});
	},

	clearFields: function() {
		var parent = this.$el.find("#filter-admins-container");
		parent.find("input[type='text']").val("");
	}
});

var AdminsTableView = Backbone.View.extend({
	initialize: function(options) {
		this.results = options.results;
		this.render();
	},

	render: function() {
		storeContent();

		this.$el.html(html["viewAdmins.html"]);
		if (this.results) {
			this.populateQueryResults(this.results);
		} else {
			this.fetchAllResults();
		}
	},

	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Teacher(object, {parse:true});
			new AdminTableRowView({
				model: model,
				el: this.addRow(".results")
			});
		}, this);
		this.$el.find("table").dataTable();
	},

	fetchAllResults: function() {
		var view = this;
		var model = new Teacher();
		model.fetch({
			url: model.getSearchTeachersUrl("A"),
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Teacher(object, {parse:true});
				new AdminTableRowView({
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

var AdminTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><button class='view-admin btn btn-xs btn-primary center-block' id='<%= model.userid %>'>View Admin</button></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .view-admin": "viewAdmin",
	},

	viewAdmin: function(evt) {
		storeContent();

		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("admins/" + id, {trigger:true});
	}
});