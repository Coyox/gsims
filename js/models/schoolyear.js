var SchoolYear = Backbone.Model.extend({
	defaults: {
		schoolyear: "",
		status: "inactive",
		openForReg: 0
	},

	validation: {
		schoolyear: {
			required: true,
		}
	},

	urlRoot: app.serverUrl + "api/schoolyears",

	getActiveSchoolYearUrl: function() {
		return this.urlRoot + "/active";
	},

	updateRegistrationUrl: function(id) {
		return this.urlRoot + "/reg/" + id;
	},

	updateActiveYearUrl: function(id) {
		return this.urlRoot + "/active/" + id;
	}
});
