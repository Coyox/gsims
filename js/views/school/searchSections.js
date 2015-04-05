var SearchSectionsView = Backbone.View.extend({
	initialize: function(options) {
		this.redirect = options.redirect;
		this.sectionid = options.sectionid;
		this.render();
	},

	render: function() {
		this.$el.html(html["searchSections.html"]);
		this.$el.find('#start-time').timepicker();
		this.$el.find('#end-time').timepicker();
	},

	events: {
		"click #search-sections": "searchSections",
		"click #clear-fields": "clearFields"
	},

	searchSections: function(evt) {
		var view = this;
		var data = {};

		var deptName = this.$el.find("#dept-name").val();
		if (deptName != "") {
			data.deptName = deptName;
		}

		var courseName = this.$el.find("#course-name").val();
		if (courseName != "") {
			data.courseName = courseName;
		}
		var days = [];
		_.each($(".day"), function(day, index) {
			if ($(day).is(":checked")) {
				days.push($(day).data("day").toUpperCase());
			}
		});
		var day = days.join(",");
		if (day != ""){
			data.days = day;
		}

		var startTime = this.$el.find("#start-time").val();
		var endTime = this.$el.find("#end-time").val();

		if (startTime != "" && endTime != ""){
			view.$el.find("#alert-both").addClass("hide");
			if (endTime > startTime) {
				data.startTime = moment(startTime, ["h:mmA"]).format("HH:mm:00");
				data.endTime = moment(endTime, ["h:mmA"]).format("HH:mm:00");
				console.log(data.startTime);
				console.log(data.endTime);
				view.$el.find("#alert-larger").addClass("hide");
			}
			else {
				view.$el.find("#alert-larger").removeClass("hide");
			}
		}
		else {
			if (startTime != "" || endTime !=""){
				view.$el.find("#alert-both").removeClass("hide");
			}
		}
		data.schoolyearid = sessionStorage.getItem("gobind-activeSchoolYear");
		var section = new Section();
		section.fetch({
			url: section.getSearchSectionsUrl(sessionStorage.getItem("gobind-schoolid")),
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
			app.Router.navigate("sections/search");
			var view = new SectionsTableView({
				el: $("#content"),
				results: data
			});
		}
	},

	clearFields: function() {
		var parent = this.$el.find("#filter-sections-container");
		parent.find("input[type='text']").val("");
		parent.find("input[type='checkbox']").attr("checked", false);
	},
});

var SectionsTableView = Backbone.View.extend({
	initialize: function(options) {
		this.results = options.results;
		this.render();
	},

	render: function() {
		storeContent();
		this.$el.html(html["viewSections.html"]);


		if (this.results) {
			this.populateQueryResults(this.results);
		} else {
			this.fetchAllResults();
		}
	},

	events: {
		"click #refresh": "refreshTable",
	},

	populateQueryResults: function(data) {
		_.each(data, function(object, index) {
			var model = new Section(object, {parse:true});
			new SectionTableRowView({
				model: model,
				el: this.addRow()
			});
		}, this);
		this.table = this.$el.find("table").dataTable({
	      	aoColumnDefs: [
	          	{ bSortable: false, aTargets: [ 4, 5 ] },
	          	{ sClass: "center", aTargets: [ 4, 5 ] },
	          	{ sWidth: "10%", aTargets: [ 5 ] }
	       	]
		});
		createRefreshButton(this.$el);
		createExportButton(this.$el);
	},

	fetchAllResults: function() {
		var view = this;
		var section = new Section();
		section.fetch({
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Section(object, {parse:true});
				new SectionTableRowView({
					model: model,
					el: view.addRow()
				});
			}, view);
			view.table = view.$el.find("table").dataTable({
		      	aoColumnDefs: [
		          	{ bSortable: false, aTargets: [ 4, 5 ] },
		          	{ sClass: "center", aTargets: [ 4, 5 ] },
		          	{ sWidth: "10%", aTargets: [ 5 ] }
		       	]
			});
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
		this.$el.find(".results").append(container);
		return container;
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


var SectionTableRowView = Backbone.View.extend({
	template: _.template("<td><%= model.sectionCode %></td>"
		+	"<td><%= model.deptName %></td>"
		+	"<td><%= model.courseName %></td>"
		+	"<td><%= model.day %></td>"
		+	"<td><%= model.startTime %></td>"
		+	"<td><%= model.endTime %></td>"
		+   "<td><span class='view-section primary-link center-block' id='<%= model.sectionid %>'>[ View Section ]</span></td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .view-section": "viewSection",
	},

	viewSection: function(evt) {
		storeContent();

		var id = $(evt.currentTarget).attr("id");
		app.Router.navigate("viewSection/" + id, {trigger:true});
	}
});