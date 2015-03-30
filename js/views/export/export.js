var ExportView = Backbone.View.extend({
	initialize: function(options) {
		this.render();

	},

	render: function() {
		this.$el.html(html["export.html"]);
	},

	events: {
		"click #exportStudents": "exportStudents",
		"click #exportTeachers": "exportTeachers"
		//"click #exportAdmins": "exportAdmins"
	},

	exportTeachers: function(){
		var schoolid = 412312; // TODO
		var dataRows = [["userid", "schoolid", "firstName", "lastName", "emailAddr", "status", "usertype"]];

		var csvContent = "data:text/csv;charset=utf-8,";
		var school = new School();
		school.fetch({
			url: school.getTeachersUrl(schoolid),
		}).then(function(data) {
			_.each(data, function(object, index) {
				var teacher = $.map(object, function(element) { return element; });
				dataRows.push(student);
			});
			dataRows.forEach(function(lineArray, index){
				console.log(lineArray);
				dataString = lineArray.join(",");
				csvContent += index < dataRows.length ? dataString+ "\n" : dataString;
			});
			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "teachers.csv");
			link.click();
		});
	},

	exportStudents: function(){
		var schoolid = 412312; // TODO
		var dataRows = [["userid", "firstName", "lastName", "dateOfBirth", "gender", "streetAddr1"," streetAddr2", "city",
    "province, country", "postalCode", "phoneNumber", "emailAddr", "allergies", "prevSchools", "parentFirstName", "parentLastName",
    "parentPhoneNumber", "parentEmailAddr", "emergencyContactFirstName", "emergencyContactLastName", "emergencyContactRelation",
    "emergencyContactPhoneNumber", "schoolid", "paid", "status"]];

		var csvContent = "data:text/csv;charset=utf-8,";
		var school = new School();
		school.fetch({
			url: school.getStudentsUrl(schoolid),
		}).then(function(data) {
			_.each(data, function(object, index) {
				// var model = new Student(object, {parse:true});
				// console.log(model);
				var student = $.map(object, function(element) { return element; });
				// console.log(student);
				dataRows.push(student);
				//var student = ["","","",model.get("userid"), model.get("firstName"), model.get("lastName")];
			});
			dataRows.forEach(function(lineArray, index){
				console.log(lineArray);
				dataString = lineArray.join(",");
				csvContent += index < dataRows.length ? dataString+ "\n" : dataString;
			});
			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "students.csv");
			link.click();
		});
	},
});

