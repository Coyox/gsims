var School = Backbone.Model.extend({
	defaults: {
		location: "",
		postalCode: "",
		yearOpened: "",
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/schools",
});

var Dept = Backbone.Model.extend({
	defaults: {
		schoolid: "",
		deptName: "",
		schoolyearid: "",
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/departments",
});

var Course = Backbone.Model.extend({
	defaults: {
		courseName: "",
		description: "",
		deptid: "",
		schoolyearid:"",
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/courses",
});

var Section = Backbone.Model.extend({
	defaults: {
		courseid: "",
		sectionCode: "",
		day: "",
		time:"",
		roomCapacity: "",
		roomLocation: "",
		classSize: "",
		schoolyearid:"",
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/sections",
});