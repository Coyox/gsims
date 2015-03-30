var StudentRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.action = options.action;
		this.id = options.id;
		this.render();
	},

	render: function() {
		var view = this;

		var student = new Student();
		student.set("id", this.id);
		student.fetch().then(function(data) {
			var model = new Student(data, {parse:true});
			view.model = model;
			Backbone.Validation.bind(view);	

			view.model.set("id", view.model.get("userid"));
			view.studentInformationTab(data, model);
			view.emailTab(data);
			view.coursesTab(data, model);
			view.attendanceTab(data, model);
			view.reportCardTab(data, model);
		});
	},

	events: {
		"click #delete-student": "deleteStudent",
		"click .edit-btn": "editStudent",
		"click .save-btn": "saveStudent",
		"click .cancel-btn": "saveStudent"
	},

	addRow: function(model, attr) {
        var container = $("<div class='form-group'></div>");
        var parent;
		if (model.addressProperties.indexOf(attr) > -1) {
			parent = "#address-table";
        } else if (model.parentProperties.indexOf(attr) > -1) {
        	parent = "#parent-table";
        } else if (model.emergencyProperties.indexOf(attr) > -1) {
        	parent = "#emergency-table";
        } else {
        	parent = "#student-info-table";
        }
        this.$el.find(parent + ".form-horizontal").append(container);
        return container;	
	},

	addEditRow: function(table) {
		var container = $("<div class='form-group'></div>");
		this.$el.find("#" + table).append(container);
		return container;
	},

	editStudent: function(evt) {
		this.model.untouched = JSON.stringify(this.model.toJSON());

		var table = $(evt.currentTarget).closest(".student-component").find(".form-horizontal").attr("id");
		this.$el.find("#" + table).empty();

		$(evt.currentTarget).hide()
		$(evt.currentTarget).parent().find(".save-btn, .cancel-btn").removeClass("hide").show();

		var props = this.getPropertiesByType(table);
		_.each(this.model.toJSON(), function(value, attr) {
			if (props.indexOf(attr) > -1 && this.model.nonEditable.indexOf(attr) == -1) {
				new StudentRecordRowView({
					el: this.addEditRow(table),
					action: "edit",
					name: attr,
					value: value,
					model: this.model,
				});
			}
		}, this);
	},

	saveStudent: function(evt) {
		var view = this;
		var def = $.Deferred();
		
		if ($(evt.currentTarget).hasClass("cancel-btn")) {
			this.model.attributes = JSON.parse(this.model.untouched);
			def.resolve();
		} else {
			setDateOfBirth(this.model);
			if (this.model.isValid(true)) {
				if ($(evt.currentTarget).hasClass("save-btn")) {
					this.model.save().then(function(data) {
						new TransactionResponseView({
							message: "Record successfully saved."
						});
						def.resolve();
					});
				} 
			}
		}

		$.when(def).then(function() {
			var table = $(evt.currentTarget).closest(".student-component").find(".form-horizontal").attr("id");
			view.$el.find("#" + table).empty();

			$(evt.currentTarget).parent().find(".save-btn, .cancel-btn").hide();
			$(evt.currentTarget).parent().find(".edit-btn").removeClass("hide").show();

			var props = view.getPropertiesByType(table);

			_.each(view.model.toJSON(), function(value, attr) {
				if (props.indexOf(attr) > -1 && view.model.nonEditable.indexOf(attr) == -1) {
					new StudentRecordRowView({
						el: view.addEditRow(table),
						action: "view",
						name: attr,
						value: value,
						model: view.model,
					});
				}
			}, view);
		});
	},

	getPropertiesByType: function(type) {
		var props;
		if (type == "address-table") {
			props = this.model.addressProperties;
		} else if (type == "parent-table") {
			props = this.model.parentProperties;
		} else if (type == "emergency-table") {
			props = this.model.emergencyProperties;
		} else {
			props = this.model.studentProperties;
		}
		return props;
	},

	deleteStudent: function(evt) {
		new DeleteRecordView({
			id: this.model.get("id"),
			el: $("#container")
		});	
	},

	studentInformationTab: function(data, model) {
		_.each(data, function(value, attr) {
			if (this.model.nonEditable.indexOf(attr) > -1) {
				// ignore these attributes
			} else {
				new StudentRecordRowView({
					el: this.addRow(model, attr),
					action: this.action,
					name: attr,
					label: attr,
					value: value,
					model: model
				});
			}
		}, this);
	},

	emailTab: function(data) {
		new EmailView({
			el: $("#email"),
			emailAddr: data.emailAddr
		});
	},

	coursesTab: function(data, model) {
		new EnrolledSectionsView({
			el: $("#course-info"),
			model: model
		});
	},

	reportCardTab: function(data, model) {
		new ReportCardView({
			el: $("#report-card"),
			model: model,
		});
	},

	attendanceTab: function(data, model) {
		new StudentAttendanceView({
			el: $("#attendance"),
			model: model
		})
	}
});

