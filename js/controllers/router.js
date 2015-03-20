var Router = Backbone.Router.extend({
	initialize: function(options) {
		this.el = $("#container");

        /** Hide/show the back button depending on what the current page is (routeName). 
            The back button should essentially be shown on all pages except for the
            home page */
		Backbone.history.on("all", function(route, router, routeName) {
            switch (routeName) {
                case "login":
                case "forgotPassword":
                case "home":
                    $("#back-container").hide();
                    break;
                default:
                    $("#back-container").removeClass("hide").show();
                    break;
           }
		});
	},

    routes: {
        "":             		"login",
        "forgotPassword": 		"forgotPassword",
        "reset":                "resetPassword",
        "reset/:id":            "resetPassword",
        "home": 	    		"home",

        "filterStudents": 		"filterStudents",
        "students/search": 		"viewFilteredStudents",
        "students/all": 		"viewAllStudents",
        "students/:id": 		"viewStudent",

        "filterTeachers": 		"filterTeachers",
        "teachers/search": 		"viewFilteredTeachers",
        "teachers/all": 		"viewAllTeachers",
        "teachers/:id": 		"viewTeacher",

        "filterAdmins": 		"filterAdmins",
        "admins/search": 		"viewFilteredAdmins",
        "admins/all": 			"viewAllAdmins",
        "admins/:id": 			"viewAdmin",

        "email" :               "email",
    },

    updatePageBreadcrumb: function(text) {
        $("#breadcrumb-text").html(text);
    },

    login: function() {
    	new LoginView({
    		el: this.el
    	});
    },


    loadHome: function() {
      	if ($("#container").html() == "") {
    		this.home();
    	}
    },

    home: function() {
        this.updatePageBreadcrumb("Home");

    	new HomePageView({
    		el: this.el
    	});
    },

    email: function() {
        this.updatePageBreadcrumb("Send Email");

        this.loadHome();

        //$("#content").html(html["email.html"]);

        new EmailView({
            el: $("#content"),
        });
    },

    forgotPassword: function() {
    	new ForgotPasswordView({
    		el: this.el
    	});
    },

    resetPassword: function(id) {
        console.log(id);
        console.log("resetPassword");
        new ResetPasswordView({
            id: id
        });
    },

    filterStudents: function() {
        this.updatePageBreadcrumb("Search Students");

    	this.loadHome();

    	var filterStudents = $("#hidden").find("#filter-students-container");
    	if (filterStudents.length) {
    		filterStudents.detach().appendTo($("#content").empty());
    	} else {
	    	new SearchStudentsView({
	    		el: $("#content"),
	    	});
    	}
    },

    viewFilteredStudents: function() {
        this.updatePageBreadcrumb("Students");

    	this.loadHome();

    	var studentResults = $("#hidden").find("#students-table-container");
    	if (studentResults.length) {
    		studentResults.detach().appendTo($("#content").empty());
    	} else {
		   	new StudentsTableView({
				el: $("#content")
			});
    	}
    },

    viewAllStudents: function() {
        this.updatePageBreadcrumb("Students");

    	this.loadHome();

    	var studentResults = $("#hidden").find("#students-table-container");
    	if (studentResults.length) {
    		studentResults.detach().appendTo($("#content").empty());
    	} else {
		   	new StudentsTableView({
				el: $("#content")
			});
    	}
    },

    viewStudent: function(id) {
        this.updatePageBreadcrumb("View Student (" + id + ")");

    	this.loadHome();

		$("#content").html(html["viewStudent.html"]);

		var parent = $("#student-content");
		new StudentRecordView({
			id: id,
			el: $("#student-info"),
			action: "view",
			parentContainer: parent
		});
    },

    filterTeachers: function() {
        this.updatePageBreadcrumb("Search Teachers");

    	this.loadHome();

    	var filterTeachers = $("#hidden").find("#filter-teachers-container");
    	if (filterTeachers.length) {
    		filterTeachers.detach().appendTo($("#content").empty());
    	} else {
	    	new SearchTeachersView({
	    		el: $("#content"),
	    	});
    	}
    },

    viewFilteredTeachers: function() {
        this.updatePageBreadcrumb("Teachers");

    	this.loadHome();

    	var teacherResults = $("#hidden").find("#teachers-table-container");
    	if (teacherResults.length) {
    		teacherResults.detach().appendTo($("#content").empty());
    	} else {
		   	new TeachersTableView({
				el: $("#content")
			});
    	}
    },

    viewAllTeachers: function() {
        this.updatePageBreadcrumb("Teachers");

    	this.loadHome();

    	var teacherResults = $("#hidden").find("#teachers-table-container");
    	if (teacherResults.length) {
    		teacherResults.detach().appendTo($("#content").empty());
    	} else {
		   	new TeachersTableView({
				el: $("#content")
			});
    	}
    },

    filterAdmins: function() {
        this.updatePageBreadcrumb("Search Administrators");

    	this.loadHome();

    	var filterAdmins = $("#hidden").find("#filter-admins-container");
    	if (filterAdmins.length) {
    		filterAdmins.detach().appendTo($("#content").empty());
    	} else {
	    	new SearchAdminsView({
	    		el: $("#content"),
	    	});
    	}
    },

    viewFilteredAdmins: function() {
        this.updatePageBreadcrumb("Administrators");

    	this.loadHome();

    	var adminResults = $("#hidden").find("#admins-table-container");
    	if (adminResults.length) {
    		adminResults.detach().appendTo($("#content").empty());
    	} else {
		   	new AdminsTableView({
				el: $("#content")
			});
    	}
    },

    viewAllAdmins: function() {
        this.updatePageBreadcrumb("Administrators");

    	this.loadHome();

    	var adminResults = $("#hidden").find("#admins-table-container");
    	if (adminResults.length) {
    		adminResults.detach().appendTo($("#content").empty());
    	} else {
		   	new AdminsTableView({
				el: $("#content")
			});
    	}
    },
});
