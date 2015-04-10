var Document = Backbone.Model.extend({
	defaults: {
		docid: "",
		docName: "",
		description: "",
		link: "",
		sectionid: "",
		userid: "",
		fullmark: "",
		schoolyearid: "",
		status: ""
	},

    validation: {
		docName: {
			required: true,
		},
		description: {
			required: true,
		},
		link: {
			required: true,
		}
	},

	urlRoot: app.serverUrl + "api/documents",

	inputMarks: function(id) {
		return this.urlRoot + "/" + id + "/marks";
	},

	getMarks: function(id) {
		return this.urlRoot + "/" + id + "/marks";
	},

	updateMarks: function(id) {
		return this.urlRoot + "/" + id + "/marks";
	}
});