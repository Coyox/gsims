var User = Backbone.Model.extend({
	defaults: {
		username: "",
		password: "",
		password2: "",
	},
	
	validation: {
    	password2: {
    		required: function(value, attr, computedState) {
        		if (computedState.login){
        			return false;
        		}
        		return true;
      		},
      		equalTo: "password",
      		msg: "The passwords must match.",
      		minLength: 6
    	},
    	password2: {
    		required: function(value, attr, computedState) {
        		if (computedState.login){
        			return false;
        		}
        		return true;
      		},
      		minLength: 6,
      		msg: "Password must be at least 6 characters"
    	},
  	},

    urlRoot: app.serverUrl + "api/login",

   	getUsers: function(id, usertype) {
   		return app.serverUrl + "api/users/" + id + "/" + usertype;
   	},

   	getUserByEmail: function(email) {
   		return app.serverUrl + "api/users/" + email;
   	}
});