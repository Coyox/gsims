var ExportView = Backbone.View.extend({
	initialize: function(options) {
		this.render();

	},

	render: function() {
		this.$el.html(html["export.html"]);
	},

	events: {
		"click #exportStudents": "constructCSV"
	},
	constructCSV: function(){
		var teacherid = (JSON.parse(sessionStorage.getItem("gobind-user"))).userid;
		var schoolid = 412312; // TODO
		var dataRows = [["schoolid","status","paid","firstName","lastName","dateOfBirth","gender","streetAddr1","streetAddr2","city","province","country","postalCode","phoneNumber","emailAddr","allergies","prevAttendedGS","parentFirstName","parentLastName","parentPhoneNumber","parentEmailAddr","emergencyContactFirstName","emergencyContactLastName","emergencyContactRelation","emergencyContactPhoneNumber"]];

		var csvContent = "data:text/csv;charset=utf-8,";
		var school = new School();
		school.fetch({
			url: section.getStudentsUrl(schoolid),
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Student(object, {parse:true});
				var student = $.map(model, function(element) { return element; });
				dataRows.push(student);
				//var student = ["","","",model.get("userid"), model.get("firstName"), model.get("lastName")];
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
			link.setAttribute("download", "import_attendance.csv");
			link.click();
		});
	},
});

