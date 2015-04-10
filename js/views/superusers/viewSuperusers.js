var SuperusersTableView = Backbone.View.extend({
	initialize: function(options) {
		this.results = options.results;
		this.render();
	},

	render: function() {
		storeContent();

		this.$el.html(html["viewSuperusers.html"]);
		if (this.results) {
			this.populateQueryResults(this.results);
		} else {
			this.fetchAllResults();
		}
	},

	events: {
		"click #refresh": "refreshTable",
		"click .send-email": "openEmailModal",
		"change .toggle-checkboxes": "toggleCheckboxes"
	},

	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Superuser(object, {parse:true});
			new SuperuserTableRowView({
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
	},


	fetchAllResults: function() {
		var view = this;
		var model = new Superuser();
		model.fetch({
			url: model.urlRoot,
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Superuser(object, {parse:true});
				new SuperuserTableRowView({
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

var SuperuserTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><span class='view-superuser primary-link center-block' id='<%= model.userid %>'>[ View Superuser ]</span></td>"
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
		"click .view-superuser": "viewSuperuser",
	},

	viewSuperuser: function(evt) {
		storeContent();

		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("superusers/" + id, {trigger:true});
	}
});