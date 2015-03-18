var Student = Backbone.Model.extend({
    urlRoot: "https://gobind-sarvar.rhcloud.com/api/students",

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
   		return "https://gobind-sarvar.rhcloud.com/api/search/users/S";
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

    urlRoot: "https://gobind-sarvar.rhcloud.com/api/teachers",

   	getSearchTeachersUrl: function(usertype) {
   		console.log(usertype);
   		usertype = usertype || "T";
   		return "https://gobind-sarvar.rhcloud.com/api/search/users/" + usertype;
   	}
});

var Superuser = Backbone.Model.extend({
	defaults: {
		emailAddr: "",
		status: ""
	},
    urlRoot: "https://gobind-sarvar.rhcloud.com/api/superusers",
});

var User = Backbone.Model.extend({
	defaults: {
		username: "",
		password: ""
	},

    urlRoot: "https://gobind-sarvar.rhcloud.com/api/login",
   	getUsers: function(id, usertype) {
   		return "https://gobind-sarvar.rhcloud.com/api/users/" + id + '/' + usertype;
   	}
});