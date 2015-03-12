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
		"click #searhc-all-students": "searchAllStudents",
		"click #clear-fields": "clearFields"
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
			data.yearop = yearop.val();
			data.year = this.$el.find("#year-option option:selected").val();
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
		storeContent();

		app.Router.navigate("students", {trigger:true});
		var view = new StudentsTableView({
			el: $("#content")
		});
		view.populateQueryResults(data);
	},

	populateYearMenu: function() {
		var menu = this.$el.find("#year-option");
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
	}
});

var StudentsTableView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		var view = this;
		this.$el.html(html["viewStudents.html"]);
	},

	events: {
		"click #refresh": "refreshTable",
	},

	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Student(object, {parse:true});
			new StudentTableRowView({
				model: model,
				el: this.addRow(".results")
			});
		}, this);
		this.$el.find("table").dataTable();
	},

	refreshTable: function() {
		this.render();
	},

	addRow: function(selector) {
        var container = $("<tr></tr>");
        this.$el.find(selector).first().append(container);
        return container;
	}
});

var StudentTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><button class='view-student btn btn-xs btn-primary center-block' id='<%= model.userid %>'>View Student</button></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .view-student": "viewStudent",
		"click .edit-student": "editStudent",
		"click .delete-student": "deleteStudent"
	},

	viewStudent: function(evt) {
		storeContent($("#content").html(), "students");

		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("students/" + id, {trigger:true});
	},

	editStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new StudentRecordView({
			id: id,
			el: $("#update-container"),
			action: "edit"
		});		
	},

	deleteStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		new DeleteRecordView({
			id: id,
			el: $("#delete-container")
		});		
	}
});

function storeContent() {
	$("#content").children().detach().appendTo($("#hidden"));
}