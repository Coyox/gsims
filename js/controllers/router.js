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
        "courses":              "courses",
        "sections":             "sections",

        "notifications":        "notifications",

        "settings":             "settings",

        "import":               "importData"
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
    		this.home(true);
    	}
    },

    createChild: function() {
        $("#content").html("<div id='child'></div>");
    },

    home: function(isHome) {
        this.updatePageBreadcrumb("Home");

    	new HomePageView({
    		el: this.el
    	});

        if (isHome) {
            new DashboardView({
                el: $("#content")
            });
        }

        $("#main-content .left").affix({
            offset: {
                top: 50
            }
        })
    },

    email: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Send Email");

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
        this.loadHome();
        this.updatePageBreadcrumb("Search Students");

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
        this.loadHome();
        this.updatePageBreadcrumb("Students");

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
        this.loadHome();
        this.updatePageBreadcrumb("Students");

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
        this.loadHome();
        this.updatePageBreadcrumb("View Student (" + id + ")");

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
        this.loadHome();
        this.updatePageBreadcrumb("Create Student");

        $("#content").html("<div id='test-reg'></div>");
        new RegistrationFormView({
            el: $("#test-reg"),
            regType: "admin",
            status: "active"
        });
    },

    studentEnrollmentForm: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Create Student");

        app.enrollmentFormView = new EnrollmentFormView({
            el: $("#content")
        });
    },

    courseEnrollment: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Course Enrollment");

        var user = JSON.parse(sessionStorage.getItem("gobind-user"));

        app.courseEnrollmentView = new CourseEnrollmentView({
            el: $("#content"),
            userid: user ? user.userid : false
        });
    },

    filterTeachers: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Search Teachers");

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
        this.loadHome();
        this.updatePageBreadcrumb("Teachers");

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
        this.loadHome();
        this.updatePageBreadcrumb("Teachers");

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
        this.loadHome();
        this.updatePageBreadcrumb("View Teacher (" + id + ")");

        new TeacherRecordView({
            id: id,
            el: $("#content"),
            action: "view",
        });
    },

    createTeacher: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Create Teacher");

        new CreateTeacherView({
            el: $("#content").html("")
        });
    },

    filterAdmins: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Search Administrators");

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
        this.loadHome();
        this.updatePageBreadcrumb("Administrators");

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
        this.loadHome();
        this.updatePageBreadcrumb("Administrators");

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
        this.loadHome();
        this.updatePageBreadcrumb("School Years");

        new SchoolYearView({
            el: $("#content")
        });
    },

    schools: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Schools");

        new SchoolView({
            el: $("#content")
        });
    },

    departments: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Departments");

        new DepartmentView({
            el: $("#content")
        });
    },

    courses: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Courses");

        new CourseView({
            el: $("#content")
        });
    },

    sections: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Sections");

        new DepartmentView({
            el: $("#content")
        });
    },

    notifications: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Notifications");

        new NotificationsView({
            el: $("#content")
        });
    },

    registrationForm: function() {
        new RegistrationFormView({
            el: $("#container"),
            regType: "online",
            status: "pending"
        });
    },

    settings: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Settings");

        new UserSettingsView({
            el: $("#content")
        });
    },

    importData: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Import Data");

        new ImportView({
            el: $("#content")
        });
    }
});
