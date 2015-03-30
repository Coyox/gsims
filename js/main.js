/** Global application object */
var app = {
	serverUrl: "https://gobind-sarvar.rhcloud.com/",
	currentSchoolYear: "2014-2015",
	selectedSchoolYearId: "100000",
	selectedSchoolId: "412312",
};

/** Object to hold all HTML templates (pre-loaded) */
var html = {};

/** Override Backbone's default model validation with the Backbone.Validation plugin */
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

/** Override Backbone's default validation callbacks. Use Bootstrap to highlight invalid fields */
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});

/** On load function */
$(function() {
	loadLoginTemplate();
	loadTemplates();

	setActiveSchoolYear();

	$("body").on("click", function(e) {
	    if ($(e.target).data('toggle') !== 'popover'
	        && $(e.target).parents('.popover.in').length === 0) {
	        $('[data-toggle="popover"]').popover('hide');
	    }
	});

	$("body").on("click", "#back-btn", function() {
		history.back();
	});
});

function loadLoginTemplate() {
	var name = "login.html";
	var xhr = $.ajax("templates/" + name);
	$.when(xhr).then(function(data) {
		html[name] = data;
		app.LoginRouter = new LoginRouter();
	});
}

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
		"forgotPassword.html",
		"resetPassword.html",
		"home.html",
		"sidebar.html",
		"header.html",
		"breadcrumb.html",
		"footer.html",
		"email.html",
		"enrolledSections.html",
		"searchStudents.html",
		"searchTeachers.html",
		"viewTeachers.html",
		"viewTeacher.html",
		"createTeacher.html",
		"searchAdmins.html",
		"viewAdmins.html",
		"viewSuperusers.html",
		"reportCard.html",
		"courseEnrollment.html",
		"viewSchoolYear.html",
		"createSchoolYear.html",
        "createDepartment.html",
        "createSection.html",
        "createCourse.html",
        "viewDepartments.html",
        "viewCourses.html",
        "viewSections.html",
        "viewSchools.html",
        "createSchool.html",
		"createStudentSearch.html",
		"enrollmentForm.html",
		"dashboard.html",
		"notifications.html",
		"pendingRegistration.html",
		"pendingTest.html",
		"emailModal.html",
		"registrationPage.html",
		"termsAndConditions.html",
		"settings.html",
		"import.html",
		"export.html",
        "viewPurge.html",
		"subSection.html",
		"attendance.html",
		"manageCourses.html",
		"viewCourse.html",
		"viewSection.html",
		"addStudentToSection.html",
		"viewPurge.html"
	];

	$.each(templates, function(i, name) {
		var promise = $.ajax("templates/" + name);
		promises.push(promise);
		$.when(promise).then(function(data) {
			html[name] = _.template(data);
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

/** Set the current school year (for all requests) */
function setActiveSchoolYear() {
	var schoolyear = new SchoolYear();
	schoolyear.fetch({
		url: schoolyear.getActiveSchoolYearUrl()
	}).then(function(data) {
		app.currentSchoolYear = data.schoolyear;
		app.currentSchoolYearId = data.schoolyearid;
		sessionStorage.setItem("gobind-activeSchoolYear", app.currentSchoolYearId);
	});
}
