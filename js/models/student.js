var Student = Backbone.Model.extend({
	defaults: {
		dateOfBirth: "",
		addressOne: "",
		addressTwo: "",
		city: "",
		stateOrProvince: "",
		country: "",
		zipCode: "",
		phoneNumber: "",
		email: "",
		allergies: "",
		previousSchools: "",
		parentFirstName: "",
		parentLastName: "",
		parentPhoneNumber: "",
		parentEmail: "",
		emergencyFirstName: "",
		emergencyLastName: "",
		emergencyRelation: "",
		emergencyPhoneNumber: ""
	},
    urlRoot: "http://gobind-sarvar.rhcloud.com/api/students",
});