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

		// if (usertype == "SU" || usertype == "A" || usertype == "T") {
		// 	this.calendarWidget(usertype);
		// }
		if (usertype == "SU") {
			this.studentGeoGraph();
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
					defaultView: "agendaWeek",
					editable: false,
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
				defaultView: "agendaWeek",
				editable: false,
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
	  //google.load("visualization", "1", {packages:["geochart"]});
      google.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable([
          ['Country',   'Latitude'],
          ['Algeria', 36], ['Angola', -8], ['Benin', 6], ['Botswana', -24],
          ['Burkina Faso', 12], ['Burundi', -3], ['Cameroon', 3],
          ['Canary Islands', 28], ['Cape Verde', 15],
          ['Central African Republic', 4], ['Ceuta', 35], ['Chad', 12],
          ['Comoros', -12], ['Cote d\'Ivoire', 6],
          ['Democratic Republic of the Congo', -3], ['Djibouti', 12],
          ['Egypt', 26], ['Equatorial Guinea', 3], ['Eritrea', 15],
          ['Ethiopia', 9], ['Gabon', 0], ['Gambia', 13], ['Ghana', 5],
          ['Guinea', 10], ['Guinea-Bissau', 12], ['Kenya', -1],
          ['Lesotho', -29], ['Liberia', 6], ['Libya', 32], ['Madagascar', -18],
          ['Madeira', 33], ['Malawi', -14], ['Mali', 12], ['Mauritania', 18],
          ['Mauritius', -20], ['Mayotte', -13], ['Melilla', 35],
          ['Morocco', 32], ['Mozambique', -25], ['Namibia', -22],
          ['Niger', 14], ['Nigeria', 8], ['Republic of the Congo', -1],
          ['Réunion', -21], ['Rwanda', -2], ['Saint Helena', -16],
          ['São Tomé and Principe', 0], ['Senegal', 15],
          ['Seychelles', -5], ['Sierra Leone', 8], ['Somalia', 2],
          ['Sudan', 15], ['South Africa', -30], ['South Sudan', 5],
          ['Swaziland', -26], ['Tanzania', -6], ['Togo', 6], ['Tunisia', 34],
          ['Uganda', 1], ['Western Sahara', 25], ['Zambia', -15],
          ['Zimbabwe', -18]
        ]);

        var options = {
          region: '002', // Africa
          colorAxis: {colors: ['#00853f', 'black', '#e31b23']},
          backgroundColor: '#81d4fa',
          datalessRegionColor: '#f8bbd0'
        };

        var chart = new google.visualization.GeoChart(this.$el.find('#geochart-colors').get(0));
        chart.draw(data, options);
      };

	}
});
