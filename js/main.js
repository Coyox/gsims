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
		"login.html"
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
	new LoginView({
		el: $("#landing-container")
	});
	// The following two are for the demo
	new FetchStudentsView({
		el: $("#students-container")
	});
	new CreateStudentView({
		el: $("#create-container")
	});
}









