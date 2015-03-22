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
		allergies: false,
		prevAttendedGS: false,
		parentFirstName: "",
		parentLastName: "",
		parentPhoneNumber: "",
		parentEmailAddr: "",
		emergencyContactFirstName: "",
		emergencyContactLastName: "",
		emergencyContactRelation: "",
		emergencyContactPhoneNumber: "",
		paid: false,
		schoolid: "",
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
		}
	},

    /** We will assume that a field is required unless otherwise stated below */
    required: [
    	"allergies", "prevAttendedGS", "streetAddr2"
    ],

    /** We will assume that a field is required unless otherwise stated below */
   	nonEditable: [
   		"paid", "schoolid", "status", "lastAccessed", "userid"
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
   	}
});

var Teacher = Backbone.Model.extend({
	defaults: {
		emailAddr: "",
		schoolid: "",
		paid: "",
		status: "",
		usertype: ""
	},

    urlRoot: app.serverUrl + "api/teachers",

   	getSearchTeachersUrl: function(usertype) {
   		usertype = usertype || "T";
   		return app.serverUrl + "api/search/users/" + usertype;
   	}
});

var Superuser = Backbone.Model.extend({
	defaults: {
		emailAddr: "",
		status: ""
	},
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
   	}
});