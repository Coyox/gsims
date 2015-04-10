var Key = Backbone.Model.extend({
	urlRoot: app.serverUrl + "api/keys/",

	getKeyByName: function(name){
		return this.urlRoot + name;
	}
});

var Count = Backbone.Model.extend({
	getCountUrl: function(usertype) {
		return app.serverUrl + "api/count/" + usertype;
	},
	
	getSectionCountURL: function(){
		return app.serverUrl + "api/sections/count";
	}
});

var Purge = Backbone.Model.extend({
	urlRoot: app.serverUrl + "api/purge",

	purgeInactive: function() {
		return this.urlRoot + "/inactive";
	},

    purgeWaitlist: function() {
        return this.urlRoot + "/waitlist";
    },

    purgeUsers: function() {
        return this.urlRoot + "/user";
    },

    purgeSchoolYears: function() {
        return this.urlRoot + "/schoolyear";
    },

    purgeSchools: function() {
        return this.urlRoot + "/school";
    },

    purgeDepartments: function() {
        return this.urlRoot + "/department";
    },

    purgeCourses: function() {
        return this.urlRoot + "/course";
    },

    purgeSections: function() {
        return this.urlRoot + "/section";
    },

    purgeDocuments: function() {
        return this.urlRoot + "/document";
    }
});

var Stats = Backbone.Model.extend({
    defaults: {
        age: "",
        city: "",
        gender: "",
        studentCount: "",
        date: "",
        totalAttendance: "",
    },

    urlRoot: app.serverUrl + "api/stats/",

    getGeoStatsUrl: function(schoolid) {
        return this.urlRoot + "geographic/" + schoolid + "/students";
    },
    
    getGenderStatsUrl: function(schoolid) {
        return this.urlRoot + "gender/" + schoolid + "/students";
    },
    
    getAgeStatsUrl: function(schoolid) {
        return this.urlRoot + "age/" + schoolid + "/students";
    },
    
    getAttendanceStatsUrl: function(schoolid) {
        return this.urlRoot + "attendance/" + schoolid;
    }
});

var Notif = Backbone.Model.extend({
    urlRoot: app.serverUrl + "api/notif",

    missingInputAttendance: function() {
        return this.urlRoot + "/missingInputAttendance";
    }
})