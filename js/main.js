var app = {};

/** Object to hold all HTML templates (pre-loaded) */
var html = {};

/** On load function */
$(function() {
	loadTemplates();
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
		"footer.html"
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

	// The following two are for the demo
	new FetchStudentsView({
		el: $("#students-container")
	});
	new CreateStudentView({
		el: $("#create-container")
	});
}

var Router = Backbone.Router.extend({
	initialize: function(options) {
		this.el = $("#container")
	},

    routes: {
        "":             	"login",
        "forgotPassword": 	"forgotPassword",
        "home": 	    	"home",
        "students": 		"students",
        "students/:id": 	"viewStudent"
    },

    login: function() {
    	console.log("Login View");
    	new LoginView({
    		el: this.el
    	});
    },

    home: function() {
    	console.log("Home View");
    	new HomePageView({
    		el: this.el
    	});
    },

    forgotPassword: function() {
    	console.log("Forgot Password View");
    	new ForgotPasswordView({
    		el: this.el
    	});
    },

    students: function() {
    	console.log("Students list view");
      	if ($("#container").html() == "") {
    		this.home();
    	}
	   	new FetchStudentsView({
			el: $("#content")
		});
    },

    viewStudent: function(id) {
    	console.log("View students view");
    	if ($("#container").html() == "") {
    		this.home();
    	}
		$("#content").html(html["viewStudent.html"]);

		new StudentRecordView({
			id: id,
			el: $("#student-info"),
			action: "view"
		});
    }
});