var StudentRecordRowView = Backbone.View.extend({
	viewTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<span><%= value %></span>"
		+	"</div>"),

	editTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<input type='text' class='form-control input-sm' value='<%= value %>' name='<%= name %>'>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	dobTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8 form-inline'>"
		+		"<select id='month-menu' class='form-control input-sm' name='month'></select>"
		+		"<select id='day-menu' class='form-control input-sm' name='day'></select>"
		+		"<select id='year-menu' class='form-control input-sm' name='year'></select>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	genderTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8 form-inline'>"
		+   	"<label class='radio-inline'><input type='radio' name='<%= name %>' value='M'> Male</label>"
		+		"<label class='radio-inline'><input type='radio' name='<%= name %>' value='F'> Female</label>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	statusTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8'>"
		+		"<select id='status-menu' class='form-control input-sm' name='status'></select>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	paidTemplate: _.template("<label class='col-sm-4'><%= label %></label>"
		+	"<div class='col-sm-8 form-inline'>"
		+   	"<label class='radio-inline'><input type='radio' name='<%= name %>' value='1'> Paid</label>"
		+		"<label class='radio-inline'><input type='radio' name='<%= name %>' value='0'> Unpaid</label>"
		+		"<span class='help-block hidden'></span>"
		+	"</div>"),

	initialize: function(options) {
		this.action = options.action;
		this.name = options.name;
		this.label = options.label;
		this.value = options.value;
		this.render();
	},

	render: function() {
		this.label = capitalize(this.name);
		this.label = splitChars(this.label);
		this.label = this.simplifyName(this.label);

		var params = {
			name: this.name,
			label: this.label,
			value: this.value			
		};

		if (this.action == "view") {
			if (this.name == "prevAttendedGS") {
				params.value = "n/a";
			} 
			else if (this.name == "paid") {
				params.value = this.value == 1 ? "Paid" : "Unpaid";
			}
			else if (this.name == "status") {
				params.value = capitalize(this.value);
			}
			this.$el.html(this.viewTemplate(params));
		} else {
			var validationProperty = this.model.validation[this.name];
			var isRequired = validationProperty ? validationProperty.required : false;
			if (isRequired) {
				params.label = this.label + "<span class='asterisk'>*</span>";
			}
			// DOB month/day/year dropdown menu
			if (this.name == "dateOfBirth") {
				var month = "", day = "", year = "";
				if (this.value) {
					dob = this.value.split("-");
					month = dob[1];
					day = dob[2];
					year = dob[0];
				} 
				this.$el.html(this.dobTemplate(params));
				populateMonthMenu(this.$el.find("#month-menu"), month);
				populateDayMenu(this.$el.find("#day-menu"), day);
				populateYearMenu(this.$el.find("#year-menu"), year);
			} 
			// Gender radio boxes
			else if (this.name == "gender") {
				this.$el.html(this.genderTemplate(params));
				this.$el.find("[value='" + this.value + "']").prop("checked", true);
			} 
			// Status dropdown menu
			else if (this.name == "status") {
				this.$el.html(this.statusTemplate(params));
				populateStatusMenu(this.$el.find("#status-menu"), this.model.studentStatuses, this.value);
			}
			// Paid radio boxes
			else if (this.name == "paid") {
				this.$el.html(this.paidTemplate(params));
				this.$el.find("[value='" + this.value + "']").prop("checked", true);
			} 
			// Plain text field
			else {
				this.$el.html(this.editTemplate(params));
			}
		}
	},

	events: {
		"change input": "updateInput",
		"change select": "updateSelect",
		"change input[type='radio']": "updateRadio"
	},

	updateInput: function(evt) {
		var val = $(evt.currentTarget).val();
		this.model.set(this.name, val);
	},

	updateSelect: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).find("option:selected").val();
		this.model.set(name, val);
	},

	updateRadio: function(evt) {
		var name = $(evt.currentTarget).attr("name");
		var val = $(evt.currentTarget).attr("value");
		this.model.set(name, val);
	}, 

	simplifyName: function(str) {
		if (str.toLowerCase().indexOf("parent") > -1) {
			return str.slice(7);
		} else if (str.toLowerCase().indexOf("emergency") > -1) {
			return str.slice(18);
		}
		return str;
	},
});

