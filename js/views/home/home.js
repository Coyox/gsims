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
		var template = html["sidebar.html"];
		template = template({
			usertype: sessionStorage.getItem("gobind-usertype")
		});
		this.$el.html(template);
		this.populateSchoolMenu();
		this.populateSchoolYearMenu();
	},

	events: {
		"click .sidebar-link": "updateActiveLink",
		"change #school-year-options": "updateSelectedSchoolYear"
	},

	updateActiveLink: function(evt) {
		this.$el.find("li.active").removeAttr("class");

		var li = $(evt.currentTarget).closest("li");
		li.addClass("active");
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
			data.reverse();
			_.each(data, function(object, index) {
				var option = $("<option></option>");
				option.attr("id", object.schoolyearid);
				option.attr("value", object.schoolyear);
				option.attr("selected", object.schoolyear == app.currentSchoolYear);
				option.text(object.schoolyear);
				select.append(option);
			});
		});
	},

	updateSelectedSchoolYear: function(evt) {
		var selected = $(evt.currentTarget).find("option:selected").attr("id");
		app.selectedSchoolYaarId = selected;
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
		var usertype = sessionStorage.getItem("gobind-usertype");
		if (usertype != null) {
			var text;
			if (usertype == "T") {
				text = "teacher";
			} else if (usertype == "A") {
				text = "administrator";
			} else if (usertype == "S") {
				text = "student";
			} else if (usertype == "SU") {
				text = "superuser";
			}
			this.$el.find(".usertype").html(text);
		}
	},

	events: {
		"click #logout": "logout",
		"click .notification-popover": "displayNotificationPopover"
	},

	logout: function(evt) {
		app.Router.navigate("", {trigger:true});
	},

	displayNotifications: function(evt) {

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