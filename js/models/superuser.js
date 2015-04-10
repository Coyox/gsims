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
   		"lastAccessed", "userid", "status"
   	],

    urlRoot: app.serverUrl + "api/superusers",
});
