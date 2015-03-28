var LoginRouter = Backbone.Router.extend({
    routes: {
        "": "login"
    },

    login: function() {
        new LoginView({
            el: $("#container")
        });
    },
});

var Router = Backbone.Router.extend({
    buttons: _.template("<div id='button-container' class='hide'>"
        +       "<button id='back-btn' class='btn btn-primary btn-sm'>Back</button>"
        +   "</div>"),

	initialize: function(options) {
        var view = this;
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
                    $("#content").prepend(view.buttons());
                    $("#button-container").removeClass("hide").show();
                    $(".buttons").children().appendTo($("#button-container"));
                    break;
           }
		});
	},

    routes: {
        "":             		"login",
        "forgotPassword": 		"forgotPassword",
        "reset/:id/:name":      "resetPassword",
        "home": 	    		"home",

        "filterStudents": 		"filterStudents",
        "students/search": 		"viewFilteredStudents",
        "students/all": 		"viewAllStudents",
        "students/:id": 		"viewStudent",
        "createStudent":        "createStudent",
        "enrollmentForm":       "studentEnrollmentForm",
        "courseEnrollment":     "courseEnrollment",
        "registrationForm":     "registrationForm",

        "filterTeachers": 		"filterTeachers",
        "teachers/search": 		"viewFilteredTeachers",
        "teachers/all": 		"viewAllTeachers",
        "teachers/:id": 		"viewTeacher",
        "createTeacher":        "createTeacher",

        "filterAdmins": 		"filterAdmins",
        "admins/search": 		"viewFilteredAdmins",
        "admins/all": 			"viewAllAdmins",
        "admins/:id": 			"viewAdmin",

        "email" :               "email",

        "schoolyears":          "viewSchoolYears",
        "schools":              "schools",
        "departments":          "departments",

        "notifications":        "notifications",

        "settings":             "settings"
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

    createChild: function() {
        $("#content").html("<div id='child'></div>");
    },

    home: function() {
        this.updatePageBreadcrumb("Home");

    	new HomePageView({
    		el: this.el
    	});

        new DashboardView({
            el: $("#content")
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

    resetPassword: function(id, username) {
        new ResetPasswordView({
            id: id,
            username: username,
            el: $("#container")
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

    createStudent: function(id) {
        this.updatePageBreadcrumb("Create Student");

        this.loadHome();

        // temp fix
        $("#content").html("<div id='child'></div>");
        new CreateStudentView({
            el: $("#child")
        });
    },

    studentEnrollmentForm: function() {
        this.updatePageBreadcrumb("Create Student");

        this.loadHome();

        app.enrollmentFormView = new EnrollmentFormView({
            el: $("#content")
        });
    },

    courseEnrollment: function() {
        this.updatePageBreadcrumb("Course Enrollment");

        this.loadHome();

        app.courseEnrollmentView = new CourseEnrollmentView({
            el: $("#content")
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
    viewTeacher: function(id) {
        this.updatePageBreadcrumb("View Teacher (" + id + ")");

        this.loadHome();

        $("#content").html(html["viewTeacher.html"]);

        var parent = $("#teacher-content");
        new TeacherRecordView({
            id: id,
            el: $("#teacher-info"),
            action: "view",
            parentContainer: parent
        });
    },

    createTeacher: function() {
        this.updatePageBreadcrumb("Create Teacher");

        this.loadHome();

        new CreateTeacherView({
            el: $("#content").html("")
        });
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

    viewSchoolYears: function() {
        this.updatePageBreadcrumb("School Years");

        this.loadHome();

        new SchoolYearView({
            el: $("#content")
        });
    },

    schools: function() {
        this.updatePageBreadcrumb("Schools");

        this.loadHome();

        new SchoolView({
            el: $("#content")
        });
    },

    departments: function() {
        this.updatePageBreadcrumb("Departments");

        this.loadHome();

        new DepartmentView({
            el: $("#content")
        });
    },

    notifications: function() {
        this.updatePageBreadcrumb("Notifications");

        this.loadHome();

        new NotificationsView({
            el: $("#content")
        });
    },

    registrationForm: function() {
        new RegistrationFormView({
            el: $("#container")
        });
    },

    settings: function() {
        this.updatePageBreadcrumb("Settings");

        this.loadHome();

        new UserSettingsView({
            el: $("#content")
        });
    }
});
