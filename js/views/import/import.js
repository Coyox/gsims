var ImportView = Backbone.View.extend({
	initialize: function(options) {
		this.render();

	},

	render: function() {
		this.$el.html(html["import.html"]);
		this.loadOptions();
	},

	events: {
		"click #import": "parseData",
		"click #downloadAttendance": "constructCSV"
	},

	loadOptions: function(){
		var tid = (JSON.parse(sessionStorage.getItem("gobind-user"))).userid
		var x = document.getElementById("section");
		var teacher = new Teacher();
		teacher.fetch({
			url: teacher.getTeachingSectionsUrl(tid),
		}).then(function(data){
			_.each(data, function(object,index){
				var option = document.createElement("option");
				option.text = object.sectionid;
				x.add(option);
			});
			// Display a message if no options are found
			if ($(x).find("option").length == 0) {
				$(x).append("<option disabled>-- No sections found --</option>");
			}
		});
	},

	constructCSV: function(){
		var teacherid = (JSON.parse(sessionStorage.getItem("gobind-user"))).userid;
		var section = this.$el.find("#section").val();
		console.log(section);
		//var sectionid = 777778; // TODO
		var sectionid = section;

		var dataRows = [["date", "teacherid", "sectionid","studentid","firstName","lastName","present"]];
		var csvContent = "data:text/csv;charset=utf-8,";
		var section = new Section();
		section.fetch({
			url: section.getStudentsEnrolled(sectionid),
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Student(object, {parse:true});
				if (index == 0){
					dataRows.push(["", teacherid, sectionid, model.get("userid"), model.get("firstName"), model.get("lastName")]);
					return true;
				}
				var student = ["","","",model.get("userid"), model.get("firstName"), model.get("lastName")];
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
							if (i==0) {
								return true;
							}
							var student = new Student(row, {parse:true});
							console.log(row);
							var isValid = student.isValid(true);
							var validate = student.validate();
							if (!student.isValid()) {
								valid = false;
								console.log("invalid", validate);
							}
							studentList.push(student.toJSON());
						});
						if (valid) {
							var studentmodel = new Student();
							$.ajax({
								type: "POST",
								url: studentmodel.urlRoot,
								data: {
									students: JSON.stringify(studentList)
								}
							}).then(function(data) {
								try {
									if (typeof data == "string") {
										data = JSON.parse(data);
									}
									if (data.status=="success") {
										new TransactionResponseView({
											message: "All students have been created and imported successfully. Students imported with an active status will receive an email with their login informations shortly"
													+ "<br><br> List of added students <br> " + data.userids

										});
									}
									else {
										new TransactionResponseView({
											title: "ERROR",
											status: "error",
											message: "Sorry, we could not import your CSV - failed to import one or more new students"
										});
									}
								}
								catch(err){
									new TransactionResponseView({
										title: "ERROR",
										status: "Error",
										message: "Sorry, we could not import your CSV."
									});
								}
							}).fail(function(data) {
								new TransactionResponseView({
									title: "ERROR",
									status: "error",
									message: "Sorry, we could not import your CSV - failed to import one or more new students"
								});
							});
						} else {
							new TransactionResponseView({
								title: "ERROR",
								status: "Error",
								message: "Sorry, we could not import your CSV - one or more required fields are invalid. Please make sure your CSV doesn't end with a new line. Remove any quotes as well."
							});
						}

						console.log("list of students", studentList);
					}
					// TEACHER/Admin
					else if (results.data[0].schoolid) {
						$.each(results.data, function(i, row) {
							var teacher = new Teacher(row, {parse:true});
							console.log(teacher.toJSON());
						});
						var teacherList = [];
						var adminList = [];
						var valid = true;
						$.each(results.data, function(i, row) {
							if (i==0) {
								return true;
							}
							var teacher = new Teacher(row, {parse:true});
							console.log(row);
							var isValid = teacher.isValid(true);
							var validate = teacher.validate();
							if (!teacher.isValid()) {
								valid = false;
							}
							if (teacher.get("usertype") == "T"){
								teacherList.push(teacher.toJSON());
							}
							else if (teacher.get("usertype") == "A"){
								adminList.push(teacher.toJSON());
							}
							else {
								valid = false;
							}
						});
						if (valid) {
							var teachermodel = new Teacher();
							var twoQueries = 0;
							if (teacherList.length > 0 && adminList.length > 0 ){
								twoQueries = 1;
								var list = teacherList;
								var modelurl = teachermodel.urlRoot;
							}
							else {
								var list = (teacherList.length > 0) ? teacherList : adminList;
								var modelurl = (teacherList.length > 0 ) ? teachermodel.urlRoot : teachermodel.admin_urlRoot;
							}
							$.ajax({
								type: "POST",
								url: modelurl,
								data: {
									teachers: JSON.stringify(list)
								}
							}).then(function(data) {
								try {
									if (typeof data == "string") {
										data = JSON.parse(data);
									}
									if (data.status=="success") {
										if (twoQueries == 1) {
											$.ajax({
												type: "POST",
												url: teachermodel.admin_urlRoot,
												data: {
													administrators: JSON.stringify(adminList)
												}
											}).then(function(data) {
												if (typeof data == "string") {
													data = JSON.parse(data);
												}
												if (data.status=="success") {
													new TransactionResponseView({
														message: "All teachers and administrators have been created and imported successfully. Teachers imported with an active status will receive an email with their login informations shortly"
																  + "<br><br> List of added userids: <br> " + data.userids
													});
												}
												else {
													new TransactionResponseView({
														title: "ERROR",
														status: "error",
														message: "Sorry, we could not import your CSV - failed to import one or more new teachers/administrators"
													});
												}
											}).fail(function(data) {
												new TransactionResponseView({
													title: "ERROR",
													status: "error",
													message: "Sorry, we could not import your CSV - failed to import one or more new teachers"
												});
											});
										}
									}
									else {
										new TransactionResponseView({
											title: "ERROR",
											status: "Error",
											message: "Sorry, we could not import your CSV - one or more required fields are invalid. Please make sure your CSV doesn't end with a new line. Remove any quotes as well."
										});
									}
									console.log("list of teachers", teacherList);
									console.log("list of administrators", adminList);
								}
								catch(err){
									console.log(err);
									new TransactionResponseView({
										title: "ERROR",
										status: "Error",
										message: "Sorry, we could not import your CSV."
									});
								}
							}).fail(function(data) {
								new TransactionResponseView({
									title: "ERROR",
									status: "error",
									message: "Sorry, we could not import your CSV - failed to import one or more new teachers"
								});
							});
						}
						else {
							new TransactionResponseView({
								title: "ERROR",
								status: "Error",
								message: "Sorry, we could not import your CSV - one or more required fields are invalid. Please make sure your CSV doesn't end with a new line. Remove any quotes as well."
							});
						}


					}
					// ATTENDANCE
					else {

						var studentids = [];

							var attendancedate = results.data[0].date;
							var teacherid =  results.data[0].teacherid;
							var sectionid =  results.data[0].sectionid;

						$.each(results.data, function(i, row) {
							if (i==0 || i==1) {	return true; }
							if (row.studentid && row.present == "P"){
								studentids.push(row.studentid);
								console.log(row.studentid);
							}
						});
						var section = new Section();
						console.log(sectionid);
						console.log(section.getStudentsEnrolled(sectionid));
						$.ajax({
							type: "GET",
							url: section.getStudentsEnrolled(sectionid)
						}).then(function(data) {
							var ids = [];
							_.each(data, function(row, index) {
								ids.push(row.userid);
							});
							_.each(studentids, function(student, index){
								//if inputted student id is not enrolled in the section
								if (ids.indexOf(student) == -1) {
									studentids.splice(index, 1);
								}
							});

							studentids.push(teacherid);
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
									console.log(typeof data);
									if (typeof data == "string") {
										data = JSON.parse(data);
									}

									if (data.status == "success"){
										new TransactionResponseView({
											title: "SUCCESS",
											message: "Template CSV successfully imported! Attendance for the following users have been inputted:<br><br>" + data.userids
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
									console.log(err);
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

						});

					}
				}
			});
		}
		catch(err){
			this.$el.find("#not-found").removeClass("hide").show();
		}
	},



});



