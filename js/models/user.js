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

   	getSearchStudentsUrl: function(schoolid) {
   		return app.serverUrl + "api/search/" + schoolid + "/users/S";
   	},
   	getAdvancedSearchUrl: function(schoolid) {
   		return app.serverUrl + "api/search/" + schoolid + "/advanced";
   	},

   	getPendingTestsUrl: function(id) {
   		return this.urlRoot + "/" + id + "/tests";
   	},

   	updatePendingUrl: function() {
   		return this.urlRoot + "/pending";
   	},
   	updatePendingTestsUrl: function() {
   		return this.urlRoot + "/pendingTest";
   	},
   	enrollStudentInSections: function(id) {
   		return this.urlRoot + "/" + id + "/sections";
   	},
   	enrollStudentInWaitlists: function(id) {
   		return this.urlRoot + "/" + id + "/waitlists";
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
   		"lastAccessed", "userid", "usertype", "schoolid"
   	],

    urlRoot: app.serverUrl + "api/teachers",
    admin_urlRoot: app.serverUrl + "api/administrators",

   	getSearchTeachersUrl: function(usertype, schoolid) {
   		usertype = usertype || "T";
   		return app.serverUrl + "api/search/" + schoolid + "/users/" + usertype;
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

   	createAdministratorUrl: function()  {
   		return app.serverUrl + "api/administrators";
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
		password: "",
		password2: "",
	},
	 validation: {
    	password2: {
    		required: function(value, attr, computedState) {
        		if (computedState.login){
        			return false;
        		}
        		return true;
      		},
      		equalTo: "password",
      		msg: "The passwords must match.",
      		minLength: 6
    	},
    	password2: {
    		required: function(value, attr, computedState) {
        		if (computedState.login){
        			return false;
        		}
        		return true;
      		},
      		minLength: 6,
      		msg: "Password must be at least 6 characters"
    	},
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