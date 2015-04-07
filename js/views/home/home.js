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
		populateSchoolMenu(this.$el.find("#school-options"), app.schoolOptions, sessionStorage.getItem("gobind-schoolid"));
		this.populateSchoolYearMenu();
	},

	events: {
		"click .sidebar-link": "updateActiveLink",
		"change #school-year-options": "updateSchoolYear",
		"change #school-options": "updateSchool"
	},

	updateActiveLink: function(evt) {
		this.$el.find("li.active").removeAttr("class");

		var li = $(evt.currentTarget).closest("li");
		li.addClass("active");
	},

	populateSchoolYearMenu: function() {
		var select = this.$el.find("#school-year-options");
		new SchoolYear().fetch().then(function(data) {
			data.reverse();
			_.each(data, function(object, index) {
				var option = $("<option></option>");
				option.attr("id", object.schoolyearid);
				option.attr("value", object.schoolyear);
				option.attr("selected", object.schoolyearid == app.currentSchoolYearId);
				option.text(object.schoolyear);
				select.append(option);
			});
		});
	},

	updateSchoolYear: function(evt) {
		var schoolyearid = $(evt.currentTarget).find("option:selected").attr("id");
		sessionStorage.setItem("gobind-activeSchoolYear", schoolyearid);
		app.Router.navigate("home", {trigger: true});
		app.currentSchoolYearId = schoolyearid;
		Backbone.history.loadUrl("home");
	},

	updateSchool: function(evt) {
		var schoolid = $(evt.currentTarget).find("option:selected").val();
		console.log(schoolid);
		sessionStorage.setItem("gobind-schoolid", schoolid);
		app.Router.navigate("home", {trigger: true});
		app.currentSchool = schoolid;
		Backbone.history.loadUrl("home");
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
		var login = sessionStorage.getItem("gobind-login");
		var lastLoggedIn = JSON.parse(login).lastLogin;
		lastLoggedIn = new Date(lastLoggedIn);
		lastLoggedIn = lastLoggedIn.toDateString();
		this.$el.find(".last-logged-in").text(lastLoggedIn);
	},

	events: {
		"click #logout": "logout",
		"click .notification-popover": "displayNotificationPopover"
	},

	logout: function(evt) {
		app.Router.navigate("", {trigger:true});
		sessionStorage.removeItem("gobind-email");
		sessionStorage.removeItem("gobind-login");
		sessionStorage.removeItem("gobind-schoolid");
		sessionStorage.removeItem("gobind-user");
		sessionStorage.removeItem("gobind-username");
		sessionStorage.removeItem("gobind-usertype");
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