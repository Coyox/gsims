var SearchStudentsView = Backbone.View.extend({
	initialize: function(options) {
		this.redirect = options.redirect;
		this.sectionid = options.sectionid;
		this.render();
	},

	render: function() {
		this.$el.html(html["searchStudents.html"]);
		this.populateYearMenu();
	},

	events: {
		"click #search-students": "searchStudents",
		"click #advanced-search-students": "advancedSearchStudents",
		"click #clear-fields": "clearFields",
		"change #year-operator": "changeOperator"
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

		var student = new Student();
		student.fetch({
			url: student.getSearchStudentsUrl(sessionStorage.getItem("gobind-schoolid")),
			data: data
		}).then(function(data) {
			view.changeRoute(data);
		});
	},

	advancedSearchStudents: function(evt) {
		var view = this;
		var data = {};

		var lowerGrade = this.$el.find("#lower-grade").val();
		if (lowerGrade != "") {
			var upperGrade = this.$el.find("#upper-grade").val();
			if (upperGrade != "") {
				data.upperGrade = upperGrade;
				data.lowerGrade = lowerGrade;
			}
		}
		var numAssignment = this.$el.find("#num-assignment").val();
		if (numAssignment != "") {
			data.numAssignment = numAssignment;
		}
		var numFailedSections = this.$el.find("#num-failed-sections").val();
		if (numFailedSections != "") {
			data.numFailedSections = numFailedSections;
		}

		var model = new Student();
		model.fetch({
			url: model.getAdvancedSearchUrl(sessionStorage.getItem("gobind-schoolid")),
			data: data
		}).then(function(data) {
			view.changeRoute(data);
		});
	},

	changeRoute: function(data) {
		if (this.redirect == false) {
			var view = new AddTableView({
				el: this.$el,
				results: data,
				sectionid: this.sectionid
			});
		} else {
			app.Router.navigate("students/search");
			var view = new StudentsTableView({
				el: $("#content"),
				results: data
			});
		}
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

var AddTableView = Backbone.View.extend({
	initialize: function(options) {
		this.template = options.template;
		this.results = options.results;
		this.sectionid = options.sectionid;
		this.render();
	},

	render: function() {
		this.$el.html(html["viewStudents.html"]);
		this.populateQueryResults(this.results);
	},

	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Student(object, {parse:true});
			new AddTableRowView({
				model: model,
				el: this.addRow(".results", model.get("emailAddr")),
				sectionid: this.sectionid
			});
		}, this);
		this.table = this.$el.find("table").dataTable({
	      	aoColumnDefs: [
	          	{ bSortable: false, aTargets: [ 4, 5 ] },
	          	{ sClass: "center", aTargets: [ 4, 5 ] },
	          	{ sWidth: "10%", aTargets: [ 5 ] }
	       	]
		});
	},

	addRow: function(selector, email) {
        var container = $("<tr></tr>");
        container.data("email", email);
        this.$el.find(selector).first().append(container);
        return container;
	},
});

var AddTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.userid %></td>"
		+	"<td><%= model.firstName %></td>"
		+	"<td><%= model.lastName %></td>"
		+	"<td><%= model.emailAddr %></td>"
		+   "<td><span class='add-student primary-link center-block' id='<%= model.userid %>'>[ Add Student ]</span></td>"
		+	"<td></td>"),

	initialize: function(options) {
		this.sectionid = options.sectionid;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .add-student": "addStudent"
	},

	addStudent: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		var student = new Student({id: id});
		$.ajax({
			type: "POST",
			url: student.enrollStudentInSections(id),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
				status: "active",
				sectionids: JSON.stringify([this.sectionid]),
				userid: id
			}
		}).then(function(data) {
			console.log(data);
			new TransactionResponseView({
				message: "This student has been added to this section."
			});
		}).fail(function(data) {
			new TransactionResponseView({
				title: "ERROR",
				status: "error",
				message: "This student could not be added to this section. Please try again."
			});
		})
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
		createEmailButton(this.$el);
		createRefreshButton(this.$el);
		createExportButton(this.$el);
	},

	fetchAllResults: function() {
		var view = this;
		var school = new School();
		school.fetch({
			url: school.getStudentsUrl(sessionStorage.getItem("gobind-schoolid"))
		}).then(function(data) {
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
			createEmailButton(view.$el);
			createRefreshButton(view.$el);	
			createExportButton(view.$el);		
		});
	},

	refreshTable: function(evt) {
		evt.stopImmediatePropagation();
		this.table.fnDestroy();
		this.render();
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