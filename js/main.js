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
		"searchStudents.html"
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
		this.el = $("#container")
	},

    routes: {
        "":             	"login",
        "forgotPassword": 	"forgotPassword",
        "home": 	    	"home",
        "searchStudents": 	"searchStudents",
        "students": 		"students",
        "students/:id": 	"viewStudent"
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

    searchStudents: function() {
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

    students: function() {
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
    }
});







