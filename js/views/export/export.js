/**
 *	View to display the export page.
 */
var ExportView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["export.html"]);
	},

	events: {
		"click #exportStudents": "exportStudents",
		"click #exportTeachers": "exportTeachers",
		"click #exportAdmins": "exportAdmins",
		"click #exportSections": "exportSections",
	},

	/**
	 *	Downloads all sections as a CSV
	 */
	exportSections: function(){
		var schoolid = this.$el.find("#schoolid option:selected").attr("id");
		var dataRows = [["sectionid", "courseid", "courseName", "sectionCode", "day", "startTime", "endTime", "roomCapacity", "roomLocation", "classSize", "status"]];

		var csvContent = "data:text/csv;charset=utf-8,";
		var section = new Section();
		section.fetch({
			data: {
				schoolid: schoolid,
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
			},
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Section(object, {parse:true});
				var section = [model.get("sectionid"), model.get("courseid"), model.get("courseName"), model.get("sectionCode"), model.get("day"), model.get("startTime"), model.get("endTime"), model.get("roomCapacity"), model.get("roomLocation"), model.get("classSize"), model.get("status")];
				dataRows.push(section);
			});
			dataRows.forEach(function(lineArray, index){
				var temp = lineArray[4];
   				lineArray[4] = "TEMP"; // course days
   				temp = temp.replace(/,/g , " ");
   				lineArray = lineArray.join(",");
   				lineArray = lineArray.replace("TEMP", temp);
   				csvContent += index < dataRows.length ? lineArray+ "\n" : lineArray;
   			});
			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "sections.csv");
			link.click();
		});
	},

	/**
	 *	Downloads all admins as a CSV
	 */
	exportAdmins: function(){
		var schoolid = this.$el.find("#schoolid option:selected").attr("id");
		var dataRows = [["userid", "schoolid", "firstName", "lastName", "emailAddr", "status", "usertype"]];

		var csvContent = "data:text/csv;charset=utf-8,";
		var school = new School();
		school.fetch({
			url: school.getAdminsUrl(schoolid),
		}).then(function(data) {
			_.each(data, function(object, index) {
				var admin = $.map(object, function(element) { return element; });
				dataRows.push(admin);
			});
			dataRows.forEach(function(lineArray, index){
				dataString = lineArray.join(",");
				csvContent += index < dataRows.length ? dataString+ "\n" : dataString;
			});
			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "admins.csv");
			link.click();
		});
	},

	/**
	 *	Downloads all teachers as a CSV
	 */
	exportTeachers: function(){
		var schoolid = this.$el.find("#schoolid option:selected").attr("id");
		var dataRows = [["userid", "schoolid", "firstName", "lastName", "emailAddr", "status", "usertype"]];

		var csvContent = "data:text/csv;charset=utf-8,";
		var school = new School();
		school.fetch({
			url: school.getTeachersUrl(schoolid),
		}).then(function(data) {
			_.each(data, function(object, index) {
				var teacher = $.map(object, function(element) { return element; });
				dataRows.push(teacher);
			});
			dataRows.forEach(function(lineArray, index){
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

	/**
	 *	Downloads all students as a CSV
	 */
	exportStudents: function(){
		var schoolid = this.$el.find("#schoolid option:selected").attr("id");
		var dataRows = [["userid", "firstName", "lastName", "dateOfBirth", "gender", "streetAddr1"," streetAddr2", "city",
		"province, country", "postalCode", "phoneNumber", "emailAddr", "allergies", "prevSchools", "parentFirstName", "parentLastName",
		"parentPhoneNumber", "parentEmailAddr", "emergencyContactFirstName", "emergencyContactLastName", "emergencyContactRelation",
		"emergencyContactPhoneNumber", "schoolid", "paid", "status"]];

		var csvContent = "data:text/csv;charset=utf-8,";
		var school = new School();
		school.fetch({
			url: school.getStudentsUrl(schoolid),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
			}
		}).then(function(data) {
			_.each(data, function(object, index) {
				var student = $.map(object, function(element) { return element; });
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
			link.setAttribute("download", "students.csv");
			link.click();
		});
	},
});

