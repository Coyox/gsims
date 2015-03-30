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
        "manageCourses":        "manageCourses",

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

        "import":               "importData",
        "export":               "exportData",
        "purge":                "purgeData",

        "viewCourse/:id":       "viewCourse",

        "viewSection/:id":      "viewSection"
    },

    updatePageBreadcrumb: function(text, icon) {
        $("#breadcrumb-text").html("<span class='glyphicon glyphicon-" + icon + "'></span>" + text);
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

    home: function(isHome) {
        this.updatePageBreadcrumb("Home", "home");

    	new HomePageView({
    		el: this.el
    	});

        if (Backbone.history.fragment == "home") {
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
        this.updatePageBreadcrumb("Send Email", "envelope");

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
        this.updatePageBreadcrumb("Search Students", "user");

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
        this.updatePageBreadcrumb("Students", "user");

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
        this.updatePageBreadcrumb("Students", "user");

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
        this.updatePageBreadcrumb("View Student", "user");

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
        this.updatePageBreadcrumb("Create Student", "user");

        $("#content").html("<div id='test-reg'></div>");
        new RegistrationFormView({
            el: $("#test-reg"),
            regType: "admin",
            status: "active"
        });
    },

    studentEnrollmentForm: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Create Student", "user");

        app.enrollmentFormView = new EnrollmentFormView({
            el: $("#content")
        });
    },

    courseEnrollment: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Course Enrollment", "th-list");

        var user = JSON.parse(sessionStorage.getItem("gobind-user"));

        app.courseEnrollmentView = new CourseEnrollmentView({
            el: $("#content"),
            userid: user ? user.userid : false
        });
    },

    filterTeachers: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Search Teachers", "user");

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
        this.updatePageBreadcrumb("Teachers", "user");

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
        this.updatePageBreadcrumb("Teachers", "user");

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
        this.updatePageBreadcrumb("View Teacher", "user");

        new TeacherRecordView({
            id: id,
            el: $("#content"),
            action: "view",
        });
    },

    createTeacher: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Create Teacher", "user");

        new CreateTeacherView({
            el: $("#content").html("")
        });
    },

    filterAdmins: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Search Administrators", "user");

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
        this.updatePageBreadcrumb("Administrators", "user");

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
        this.updatePageBreadcrumb("Administrators", "user");

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
        this.updatePageBreadcrumb("School Years", "calendar");

        new SchoolYearView({
            el: $("#content")
        });
    },

    schools: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Schools", "education");

        new SchoolView({
            el: $("#content")
        });
    },

    departments: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Departments", "th-list");

        new DepartmentView({
            el: $("#content")
        });
    },

    courses: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Courses", "th-list");

        new CourseView({
            el: $("#content")
        });
    },

    sections: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Sections", "th-list");

        new DepartmentView({
            el: $("#content")
        });
    },

    notifications: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Notifications", "bell");

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
        this.updatePageBreadcrumb("Settings", "wrench");

        new UserSettingsView({
            el: $("#content")
        });
    },

    importData: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Import Data", "import");

        new ImportView({
            el: $("#content")
        });
    },

    exportData: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Export Data", "export");

        new ExportView({
            el: $("#content")
        });
    },

    purgeData: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Purge Data", "purge");

        new PurgeView({
            el: $("#content")
        });
    },

    manageCourses: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Manage Courses", "wrench");
        new CourseManagement({
            el: $("#content")
        })
    },

    viewCourse: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("View Course", "th-list");

        new ViewCourse({
            el: $("#content"),
            id: id
        });
    },

    viewSection: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("View Section", "th-list");

        new SectionView({
            el: $("#content"),
            id: id
        });
    }
});
