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
                    // $("#content").prepend(view.buttons());
                    // $("#button-container").removeClass("hide").show();
                    // $(".buttons").children().appendTo($("#button-container"));
                    break;
           }
		});
	},

    routes: {
        "":             		"login",
        "forgotPassword": 		"forgotPassword",
        "selectSchool":         "selectSchool",
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

        "filterTeachers/A":     "filterAdmins",
        "teachers/search/A":    "viewFilteredAdmins",
        "teachers/all/A":       "viewAllAdmins",
        "teachers/:id/A":       "viewAdmin",
        "createTeacher/A":      "createAdmin",

        // "filterAdmins": 		"filterAdmins",
        // "admins/search": 		"viewFilteredAdmins",
        // "admins/all": 			"viewAllAdmins",
        // "admins/:id": 			"viewAdmin",
        // "createAdmin":          "createAdmin",

        "superusers/all":       "viewAllSuperusers",
        "superusers/:id":       "viewSuperuser",
        "createSuperuser":      "createSuperuser",
        "email" :               "email",

        "schoolyears":          "viewSchoolYears",
        "schools":              "schools",
        "departments":          "departments",
        "courses":              "courses",
        "mySections":           "mySections",
        "sections":             "sections",
        "filterSections":       "filterSections",
        "sections/search":      "viewFilteredSections",

        "notifications":        "notifications",

        "settings":             "settings",

        "import":               "importData",
        "export":               "exportData",
        "purge":                "purgeData",

        "viewCourse/:id/:did":  "viewCourse",

        "viewSection/:id":      "viewSection",

        "help":                 "help"
    },

    updatePageBreadcrumb: function(text, icon) {
        $("#breadcrumb-text").html("<span class='glyphicon glyphicon-" + icon + "'></span>" + text);
    },

    login: function() {
    	new LoginView({
    		el: this.createChild($("#container"))
    	});
    },

    loadHome: function() {
        if (sessionStorage.getItem("gobind-usertype") != null) { 
            if ($("#container").html() == "") {
             this.home();
           }
        } else {
            this.login();
        }
    },

    createChild: function(elem) {
        elem = elem || $("#content");

        var container = $("<div></div>");
        container.attr("id", "child");
        elem.html(container);
        return container;
    },

    home: function(isHome) {
        if (sessionStorage.getItem("gobind-usertype") != null) {

            this.updatePageBreadcrumb("Home", "home");

        	new HomePageView({
        		el: this.el
        	});

            if (Backbone.history.fragment == "home") {
                new DashboardView({
                    el: this.createChild()
                });
            }
        } else
            this.login();
    },

    email: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Send Email", "envelope");

        new EmailView({
            el: this.createChild(),
        });    
    },

    forgotPassword: function() {
    	new ForgotPasswordView({
    		el: this.createChild($("#container"))
    	});
    },

    resetPassword: function(id, username) {
        new ResetPasswordView({
            id: id,
            username: username,
            el: this.resetPassword($("#container"))
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
	    		el: this.createChild(),
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
		   	var view = new StudentsTableView({
				el: this.createChild()
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
		   	var view = new StudentsTableView({
				el: this.createChild()
			});
    	}
    },

    viewStudent: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("View Student", "user");

        new StudentRecordView({
            id: id,
            el: this.createChild(),
            action: "view"
        });
    },

    createStudent: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("Create Student", "user");

        var container = this.createChild();
        container.append("<div id='test-reg'></div>");

        new RegistrationFormView({
            el: $(container).find("#test-reg"),
            regType: "admin",
            status: "active"
        });
    },

    studentEnrollmentForm: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Create Student", "user");

        app.enrollmentFormView = new EnrollmentFormView({
            el: this.createChild()
        });
    },

    courseEnrollment: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Course Enrollment", "th-list");

        var user = JSON.parse(sessionStorage.getItem("gobind-user"));

        app.courseEnrollmentView = new CourseEnrollmentView({
            el: this.createChild(),
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
	    		el: this.createChild(),
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
				el: this.createChild()
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
				el: this.createChild()
			});
    	}
    },
    viewTeacher: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("View Teacher", "user");

        new TeacherRecordView({
            id: id,
            el: this.createChild(),
            action: "view",
        });
    },

    createTeacher: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Create Teacher", "user");

        new CreateTeacherView({
            el: this.createChild()
        });
    },

    filterAdmins: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Search Administrators", "user");

        var filterTeachers = $("#hidden").find("#filter-teachers-container");
        if (filterTeachers.length) {
            filterTeachers.detach().appendTo($("#content").empty());
        } else {
            new SearchTeachersView({
                el: this.createChild(),
                usertype: "A"
            });
        }
    },

    viewFilteredAdmins: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Administrators", "user");

        var teacherResults = $("#hidden").find("#teachers-table-container");
        if (teacherResults.length) {
            teacherResults.detach().appendTo($("#content").empty());
        } else {
            new TeachersTableView({
                el: this.createChild(),
                usertype: "A"
            });
        }
    },

    viewAllAdmins: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Administrators", "user");

        var teacherResults = $("#hidden").find("#teachers-table-container");
        if (teacherResults.length) {
            teacherResults.detach().appendTo($("#content").empty());
        } else {
            new TeachersTableView({
                el: this.createChild(),
                usertype: "A"
            });
        }
    },

    viewAdmin: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("View Administrator", "user");

        new TeacherRecordView({
            id: id,
            el: this.createChild(),
            action: "view",
            usertype: "A"
        });
    },

    createAdmin: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Create Administrator", "user");

        new CreateTeacherView({
            el: this.createChild(),
            usertype: "A"
        });
    },

    viewAllSuperusers: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Superusers", "user");

        var superuserResults = $("#hidden").find("#superusers-table-container");
        if (superuserResults.length) {
            superuserResults.detach().appendTo($("#content").empty());
        } else {
            new SuperusersTableView({
                el: this.createChild()
            });
        }
    },
    viewSuperuser: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("View Superuser", "user");

        new SuperuserRecordView({
            id: id,
            el: this.createChild(),
            action: "view",
        });
    },

    createSuperuser: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Create Superuser", "user");

        new CreateTeacherView({
            el: this.createChild(),
            usertype: "SU"
        });
    },
    viewSchoolYears: function() {
        this.loadHome();
        this.updatePageBreadcrumb("School Years", "calendar");

        new SchoolYearView({
            el: this.createChild()
        });
    },

    schools: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Schools", "education");

        new SchoolView({
            el: this.createChild()
        });
    },

    departments: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Departments", "th-list");

        new DepartmentView({
            el: this.createChild()
        });
    },

    courses: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Courses", "th-list");

        new CourseView({
            el: this.createChild()
        });
    },

    mySections: function() {
        this.loadHome();
        this.updatePageBreadcrumb("My Sections", "th-list");

        new MySectionsView({
            el: this.createChild()
        });
    },    

    sections: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Sections", "th-list");

        new DepartmentView({
            el: this.createChild()
        });
    },

    filterSections: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Search Sections", "th-list");

        var filterSections = $("#hidden").find("#filter-sections-container");
        if (filterSections.length) {
            filterSections.detach().appendTo($("#content").empty());
        } else {
            new SearchSectionsView({
                el: this.createChild(),
            });
        }
    },

    viewFilteredSections: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Sections", "th-list");

        var sectionResults = $("#hidden").find("#sections-table-container");
        if (sectionResults.length) {
            sectionResults.detach().appendTo($("#content").empty());
        } else {
            new SectionsTableView({
                el: this.createChild()
            });
        }
    },
    notifications: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Notifications", "bell");

        new NotificationsView({
            el: this.createChild()
        });
    },

    registrationForm: function() {

        var container = this.createChild($("#container"));
        container.append("<div id='test-reg'></div>");

        new RegistrationFormView({
            el: $(container).find("#test-reg"),
            regType: "online",
            status: "pending"
        });
    },

    settings: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Settings", "wrench");

        new UserSettingsView({
            el: this.createChild()
        });
    },

    importData: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Import Data", "import");

        new ImportView({
            el: this.createChild()
        });
    },

    exportData: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Export Data", "export");

        new ExportView({
            el: this.createChild()
        });
    },

    purgeData: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Purge Data", "trash");

        new PurgeView({
            el: this.createChild()
        });
    },

    manageCourses: function() {
        this.loadHome();
        this.updatePageBreadcrumb("Manage Courses", "wrench");
        new CourseManagement({
            el: this.createChild()
        })
    },

    viewCourse: function(id, deptid) {
        this.loadHome();
        this.updatePageBreadcrumb("View Course", "th-list");

        new ViewCourse({
            el: this.createChild(),
            id: id,
            deptid: deptid
        });
    },

    viewSection: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("View Section", "th-list");

        new SectionView({
            el: this.createChild(),
            id: id
        });
    },

    help: function(id) {
        this.loadHome();
        this.updatePageBreadcrumb("Help", "th-list");

        new HelpView({
            el: this.createChild(),
        });
    },    

    selectSchool: function(evt) {
        new SelectSchoolView({
            el: this.createChild($("#container"))
        });
    }
});
