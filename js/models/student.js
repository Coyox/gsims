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