var Student = Backbone.Model.extend({
	defaults: {
		userid: "",
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		gender: "",
		streetAddr1: "",
		streetAddr2: "",
		city: "",
		province: "",
		country: "",
		postalCode: "",
		phoneNumber: "",
		emailAddr: "",
		allergies: "",
		prevSchools: "",
		parentFirstName: "",
		parentLastName: "",
		parentPhoneNumber: "",
		parentEmailAddr: "",
		emergencyFirstName: "",
		emergencytLastName: "",
		emergencyContactRelation: "",
		emergencyContactPhoneNumber: "",
		schoolid: "",
		paid: "",
		status: "",
		lastAccessed: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/students",
});

var Teacher = Backbone.Model.extend({
	defaults: {
		emailAddr: "",
		schoolid: "",
		paid: "",
		status: "",
		usertype: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/teachers",
});

var Superuser = Backbone.Model.extend({
	defaults: {
		emailAddr: "",
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/superusers",
});

var User = Backbone.Model.extend({
	defaults: {
	},

    urlRoot: "http://gobind-sarvar.rhcloud.com/api/login",
});