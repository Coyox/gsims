var HomePageView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["home.html"]);

    	new SidebarView({
    		el: this.$el.find("#sidebar")
    	});

    	new BreadcrumbView({
    		el: this.$el.find("#breadcrumb")
    	})

    	new HeaderView({
    		el: this.$el.find("#header")
    	});

    	new FooterView({
    		el: this.$el.find("#footer")
    	});
	}
});

var SidebarView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["sidebar.html"]);
		this.populateSchoolMenu();
		this.populateSchoolYearMenu();
	},

	events: {
		"click .sidebar-link": "updateBreadcrumb",
		"click .sidebar-link": "loadPage"
	},

	updateBreadcrumb: function(evt) {

	},

	loadPage: function(evt) {
		// Update the breadcrumb with the current sidebar link
		var link = $(evt.currentTarget).html();
		$("#breadcrumb-text").html(link);

		this.$el.find("li.active").removeAttr("class");

		var li = $(evt.currentTarget).closest("li");
		li.addClass("active");

		var link = $(evt.currentTarget).data("link");
		switch (link) {
			case "students":
				app.Router.navigate("students", {trigger:true});
				break;
			default:
				app.Router.navigate("");
				$("#content").html(html["tempContent.html"]);
				break;
		}
	},

	populateSchoolMenu: function() {
		var select = this.$el.find("#school-options");
		new School().fetch().then(function(data) {
			_.each(data, function(object, index) {
				var option = $("<option></option>");
				option.attr("id", object.schoolid);
				option.attr("value", object.location);
				option.text(object.location);
				select.append(option);
			});
		});
	},

	populateSchoolYearMenu: function() {
		var select = this.$el.find("#school-year-options");
		new SchoolYear().fetch().then(function(data) {
			_.each(data, function(object, index) {
				var option = $("<option></option>");
				option.attr("id", object.schoolyearid);
				option.attr("value", object.schoolyear);
				option.text(object.schoolyear);
				select.append(option);
			});
		});
	}
});

var HeaderView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["header.html"]);

		var username = sessionStorage.getItem("gobind-username");
		if (username != null) {
			this.$el.find(".username").html(username);
		}
	},

	events: {
		"click #logout": "logout"
	},

	logout: function(evt) {
		app.Router.navigate("", {trigger:true});
	}
});

var FooterView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["footer.html"]);
	}
});

var BreadcrumbView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["breadcrumb.html"]);
	}
});