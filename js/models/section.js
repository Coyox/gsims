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
		sectionCode: {
			required: true
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
		return this.urlRoot + "/" + sectionid + "/teachers/" + teacherid;
	},
	
	getSectionDates: function(id) {
		return this.urlRoot + "/" + id + "/dates";
	},
	
	getSectionAttendance: function(id) {
		return this.urlRoot + "/" + id + "/attendance";
	},
	
	getStudentCount: function(id) {
		return this.urlRoot + "/" + id + "/count";
	},

    getSectionById: function(id)  {
        return this.urlRoot + "/" + id;
    },

    enrollStudent: function(id, sid)   {
        return this.urlRoot + "/students/" + id + "/" + sid;
    }
});
