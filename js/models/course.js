var Course = Backbone.Model.extend({
	defaults: {
		courseName: "",
		description: "",
		deptid: "",
		schoolyearid:"",
		status: ""
	},

	validation: {
		courseName: {
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

	courseStatuses: [
		"active", "inactive"
	],

    urlRoot: app.serverUrl + "api/courses",

    getCoursePrereqs: function(id) {
    	return this.urlRoot + "/" + id + "/prereqs";
    },

	getCourseTeachersUrl: function(id) {
		return this.urlRoot + "/" + id + "/teachers";
	},

    assignCourseTeacherUrl: function(courseid, teacherid) {
		return this.urlRoot + "/" + courseid + "/teachers/" + teacherid;
	},

	unassignCourseTeacherUrl: function(courseid, teacherid) {
		return this.urlRoot + "/" + courseid + "/teachers/" + teacherid;
	},

	addCoursePrereqs: function(id) {
		return this.urlRoot + "/" + id + "/prereqs";
	},

	deleteCoursePrereq: function(cid, pid) {
		return this.urlRoot + "/" + cid + "/prereqs/" + pid;
	},

    getCourseWaitlist: function(cid) {
		return this.urlRoot + "/" + cid + "/waitlist";
	}
});

var Prereq = Backbone.Model.extend({
	defaults: {
		courseid: "",
		prereq: ""
	}
});