var EnrolledSectionsView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(html["enrolledSections.html"]);

		var view = this;
		var id = this.model.get("userid");
		this.model.fetch({url:this.model.getEnrolledSectionsUrl(id)}).then(function(data) {
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
				new EnrolledSectionsRowView({
					el: view.addRow(),
					model: section,
					studentid: id
				});
			});
			view.$el.find("table").dataTable({
				dom: "t"
			});
		});
	},

	addRow: function() {
        var container = $("<tr></tr>");
        this.$el.find("#enrolled-sections-table .results").first().append(container);
        return container;
	}
});

var EnrolledSectionsRowView = Backbone.View.extend({
	template: _.template("<td><%= model.courseName %></td>"
		+	"<td><%= model.sectionCode %></td>"
		+	"<td><%= model.day %></td>"
		+	"<td><%= model.startTime %></td>"
		+	"<td><%= model.endTime %></td>"
		+   "<td><button class='drop-section btn btn-xs btn-primary center-block' id='<%= model.sectionid %>'>Drop Section</button></td>"),

	initialize: function(options) {
		this.studentid = options.studentid;
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	events: {
		"click .drop-section": "dropSection"
	},

	dropSection: function(evt) {
		var id = $(evt.currentTarget).attr("id");
		this.model.set("id", id);
		this.model.destroy({
			url: this.model.getDropStudentUrl(id, this.studentid)
		}).then(function(data) {
			console.log(data);
		});
	}
});

var StudentAttendanceView = Backbone.View.extend({
	initialize: function(options) {
		this.currentMonth = new Date().getMonth();
		this.render();
	},

	render: function() {
		this.$el.html(html["attendance.html"]);

		var currMonth = this.indexToMonth(this.currentMonth);
		var nextMonth = this.indexToMonth(parseInt(this.currentMonth) + 1);
		var prevMonth = this.indexToMonth(parseInt(this.currentMonth) - 1);
		this.$el.find("#current-month").text(currMonth.toUpperCase());
		this.$el.find("#next-month").text(nextMonth + " >").attr("name", this.currentMonth + 1);
		this.$el.find("#prev-month").text("< " + prevMonth).attr("name", this.currentMonth - 1);

		var view = this;
		var student = new Student({id:this.model.get("userid")});
		student.fetch({
			url: student.getAttendanceUrl(this.model.get("userid")),
			data: {
				month: parseInt(this.currentMonth) + 1,
				schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")
			}
		}).then(function(att) {
			var student = new Student();
			student.fetch({
				url: student.getEnrolledSectionsUrl(view.model.get("userid"))
			}).then(function(data) {
				_.each(data, function(section, index) {
					var model = new Section(section, {parse:true});
					new StudentAttendanceRowView({
						el: view.addRow(),
						model: model,
						courseName: model.get("courseName"),
						attendance: att,
						sectionid: model.get("sectionid")
					});
				});
			});
		});
	},

	events: {
		"click #next-month": "nextMonth",
		"click #prev-month": "prevMonth",
	},

	addRow: function() {
		var container = $("<tr></tr>");
		this.$el.find(".table").append(container);
		return container;
	},

	indexToMonth: function(index) {
		index = index.toString();
		switch (index) {
			case "0":
				return "January";
			case "1":
				return "February";
			case "2":
				return "March";
			case "3":
				return "April";
			case "4":
				return "May";
			case "5":
				return "June";
			case "6":
				return "July";
			case "7":
				return "August";
			case "8":
				return "September";
			case "9":
				return "October";
			case "10":
				return "November";
			case "11":
				return "December";
			default:
				return ""
		}
	},

	nextMonth: function(evt) {
		this.currentMonth = $(evt.currentTarget).attr("name");
		this.render();
	},

	prevMonth: function(evt) {
		this.currentMonth = $(evt.currentTarget).attr("name");
		this.render();
	}
});

var StudentAttendanceRowView = Backbone.View.extend({
	template: _.template("<td><%= section %></td>"
		+	"<td name='01'></td>"
		+	"<td name='02'></td>"
		+	"<td name='03'></td>"
		+	"<td name='04'></td>"
		+	"<td name='05'></td>"
		+	"<td name='06'></td>"
		+	"<td name='07'></td>"
		+	"<td name='08'></td>"
		+	"<td name='09'></td>"
		+	"<td name='10'></td>"
		+	"<td name='11'></td>"
		+	"<td name='12'></td>"
		+	"<td name='13'></td>"
		+	"<td name='14'></td>"
		+	"<td name='15'></td>"
		+	"<td name='16'></td>"
		+	"<td name='17'></td>"
		+	"<td name='18'></td>"
		+	"<td name='19'></td>"
		+	"<td name='20'></td>"
		+	"<td name='21'></td>"
		+	"<td name='22'></td>"
		+	"<td name='23'></td>"
		+	"<td name='24'></td>"
		+	"<td name='25'></td>"
		+	"<td name='26'></td>"
		+	"<td name='27'></td>"
		+	"<td name='28'></td>"
		+	"<td name='29'></td>"
		+	"<td name='30'></td>"
		+	"<td name='31'></td>"),

	initialize: function(options) {
		this.index = options.index;
		this.userid = options.userid;
		this.month = options.month;
		this.attendance = options.attendance;
		this.courseName = options.courseName;
		this.sectionid = options.sectionid;
		this.render();
	},

	render: function() {
		var view = this;
		this.$el.html(this.template({
			section: this.courseName
		}));

		_.each(this.attendance, function(att, index) {
			if (att.sectionid == this.sectionid) {
				var parsedDay = att.date.split("-")[2];
				var cell = this.$el.find("td[name='" + parsedDay + "']");
				cell.text("P");
				cell.addClass("bg-success");
			}
		}, this);
	}
});



var ReportCardView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
	},

	render: function() {
		//console.log("render");
		this.$el.html(html["reportCard.html"]);

		var view = this;
		var id = this.model.get("userid");
		this.model.fetch({url:this.model.getEnrolledSectionsUrl(id)}).then(function(data) {
			//console.log(data);
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
				//console.log(section);
				new ReportCardRowView({
					el: view.addRow(),
					model: section
				});
			});
		});
	},

	addRow: function() {
        var container = $("<tr></tr>");
        this.$el.find("#report-card-table .results").first().append(container);
        return container;
	}
});

