var Student = Backbone.Model.extend({
    urlRoot: app.serverUrl + "api/students",

	defaults: {
		userid: "",
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		streetAddr1: "",
		streetAddr2: "",
		city: "",
		province: "",
		country: "",
		postalCode: "",
		phoneNumber: "",
		emailAddr: "",
		gender: "",
		allergies: "",
		prevSchools: "",
		parentFirstName: "",
		parentLastName: "",
		parentPhoneNumber: "",
		parentEmailAddr: "",
		emergencyContactFirstName: "",
		emergencyContactLastName: "",
		emergencyContactRelation: "",
		emergencyContactPhoneNumber: "",
		paid: 0,
		schoolid: "",
		status: "active",
		lastAccessed: ""
	},

	validation: {
		firstName: {
			required: true
		},
		lastName: {
			required: true
		},
		dateOfBirth: {
			required: true
		},
		streetAddr1: {
			required: true
		},
		city: {
			required: true
		},
		province: {
			required: true
		},
		country: {
			required: true
		},
		postalCode: {
			required: true
		},
		phoneNumber: {
			required: true
		},
		emailAddr: [{
			required: true
		}, {
			pattern: "email",
			msg: "Please provide a valid email address."
		}],
		gender: {
			required: true
		},
		parentFirstName: {
			required: true
		},
		parentLastName: {
			required: true
		},
		parentPhoneNumber: {
			required: true
		},
		parentEmailAddr: {
			required: true
		},
		emergencyContactFirstName: {
			required: true,
		},
		emergencyContactLastName: {
			required: true,
		},
		emergencyContactPhoneNumber: {
			required: true
		},
		emergencyContactRelation: {
			required: true
		},
		paid: {
			required: true
		},
		status: {
			required: true
		}
	},

    /** We will assume that a field is required unless otherwise stated below */
   	nonEditable: [
   		"schoolid", "lastAccessed", "userid"
   	],

   	/** Student info properties */
   	studentProperties: [
   		"firstName", "lastName", "dateOfBirth", "phoneNumber", "emailAddr", "allergies",
   		"gender", "prevAttendedGS", "paid", "schoolid", "status", "lastAccessed"
   	],

   	/** Address properties */
   	addressProperties: [
   		"streetAddr1", "streetAddr2", "city", "province", "postalCode", "country"
   	],

   	/** Parent info properties */
   	parentProperties: [
   		"parentFirstName", "parentLastName", "parentPhoneNumber", "parentEmailAddr"
   	],

   	/** Emergency contact properties */
   	emergencyProperties: [
   		"emergencyContactFirstName", "emergencyContactLastName", "emergencyContactRelation", "emergencyContactPhoneNumber"
   	],

   	getEnrolledSectionsUrl: function(id) {
   		return this.urlRoot + "/" + id + "/sections";
   	},

   	getSearchStudentsUrl: function() {
   		return app.serverUrl + "api/search/users/S";
   	},
   	getAdvancedSearchUrl: function() {
   		return app.serverUrl + "api/search/advanced";
   	},

   	getPendingTestsUrl: function(id) {
   		return this.urlRoot + "/" + id + "/tests";
   	},

   	updatePendingUrl: function() {
   		return this.urlRoot + "/pending";
   	},

   	enrollStudentInSections: function(id) {
   		return this.urlRoot + "/" + id + "/sections";
   	},

   	getPrevEnrolledSections: function(id) {
   		return this.urlRoot + "/" + id + "/prevSections";
   	},

   	getAttendanceUrl: function(id) {
   		return this.urlRoot + "/" + id + "/attendance";
   	},

   	studentStatuses: [
   		"active",
   		"inactive",
   		"pending",
   		"pending-test"
   	]
});

var Teacher = Backbone.Model.extend({
	defaults: {
		userid: "",
		firstName: "",
		lastName: "",
		emailAddr: "",
		schoolid: "",
		status: "",
		usertype: "",
		lastAccessed: ""
	},

	validation: {
		firstName: {
			required: true
		},
		lastName: {
			required: true
		},
		emailAddr: [{
			required: true
		}, {
			pattern: "email",
			msg: "Please provide a valid email address."
		}],
		status: {
			required: true
		}
	},

	nonEditable: [
   		"schoolid", "lastAccessed", "userid", "usertype"
   	],

    urlRoot: app.serverUrl + "api/teachers",
    admin_urlRoot: app.serverUrl + "api/administrators",

   	getSearchTeachersUrl: function(usertype) {
   		usertype = usertype || "T";
   		return app.serverUrl + "api/search/users/" + usertype;
   	},

   	getTeachingSectionsUrl: function(id) {
   		return this.urlRoot + "/" + id + "/sections";
   	},

   	getCourseCompetencyUrl: function(id) {
   		return this.urlRoot + "/" + id + "/competency";
   	},

   	addCourseCompetencyUrl: function(id) {
   		return this.urlRoot + "/" + id;
   	},
   	teacherStatuses:[
   		"active",
   		"inactive"
   	]
});

var Superuser = Backbone.Model.extend({
	defaults: {
		userid: "",
		firstName: "",
		lastName: "",
		emailAddr: "",
		status: "",
		lastAccessed: ""
	},

	validation: {
		firstName: {
			required: true
		},
		lastName: {
			required: true
		},
		emailAddr: [{
			required: true
		}, {
			pattern: "email",
			msg: "Please provide a valid email address."
		}],
		status: {
			required: true
		}
	},
	nonEditable: [
   		"lastAccessed", "userid"
   	],

    urlRoot: app.serverUrl + "api/superusers",
});

var User = Backbone.Model.extend({
	defaults: {
		username: "",
		password: ""
	},

	validation: {
		username: {
			required: true,
			msg: "Please enter a username"
		},
		password: {
			required: true,
			msg: "Please enter a password"
		}
	},

    urlRoot: app.serverUrl + "api/login",

   	getUsers: function(id, usertype) {
   		if (typeof id == undefined || typeof usertype == undefined) {
   			return undefined;
   		}
   		return app.serverUrl + "api/users/" + id + "/" + usertype;
   	},

   	getUserByEmail: function(email) {
   		return app.serverUrl + "api/users/" + email;
   	}
});