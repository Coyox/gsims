var SearchStudentsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["searchStudents.html"]);
		this.populateYearMenu();
	},

	events: {
		"click #search-students": "searchStudents",
		"click #search-all-students": "searchAllStudents",
		"click #clear-fields": "clearFields",
		"change #year-operator": "changeOperator"
	},

	searchAllStudents: function(evt) {
		var view = this;
		new Student().fetch().then(function(data) {
			view.changeRoute(data);
		});
	},

	searchStudents: function(evt) {
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

		var gender = this.$el.find("#gender-options option:selected");
		if (!gender.is(":disabled")) {
			data.gender = gender.val();
		}

		var paid = this.$el.find("#paid-options option:selected");
		if (!paid.is(":disabled")) {
			data.paid = paid.val();
		}

		var status = this.$el.find("#status-options option:selected");
		if (!status.is(":disabled")) {
			data.status = status.val();
		}

		var yearop = this.$el.find("#year-operator option:selected");
		if (!yearop.is(":disabled")) {
			var value = yearop.val();
			data.yearop = value;

			if (value == "between") {
				data.lowerYear = this.$el.find(".lower").val();
				data.upperYear = this.$el.find(".upper").val(); 
			} else {
				data.year = this.$el.find("#year-option option:selected").val();
			}
		}

		var city = this.$el.find("#city").val();
		if (city != "") {
			data.city = city;
		}

		var model = new Student();
		model.fetch({
			url: model.getSearchStudentsUrl(),
			data: data
		}).then(function(data) {
			view.changeRoute(data);
		});
	},

	changeRoute: function(data) {
		app.Router.navigate("students/search");
		var view = new StudentsTableView({
			el: $("#content"),
			results: data
		});
	},

	populateYearMenu: function() {
		var menu = this.$el.find("#year-option, .year-option");
		var start = new Date().getFullYear();
		var end = start - 50;
		for (var i = start; i > end; i--) {
			var option = $("<option></option>");
			option.text(i);
			option.attr("value", i);
			menu.append(option);
		}
	},

	clearFields: function() {
		var parent = this.$el.find("#filter-students-container");
		parent.find("input[type='text']").val("");
		parent.find("select").prop("selectedIndex", 0);
	},

	changeOperator: function(evt) {
		var operator = $(evt.currentTarget).find("option:selected").val();
		var elem = this.$el.find(".between");
		if (operator == "between") {
			elem.removeClass("hide").show();
		} else {
			elem.hide();
		}
	}
});

var StudentsTableView = Backbone.View.extend({
	initialize: function(options) {
		this.template = options.template;
		this.results = options.results;
		this.render();
	},

	render: function() {
		storeContent();

		if (this.template) {
			this.$el.html(html[this.template]);
		} else { 
			this.$el.html(html["viewStudents.html"]);
		}

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
			var model = new Student(object, {parse:true});
			new StudentTableRowView({
				model: model,
				el: this.addRow(".results", model.get("emailAddr"))
			});
		}, this);
		this.table = this.$el.find("table").dataTable({
	      	aoColumnDefs: [
	          	{ bSortable: false, aTargets: [ 4, 5 ] },
	          	{ sClass: "center", aTargets: [ 4, 5 ] },
	          	{ sWidth: "10%", aTargets: [ 5 ] }
	       	]
		});
		this.$el.find(".dataTables_filter").append("<button class='send-email btn btn-sm btn-primary dt-btn'>Send Email</button>");
		this.$el.find(".dataTables_filter").append("<button class='btn btn-sm btn-primary dt-btn'>Refresh Table</button>");
	},

	fetchAllResults: function() {
		var view = this;
		new Student().fetch().then(function(data) {
			_.each(data, function(object, index) {
				var model = new Student(object, {parse:true});
				new StudentTableRowView({
					model: model,
					el: view.addRow(".results", model.get("emailAddr"))
				});
			}, view);
			view.table = view.$el.find("table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 4, 5 ] },
		          	{ sClass: "center", aTargets: [ 4, 5 ] },
		          	{ sWidth: "10%", aTargets: [ 5 ] }
		       	]
			});
			view.$el.find(".dataTables_filter").append("<button class='send-email btn btn-sm btn-primary dt-btn'>Send Email</button>");
			view.$el.find(".dataTables_filter").append("<button class='btn btn-sm btn-primary dt-btn'>Refresh</button>");
		});
	},

	refreshTable: function() {
		this.render();
	},

	addRow: function(selector, email) {
        var container = $("<tr></tr>");
        container.data("email", email);
        this.$el.find(selector).first().append(container);
        return container;
	},

	openEmailModal: function(evt) {
		var recipients = [];
		_.each(this.table.fnGetNodes(), function(row, index) {
			var checkbox = $(row).find("input[type='checkbox']");
			if ($(checkbox).is(":checked")) {
				recipients.push($(checkbox).closest("tr").data("email"));
			}
		}, this);

		var numRecipients = recipients.length;
		openEmailModal(recipients, numRecipients, "S");
	},

	toggleCheckboxes: function(evt) {
		var nodes = this.table.fnGetNodes();
		var checked = $(evt.currentTarget).is(":checked");
		_.each(nodes, function(row, index) {
			var checkbox = $(row).find("input[type='checkbox']");
			checkbox.prop("checked", checked);
		}, this);
	},
});

var StudentTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><span class='view-student primary-link center-block' id='<%= model.userid %>'>[ View Student ]</span></td>"
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
		"click .view-student": "viewStudent"
	},

	viewStudent: function(evt) {
		storeContent();

		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("students/" + id, {trigger:true});
	}
});

function storeContent() {
	$("#content").children().detach().appendTo($("#hidden"));
}