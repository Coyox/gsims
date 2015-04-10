var School = Backbone.Model.extend({
	defaults: {
		location: "",
		postalCode: "",
		yearOpened: "",
		status: "inactive"
	},

    validation: {
		location: {
			required: true,
		},
		postalCode: {
			required: true,
		},
		yearOpened: {
			required: true,
		}
	},

    urlRoot: app.serverUrl + "api/schools",

    getSchoolsUrl: function(){
    	return this.urlRoot;
    },

    getDepartmentsUrl: function(id) {
   		return this.urlRoot + "/" + id + "/departments";
    },
    
    getStudentsUrl: function(id){
    	return this.urlRoot + "/" + id + "/students";
    },
    
    getTeachersUrl: function(id){
    	return this.urlRoot + "/" + id + "/teachers";
    },
    
    getAdminsUrl: function(id){
    	return this.urlRoot + "/" + id + "/administrators";
    }
});