var School = Backbone.Model.extend({
	defaults: {
		location: "",
		postalCode: "",
		yearOpened: "",
		status: ""
	},
    urlRoot: app.serverUrl + "api/schools",

    getDepartmentsUrl: function(id) {
   		return app.serverUrl + "api/schools/" + id + "/departments";
    }
});

var SchoolYear = Backbone.Model.extend({
	defaults: {
		schoolyear: "",
		status: "",
		openForReg: ""
	},
	urlRoot: app.serverUrl + "api/schoolyears"
});

var Dept = Backbone.Model.extend({
	defaults: {
		schoolid: "",
		deptName: "",
		schoolyearid: "",
		status: ""
	},
    urlRoot: app.serverUrl + "api/departments",

    getCoursesUrl: function(id) {
    	return app.serverUrl + "api/departments/" + id + "/courses";
    }
});

var Course = Backbone.Model.extend({
	defaults: {
		courseName: "",
		description: "",
		deptid: "",
		schoolyearid:"",
		status: ""
	},
    urlRoot: app.serverUrl + "api/courses",
});

var Section = Backbone.Model.extend({
	defaults: {
		courseid: "",
		sectionCode: "",
		day: "",
		startTime: "",
		endTime:"",
		roomCapacity: "",
		roomLocation: "",
		classSize: "",
		schoolyearid:"",
		status: ""
	},
    urlRoot: app.serverUrl + "api/sections",

    getDropStudentUrl: function(sectionid, studentid) {
   		return app.serverUrl + "api/sections/students/" + sectionid + "/" + studentid;
    },

    getSearchSectionsUrl: function() {
    	return app.serverUrl + "api/search/sections";
    },
	
	getSectionTeachersUrl: function(id) {
		return this.urlRoot + "/" + id + "/teachers";
	},
});

var Prereq = Backbone.Model.extend({
	defaults: {
		courseid: "",
		prereq: ""
	}
});

var Prereqs = Backbone.Collection.extend({
	model: Prereq
});