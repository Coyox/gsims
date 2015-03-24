var SchoolView = Backbone.View.extend({
	initialize: function(options) {
		this.model = new School();
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
		
		this.$el.append(html["createSchool.html"]);
        console.log("asdf");
		$("#create-school-modal").modal({
			show: true
		});
		
		$("#create-school-modal").on("hidden.bs.modal", function() {
			$("#create-school-modal").remove();
			$(".modal-backdrop").remove();
		});
		
		$("#create-school-modal").on("click", "#save", function() {
			view.model.set("location", $("#location").val());
            view.model.set("postalCode", $("#postalCode").val());
            view.model.set("yearOpened", $("#yearOpened").val());
			if (view.model.isValid(true)) {
				$("#create-school-modal").remove();
				$(".modal-backdrop").remove();
                console.log(view.model.toJSON());
				
                view.model.save().then(function(data) {
					if (data) {
						new TransactionResponseView({
							message: "New school successfully created."
						});
						view.render();
					}
				}).fail(function(data) {
					new TransactionResponseView({
						title: "ERROR",
						status: "error",
						message: "Could not create a new school."
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