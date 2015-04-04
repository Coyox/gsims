var SearchSectionsView = Backbone.View.extend({
	initialize: function(options) {
		this.redirect = options.redirect;
		this.sectionid = options.sectionid;
		this.render();
	},

	render: function() {
		this.$el.html(html["searchSections.html"]);
	},

	events: {
		"click #search-sections": "searchSections",
		"click #clear-fields": "clearFields"
	},

	searchSections: function(evt) {
		// var view = this;
		// var data = {};

		// var firstName = this.$el.find("#first-name").val();
		// if (firstName != "") {
		// 	data.firstName = firstName;
		// }

		// var lastName = this.$el.find("#last-name").val();
		// if (lastName != "") {
		// 	data.lastName = lastName;
		// }

		// var mGender = this.$el.find("#gender-options input[value='M']");
		// if (mGender.is(":checked")) {
		// 	data.gender = "M";
		// }

		// var fGender = this.$el.find("#gender-options input[value='F']");
		// if (fGender.is(":checked")) {
		// 	data.gender = "F";
		// }

		// var paid = this.$el.find("#paid-options input[value='1']");
		// if (paid.is(":checked")) {
		// 	data.paid = "1";
		// }

		// var unpaid = this.$el.find("#paid-options input[value='0']");
		// if (unpaid.is(":checked")) {
		// 	data.paid = "0";
		// }

		// var status = this.$el.find("#status-options option:selected");
		// if (!status.is(":disabled")) {
		// 	data.status = status.val();
		// }

		// var yearop = this.$el.find("#year-operator option:selected");
		// if (!yearop.is(":disabled")) {
		// 	var value = yearop.val();
		// 	data.yearop = value;

		// 	if (value == "between") {
		// 		data.lowerYear = this.$el.find(".lower").val();
		// 		data.upperYear = this.$el.find(".upper").val();
		// 	} else {
		// 		data.year = this.$el.find("#year-option option:selected").val();
		// 	}
		// }

		// var city = this.$el.find("#city").val();
		// if (city != "") {
		// 	data.city = city;
		// }

		// var student = new Student();
		// student.fetch({
		// 	url: student.getSearchStudentsUrl(sessionStorage.getItem("gobind-schoolid")),
		// 	data: data
		// }).then(function(data) {
		// 	view.changeRoute(data);
		// });
	},
	changeRoute: function(data) {
		// if (this.redirect == false) {
		// 	var view = new AddTableView({
		// 		el: this.$el,
		// 		results: data,
		// 		sectionid: this.sectionid
		// 	});
		// } else {
		// 	app.Router.navigate("students/search");
		// 	var view = new StudentsTableView({
		// 		el: $("#content"),
		// 		results: data
		// 	});
		// }
	},

	clearFields: function() {
		var parent = this.$el.find("#filter-students-container");
		parent.find("input[type='text']").val("");
		parent.find("select").prop("selectedIndex", 0);
	},
});




function storeContent() {
	$("#content").children().detach().appendTo($("#hidden"));
}