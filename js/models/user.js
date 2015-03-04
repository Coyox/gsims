var Student = Backbone.Model.extend({
	defaults: {
		datefyouOBirth: "",
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
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/students",
});

var Teacher = Backbone.Model.extend({
	defaults: {
		emailAddr: "",
		schoolid: "",
		paid: "",
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/teachers",
});

var Administrator = Backbone.Model.extend({
	defaults: {
		emailAddr: "",
		schoolid: "",
		paid: "",
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/admins",
});

var Superuser = Backbone.Model.extend({
	defaults: {
		emailAddr: "",
		status: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/superusers",
});