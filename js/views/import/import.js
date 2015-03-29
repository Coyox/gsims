var ImportView = Backbone.View.extend({
	initialize: function(options) {
		this.render();

	},

	render: function() {
		this.$el.html(html["import.html"]);
	},

	events: {
		"click #import": "parseData",
		"click #downloadAttendance": "constructCSV"
	},
	constructCSV: function(){
		var teacherid = (JSON.parse(sessionStorage.getItem("gobind-user"))).userid;
		var sectionid = 777778; // TODO
		var dataRows = [["Enter Date Below(YYYY-MM-DD)", "Teacher ID", "Section ID"], ["", teacherid, sectionid], ["Student ID", "First Name", "Last Name", "Present as P"]];
		var csvContent = "data:text/csv;charset=utf-8,";
		var section = new Section();
		section.fetch({
			url: section.getStudentsEnrolled(sectionid),
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Student(object, {parse:true});
				var student = [model.get("userid"), model.get("firstName"), model.get("lastName")];
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
	parseData: function() {
		try{
			var view = this;
			var results = Papa.parse($("#csv-file")[0].files[0], {
				header: true,
				complete: function(results) {
					$("#not-found").hide();
					console.log(results);
					
					// STUDENT
					if (results.data[0].city) {
						var studentList = [];
						var valid = true;
						$.each(results.data, function(i, row) {
							var student = new Student(row, {parse:true});
							var isValid = student.isValid(true);
							var validate = student.validate();
							if (!student.isValid()) {
								valid = false;
								console.log("invalid", validate);
							}
							studentList.push(student.toJSON());
						});
						if (valid) {
							// insert
						} else {
							// display a message
						}
						console.log("list of students", studentList);
					} 
					// TEACHER
					else if (results.data[0].schoolid) {
						$.each(results.data, function(i, row) {
							var teacher = new Teacher(row, {parse:true});
							console.log(teacher.toJSON());
						});
					}
					// ATTENDANCE
					else {

						var attendancedate = results.data[1][0];
						var teacherid = results.data[1][1];
						var sectionid = results.data[1][2];
						var studentids = [];

						for (i = 3; i < results.data.length; i++) {
							if (results.data[i][3] && results.data[i][3].indexOf("P") > -1){
								studentids.push(results.data[i][0]);
							}
						}
						if (studentids.length > 0){
							var section = new Section();
							$.ajax({
								type: "POST",
								url: section.inputAttendance(sectionid),
								data: {
									date: attendancedate,
									schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
									userids: JSON.stringify(studentids)
								}
							}).then(function(data) {
								try {
									if (typeof data == "string") {
										data = JSON.parse(data);
									}

									if (data.status == "success"){
										new TransactionResponseView({
											title: "SUCCESS",
											message: "Template CSV successfully imported!",
										});
									}
									else {
										new TransactionResponseView({
											title: "ERROR",
											status: "Error",
											message: "Sorry, we could not import your CSV. Please make sure the CSV matches the template's format."
										});
									}
								}
								catch(err){
									new TransactionResponseView({
										title: "ERROR",
										status: "Error",
										message: "Sorry, we could not import your CSV. Please make sure you are not importing more than once for the same file."
									});
								}
							}).fail(function(jqxhr){
								new TransactionResponseView({
									title: "ERROR",
									status: "Error",
									message: "Sorry, we could not import your CSV. Please make sure that the CSV matches the template's format"
								});
							});
						}


					}
				}
			});
} catch(err){
	this.$el.find("#not-found").removeClass("hide").show();
}
},
});