var ReportCardRowView = Backbone.View.extend({
	template: _.template("<td><%= model.courseName %></td>"
		+	"<td><%= model.sectionCode %></td>"
		+	"<td><%= this.teacherNames() %></td>"
		// +	"<td>[teacher name]</td>" // TODO: get these fields
		+	"<td>[student's grade]</td>"),

	initialize: function(options) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},
	
	teacherNames: function() {
		// TODO: stub
		var id = this.model.get("sectionid");
		var output = "test";
		this.model.fetch({url:this.model.getSectionTeachersUrl(id)}).then(function(data) {
			console.log(data);
			// output = data.lastName + ", " + data.firstName;
			_.each(data, function(object, index) {
				var teacher = new Teacher(object, {parse:true});
				console.log(teacher);
				output += teacher.lastName + ", " + teacher.firstName + "; ";
			});
		});
		// output
		return output;
	},
});

// var ReportCardTeacherView = Backbone.View.extend({
	// template: _.template("<td><%= model.courseName %></td>"
		// +	"<td><%= model.sectionCode %></td>"
		// +	"<td><%= model.sectionCode %></td>"
		// +	"<td>[teacher name]</td>" // TODO: get these fields
		// +	"<td>[student's grade]</td>"),

	// initialize: function(options) {
		// this.render();
	// },

	// render: function() {
		// this.$el.html(this.template({
			// model: this.model.toJSON()
		// }));
	// },
// });

function dlReportCardPDF() {
	// TODO: stub
	window.alert("Download Report Card as PDF - clicked"); // for testing only
}

function dlReportCardCSV() {
	// TODO: stub
	// window.alert("Download Report Card as CSV - clicked"); // for testing only
	
	var output = "";
	var i;
	var j;
	for (i = 0; i < document.getElementById("report-card-table").rows.length; i++) {
		for (j = 0; j < document.getElementById("report-card-table").rows[i].cells.length; j++) {
			output += getCellContent('report-card-table', i, j) + ",";
			// output += document.getElementById("report-card-table").rows[i].cells[j].innerHTML + ",";
		}
		output += "\n";
	}
	
	window.alert("output: " + output); // for testing only
}

// Helper function
// remember to pass id string with single-quotes (ie. 'report-card-table')
function getCellContent(id, row, cell) {
    return document.getElementById(id).rows[row].cells[cell].innerHTML;
}
