var SchoolView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new SchoolYear();
		this.render();
	},

	render: function() {
		this.$el.html(html["viewSchools.html"]);

		var view = this;
		var school = new School();
		school.fetch().then(function(data) {
			_.each(data, function(object, index) {
				var school1 = new School(object, {parse: true});
				new SchoolRowView({
					el: view.addRow(),
					model: school1
				});
			});
			view.$el.find("table").dataTable({
				dom: "t"
			});
		});
	},

	events: {
		"click #create-school": "createSchool",
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".results").append(container);
		return container;
	},

	createSchool: function(evt) {
		var view = this;
		Backbone.Validation.bind(this);	
		
		this.$el.append(html["createSchoolYear.html"]);

		$("#create-year-modal").modal({
			show: true
		});
		
		$("#create-year-modal").on("hidden.bs.modal", function() {
			$("#create-year-modal").remove();
			$(".modal-backdrop").remove();
		});
		
		$("#create-year-modal").on("click", "#save", function() {
			view.model.set("schoolyear", $("#school-year").val());
			if (view.model.isValid(true)) {
				$("#create-year-modal").remove();
				$(".modal-backdrop").remove();
				view.model.save({
					dataType: "text"
				}).then(function(data) {
					if (data) {
						new TransactionResponseView({
							message: "New school year successfully created."
						});
						view.render();
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new school year."
					});
				});
			}
		});
	},

	refresh: function() {
		this.render();
	}
});

var SchoolRowView = Backbone.View.extend({
	template: _.template("<td><%= model.location %></td>"
		+	"<td> <%= model.postalCode %> </td>"
		+	"<td> <%= model.yearOpened %> </td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		var view = this; 

		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	}
});