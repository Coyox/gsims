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

    getSchoolsUrl: function(){
    	return this.urlRoot;
    },
    getDepartmentsUrl: function(id) {
   		return this.urlRoot + "/" + id + "/departments";
    },
    getStudentsUrl: function(id){
    	return this.urlRoot + "/" + id + "/students"
    },
    getTeachersUrl: function(id){
    	return this.urlRoot + "/" + id + "/teachers"
    },
    getAdminsUrl: function(id){
    	return this.urlRoot + "/" + id + "/administrators"
    },
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
		status: "inactive"
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

	validation: {
		couresName: {
			required: true,
		},
		description: {
			required: true,
		},
		schoolyearid: {
			required: true,
		},
		status: {
			required: true,
		},
	},
	nonEditable: [
   		"deptid", "schoolyearid"
   	],
    urlRoot: app.serverUrl + "api/courses",

    getCoursePrereqs: function(id) {
    	return this.urlRoot + "/" + id + "/prereqs";
    },
	getCourseTeachersUrl: function(id) {
		return this.urlRoot + "/" + id + "/teachers";
	},
    assignCourseTeacherUrl: function(courseid, teacherid) {
		return this.urlRoot + "/" + courseid + "/teachers/" + teacherid
	},
	unassignCourseTeacherUrl: function(courseid, teacherid) {
		return this.urlRoot + "/" + courseid + "/teachers/" + teacherid
	}
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

    validation: {
		day: {
			required: true,
		},
		startTime: {
			required: true,
		},
		endTime: {
			required: true,
		},
		roomCapacity: {
			required: true,
		},
		roomLocation: {
			required: true,
		},
		classSize: {
			required: true,
		},
		status: {
			required: true,
		},
	},

	nonEditable: [
   		"courseid", "schoolyearid"
   	],
    urlRoot: app.serverUrl + "api/sections",

    getDropStudentUrl: function(sectionid, studentid) {
   		return this.urlRoot + "/students/" + sectionid + "/" + studentid;
    },
    getSearchSectionsUrl: function(schoolid) {
    	return app.serverUrl + "api/search/" + schoolid + "/sections";
    },
	getSectionTeachersUrl: function(id) {
		return this.urlRoot + "/" + id + "/teachers";
	},
   	unassignTeacherUrl: function(sectionid, teacherid) {
   		return this.urlRoot + "/" + sectionid + "/teachers/" + teacherid;
   	},
    inputAttendance: function(sectionid){
    	return this.urlRoot + "/" + sectionid + "/attendance";
    },
    getStudentsEnrolled: function(sectionid){
    	return this.urlRoot + "/" + sectionid + "/students";
    },
    getStudentAttendance: function(id) {
    	return this.urlRoot + "/" + id + "/attendance";
    },
	getStudentGradeForSection: function(sectionid, studentid) {
		return this.urlRoot + "/" + sectionid + "/students/" + studentid;
	},
	assignSectionTeacher: function(sectionid, teacherid) {
		return this.urlRoot + "/" + sectionid + "/teachers/" + teacherid
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

var Count = Backbone.Model.extend({
	getCountUrl: function(usertype) {
		return app.serverUrl + "api/count/" + usertype;
	},
	getSectionCountURL: function(){
		return app.serverUrl + "api/sections/count";
	}
});

var Purge = Backbone.Model.extend({
	urlRoot: app.serverUrl + "api/purge",

	purgeInactive: function() {
		return this.urlRoot + "/inactive";
	},

    purgeWaitlist: function() {
        return this.urlRoot + "/waitlist";
    },

    purgeUsers: function() {
        return this.urlRoot + "/user";
    },

    purgeSchoolYears: function() {
        return this.urlRoot + "/schoolyear";
    },

    purgeSchools: function() {
        return this.urlRoot + "/school";
    },

    purgeDepartments: function() {
        return this.urlRoot + "/department";
    },

    purgeCourses: function() {
        return this.urlRoot + "/course";
    },

    purgeSections: function() {
        return this.urlRoot + "/section";
    },

    purgeDocuments: function() {
        return this.urlRoot + "/document";
    }

	// THESE ARE THE ROUTES
	// $app->post('/purge/attendance', 'purgeAttendance');
	// $app->post('/purge/waitlist', 'purgeWaitlist');
	// $app->post('/purge/user', 'purgeUsers');
	// $app->post('/purge/schoolyear', 'purgeSchoolYears');
	// $app->post('/purge/school', 'purgeSchools');
	// $app->post('/purge/department', 'purgeDepartments');
	// $app->post('/purge/course', 'purgeCourses');
	// $app->post('/purge/section', 'purgeSections');
	// $app->post('/purge/document', 'purgeDocuments');
	// $app->delete('/purge/inactive', 'purgeInactive');

});

var Document = Backbone.Model.extend({
	defaults: {
		docid: "",
		docName: "",
		description: "",
		link: "",
		sectionid: "",
		userid: "",
		fullmark: "",
		schoolyearid: "",
		status: ""
	},

    validation: {
		docName: {
			required: true,
		},
		description: {
			required: true,
		},
		link: {
			required: true,
		}
	},

	urlRoot: app.serverUrl + "api/documents"

});

var Stats = Backbone.Model.extend({
	defaults: {
		age: "",
		city: "",
		gender: "",
		studentCount: "",
		date: "",
		totalAttendance: "",
	},
    urlRoot: app.serverUrl + "api/stats/",

    getGeoStatsUrl: function(schoolid) {
    	return this.urlRoot + "geographic/" + schoolid + "/students";
    },
    getGenderStatsUrl: function(schoolid) {
    	return this.urlRoot + "gender/" + schoolid + "/students";
    },
    getAgeStatsUrl: function(schoolid) {
    	return this.urlRoot + "age/" + schoolid + "/students";
    },
    getAttendanceStatsUrl: function(schoolyearid) {
    	return this.urlRoot + "attendance/" + schoolyearid;
    }
});