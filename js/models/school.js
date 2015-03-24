var School = Backbone.Model.extend({
	defaults: {
		location: "",
		postalCode: "",
		yearOpened: "",
		status: "inactive"
	},

    	validation: {
		location: {
			required: true,
		},
		postalCode: {
			required: true,
		},
		yearOpened: {
			required: true,
		}
	},
     
    urlRoot: app.serverUrl + "api/schools",

    getDepartmentsUrl: function(id) {
   		return app.serverUrl + "api/schools/" + id + "/departments";
    }
});

var SchoolYear = Backbone.Model.extend({
	defaults: {
		schoolyear: "",
		status: "inactive",
		openForReg: 0
	},

	validation: {
		schoolyear: {
			required: true,
		}
	},

	urlRoot: app.serverUrl + "api/schoolyears",

	getActiveSchoolYearUrl: function() {
		return this.urlRoot + "/active";
	},

	updateRegistrationUrl: function(id) {
		return this.urlRoot + "/reg/" + id;
	},

	updateActiveYearUrl: function(id) {
		return this.urlRoot + "/active/" + id;
	}
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
    	return this.urlRoot + "/" + id + "/courses";
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
   		return this.urlRoot + "/students/" + sectionid + "/" + studentid;
    },

    getSearchSectionsUrl: function() {
    	return app.serverUrl + "api/search/sections";
    }
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