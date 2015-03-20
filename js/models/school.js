var School = Backbone.Model.extend({
	defaults: {
		location: "",
		postalCode: "",
		yearOpened: "",
		status: ""
	},
    urlRoot: "https://gobind-sarvar.rhcloud.com/api/schools",
});

var SchoolYear = Backbone.Model.extend({
	defaults: {
		schoolyear: "",
		status: ""
	},
	urlRoot: "https://gobind-sarvar.rhcloud.com/api/schoolyears"
});

var Dept = Backbone.Model.extend({
	defaults: {
		schoolid: "",
		deptName: "",
		schoolyearid: "",
		status: ""
	},
    urlRoot: "https://gobind-sarvar.rhcloud.com/api/departments",
});

var Course = Backbone.Model.extend({
	defaults: {
		courseName: "",
		description: "",
		deptid: "",
		schoolyearid:"",
		status: ""
	},
    urlRoot: "https://gobind-sarvar.rhcloud.com/api/courses",
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
    urlRoot: "https://gobind-sarvar.rhcloud.com/api/sections",

    getDropStudentUrl: function(sectionid, studentid) {
   		return "https://gobind-sarvar.rhcloud.com/api/sections/students/" + sectionid + "/" + studentid;
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