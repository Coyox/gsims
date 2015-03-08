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
		"studentRecord.html",
		"createStudent.html",
		"confirmationModal.html",
		"transactionResponse.html",
		"login.html",
		"home.html",
		"sidebar.html",
		"header.html",
		"breadcrumb.html"
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
    routes: {
        "":             "login",
        "home": 	    "home"
    },

    login: function() {
    	console.log("Login View");
    	new LoginView({
    		el: $("#container")
    	});
    },

    home: function() {
    	console.log("Home View");
    	new HomePageView({
    		el: $("#container")
    	});
    }
});







