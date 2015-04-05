var DashboardView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		var template = html["dashboard.html"];
		var usertype = sessionStorage.getItem("gobind-usertype");
		template = template({
			usertype: usertype
		});
		this.$el.html(template);

		// User info (all users)
		this.populateUser();

		// School statistics and notification management
		if (usertype == "SU" || usertype == "A") {
			this.populateStats();
			this.populateNotifications();
		}

		if (usertype == "SU" || usertype == "A" || usertype == "T") {
			this.calendarWidget(usertype);
		}

		if (usertype == "SU") {
			this.studentGeoGraph();
			this.studentGenderGraph();
			this.studentAgeGraph();
			this.attendanceCalendar();
		}
	},

	events: {
		"click .view-notification": "viewNotification"
	},

	viewNotification: function() {
		app.Router.navigate("notifications", {trigger:true});
	},

	populateNotifications: function() {
		this.$el.find("#pending-notifications").removeClass("hide").show();

		var view = this;
		var count = new Count();
		count.fetch({
			url: count.getCountUrl("S"),
			data: {
				status: "pending",
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {
			var parent = view.$el.find("#pending-stats");
			parent.find(".count").text(data);
			if (data != "0") {
				parent.find(".alert").removeClass("alert-success").addClass("alert-danger");
			} else {
				parent.find(".alert").removeClass("alert-danger").addClass("alert-success");
			}
		});
		count.fetch({
			url: count.getCountUrl("S"),
			data: {
				status: "pending-test",
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {
			var parent = view.$el.find("#pending-test-stats");
			parent.find(".count").text(data);
			if (data != "0") {
				parent.find(".alert").removeClass("alert-success").addClass("alert-danger");
			} else {
				parent.find(".alert").removeClass("alert-danger").addClass("alert-success");
			}
		});
	},

	populateUser: function() {
		var parent = this.$el.find("#user-panel");
		var object = JSON.parse(sessionStorage.getItem("gobind-login"));
		parent.find(".username").text(sessionStorage.getItem("gobind-username"));
		parent.find(".last-logged-in").text(object.lastLogin);
	},

	populateStats: function() {
		var parent = this.$el.find("#stats-panel");
		var count = new Count();
		count.fetch({
			url: count.getCountUrl("S"),
			data: {
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {
			parent.find(".students").text(data);
		});
		count.fetch({
			url: count.getCountUrl("T"),
			data: {
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {
			parent.find(".teachers").text(data);
		});
		count.fetch({
			url: count.getCountUrl("A"),
			data: {
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {
			parent.find(".administrators").text(data);
		});
		count.fetch({
			url: count.getCountUrl("SU"),
			data: {
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {
			parent.find(".superusers").text(data);
		});
		count.fetch({
			url: count.getSectionCountURL(),
			data: {
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear"),
				schoolid: sessionStorage.getItem("gobind-schoolid")
			}
		}).then(function(data) {
			parent.find(".sections").text(data);
		});
	},

	calendarWidget: function(usertype) {
		var view = this;
		var mon = [], tue = [], wed = [], thu = [], fri = [], sat = [], sun = [];

		if (usertype == "T") {
			var user = JSON.parse(sessionStorage.getItem("gobind-user"));
			var userid = user.userid;
			var teacher = new Teacher();
			teacher.fetch({
				url: teacher.getTeachingSectionsUrl(userid)
			}).then(function(data){
				// Get all sections
				_.each(data, function(section, index) {
				// Get all days for a section
				var days = section.day.split(",");
				_.each(days, function(day, index) {
					var obj = {
						start: section.startTime,
						end: section.endTime,
						courseName: section.courseName,
					};
					switch (day) {
						case "MON":
						mon.push(obj);
						break;
						case "TUE":
						tue.push(obj);
						break;
						case "WED":
						wed.push(obj);
						break;
						case "THU":
						thu.push(obj);
						break;
						case "FRI":
						fri.push(obj);
						break;
						case "SAT":
						sat.push(obj);
						break;
						case "SUN":
						sun.push(obj);
						break;
						default:
						break;
					}
				});
			});

				view.$el.find("#calendar").fullCalendar({
					header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay'
					},
					defaultView: "basicWeek",
					editable: false,
					eventLimit: true,
					views: {
						agenda: {
							eventLimit: 3
						}
					},
					eventRender: function(event, element) {
						element.popover({
							title: event.title,
							placement:'auto',
							html:true,
							trigger : 'click',
							animation : 'true',
							content: event.description,
							container:'body'
						});
						$('body').on('click', function (e) {
							if (!element.is(e.target) && element.has(e.target).length === 0 && $('.popover').has(e.target).length === 0)
								element.popover('hide');
						});
					}

				});

				view.$el.find("#calendar").fullCalendar( 'addEventSource',
					function(start, end, status, callback) {
						var events = [];

						for (loop = start._d.getTime();
							loop <= end._d.getTime();
							loop = loop + (24 * 60 * 60 * 1000)) {
							var test_date = new Date(loop);

						var day = test_date.is().monday()? mon: test_date.is().tuesday()? tue : test_date.is().wednesday()? wed : test_date.is().thursday()? thu : test_date.is().friday()? fri : test_date.is().saturday()? sat : sun;
						_.each(day, function(section, index) {
							events.push({
								title: section.courseName,
								start: view.getStartTime(test_date, section),
								end: view.getEndTime(test_date, section),
								description: section.description,
									//sectionCode: section.sectionCode

								});
						});
					}
					callback( events );
				}
				);
			});

		}
		else {
	var section = new Section();
	section.fetch({
		data: {
			schoolid: sessionStorage.getItem("gobind-schoolid"),
			schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
		}
	}).then(function(data) {
			// Get all sections
			_.each(data, function(section, index) {
				// Get all days for a section
				var days = section.day.split(",");
				_.each(days, function(day, index) {
					var obj = {
						start: section.startTime,
						end: section.endTime,
						courseName: section.courseName
					};
					switch (day) {
						case "MON":
						mon.push(obj);
						break;
						case "TUE":
						tue.push(obj);
						break;
						case "WED":
						wed.push(obj);
						break;
						case "THU":
						thu.push(obj);
						break;
						case "FRI":
						fri.push(obj);
						break;
						case "SAT":
						sat.push(obj);
						break;
						case "SUN":
						sun.push(obj);
						break;
						default:
						break;
					}
				});
			});

			view.$el.find("#calendar").fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				defaultView: "basicWeek",
				editable: false,
				eventLimit: true,
				views: {
					agenda: {
						eventLimit: 3
					}
				},
				eventRender: function(event, element) {
					element.popover({
						title: event.title,
						placement:'auto',
						html:true,
						trigger : 'click',
						animation : 'true',
						content: event.description,
						container:'body'
					});
					$('body').on('click', function (e) {
						if (!element.is(e.target) && element.has(e.target).length === 0 && $('.popover').has(e.target).length === 0)
							element.popover('hide');
					});
				}
			});

			view.$el.find("#calendar").fullCalendar( 'addEventSource',
				function(start, end, status, callback) {
					var events = [];

					for (loop = start._d.getTime();
						loop <= end._d.getTime();
						loop = loop + (24 * 60 * 60 * 1000)) {
						var test_date = new Date(loop);
					var day = test_date.is().monday()? mon: test_date.is().tuesday()? tue : test_date.is().wednesday()? wed : test_date.is().thursday()? thu : test_date.is().friday()? fri : test_date.is().saturday()? sat : sun;
					_.each(day, function(section, index) {
						events.push({
							title: section.courseName,
							start: view.getStartTime(test_date, section),
							end: view.getEndTime(test_date, section),
							description: section.description,
						});
					});
				}

				callback( events );
			}
			);
		});
		}
	},

	getStartTime: function(test_date, section) {
	var start = new Date(test_date.getTime());
	var str = section.start.split(":");
	start.setHours(str[0]);
	start.setMinutes(str[1]);
	return start;
	},

	getEndTime: function(test_date, section) {
		var end = new Date(test_date.getTime());
		var str = section.end.split(":");
		end.setHours(str[0]);
		end.setMinutes(str[1]);
		return end;
	},
	studentGeoGraph:function(){
		var stats = new Stats();
		var dataArray = [['City', 'Student Count'],['Vancouver',1000],['Richmond',20000]];
		stats.fetch({
			url: stats.getGeoStatsUrl(sessionStorage.getItem("gobind-schoolid"))
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Stats(object, {parse:true});
				var city = [model.get("city").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}), parseInt(model.get("studentCount"))];
				dataArray.push(city);
			});
		});
		if (dataArray.length > 1){
			this.$el.find("#demographics-label").removeClass("hide").show();
			var data = google.visualization.arrayToDataTable(dataArray);
        	var options = {
          		title: "Location",
          		is3D: true,
          		legend: {
          			position: "bottom"
          		},

      		}
        	var chart = new google.visualization.PieChart(this.$el.find('#student-location-piechart').get(0));
        	chart.draw(data, options);
		}
	},
	studentGenderGraph:function(){
		var stats = new Stats();
		var dataArray = [['Gender', 'Student Count'], ['F',1000],['M',20000]];
		stats.fetch({
			url: stats.getGenderStatsUrl(sessionStorage.getItem("gobind-schoolid"))
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Stats(object, {parse:true});
				var gender = [model.get("gender"), parseInt(model.get("studentCount"))];
				dataArray.push(gender);
			});
		});
		if (dataArray.length > 1){
			this.$el.find("#demographics-label").removeClass("hide").show();
			var data = google.visualization.arrayToDataTable(dataArray);
        	var options = {
          		title: "Gender",
          		is3D: true,
          		legend: {
          			position: "bottom"
          		},

          		colors:['#00B88A','#9d426b']

      		}
        	var chart = new google.visualization.PieChart(this.$el.find('#student-gender-piechart').get(0));
        	chart.draw(data, options);
		}
	},
	studentAgeGraph:function(){
		var stats = new Stats();
		var kids = 3; //0-17
		var teens = 41; //18-24
		var youngadults = 8; //25-34
		var adults = 20; //35-44
		var oldadults = 4; //45-54
		var seniors = 5; //55-64
		var elderly = 1; //65+

		var dataArray = [['Age Range', 'Student Count']];
		stats.fetch({
			url: stats.getAgeStatsUrl(sessionStorage.getItem("gobind-schoolid"))
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Stats(object, {parse:true});
				var age = parseInt(model.get("age"));
				var studentcount = parseInt(model.get("studentCount"));
				if (age <= 17){ kids += studentcount; }
				if (18 <= age && age <= 24){ teens += studentcount; }
				if (25 <= age && age <= 34){ youngadults += studentcount; }
				if (35 <= age && age <= 44){ adults += studentcount; }
				if (45 <= age && age <= 54){ oldadults += studentcount; }
				if (55 <= age && age <= 64){ seniors += studentcount; }
				if (age >= 65){ elderly += studentcount; }
			});
		});

		dataArray.push(['0-17', kids]);
		dataArray.push(['18-24', teens]);
		dataArray.push(['25-32', youngadults]);
		dataArray.push(['35-44', adults]);
		dataArray.push(['45-54', oldadults]);
		dataArray.push(['55-64', seniors]);
		dataArray.push(['65+', elderly]);


		if (kids!=0|teens!=0|youngadults!=0|adults!=0|oldadults!=0|seniors!=0|elderly!=0){
			this.$el.find("#demographics-label").removeClass("hide").show();
			var data = google.visualization.arrayToDataTable(dataArray);
        	var options = {
          		title: "Age",
          		is3D: true,
          		legend: {
          			position: "bottom"
          		},
      		}
        	var chart = new google.visualization.PieChart(this.$el.find('#student-age-piechart').get(0));
        	chart.draw(data, options);
		}
	},
	attendanceCalendar:function(){
		var stats = new Stats();
		var dataArray = [[ new Date(2012, 3, 13), 37032 ],
          [ new Date(2012, 3, 14), 38024 ],
          [ new Date(2012, 3, 15), 38024 ],
          [ new Date(2012, 3, 16), 38108 ],
          [ new Date(2012, 3, 17), 38229 ]];

		stats.fetch({
			url: stats.getAttendanceStatsUrl(sessionStorage.getItem("gobind-activeSchoolYear"))
		}).then(function(data) {
			_.each(data, function(object, index) {
				var model = new Stats(object, {parse:true});
				var city = [new Date(model.get("date")), parseInt(model.get("totalAttendance"))];
				dataArray.push(section);
			});
		});
		if (dataArray){
			var dataTable = new google.visualization.DataTable();
			dataTable.addColumn({ type: 'date', id: 'Date' });
       		dataTable.addColumn({ type: 'number', id: 'Attendance' });
       		dataTable.addRows(dataArray);

	    	var options = {
          		title: "School Attendance",
          		height: 350,
      		}

        	var chart = new google.visualization.Calendar(this.$el.find('#calendar_basic').get(0));
        	chart.draw(dataTable, options);
		}
	},
});
