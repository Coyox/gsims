var SearchAdminsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["searchAdmins.html"]);
	},

	events: {
		"click #search-admins": "searchAdmins",
		"click #clear-fields": "clearFields",
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

		var teacher = new Teacher();
		teacher.fetch({
			url: teacher.getSearchTeachersUrl("A", sessionStorage.getItem("gobind-schoolid")),
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

	events: {
		"click #refresh": "refreshTable",
		"click .send-email": "openEmailModal",
		"click #export-table": "exportTable",
		"change .toggle-checkboxes": "toggleCheckboxes"
	},

	populateQueryResults: function(data) {
		var view = this;
		_.each(data, function(object, index) {
			var model = new Teacher(object, {parse:true});
			new AdminTableRowView({
				model: model,
				el: this.addRow(".results", model.get("emailAddr"))
			});
		}, this);
		view.table = this.$el.find("table").dataTable({
	      	aoColumnDefs: [
	          	{ bSortable: false, aTargets: [ 4, 5 ] },
	          	{ sClass: "center", aTargets: [ 4, 5 ] },
	          	{ sWidth: "10%", aTargets: [ 5 ] }
	       	],
			dom: dataTables.exportDom,
			tableTools: {
       			 aButtons: dataTables.buttons,
   			 	 sSwfPath: dataTables.sSwfPath
    		}
		});
		createEmailButton(this.$el);
		createRefreshButton(this.$el);
		createExportButton(this.$el);
	},

	fetchAllResults: function() {
		var view = this;
		var school = new School();
		school.fetch({
			url: school.getAdminsUrl(sessionStorage.getItem("gobind-schoolid"), "A")
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Teacher(object, {parse:true});
				new AdminTableRowView({
					model: model,
					el: view.addRow(".results", model.get("emailAddr"))
				});
			}, view);
			view.table = view.$el.find("table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 4, 5 ] },
		          	{ sClass: "center", aTargets: [ 4, 5 ] },
		          	{ sWidth: "10%", aTargets: [ 5 ] }
		       	],
				dom: dataTables.exportDom,
				tableTools: {
           			 aButtons: dataTables.buttons,
       			 	 sSwfPath: dataTables.sSwfPath
        		}
			});
			createEmailButton(view.$el);
			createRefreshButton(view.$el);
			createExportButton(view.$el);
		});
	},

	addRow: function(selector, email) {
        var container = $("<tr></tr>");
        container.data("email", email);
        this.$el.find(selector).first().append(container);
        return container;
	},

	openEmailModal: function(evt) {
		openEmailWrapper(this.table.fnGetNodes());
	},

	toggleCheckboxes: function(evt) {
		toggleCheckboxes(this.table.fnGetNodes(), evt);
	},


	refreshTable: function(evt) {
		evt.stopImmediatePropagation();
		this.table.fnDestroy();
		this.render();
	},
});

var AdminTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><span class='view-admin primary-link center-block' id='<%= model.userid %>'>[ View Admin ]</span></td>"
		+	"<td><input type='checkbox' class='user-row' checked></td>"),

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