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