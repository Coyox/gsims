var app = {
	currentSchoolYear: "2014-2015"
};

/** Object to hold all HTML templates (pre-loaded) */
var html = {};

/** On load function */
$(function() {
	loadTemplates();

	$("body").on("click", function(e) {
	    if ($(e.target).data('toggle') !== 'popover'
	        && $(e.target).parents('.popover.in').length === 0) { 
	        $('[data-toggle="popover"]').popover('hide');
	    }
	});
});

/** Pre-fetches the specified templates located in the /templates directory in an
	html object (to be used by the views later) */
function loadTemplates() {
	var promises = [];
	var templates = [
		"viewStudents.html",
		"viewStudent.html",
		"createStudent.html",
		"confirmationModal.html",
		"transactionResponse.html",
		"login.html",
		"home.html",
		"sidebar.html",
		"header.html",
		"breadcrumb.html",
		"footer.html",
		"email.html",
		"enrolledSections.html",
		"tempContent.html",
		"searchStudents.html",
		"searchTeachers.html",
		"viewTeachers.html",
		"searchAdmins.html",
		"viewAdmins.html"
	];

	$.each(templates, function(i, name) {
		var promise = $.ajax("templates/" + name);
		promises.push(promise);
		$.when(promise).then(function(data) {
			html[name] = data;
		});
	});

	$.when.apply($, promises).then(function() {
		init();
	});
}

/** Initialization function */
function init() {
	app.Router = new Router();
	Backbone.history.start();
}

var Router = Backbone.Router.extend({
	initialize: function(options) {
		this.el = $("#container");
		var route = this;
		Backbone.history.on("all", function(route, router) {
	
		});
	},

    routes: {
        "":             		"login",
        "forgotPassword": 		"forgotPassword",
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
    	new HomePageView({
    		el: this.el
    	});
    },

    forgotPassword: function() {
    	new ForgotPasswordView({
    		el: this.el
    	});
    },

    filterStudents: function() {
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







