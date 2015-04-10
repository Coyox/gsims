var Dept = Backbone.Model.extend({
	defaults: {
		schoolid: "",
		deptName: "",
		schoolyearid: "",
		status: "active"
	},

    urlRoot: app.serverUrl + "api/departments",

    getCoursesUrl: function(id) {
    	return this.urlRoot + "/" + id + "/courses";
    },

    deleteDepartment: function(id) {
    	return this.urlRoot + "/" + id;
    }
});
