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
			var isRequired;
			if (validationProperty instanceof Array) {
				_.each(validationProperty, function(rule, index) {
					if (rule.required == true) {
						isRequired = true;
					}
				}, this);
			} else {
				isRequired = validationProperty ? validationProperty.required : false;
			}
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
		this.model.fetch({
			url: this.model.getEnrolledSectionsUrl(id),
			data: {
				status: "active"
			}
		}).then(function(data) {
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
				new EnrolledSectionsRowView({
					el: view.addRow(),
					model: section,
					studentid: id
				});
			});
			view.$el.find("#enrolled-sections-table").dataTable({
				dom: "t"
			});
		});

		this.model.fetch({
			url: this.model.getPrevEnrolledSections(id)
		}).then(function(data) {
			_.each(data, function(object, index) {
				var section = new Section(object, {parse:true});
				new PrevEnrolledRowView({
					el: view.addRow("#previous-sections-table"),
					model: section,
					studentid: id
				});
			});
			view.$el.find("#previous-sections-table").dataTable({
				dom: "t"
			});
		});
	},

	addRow: function(table) {
		table = table || "#enrolled-sections-table";
        var container = $("<tr></tr>");
        this.$el.find(table + " .results").first().append(container);
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


var PrevEnrolledRowView = Backbone.View.extend({
	template: _.template("<td>blah</td>"
		+	"<td>blah2</td>"),

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

});

var StudentAttendanceView = Backbone.View.extend({
	initialize: function(options) {
		this.currentMonth = new Date().getMonth();
		this.render();
	},

	render: function() {
		this.$el.html(html["attendance.html"]);

		var currentMonthName = this.indexToMonth(this.currentMonth);
		this.$el.find("#current-month").text(currentMonthName.toUpperCase());

		var nextMonthIndex = parseInt(this.currentMonth) + 1;
		nextMonthIndex = nextMonthIndex > 11 ? 0 : nextMonthIndex;
		var nextMonthName = this.indexToMonth(nextMonthIndex);
		this.$el.find("#next-month").text(nextMonthName + " >").data("index", nextMonthIndex);

		var prevMonthIndex = parseInt(this.currentMonth) - 1;
		prevMonthIndex = prevMonthIndex < 0 ? 11 : prevMonthIndex;
		var prevMonthName = this.indexToMonth(prevMonthIndex);
		this.$el.find("#prev-month").text("< " + prevMonthName).data("index", prevMonthIndex);

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
					view.addCourseRow(model.get("courseName"));
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

	addCourseRow: function(courseName) {
		var container = $("<tr><td colspan='32'><strong>" + courseName + "</strong></td></tr>");
		this.$el.find(".table").append(container);
		return container;
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
		this.currentMonth = $(evt.currentTarget).data("index");
		this.render();
	},

	prevMonth: function(evt) {
		this.currentMonth = $(evt.currentTarget).data("index");
		this.render();
	}
});

var StudentAttendanceRowView = Backbone.View.extend({
	cellTemplate: _.template("<td></td>"
		+	"<td class='att-cel' name='01'></td>"
		+	"<td class='att-cel' name='02'></td>"
		+	"<td class='att-cel' name='03'></td>"
		+	"<td class='att-cel' name='04'></td>"
		+	"<td class='att-cel' name='05'></td>"
		+	"<td class='att-cel' name='06'></td>"
		+	"<td class='att-cel' name='07'></td>"
		+	"<td class='att-cel' name='08'></td>"
		+	"<td class='att-cel' name='09'></td>"
		+	"<td class='att-cel' name='10'></td>"
		+	"<td class='att-cel' name='11'></td>"
		+	"<td class='att-cel' name='12'></td>"
		+	"<td class='att-cel' name='13'></td>"
		+	"<td class='att-cel' name='14'></td>"
		+	"<td class='att-cel' name='15'></td>"
		+	"<td class='att-cel' name='16'></td>"
		+	"<td class='att-cel' name='17'></td>"
		+	"<td class='att-cel' name='18'></td>"
		+	"<td class='att-cel' name='19'></td>"
		+	"<td class='att-cel' name='20'></td>"
		+	"<td class='att-cel' name='21'></td>"
		+	"<td class='att-cel' name='22'></td>"
		+	"<td class='att-cel' name='23'></td>"
		+	"<td class='att-cel' name='24'></td>"
		+	"<td class='att-cel' name='25'></td>"
		+	"<td class='att-cel' name='26'></td>"
		+	"<td class='att-cel' name='27'></td>"
		+	"<td class='att-cel' name='28'></td>"
		+	"<td class='att-cel' name='29'></td>"
		+	"<td class='att-cel' name='30'></td>"
		+	"<td class='att-cel' name='31'></td>"),

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
		this.$el.html(this.cellTemplate());

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
				//console.log(id);
				new ReportCardRowView({
					el: view.addRow(),
					model: section,
					id: id
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
		+	"<td><%= teacher %></td>"
		+	"<td><%= grade %></td>"),

	initialize: function(options) {
		this.render();
	},

	//events: {
	//	"click #dl-report-card-csv": "dlReport",
	//},

	render: function() {
		var view = this;
		var sid = this.id;
		var secid = this.model.get("sectionid");	
		//Get teacher names
		this.model.fetch({
			url: this.model.getSectionTeachersUrl(secid)
		}).then(function(data) {
			// Get teacher names
			var names = "";
			_.each(data, function(teacher, index) {
				var fullName = teacher.firstName + " " + teacher.lastName;
				names += fullName + ","
			});
			names = names.slice(0,-1);
			// Get grades
			view.model.fetch({
				url: view.model.getStudentGradeForSection(secid, sid)
			}).then(function(data){
				var grade = data.studentGrade;
				view.$el.html(view.template({
				model: view.model.toJSON(),
				teacher: names,
				grade: grade
			}))});
		});
	},
	
});

function dlReportCardPDF() {

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
		//var table = this.$el.find("#report-card-table");
		//console.log(table);

        var doc = new jsPDF();
        //var logo = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAKwAAABiCAYAAADN0zgcAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAXW9JREFUeNrsnXWcXNX5/9/n3ju+O+uucRfiThIgQkhI8CLF2lKkLbTQ0pZCgSqVb9tvHSnuECRIAkSAhBD3ZLOxTdZ9x2eunN8fd3Y3S4Qg/bb9lcPrkNm5d66c8znPefwRP9qwn482iQCk/YcQIO3PApk8JpJ/281KfhbJ30hE17n2dxJQkt+BFAIhP3qu3XJ69WblH3/D4rtuxe1yIRSFT9OOfs7O1v0sInn85Fcg+Wy6bmIYcdatOp+x08YDbfa1DZ3WuhhCFR9/NakjFEeaP3eOqqhZrRD9RG8DvVm+/AXOPPNWVE1D0xxHvZd11Pvaz400+UxNCCA59kIiJPYsSfmpLheLxUjLzOL2Z5aQUVBAtKPdvqboni9FWoCCoSg4LQOPoWOJniOr8UX72KYoAkVxsGzZBkLmVtqPmBiGSf++aYwY5afxSBShnhyyliVRlbapInusRB38GjScwp2tJGj6Ayn86EdPIaWFw+H4tLj5j29fAPYUmqoKNM3BHT+thp+aXZTM43HxwfIJjBhbSNOhKMrJQGt5cHBwnrD2NcD010A/FTIHZPL660+ydu27rFmzAU1zIqU8Zvf4ArBftI9s6RKn04FlOezdUgii0Sg33rKH9z8Yi8clSBjypFusRtscadSsES4PoJ4Cde3Hu+++yrx5NwLgcLrRHA6kZf7XzoPyBRQ/GaV1OASaJtBUUFQ3q9c28cHSNlKKfFiWgkQ9TncgMFEF5dKoz+ymnifrPqCdr113LwButw9VVZGW9d/Nnn0Bw0/fnC4VsHj4mToQAgXLFnY+0qWloIpAP1UFSz9cBBHACzhP0DWgnA8/fJeKPYdQVWe3EPzfLk98MQSfiU8A4eTRp+o4srOV9HwNISyUj3SEgqp0jFUUsBIVg6V10GuzBLET9ASg8+CDS5ILw/nFWH8B2M+nuV0OYrEojz7dhOJ1Iy2BRDmqC0BDFcHJQgGMuCoTW2dAdnLrV47TM4nHd/PMM2938c9ftC8A+/kMoGLrmB9+ugmz3cTrdWNJx1HdDdJEVZoWSeyd3YqtmQeu5PB/lHcFKOD551cQCIRwutxfDPIXgP18uQJNc7NvXxvLljXiyddA6ggMBAZIBVVpGaGKUIElQSggE5tOhxbAfRzq6gSiPPbY0qSgp34xyF8A9nMWvpwCMHnoqTrAwKGY3YBFoCktZymie8SlvnewNCsLIfM4gM2huXkrb7314RfswBeA/WdRWQk4WbK0jbrdUfyZHiQaEgcSgaa0LuhS8wvAACv2wdngxzYgGMmuA2k8//wKLMvE5XJ9MbhfAPbza6ZpYZq2Et/h1IhFw7y5vB3hdya1UCqqCKeoSutkS/ZkU63YigvtkzrVWBq2qquDxx9/M8kffzE9XwD2c2hCCKSU6IkYiUScaDSCw2Hzmq++2QIIVEVgSQ+q0nGWKkxFAlgCLIHQQMZWz5LWplzIOQrJ2dTUbGX16i2AOCE7YJrmfy2r8AVgP267P043DJNYLMY9d3/3/ccee3R/aop3ZCQcBJwsW9HK4e0d+LOS7IDacEmn45PUwYzYgEU3sSKvX26rtwzABPy89tqaJF/sRAhBLBohFo0ihEj+HUZPxInHIoijPJmEEFiWTJ4fxrKsHse/AOx/Dz3t2YVCIhFnyJBBl//ozl9OvvzyK3pv3bZp8+jRw2+EOOFwiFfebEVJ9aAQ9DiUunNlUjtgGWAG7CEXCljR16+E9qPYgmAXYDVNJRqNAkwAa4RhGEQjIaZNm3DXs88+fWjkyBHXd4JWURSikTCJeISBg/pfe9lll/7U6/X2NQyDjzcBn6x/Adj/fNAmd+Jrr7n8BgAzXkuvXgPYsGHjHxfMP+t3AK+/3QjSjcfRdI4qDFenOgtTYAQF0gThABnfNdwy1veBYsBPJHKQd9/dAkAkEkFzOCbs2L7hgzeWPL1F1+Ni8OCBV69csfzHF154cdndd33nT5ZleQ1dJxwOA/T+1X0/3bpr544HHn34f3+Q0PUiXddBUT5dP9on+gvA/vtK+9bxnEtEN3MQj8cAUqZOGTfe/lagx6oBjZdfWfat8RMm/+KNZXXUV8bxZbRfLI5SZ1kJgRURWHGBcNhcgBV66jZIAXwcOFBNe3t7510dj/7jf5cNGTqaOfMu5sorL13/xGN/fUgoHiDBnDlnisys7Nm6Hgcoe+7ZR7fcetsPhgvh4Kmnnq2LhMPvO51uW1H8iTr/1m4LXwD2KB4wkdBJxKPEomFM0+ziAcVRAo60TLJzc0cMGdxfgTggEEJLghbWrF7xvfTMARf/5YGlkNI6V1qdvwMrKrB0gRlRQAGhghV54RppbXFDGocOVXfd54rLLnjxS5ddl2oZLUCCu++8dXR+Xg4QQJrtON0FTD99Um+AP//pl+9dcOEVqdJoAsDj8ViAJaUdz3Hq/33Bw/7HiFOJeIy+fcrnP/zwA1vmzJl1h56IE42EukFrQxOAYUMGjvCkFIEMHQV4DSNWjaI4ePPNFY/m5+c8TzTgtbCBKeM2YBVVYkUEsjOYQE84bF7WzZbNdrjSqNOG3vro40+fAwlMw3aG0XWD/QcOAS4M3Val9e5VOmnQoAG/vf6G75YgA9g8q2T4sMFFmsM5SNcTSCFPvf8HQPa/m8IKCcICYWGaBgMG9p515ZXXjnjjjaX3/v3vf96cmZk2KRoJYZoWiO7Is/y83DJQkaYJSBRFoLk8aA4XRryZ8WMLnNd/vfR8PRkFIxxghhXMmEA4JVZUIBM2kIUARX/+W2Dy5NPL0BzOhe+88+avQMWINSKECmaUzMx04vE4pt6BptrTNm3axPMef+SPtwDo8WBycZmkpKbg9Xky7cVonWL/N+cF/psBK48n/dvfRex/w3z1q9ePrKjYtXrevFm/SyRixONxW3AC0jP8fkjGaWlOFIeDyj27icViaK5sZGwNVsdKcHTf0GxXbEWAH6ywwIoqtnpLA2HtGoT+t4H7Dgn+9uffLk7PKMKI12CfYBso/P5UVFXD0HWEI4UPVr+B2+Vi1NjJWHqdDWwAVOKxGJFILNw9xafS/zNUYMp/O4FFKl2hm5ZptdkfIhjxGrKzC1myZOm3brvtG0st0yAejwPg9bqFzQaAlBofvL+OnXsOseS1t1j1XgVxfRlWMvRLaLbu1WxXIFViZUlkQmCGRffoq7Bz/V3fveaqS753zVe+grTaODqERkqJ5nJjWSZCUVj34VqWLHmLaCwGeDDNnhJibV2DaSTiB4Wq2e92Cl3ILwD7byH1n4rGqpM3ra1taIF2UFyAih6rAaLcd98fZt1xx7eXW4aNjHDYDtFWHH4O7K+graODhQsvYcbMeQTaDtFa82f7EtiANQIKVhhwS8xMiXBJzA4FK57UHujgdzVf/ePvjf8FuDAT4eM8qEp2dibPPvsy7a1N/OD7N1NcWADEjzIQ2O+76t01K4F2l8vN8U0fH+1fGA7++UA72UspCrFohHjMtvoYhtE1qZ3HYtEw0WiEWCzaxZvu339ob1tLE7ZNH4RQ0WOtQIh77/3NjGuvvexZgKam1n1JzRPVtfUMGtAHCJCVncf8BenkpDRhJpJqWwPMoC2DWx4DM8OEFDDbBWZAQXGAEYOSEsgvXolugERFc3nRXNmoqoKUJpDKxk3b2Lx1O2fNWcShQ4cJhkI9KLHmcAAGb729KgYUCmmhnJJeQH4B2E/9QBro0UiXqunTgD0ej3Pzzdc/9dvf/m75xIkTbjL0uIhGQliWJJFIMG/e7NtvvvnmfwweMvTLWFZuLHm/YLBj9Z49B9pA604eIlT0WAcQ54EHHr+wqLBgzmuvLXsDIBqqIxgMUVpWhqWHMUwwOl7vymUhVLBiAiusgNtA+lygaMhUA6ELjGC31UtPgN7wN9AbcLgLOLR/H08/9TCJhI7q8IJMsG/fIS68YCFCuNi5q+LY3ARKFm8tfZ6vfu3GeX/92/1vR6ORHuLUcWnrf5j19t8OsLFAlJJRYwFIJHQQdpjJqXYQGIZBTk5271tu+daMNWs++N8XXnhm35jRp10Xj0fRdZ3rvvrlb/7P//zPVTu3v//I2g9WHrrxxhue0DRtCGA89/wr+wE0l/MjoLV1nG8te/nl7JzsS9taDwQ72gPk5mSjOtIxTQ0kyMTKbm5DBTMqkGGwUk1ERn+cLMRItUCTtvAVt89DAZkI4PDspL4hxt69lQgh2H+gCkXN4J23X2H6tPFMmHgWEMaX4qO8rBhk8KhdSdDU1M4lF1/EwAH9s099txJfAPbTtkB9HUPmzmXipVdjWmYSM5/A/q0oqKqDH/7w3lnbtq4yAM4776Le6zds+Ou99961HEh97oVXH+ucp/ETTvf88Y9/unT7tg93XHXVpUtycjIHrlrxKggvmtuLTGr+hdAw4jUMGjLW+dc//fwHlRWVDkuCpmmAiVD8YNaAsbnH/FtRgUiAmQ7CU4iXb2ClAh4dK2IbEToFfM0DdYef5aWX32PCxCmMGzsSvz+F+rpK9u07xIwz5oBsIxpqJjU1heLiAizDFgRVTSMWriIlNRuALVu27OiGouxKJXV0T+Yf+oLCfib+1bKIByKcfsN38PrTiccip6T47+pS4rQdnzu++rXv/AUZS1KhMHfc8eMZGze8t8vjcU9prK8C/BixGqxEHQMHjeLnP71j3uWXXpDidnt58vHH0BMShzsNKS2kNNFcHsBk3vzLMAzDveztFWRmpgMmCBeYB+17JdeOZYAVUpBe0HNAlX1xMw2R5sNMkxDB1haIbn1t25GXmDa5L/70IhobmzFNi00b1jFnzixUzQVYNDe3Iy2J5krFskBKC0XLYf36zRSV9AVg89Ytu48mnrIToP+hwta/LWCFohALhVCdLpxuz0m3tBP6GEkLRdVYt27jT//6t7+C8AIOEtEq/P704m/ceO2ktWtXsX3bejR3AYrDCbKDYLCDI9W1jJ94Br169eL5554mFAzhcGeiah6aG5t5fclzbN++jn79B1Jb24DL5UwCFqS1rysznh27JZAhgczSsfzgMs+0RTXnDPRsWy8mY7YzDAL0IAwenGDwEFvoy8nJ5pVXl1JSWkRZr+EYsSYQXppbWvCneoAUpDRxuHx0tO6nqrqd4cOGAbBh/YZN/z9qfv4ttQSKqqLHoljmp0/J43I6ARpeemXFr/ZV7qS9tQmnO5snHn+U9vYOysrKqa+r4s03FqPrCggPffr0p62tnZbGvUycfBZDhp7Gc88+RUtzM4qWyYfrNpGamkJTYyNbt21j8OABSOsoamUe7iZciq0hQAczTaI5vTjV2QA4ramYmUCaiYwmvbeSQpoeacOI7ABg69adBAMhho2YjKU3JS/tob6+mdffeJdIuBVVc4Pw8/Y7qxgydDQOh0pdXR07d+587+ilbVrW8R17TtAsy+rSpsQiEaLRSJdP7qdtlmnamWs+wzX+o/WwdurOEx/XNAcrli/94f6DLdbhIzUEOoKcccYMKisPUF5WjM/nJT8/n8WLX2bn9i0oWia5uVls37EbkAwfMYrTp5/Ja0sW09JcS35+Lnm5Ocw84xz69h3A+6s/JBAIAh6btFsdPbKUYgikIjC84FIXogiPvZi4CMULpt+ws24aotvYJEFa9bbQqevMnTvTBpwRx+HOoaFuJ77UXEaPm8GmjatRtCzeXbGYYETjtJE2dV2+fEUN0tprh4grWKaFHo+JeCzuOSngkg7isWiYRDyKx5sycebMmb/40Z0/evvee36wQtf1Qj2hf/JdM3nPaCiIUD6b2+L/F4aDozUER3en00UiHtfvufvOrw0fMYG1H65l1Kjh1Dc0s3nLDnJyC2ltbWHS5Mns21fJsqWLGTv+TGKxBNWHdwAWvfsM5aKLL+LQge1EI1HCkSigU95rMOeeM5v9B6sAZ3IKrB78itRBajrSDS4u61pkmlKOy3kGhg+kqXRZxWypHjCqACgqzKdP71Kk0YzDk0Mw0Mjrb6xi6LBR9O/Xi/y8XGqO7OJwdZDzzzu/69aPP/74650LVtcTJBLR8h/96M79l1zypR/GYjF6mGKT4T7RaJhYJAxCGXP+Bef/7rHHHti1e8cHa955553v3XP3PWfMmT1zuqHrHilACOXUu6JgWfboTL7gUgr7DSQWDH5h6bLFimTC5OS/lpS4XB7WrHn/wV/e96tls2YvZM0HG7nisnN54qklGIYkJzubd1etYM7cc3A4nCx9czF9epeyc+ceIpEo77y1mPUbttMeiFNTU82OHbux9BZAMnX6VFRFRY83YvujOHo+ki6wHBaaJxUXZ/U45GAelhekYtnRMUfx5ZpLoaHBJJHQ8WfkIrR0Ah0tPPDAw4wcNZXMDD+WpbNt23a2bN3NovMvJjXVB9iO38tXrLhfCEEkEsE0Enlf+tIlG+655+5eHq9XdLIFUtjpnWORMPFYhNzcvIW33PLNpTu2fbj++eee/9bll187qKzXUABeWvwUY8efeZuqavudTtcp2c4kkIjHiEYixOMxMvMKuOzHPycejWDqxqee5f8P0232zJ2qqCqqqnH797570YIF81unTjtbWbP6Da65ciEPPfws37jhSkaPHstDD/6Nq67+CgcPHmRPxU4sCx68/29MmDyLjPQ0wpEIui5ZvPh59lbuY+RpEzht5ED69CmmpvoI5X1yMdTipKm3+1FMDTTXGJSPgNnFdGQGqG4dqQs0T3I2EoBnGBtX7kJYUSCVQEcNTz31LNNnLuS0kTaI9uzZxfrNe7n7xz/D6eyexsUvvbQ/EY+tTzLVztmzZ2588smnsgCee+65tfY+IIlHbO1LXn7eZbd95+bvfOUrV52Wlp5vP7ZRj9B8YFls37GX226/dxPwa6fTZQvB8vjshEiC1DwqHWivYSMZNv0MJp6zCFVVaauvQ1HVT80W/H+cH1YmtVwSp8tNNBLqmDbt9LlNjQ1LR4+ZycZ1b3HmzAmseHcTc84ax7kLz+eB+//MBRdexrTpc3jt1RdY9f4HXP7lr5ORkQbAoIGDqKltZM+eSoYNG8WBAweoq9tHRrqP8j6jUV1jsRRwOGyLqW6BVEFVBxxjAHVwGpv2QHYd9JkkaaqG9ZtG4HQKps6yiMWaOGvmdEKBOl54fjFTT5/H4EH9u35fsXc/Cxac3wOsAH/581//3vl57pyZyx944OEigPffX22FgoG3AOLRCKWlpV++4fqvffP6668d7U/LBwzMRB2WZeFwpxGPRTl0sIrf/eEh9u3dc67T6epKHX+0nlkIgaEnSOjdvG2/0eMYNnUGAyZOpnzIcNLzCgm1NtFaV4OqOT7TrP4XJDQWJOK2Yb+5qXHZvHnnfP+115b8fMz4M1n8wiOUlg1i5+4j9Oubx1VXf41HH3mA6TPmcOnl17Nr9x4efuQRbrn5m7Z071QZM3Yio8eMp3//PvTv34fdu8v44x//B0jlnAWLUNNyqN7dRH4JuPNMAodAEWU9tvyOQID33vsA3XicoGsT6574A770K+g/6iEMI8ZvfnMXX/va1aSmZfDg/X/ljFkXUF5WTCgUYs+eCrKyspgwfgITJ4zv8aYbN25k9er3/ghw/nlnL/n5z++bXFhUAsDDjzz2WyBWXl52/o03fP0HN9301VFuTxagY8Rr6Qwrd7jTiIRDHK46zLurd/LE449cCLJaczi7c9MKm9mORrt15OVDhjN40jSGTp9Jv3GTSEtLJxIKEmhpobpiF4rgM4MVQD39a986uanu6FDiHtpPerhO9IyzFF1nHPtd9/ZxzPfJazjcbmKhIBuefoR4NILmcPYQEOKxCIah2900UVXtI5qS7j+klGRmZvYOh4NeIFhZWfl+Y2NT+XnnLRpZVt6fZ595mNFjJtPa2oFClFlzFvHGay8QiYS48qob2bZlLTm5JaSn+QHYvWsnpSUl+G2XWHJyshg/YSorVi5Hmgni8WzWbh9BZU1vGvfvoFcxeArORzAWATQ2NvLyyy/Tt29vZs6YTe/Bs1m7eRL+jDOZND6P3GyNDZv3UF6SyutvvM3MM88nJzuTt956m+qaGiLhCO8sf4epU6aSlnymznb+BRd8r7q6euVll5739zvvuuOSfv1HoghobmmzvvWtb73/9euuufalF5+5Z+rpZxZoDhUj3ohlRgHFrp3gziIYaGf/vv10hFRuvvmbv25tafq9x5uClBIhBHoiTiIRxzB0PCmpjJ51Dhfc+gPOu/WHTFxwHhl5hQRaW+horCcaCmIlQ43ER+alCy/iaBzYSLKEQJUWDstCfkSr8W8JWKfXS6S9lRV//Z+kor07ZY9hmq709LQzSktLp0iUgmgkHDQNPWwYOqYlcTi07isJiMeiFBQUTl+5cuWH+/cfMPbv3//ehg3rX5aI8XPnzOlXXt6XX//6ZyxYcCEVFXtxaDqnz1jA1i1raG1t4swZY9m2Yx+9e/cG4PDhw5T36tWp5wXA63UzbvwEHnrofhrbxnL1NTeTV3I+FYemsH77C/QZ0h+36ywi0Sivvf4606ZOZfDgwV2/Hz2qN01NBzh44CDl5WW0Ntewdt1mzl10OZFwkHfeeYe8/DymTJ7CgAH9URQVISA3N7frGu+/v/rQvffcc9FVV1788zt/9L1v5RcOxOO2x23Vu6tYtGDqlBtu+u5QVVMw4g1Y5lHaAmnhcOdzpKqC7TsqGDJ0Epdeesnju3ftuN7jTUVKWydr6AksaTFowhRmXXM9F972Q+Zcez1F/QYQamulraGeaDCAJeVR0rw45v//3wFWWha+zCwizc1U79iCoSfAkiT0BOPHjbqlcu+eR79x01ULr7nykssvvPCCbwwYOOiMUCjiP3K46rCh6yHD0NEcLoSQKIpKU1PDnvkLzj3v7rt//CW32zP7vffe+3D58nf+Bxi6cOGiwT5fKn/5y5+4+eZv89Zbb5PmdzBm3BlU7t1OfUM9ph7D5cnA70/l4MGDFBUX43T2TDKsCMGMGWdQU72X9vZ2+vcpZtCQ3uiuhax57wgDBoxlzZoP6N2rFwMGDDhmxEtLSti929b/Hjh4mFmz51N95DB7KytZMH8+ffr06cpkGIlEaGlpobS01NZvRmPBvn373PKlSxYu+u2v7/1RwkihoMAWoBIJk0MHdok5Z88CK4SRCB0FVInmUFGceWzftpbKfYeZNftcLr/i8uVvv7VsodPhJB6PYhg6KWkZTDj3Ai743p0svOV2hk6biaZptNbVEGpr66KkJLvo4tj/CwBrGnGEojHmwkspHTmWcHMjjYfsAL1QW1to3jlnfCUvr6/qS8mkqKhMmzRpcvm11149d/rpE2+MRGIZu/fsrTL0eIuh66gOF9Iyefzxx1655ZZbvnPmmWeUXH3N1Tfsrahou//++2+trNznuvXWW6cKofDSSy9z+Zev5emnn6C8LJchwyZSW1vN1s0biEajDBw4hIbGRnweDykpKcflsQYOHMC6detpbGykvLyc4oJcnFpvnnz6YdLT0pgyZcoJ+bM+fXrz4ouLKSouQREKdXW1LFq4EIejJ+/X0dFBQ0Mjffv2AeDKq649MGJY375PPPbna7fvrGXosBFd07Zu/UaE1UF57xHo8UC3pUqaaO4MUFTeeH0J1dXNLDrvYm648aa1jz7y8DQA0zIpHTiYWddez5fu+hlnXHEtuaW9aG+so72+Hj0W7WEY6Kkx+C8CrFBsXikeClI2ZjxjLriM8rETUVSV/Zs3NPzlrw++kCL0BeMnj0tTVCcQBhKU9xriuPDCiyZ96eL5N6VnZI4/fKTGamlu3JH0Rwi+/vqb1ddf//UFfr+fSy+9dO7AgYPO/PGP7/rxc88/3/T73/1ukqIoWmVlBQvPu5hXX3mRstJs+vUfRXZ2Bs89+wQJQ2XkyNOIRaOkpaWdEHiDBg1i8+bN1NTU0Lt3b3JyUtm9ezeDBg8iLy/vpBahNWs+4He/+z1XX30VY8eOOe55uq4TCAYpKy1l2VvLyct25txz7329F7/0BqPHTsbrsVmBWFxnzerlTJk8BrfL5lORElVTUZ0FHDqwiyVL3iYnr5R5887hyssu2/jgQw9NAayxcxdw3ne+z/m33cGo2eeAELRWHybc0d7Fz4qTWMz+WYAV/26VEG21SfdvpSXRHE7Si0vRXLD//dWsevRBNj39D/rl5/76T3/6wzcGjBrmTElxkZldllRk2s4jsWgjL730xoEXFi95dcmS11+KRSMrv/Sly3/z5JOPfbvzXSORKBdccMGvDx850uelF1+cG4vH3EJR6N27L6+9+iTz5p2Fx1tEXe0+7r33J6SkFfOjO24n9QQU9uj20ssvk52VzZQpk3l1yRLmn3POSc83TZN//ONh+vTpzYwZM054XkNDAx0dHWRk5vDuyiWcf8H5PP3kU0yYPIfysqKu8z5Yu554pJrpMxehR2vQNA3hSMfUgyxfsYbGpjamnT6LkuICLjp7zlvPvbF01hlXXMOEBeczcNI0NNVBS00VsUgUVCU5Z6LLhCxOoEuVwq5qKHtAtWcYuUB+qkqI/5YUtvN/AlCEAtIi0tZCuLWNvD4DU087//z8vhdc46mMWps3bN8zIgvR25QqO3ZsIREPk5ubCUg0h5uhw0ZnXHThRROuvOK8q4qKi6a9/MriLX5/1qiRI0d4ARwOB5dddtmk7Oys4v/9458cvXr3Vi3TJCcnm9LyAbz15mv061dEWnoJ06ZN4hc//wnxuGDChLEfC9iBAweyd28lLy5+iUkTJ5KdnXXS81955VWGjxjO+HHjTnpeIhFHN+DA/j3MmDaUt99ZRUHxYIYO6eaNY3GdndvXMWXKGBxOE9WRiRAmGzdsYMOmXaial0WLzsfv83D1N7/9zge1LWfd9rd/MPfq60jPzqH1yGGCzY12KLuiIMVRsy6OQcl/PYV1SUQ50BfESCEYELNkaUA3i+OGme13aGl987KY0CsD2RqOta1f7W5ubqX/gH60tDTT1FhLeVkBo0YOwecvTLIMPlubj8HDD/3Z6NV3lHb6tJ78pGlZvPTSy6iKwltvv81Xv/IVho8YwWuvPM78BfNAZNDavJsnn1rK9TfczKlmc7/zrh9z7TXXUFZWesJznnn2WUqKS5g0aeLHXq+xsZkHH/oHN35tERWV+whGPMyccXqPc1577Q16l/kYNHQa4eBhtm2v4NChejIysxkzZgLZ2Rk0VB/hoRdeZlvhwP39Tz+zKdbSFFfaWxpSVFGlSrlHleZO1bL2Ksg2kCiWhRQKliKQUvxLKOy/FLACiR0mJwdKxFgpGAtiFNAPyDUkdOgGUcMix6VRnuqmv9/DgDQPpb6exSqWvrmU2iOHueziSzBUjeUrVxCNBPB4NIYO7kt574HYaS1tF4rXXn2J/MLBjB498pj3b2lpYe3aD3nk0UeZM2cOo0aNRo/VM3b8VMDNurVv4vaVMXzYoFMCbENDAxs3buLss+ce9/gTTzxJTm4Os84665Su9/f7H0aP1XHxheewbnMNZ8+d0+P43soD1NfsoH//AXywdiOGqZCams7QocMpLi4EYPOWLWzeuJEzZ8+mtLiYD5oC7GyPsisQpTFm4HeopDsUVGmFFGntVS1rpybNraplbXVIc4NqWe2KtCmgJXoWm/7/BrBKp1OKEF4kpyOYacGZIEZ2bQsCIoZFe0LHqyr0SnEzLMPLyMwUcj0nr1f14dq1/PGhh7nlii8xaurpJHST1e+/T1NTPf5UD8XF2fa2qWQBQZ547AmKSoYwffrU416vra2Nv//9foYNH8mGDeuZMW0YU09fQEvTPl565W0uueQqfL5Tq/KyatW7+P2pnHbaaT2+f3HxYhwOJ/PPmXdK12ltC/DyS08xefwAqut1Tp9+VtLxprv97x9+RXlZLpG4m4z0LCZOmkRqircb0B+u4VBtHTPnzkNz93z+5liCdc1BNjSHOBSO49Y00l0aVuecSwvVsgIOaS53mMZ7Tmksd5jmlk7wmkL5zwesXR5ddQNnW4KLJGImdurpHnxre8IkpBvkuDTGZKUyNieV3qmek05gW1ynoiNCZTCG5c9gXcV+Vvz+F9w4qh83fv+OrvP27NlLdc1hIuEAeTl+Ro4cgcuTw4vPP4LHl8/cubNPeI/6+no2bdrGs88+xayzxnPppdeya+eH7N3fxsJz55/wd6FQiHg8jsPhwO1289577zNx4gS8Xhs87777Hm3tbZy7YMEpmyY3btxIoH0fmpbJsBETSE9P7XH8vvt+STTawaJFX2LY8GE9+cxYiIdeWcoB6eT6BbMpOgkBMCyL9U1B3q5rZ38oRprTgd+hYknZRVFlktfUTHOX0zKWus3EI07L2NrFYgnxnwNYBavTT3UmgkstxDwg/2jfiWSNYdriJiHDoE+qm3HZqYzLTiXDdWK7c0sswc72CDvbI1SFYjTHDSTgURUK8vMJ6QbLH/gz0x1x7r7hK7gLS7p+W1fXQGVlBYFAK16Ph169Cqio2IuipjJjxiwcjhM7OHd0BHn77bcw9CilJTk0NNYyY+Z5PUykra2trFu3DinB5/OiJP1BnU4HH6z9kKzMTL785Suoq6vjneUruPyyS08ZrFWHq1m+7DmycvIZM+4MCgtyexx//vkXqKmp5hvf/BbKR15j97q1PLJhJ/uyyygZMRo1HCBbE/Txuxmc5mVwuu+40QSWlLxd28bbde00xHQKPC4cCiRdXG1yJJLgtSyclrHaaelPe434E6pltllCwRLKvz1gUxBcIuFaiZjQzRr0tAwFdZP2hE6Zz8W0vDTOKMw46YTtag+zvjnI9rYwLXEDh6Lgd2i4VNH1xNKycLpceAqKWPH6G6Qe2sVXpoxi9swZH5G0DTZsWE9dXQ052X72Ve4kM7uQuXMXJeO0TtyCwTAffvgBDXUH+HD9Fn7yk1/i96dSsXcvmzdtJi8/j8GDeupcA4EAhw5VsbeyEpfLxZEjh7nqyiu7qO3HtUgkzv1//y0+r5v5515BXl52j+Nvvvkm8XiCc8/tSa2rd2zlta27WRU0cQ4dS+/CfBJtLejYrFfIMHEKKPO5OC0rhZGZKRR4j61e05HQeelwC+83BHCoClkuB9bRaUiTOECoSAEOy2h3G4n7PWbifqdlVAIYQv23A2yOFOJ6C3HT0Vt+T6BC3JQ0xnTy3BrT89OYW5yVNL5YxC0Lt6OnE9mmliDvNXSwsz2CISHT5cCtiGNc9joXQlg3aY3FKSoqwpOIkrL+HfqmOBkwbAT9+vU75pkqKvZSX1/D5k1rqKtvYsqUmcyf//HbtGnC3+//C5YlWbRwIXv37mXUqFFdjjEnanv27OGDtR9SXFRIWVkZ/fv3/9h7LV78DBW7t/G1r9+WjNQ9SuBctgxDN5g37+yu77Zs3MDi99exMQrewSPpN3QYzmiIeDSKUHpa+i0goJuEdJN0p8qwdC+n56fR13/sYtrcEuCZg800xQ0KkiyFBTgVgWFJmuI66U4NTVUxsKmu20z8I8WI/c5hGdskNp/7LwSsxEIUIMR3JXwVhK/zCkHDwiEEHk3pso40xXQsKTmrMI0Ly+0t7UBdO0+t3cdp5VlMHlBIWnKF7wtEWFzVwp5AFFUIstwOTuT620mx2xI6BW4HY7JTGZPpozw56Pv27aeiooKOQAe9e/dmwvjxx1yjvSPI+nVrWPbWMpqb2rjiisuZOXPmx4KpsnIfzz//PEOGDGHBgvmnvMVv2bKVqqoqItEoUyZPoqSk5LjnLVv2Bh9+sIpvfOt20tO7wRoOh3nl1VcpKytj0kRbHbZ69Wq2bd1GbmY60fKBtA8+jeaQQbjDzh9rmgY+nw+nHsWIhEFRe4A3bklaYjouVTAi08e8okxKUnoKZlHD5OF9DbzfGKDI68KpCBKWZGSGh1yPkyVH2ggYJnluJ4oiMISCIi3cZuKJFD32E5dp7DGTqjH+jwGbLgW3WohbOs1LioCwYdGeMBiXlQJIDoYTCAR10QS9U5xcPaCAUo+LxrYwN/9lJR1Csmh8b66YNgCXliwfdLiZJTVtGJYkz+NEOSFQQbckjVGdPI/GpFw/U/PSSHcenwfevGkTh/dXkO52UFyYS58+fSG98Fi96DPPsmnzZvLz8jj77LnHdVg5utXU1PDQPx7mhuu/TlZW1ify8dy5cye7du1i/vz5uD8ita9e/R4vLX6WW2/7IXl5+d27zubNVFZWMn7ceMrLy9i0aQubNm8mEAjSp3cfpkydQooq2HPoEGtrm9hU20x6igePy01jSzOOgaPIys4mFgoew7sqAhLJMfWogrMK01lUduyG+VJVE69Wt5Hq0HAqAlUILi7PojTFxUtVLaxtthNC57g0pBDoQkGTFj49dmeqHrlXlRI9uWD+6YCVQlwi4Q+dW78QNiNeF0mQ6VS5om8uGvDi4VYa4wahhMH0/DSu6mcP+q+fXsdt//M2U6f35/W7zyXF7ehi8v+2p5b3GoMU+lx4VKUHr9TDTCcEbQmDiG4yPd/PwtJsUp2n5pO+ZH0FT7+/g+baWkYXpTB+QBFjhg2ksLincv+d5cup2FNBaWkJY8eOPakvwK5du4jH48eork5J+t+0EX9qGv369T1qq1/Kk088xi9+cR8FBfaiqq6uZt26dTidbvr27UsoFOTBhx6moaGWmTOnM3XyJCKRIMFgB/7UFFLdGulOgdfnJqO4BKTk4I7t/OXDQ9QPPJ1e2akY+vEjYRUhiBoW9dEEwzM83DCwkJSPsGtrGzt4oLKBlCRo62MJLu+Vw6yiTCo6IrxQ1czeQIxslwOvJtARmELFbSZ2pCfC17lMfY2RFMw+d8Aq9vY/2BLKr4G5RwOnPWEQ0A2m5vq5ql8ewYTJvduO0Bw3cAq4om8u0/LSOdQW4oLbX2Lja9v5+e8u5PYLejp4/HbnETa1RChLcZ20jokqbIqd7lC5vHcOI7JSPxYUSytbWXEwyPaGKC26Sm3CQ11LO0OtKm4aBEPzvIQSEiklJSWl9O7TG0eS4u8/cICtW7YCkpkzZ/bYmo/eoj/88MNTYiM+2nbv3k00GmXUqFEAvPzyK6xctZKf/uQneL1e2traWLXqXerqG4jHE5SVlZCa4kZPhHA5VUaPGoHDoaLrCdLSUkFNx64YDpCgrfkI27bvxrIEGWmZ/OHvDyEu+QaejEwyMTFPQBQ6VY41kQQ5To3vDy8hIylwKUkw7WgL8YddtXgdKj5N5WAwxtnFGVzex17cb1S38PLhFhAKuW4HppSYwmbuUvXoL/yJyPc7gyI/N8Da34jbLCHu++jL1IYTZLg0FpVmMiUvndpInHu2VBE2JWkOlRsGFjA43cerW6s497bFyIpGHnjiKq6d0lPYeOVwM08ebKKv38PJcpipQlAfTVDocfDNwUVkuk4eerF4ZzNPbW/hw2o7GUSKS6MhmGBqLz/fnN6X6cmddseuPWzetJGKir3E4xEUIcjKyqb/gEH079efaCzK9u07SCQSpKenMeusM0lPTzvG4aWwsJBxY8d+IsDu27cfkPTt25cVK1YQjyeYM2c2tbX1LHntDQ4c2E8oFGLK5PEUFGTjcsLYMSNRHZ1btdlleka2U1NdR119Ey2tQSxLxTQhKzsHUFjyyiucM3cWA6ZO5Y+bD3EgnKDY5+wMgzvhmFdHEhR7NO4YWYZiWdR3hCjK9COEwo62EP+zs5Y0l4ZXVTgUinNmQfeOuj8Q4eF9DRwJ6/a9AAuBoah4jPi76YnQpU7LqDGE47MDVkiZawnlUQmzPypd1kYSDE/3cFXffDLdDqrDMe7deoS4JfGpgluGFNPX7+H+lXv42p2vQl2QH//2PO6aP/IYC8u9Ww+jKSoeVZxw4DqFOUVK7jmt7KQsQG0gxl3Lq3ltbwCfU6MkzUlcN6kNmdw8ow9fGajRfnAH++ua6YhEMI0YebmZ9O7dC7fbQVtrK3X1DSR0E0O3iETjFBWVUF1dz5tL3yIQDDN61GgmTBjPoEGDSE+3tQOvvrqEefPO/kS1Yrdu3UY0FiMWjbP2w7WMHTuG7du2s2LlOwwfNoSZM0+nb58S0vxe/OnlnZYAkCEa6xtpbGyhpbWDWNxA123HH7fbR0ZmJv369cfrcRJsrOWBJ57jtFGnMf30aV0Ggr9W1LGpNUyR13VC9quTRTgQjDK3MJ3L++bT2BFia1UTE/oXkep2sqahg7/trafA60IVUBWOMyPPz7X9C+ynNUz+vreOjS1hCn2uLgFaV1Q0y2rPjgfmuQ1jTVRzfCbAnm4hFoPI6KoOIMCw4Eg4xqzCdK7sa6+ioG5w5+ZDBHSJlBbfHlLE0IwUHv1gH1d+dzEEdWZfNoo3b5tzLA/XHORPe+oo9LqOcoU5jmMF0BhJcNOgAkaehA3YVBvk6hcP0Bi2GJDjRhWgGyZBLZVvjc3gHEcl2/YfxtQ0+vUroby8BER68g7xJMUS2HGanXUAJJjtBINh3G4P+/YfZPv2XTicXnRdguKgrLScyspK3B4vF5y/8NSErl27+fa3b6G0pIR+/XoxcfwYVM0iNcVDbk4mOTlZWKaFZUmaW1ppbw8SiRkEg2GamttxOty4PT7cHi/ZWTnk5+eTnX2UTjveyq/++gyGNLnpsvNIzTlWyPz9zmr2BmOkf4wMkLAkUcPkRyNKyfM42V3TytJth7l57sguQey5qhZ6p3owpeRgMMa5JRlc0rub9398fwPLatspSoLW1tHaizsrHrrIbSaeAz4VYK+yhPKPj1I4XUJtJM7CkgzOT6qmTGnx062HORKx1VYXlWUxuziLnTWtDL3yEbswcJqTlsevIfM49veacJxfbD+CV1PRlBNbm4K6SaHHwe3DT+z5dKA1ytxH92ChUp7uxLAkSIuA6ictXMsv+x3CdHgZMHwoGVnlQDtmIs4pZZgX2KEqqgNwJ7skEa2jYu9+WlrakTjZsWMLU6fNYeTIESe8Vjgc5m9/+zsvvvg0AwYMYP78uZSXllBeXkZCN+lob0MoGtFojPb2IEKoKKqG0+nG5XLjdrtJT08nJ+f4WokjW1bzxqZ9LDus83qtk5mzz+TZ8ws5nqliXyDKfduPkOV2opwsmxGC2kicrw/IZ1yOvaP87KWNpLqdfGOOnSrpNzuOsCcQo8DjJGFJaiJxruyTw5mFmV3XeWxfPW/VdVCa4kJKG1dGMhdwhh7+ckY89JhmWlhKT/2QdvyHklhCfF0i/nI8CtcQTXBeSSaLyrtVHQ9XNrAvGMejqgxMczM7aQxY+Ou3bGIlTb514ajjghWgyOein9/N1rYohV5Hl+nvGIuPYVKacmLKGjcsbn79EDFToX9WEqyAcLjpqG9gvncbI8ZOx5nRD4gAbWBZXSbUj0sALKVdHBnDtLfk5Kg4NJVhI07DrmoIM2bO5uGH/pcNGzcxedIE0tLSEEIQCAQIhUK0tbVjWRbhcIhZs+bi8fg4dKiew4eb2b7rMD6vj7y8HIYNKsOfmdHllH4i4Dc3N6MHWwm0trDlYD076oKsOhTkkKuE7EFTmDYinXUVh/nm4ggPLOp73K3rZISiy1SLRBWiByW+fOoAbn18DVedPpBUj4Ov9i/gh5sOETYsvJogz+Pk0f2NFHtdDEy3M9Rc0TefDt1kU2uYYq8LU0pUaWEJQasz5VGnacQyzPBzuujpaa0d4yArJVKIOyzEveI4jHdVOM74LF8PsL5b386K+gBFPiftcZ0v9bap7v8u3cG+9w9A7xyEtPjxwpEnHYx5xVlsbjlM3JI4xfH5WInAcZKBfXFXM+9XhRlVlNIFVoCwlkpOy0puPzsbZ2oa0doNNMfAsCRutwuv10NaRrrN+WDZYLYMLNM6ho9DU7DTErnoTtcSIRxopq39AI2NrdTWtVJQ2AvV4aGtrZ32dju0JBgMkpKSSmFhAX379mXWrG6XQsuyaGtrJxaLoieiWDLBuEV/QRECM2aQV+DlmkV9cDsVEALLNOkIBLBMkyGleWxrjvHTNR1Y7nQ8+cMpmj6Q0aqOEWwl3trAwBw3Kw+F2FIXYmRBz4iJulicmCXJECcXdqvDcQaluenn73ZKKs1KISPFxSsbD3LZlP74nRpzizJ46lAz5SluPCqkOR38paKOe08rw5/UkX+1fwHf33iQtoRBmkO1ffqkbeRt8KQ9K5Gne434u/pRxg3taFQIwBLK9RYcA1YBtCcMcl1al+QH0BRN8PiBRvI8TppjBjPy0yhMWqp+8so2yEqBljBTZvQl3XtyV7w+fg8Ly7J4+mAzvVOPf65bFdRHEie8xvuHQ6R5HF0JyDqby4ziLu7LNa8epPH5ZZw9NI8Lh2aiJHQa2hLEzQ5aW3YSj0fIykonLy8bf6qX1FQfihB4Ul1J6mnQ3lxPfUM7be0dtLS0g1Dx+VKwpM3zJnSDvIJSxo4Z84k0BYqikJXVvW1+977VVLzbYS+gwnyuvfZMFswfjCpkVyRIqtuB4nLTEFP489vN5EwxyHNZyHgYGW6gi0IJcAgIJyw2VB8L2B1tYZwnERJVIWiK2xawy/vkHWNs2HyohVHl3c44MwvSWdXQQcgw8aoKGU6NqlCcpw40ct1AO4zHpSpc1TeP3+2qJdWhdtFRVVpYqLS4/W85wy2FTtNo0RUNkGgfoWOTJeLP4gTCTsgw+drgQrxaN+IfP9CAKcGjKYR0mJJr8zWL1x+gcVc9ojgDWdXKWYMLTmnSzi3Npi4S5/3GEOUprmP8BVIdKrs7ItRF4sc4aUgkh9sT+N3qMdRZSwRJpJeyw9eHWDzB0yGNcKufBQPTGdmJkXiYXRX7aG7roK4hSn1jGEVpwtANPtx6hPfePUAobvGN605n+IB8nC6V9Mw0srKzyMrKJj09DadD5bO2h5/dyI/vW0HVxipmXjCaK84fyuUXj0ITxwfUsztb+dV7NbTHJL0ynOiRo3N+9mRnNAUyvT05wdpInG1tkRNaB9WkSV1Ki5sHFx0z7tuqW1m/rZYXbp7VTVg0ldPz0ni2qgWf14kpJUU+J6ubQozPCXYJzMMzUxie4aUiECPTpXXNt0OaJBTN2eJJfzM/3DpWS7ILWpd/lRB+E+WtE6mSWhMmA/1uhmZ0r8zVDR1saAnTK9VDR8J2DyxP+q8+/v5+W5UA4NEYVX7q5sqvDywiYhxhU2uEEp+tIukEoKYIDAnPH2rmG4OLjhEIsjwqG2qj5Hq1HiyBFCpCj5FFDNUtiBlxHljTymMfwmkFHs4ekMHkXhkMHn4cIcmUFJW34kut4J33DrLiQ0lGfg6njyvks8Mz6ZbYHmHTzhpeW7aHnbvquHTBUK569ir6984+7vnN4QQrDwZ4bGszm2qjZPsclKc70E15QmGxPWqR69M4vVdP3fHSmjbilkRT6CF4doreVeEYuS4H3xxcTMlxZJD5977G8EEFlGT1pNqjs1J4s6YNQ4IqbJNvikPjpcMtDM9M6TI8TMr1s60tcgyBdFgGYc01pt3luzMzHrrHFBpaJ0trIp6Q4DkRdY0aBpNys3r4SS6rbSPD6QApiRgm5Uc5SeyqbYcUN9KwwOMg1+/5RBP47aElPL6/nqU17aS7HGQ4NUwpkRJy3Q42tIZ4/UgLZ5f0XAi3TS3kgyOV7G+N0zvD1ivKY/AncSjQN8uFYcH2xgQfVNeQ5amnb5abobke+me5GZzrYVCuD6cq6Ncri37XTuKmayeBNNlX2UioLUBahv9zAayKRU6am9uumUhh2bEgNUyTvS1RNtVGWF8TZltDhINtCbwOjX7Z7qROVXIiD7mECRXNEf4wr4Qsbzcl3R+IsLoxQJ7b2QOsStLsHUgYTMhJ4fLeefiPo/K69k8rOLyzlk1vHhvMmud1UZrioiqcwO9QkRIyXSqHQnE2NAe7tAx9/R4yXRoJS+L8iHyiWQYdTt/dHiNxv9My6jRb8lOmWCjnnEhdn7AkOW4Hw4+irjvbw1RHEuR7nF2/yvPYAxGKJahpi4Bbs1P4eZ1k+JyfeBIv75NP71QPi6uaqQrFyPc4caoCKSHP7eTZqmYUAXOKu0E7JNfHi1/qxzdfO8SOxgjFaS7SXOpxFeKWtCczL0UjDw3dlOxpjrO+JoJpSTI9KqXpTopSnRT5HZSmu8j1OSjN8tCrf4Ft+JTyM6VA72xp6SmMSLfHtzqYoLYjxpGOBFXtcaraExzpSHCoPU5zxMShKmR6NHpluI+2nB9/ISiCtqhJVXuMWyfnce3o/B5RBQ/srcepKmhK93hEDIummE6J18kl5XlMyUs/7rV/8I/3eegP77DkuevISjm+zFHsc7EnEMPfySpJUBWF7W3hLsBmuhzkuB3URBI4lZ57liolCUUl4PT+MScWOF9Lxlj99WRDHjUs+qa6eqywjc2hrm3DlLY/ZEbyeG1bhGA4AVqyXLVhYnzK6oaTctMYku7l+UPNrG8JYcQh263hVhVy3E6eOthMe8Lkkt7dDP+QPB9LrxzIr1fX8sz2NvY0JchNcZDuVk/qn+BQBdlejewkj6dbkuqAwd6WBHHDsmu+KgKPQ5DmUkl1KbYp0qng0QRpbpV0l4rXqeFzKT1YmS7KJSFmSoJxi5iuE9IlgbhFMG4S0S1CCYtA3CQQNwklLCwpcGkKXodCilOjb6ajxzVPNKydVLWyJYbPAT89o5DrxvWUI/64u5aGmEGxz4WFJGJatMcN0pwK84ozWFCShUc7PtNzxnefZ/lr23nz2euYPbzkhPOX49J61FaQgFdTuqJEOnHnd6hUHWeHkIBmmUQ153kxVSvUBIwDhpwswaxuWaQ5ux/ctCTVkTgpmtYVYigE3eqmThQLgXCqyLoge2o6GFiQ8emoj9PBtf0LmBGMsrSmlW1tEaKmJN2pUeB18WZNGwdCMS4uz6ZP0v9VU1Vun1bC5SNyeGZ7C6/uaedgawwpBFleB36XckKXxS4AK4J0t0q6W+0BEFPaYG6KSGqDCQwpMSyJaUnMZE5aO/HvR5KpdssLXV0RtlDjUAWaYneHqpDhUcn2He/XJ1Pq29ljggmLmkAcryZYMDCVb03IZ0COr8e5f9lTw+a2CEVeJ01xnahhkut2ML84g2n5aWS7j78jLl69j4vuXUKK18mWZTczoujkc+pUukP6P66d2BwvMYRKVHV9WQPOO14Iy0cvpPRgESxipuyK1lSEDeJYUmdZlp1CRrqHtvoQikvDNCTPbaxi4Zjyz7Rt9k71cP3AIg4Eo2xrDbO9LcyRSBxNUdjSFuFgqJrp+WnMzE/vkmSL09x8Z0oRXxmTy/tVQVZXBdlQG+ZAa4y4BT6nSppLxa0pnILeHCFAE7bw59H+9RUEO2lDWLdoixpEEiZl6Q6uHJnJuQMzGF/Sk8euj8Z5uLKBD5tDpDs1OuI6fVPdjMxMYUx2KmnH4VNr20M88MYu/rpkK/VtEW46Zzh/uOnUPNJipkR+RLsRNy0ynOrRgeEEdPOk+nUBJFTtDM1CjBanMChHq89dqoJXVehImHjU5MUsaIjafpUuTWPqgFxe2VEHmV7ITeXJ13dw30WjKcpI+cyT1DvVQ+9UD/NKMtndHmF/MEZVKEZVOM5TB5p45XALp+enM6MgjUFpNmVJczuYNyCTeQMyCcR0NtSE2FIfYVt9lANtceqDcSKGxKWppDgU3JqCUxUoyr9fYUtTQky36IibRBImXoeg2O9kbGEqowq8zBuQQaG/p+qpLhpnWU0bb1a3ghBMyfPTJ8XFkHQf/dKOtaI1BSIs2VDFI+/sYdV7laCpXHjWIH799WmUfoI5rIsmeljQFCGImVaPaOjWuJGMcjixHliRFoZQ+2kCOd3i5JPiUhWaYkaPm/ZJdVMZjJHuUrEkOFWFI5F41zk/XDiSV17fiRlJoKY4MQ+FOOfnb7L5vgs+t4lzKIqtx8u0B7BDNwhKqEvo7GyL8GEgysG4Qf9UN6UeF52bnN/tYGafDGb2sbezumCcfS0xdjZG2NEQpTqQoDli0BIxCes2H+lQbV7SpQqcqoJDFaiiO/L382yWtLthSRKmJGZYxAwL3bRQhK3zzkvRGJrrZXShlxH5Pgbnesj0dm/jId2W8BtjCSoDMaojcSzga4OKGJeXhu84++j2qhZe3lDFEyv3smdbDUQT+Hpn88ubz+SGc4aR4vxkGbR102JPR5TUo3TTEcMi26UxLrvbvH4wGKMlbpDvPbFgLqTEVJQCTSJagdyT3dirqVSF49SEYxQl9XBT8tNYXt+Obtk6Nr9DpaIjQkg3SHFojOuTx1evGMf9v1+FHFaEUprBljUH+erfVnL/ddP/KZQnzaGRhiQtHKfAodGmm7SF4zQldNKyLHI8x1etFaS6KEh1MbU8LQkYi9pAgpqALZ1XJz83hHTaYyZtUYNgzCRqSHTLZodkciF386X23/JEO5YkqaazVXUWNu8rksKfRxOkOFVyvSrZPieFqQ6K/E4KUpyUpDvpk+EmJ8V5QhbO6dDIcWjk+tyMzDpW9VbdGGDz4Vbe21PP+xX1bNzXTKI5iCffz/jyLM67bioXT+rD8PLsTz0f7zZ0UBux/V87x6cxGueC8qweAvyu9vDHFqyzEGhStmgIsVIgLzrZyVpS1bG+OdgF2CKvi3HZqbzXGKTU58KlQHXE4P2Gji4109+vmsK2vY18uGo/ar9cRFkWDzy0FkXC377++YL24RW7eWR5BSs3HYaWMDg0cKp2VxXUVDd+n4viLB8lmSmUZHkpzvRSmOGjPDuF0mz7e5fLgSIUitPcFKe5Gf8RAThmmLSEdVoiBi1RnY6YRThhEkyYhOIWYd0iqtuUWbc+muquG1AuzRb+MnxO0j0aPoeKSxX4XSpZXo0cn0amW/lUhgkBkDBo7IhQ2xJhX2OAHdXt7Khtp6K2nf0NAYyOGMR0kBJ/UTrnjC1hVFkWS5ZXcPppxfz4vDGfaT5aYzqLD7eQ6da6nimgm+R5NGYfFc7fmWmm08p1QsAqCpoR368JaW21hHKR+BjpLdPl4L2GAHOKs3AneY1FZdlsbg0TNExSNDtW/fXqNibmpnUx7x/87DyGfvMpdq2tQgzMR/TN5e+PredQXQdPf282GV73ZxoY3TSZdOfLbHh+K/icTFs0ggl9c8lOdeFzKCQsqGmLsOtIG3uq29hd0872XXXQEYVoAnQTVAXcDsjwkV+UzoS+OUwekMfE/nkMLkon4yh+y62pFKWpFKV9bhwpeixOwpA4VCUZG2diWCbBgEUoYdIajmNZkqhhEY6bdISjdER0WoJxGgJRmoJxGgMxqppC1LSFCYTi9vsFk6D0uWy+Jd3L2OGFzBiUR4HXyaIZA1h4WhnVzUGu+/NK3tlZR31LhK2HWvlo+ahP2v5eWUfMlGS61K7wm+ZYgpsGFuA+SlX25IFGoiaku5STOo8n1VsbxR0b9veyhHLgYx0zkp46ZxakcVmfbmfcNQ0d/KmijvIUN6oQ1ETiDE/38q0hxUfxLQaL7n2NZa/vgrIsRIoLua+J3N6Z3Hf1RK6cMehTD8xFf1rOc79ejja6hJU/mc/kgYUfL7kmdJqDMRrao9R3REkYJpX1AV7fUs3WqhbaDzRBa8Sm0gV+ioozyEhx0b8gjcIMLwUZXvLSPGT6nGT4XGSkuPE4VLwuFa/TgVMV+NwaQlGPA0+Lx9/axdLttWw53Ma+5hB6IAZxy07daHXGqST1Z6YJccNWkSVM6CzKpihgWeBQIdUDKU7SCtMpTPcwrk8uTlWQn+5hSFEGmWkuBuSlUZLp5efPrGfptmripkDRTZb98jw0RcEz8Ze4hhYQe/jqz7wEH6ioZXVziCKvbT1TheBwOM7E7BSuO2p+3q1v58HKBop9ro9f1opKTrRjurhjw36kUJ6ViAs/rtiXlXTcvnlwIacd5e3/tz21rG4KUp7ixpK2jnZRaRbnlvbkf3781Ifc/fBa0CWiPBNZH4BQlPPmDeVHF45mZO/cTzQw++rb6XftY9AQ4sX7L2XRaWWfaoBf3nCQA00Bbplr+xE0toXYWx9gT10HH+5rZNvhVoJRg9r2MJYFJhJFStJTnBRlpJDhc5Kf5qYwzUNxpo9+uSmcOar3sffZWsXXf/sO9WurbIo3pICCgjQyfA40AbGEiaYpmJYtyXk0gduh4Hc7SfM6KMv2U5LlI8vvxq0peJ0qffL89O/cYqUJQqWyrpV+Bd1eX1Nvf4E/3zidFzcc5sc/e4OdL99AIK4z8ew/Me2Kcaz6wdmUfPNpgrEE7X//8mcC698rarvYRJEkdE0xHZ8m+Mlp5V3UdW9HhF/uqCbd6ThpSBSAoai4zURVfqStXNy1fh9SkGkIteXjqSwEdAvdNPnB8BKKk/ysaUnu2VpFTUSnyOckbkqqw3EuLs9i/kdAu2JnNdf9fgWV2+sgPw1SXVDVAqkurjhzAN9bdBpDyk6N0f/Tsp3c9J0XGLFwOG/fdibr9jVRmO4jL8OHy6mR4tJwHrX9bD7UxNvrqxhYmsn88d2AEpc+ALqJfO66Y+5x6xNr+WBvHavvXnSShSyPqh1gf77z+Q2UZPn4anL32FPbxqBrHoVAgklnDOCsofkcbmhHWhK/z4mmCdwuB6qioDkU8v0eCjJ8ZPlcFKR76FVwfOehtnCct3bVUNMc5vbfrWDGjD4sXbqLr189hb98eSLr9jcy/sK/8d5TX6GqKYTuUkkJ6Ty9/gAf7KijWVWI/+MqfvziJu7+2ZtUvHo9/T+FgSekG/x5Ty072qOUJMEqBIR0i6BucMfwki7HqKpQjF/tqAYhyEz6iJyU7VNU8qLtc1L02FINIRHQqkrzy4ZQHxUfQ2HTHCrNlsWvdlTz/WEl5HtdqIrg20OK+PGWwzREdfI8Dop8Tl443EJrwuiK+QKYMaSYir9fwa9f2MAdT28kUdkIhengUHnsxW08trKSc8eVc92sQcwd0+ukLxJNGNAepV9xBtn+FAKRGg7VdyCEYFttO4tf3cl5C4bz52um8KPFm/jJz96kaHghrYEYY4rSePvXF+HUVFxOjclDC/nDm9vZV9nIDZeMZWDSzj1zSCEjyzI/ll3qYVkA7v3zuwwYVdIF2NUVDXCojb6zB7L63nP47RvbmZpWwIh+eXjdDrwuB16XhmVJVMVWo6mqikMVODWVTYeaufq+pdTFEkQ74sya0ocXbjmLN7Yc4bJLHyRj9iDu+PJ4Rg3OZ3BRJv9zz2v86csTONwahjw/4/vmMbpXDgt+8CJpfg+//8ZM/rS8gp9/8xkaOiJcObUvd+9r4OWNh7ntnE8G2B1tIR7d10hrwqQsxZ3M8mMbDZpiCb41qLALrHvaw/xhdy1CKGR9DFgFEFc0UozY6hQ9vtRQNNQpX7sFyy6Dsw0h0kFM+DjzWYqmEtAt1jUHKfY6yfU4casqwzN8vN/QQdCwyHBqeFSVLW1h9gei9PW7u5IwCGDy4EKumNkf4dHYcaSVxJE229nb5aBiWw1PrNjLGztriMYSFGV48B/HrS0rxcUfV1awa2c9V5w9mGmDihjbL5+x/fI5Z1Q5t/1lFRmF6cweXsiCyx5k4ZfGse6+C7hq1mBuvmsJjW4H80eV8r9v72bXrjrC0mL1rjp+8ZdVnDG5D2XZqdz08GoEgrOGFXPdg+/x7o4aXtp4iNv/tIo2JNMG2IsxJi3ueXwtv3lpC5YmWHakneHFGVw+xQ5Hyfa7+d2qClprg2xqCrCzqon+JRkMLkwnM8VDtt9DqseBz20D1+XQcGoKqqIQ101KL72fsUOKeOPu+RiqwoM/eYNLLh7NhH55/PSh1Xz3K1O565Kx9C9IZ/aIEn61fDdv76mnojlIB4LvzhvOz17ewkPff5l7f30+LY1Bnv5gP80tYZodCl+e2h+rJJ25o8sozPCdsp71pcPNPHWwGQPI8zjt3QY77q8umuCKPrlMy7edZ1bWt/HA3gZURSHL9fGU1RAKDmkm8qPtE1UpwxKBevrXbk6qXgQKcilCDpGIIR+nNUh1qAQNi/cbA3hUQR+/h1SHxrAMH+uaAwR0C79DJc2pcTAUZ11TAJ+mUHaUV0+618Wc0WV85YwBCI9GRW0b0ep28LogK4Wag628uWoff3y3kk0HGtGEbfZ1JoGfneph4LBCXnhxM394Yj17Ywk6YgaNgShLth1h6as7uOf6qQSiOo8/vYHl919OqsuB3+3g95WNHKkPcNOsQdz+x5VMH1fOyrsW8J2Fp/HLV7fz5p4Gbjl7KF/+6ZsYTo2vzhzAl/60ilUvbGb4mBJUp8rffv4mvUeVMqIsi5E3P8Pzz24ip1cWL285TMfWWqZO7MWC0TZf7fdojB9ZzJMr91LxdiXVTidr9tSxbEsV72yu4r1d1WytrOdwYwdujwOXQ+3BzkwcXsiUgfk8/PZuthxo4mBLmOHDipjQN4+7X9hE/365zB/VzcOfM70/3//lUire3MO1V4xnzogS+uSm8KFl8ocn1lHZHORv103jhzdMZ1hhBrl+DzOGl5wyWDc0B7h/bz0fNofIdjtIdWhdYDWBw6EYC0syWVCaTcK0eGRfPS8dbsXv0kg/BTbATuGpkhPrONNp6jvjqp3uSBNYH/UmugjB3yXiqyc3D0oyXRoRU+GxA00cDMX4Uu9cSlPc3DmijLu2HKI+liDP7aTI6ySgmzy0r4EPm4PML8liwFHmwNx0H/ddPYU7Lh7DI8sr+OvSXezaVW87gGeloEvBS0v38NKyPeT2ymTagDzmnlbC7BElXDK6nPPX/4A7H1nDb1/fwVOvbINIHNqiZI4s5oJxvTjQGATL4un39nHLvOEEdYP2VXu5/JszME0L6tv5yuzuyoSjJvdhzQcHiCcS4HUwtNTeIsOhOCPmDuHBr9k6ZLF0D3vqAuyta2Pnazt49LGruGJiXxo6wuTP/iOReLd18EhLkEE5Pt773QXc/+oOHlm6i5aGEC05Kews8JPVGEEmDKx4gkEl6Vw0tQ/zx/WiJDMdTVVYuqmGF1bs5pdfncY3F4ykfHklW6rakpYdF69vqe4xPyPy07n31rP4+S+XcsVku55XSVYqq39+Pq0tITKPcrbOKT51FuBgMMqSI61saQvjUlXKkoJ2J1gNCYfDMS7vk8vZxZlsbQ3yzMFmaqO6nYtAcApgVTCEQn60/SspemxlQtFQkj/Rjm+3lV+TQu62UH57cq2BxKMIin0uPmgKsT8YY15xJtPy0/nt2D7csfkQRyJxSrwuUjQFn+aiIhDjwO5aRmf6mJjrZ3B694r2e91845wRfOOcESxZd4BnVu/n9a3VtB5sAVWFdB+NzVGe37+L51/fiTPfz5SB+Vw5rR/XzR3MdxYMxeN0EDYk8UiCkgJ7KxpUlMHNd87j2/ct5c+v72BfVQsZhWn87OIxbDzUAk1hfvPyVi4aV05VW4Q1z27k/MvG2uU52yIUpCcXV0eEoWV2us5ANAFeJzmpLg42BsGlMmeYHQGRl+aDkjRq2qJd71aancbWqib0uM55M/owZUgeoZjJuqpWlm6roW53A4TiYEoaD3awpTrESx8c4s4vjWPKwCJ+/9d3yR1ZytCSTO5fvgdNU3hwZQV/vnoSl84bSmN79Jj5uePc07hx7lDbyf6olpn1yf05DgWjrKzvYENLiKiZTNAn6KE7NaQkalpc2zeXKXlpPL6/gVX1HThUlRJf0plentzgYecnEGTHA1f59cgjAA7ZvfBPkJegMzxCzLSEeBgoORU9bUcyv9bwDC8XledS4LEjJbe1RclJWjw6M+M1xXQ0Aadl+piUm8aIDN9xjfLtoSgvfHCAl9dXsWxHDfHaAAgF/B7b/hmK28rxVCfl5VnMGlHEmUOLGN8/j9JMn62vTLb99R38/qUtpHqd3HrpWDI0jYdXVfDTp9ZTVpTGxv1NtB9qJc3vpua564gmDHL6/Yhf3v9lvjt/OGLgXVx04zSe+cYZVNa10f+s33HvvQu5cdYgMifdx3mXjefPN5zO46v2cuu3nmPmNZN45wc9C3HEDZNn11RiAUML/LgUlcZgjFBMx+l1sae2g0dX7mXze/ugJQq9M3nw9ln0y/dz6V1LEB6N3143jclDCrnjsQ+Yf1oZUcOkLRwjP82LQxVI0yLN72ZAQTr5Gal8llbREWFNY4CNLSHChkWO24FLFccNw4+Zkj4pTkZk+ni9po2aiE6Bx9nlHP5xzbAzwIQz44FFLlN/SwCaNHtm7j4ZYJOfPVKI30jE9adiEpRgO+dKyYz8NMZm+Xirtp19oTguVem6rpLMHtMStz28ynwuRmf5GJedSuYJfDFrm4O8s62apdureWd7HfXV7RBJgMcFnY4TwahtvfI6SMlNYURpFqPKMpk6uICFY8uPKp58bHtu7QGCrSHOmzWYdE2jsSPK7Q++y7cvHMPQkiyG3fA4N54/iq+fMZj69jB9r3iAu647ndvOGckvXt/G9+95DXJSOX1cKRW7Gxg7qpRXbrWzO+1vaGdPTRu1jUHcLgcbDzSxblcN2alu+ualkZfh5bTeOXjdDsYNKmDjvia+/sD7bHv3AFgmSx64jHmn2e6Za/bW8+TbOynOTKE1rtO3KAO3pqApguxUN9mpbkpy/WSnej+VY07MMNnQEmRdU5DKYIyEJclyO3Ap4qTAE0kf4oaYjltV8GnqSa1XXe6RyWIeblP/ICseulSzjEMJRcNpGZ8UsEdV0BLidAn3SMS0U/XRbIrp5Lg1Sn1OqiP6cY19na6LHbpJRDfIdTvo6/cw0O+hf5qHPM/xrSCxWIL3dtfx1rYa3quoZ3NVK/H6gM1EuRw2gCU29Y0mwKlAppfSnFQGFPgZUpTB4JIMhpVkMKQ4g1TfJzcRN0fjpDsdaElTdWV9OwcOtzJ7XG/adJ1IME5Bho+algCHW0LEEwZ56R4CwRi764NUHGmjuilAQyBGWW4qTcE4/bNTUd0Ovj53GL2yU/npixu548dv4BtdQugfV/Lqpiq+9+RafnHBGOaP7/2xTiOn3iS72iNsbwuzsz1CTSSBpihkOrXjRk6cTPUpxKkbdQ2homKRqkdv9+mxX3aWwrKE+IyATTp5W0K5EviuhMEfZ20W2J75upR4VOXjHTaAmCUJJAwMKclwqPT1uxmY5qWf39NlqDg+9Q3w/u561u5vYsOBZrYebiXQGIJgHFwauJ12jLNp2SBOGDZL4XHiSHfTJy+VwUXpDChIp09eKr1y/ZRl+yjLTkVzaJ8aBgnDZG9tMwMKc9hc1UhrRxQjGUZa1xbh/S1HaDAtvj93GHe/uoXlP5zP71/bxv6WAH/48hTueX4Dd93zJv3PGsj6e+cz95dv8Pr3zibN6/xcQLo/EGNPR4Qd7WEOBOPoUuJ3aPg05aThRJ/ZgyLp1O0y9XfSEpHvOC19q67YTt1C8vkA9ugjUnATcKNEGfjPeK3O9OUB3bRDdBwqBR4H/fwe+qR6KPG5TlpppjUQYcuhFlbtqmXDgRZ21bZzqD5oO4Uk7HKUuDSbGie9m4gbtu1eU+wAylQXBeleSjN9DCxOZ0hxBqVZPkqyfBRnpZCT6sbj/njgtIej7Khuo7o5xO5DLext7KCmNYS0wKUIPE4NmTDpXZyGqijsqu2gX3Emb26vY/87lZDl4YMHLucvb+1gTO88vjF76KdfQKbFwVCMio4Iu9ojVEcShA0Ln0PF71A/Nmzo8wCqFAKXaez0GdG73UbiOSXJFli2avWfA9jO2ncWYpEUfF0iZn02/56P2TqkJGxYRA07lCLDqZHvcVDkcVHgdVLsc1LoceE4ESWXFhU1beyqbmdPbTu7atqpqO2gor6DQEcMQgkbtAjbe0sRybTi2Hm0TMt+OZcKHgdqqpusFCd5aV5yUp3kpnkpy/aR63cnv3NRkOElN82Dz6Wxp6aFHQebaInoHGgIEYon0BMG0bhFWziO0BQ6wjq7agMoLifRnfUQijHu7CHcecU43t9VQ8KE31w+8ZMBxLI4FIpxKBTjcDhOdThBXTRBzJJ4NZUUTUUT/1yQSgSm0kVRK7xG4pceI/4PO1ZLSYZfyX8uYOlxGQDGW0KcLxGLgL7/TPBKbE1DxDCJJ+PIUjSFHLcdLpzjcpDrSX52O0+a8DgWibO/Kcj+xiD7GwLsqw9Q1RKiKRCnMRilORgnFEnYwl1Uh7hpP4ApbW8p0+r0vrb/1pKU26HYfhIpblK9tgdXZwp2pK0OMk27dmvClNAetT3EpAUlmZw9oogRpen075VBIKITT1jc9pGcusdrQd2gPpKgOhKnOhznSDhOXVQnZFhoisCnqXhU5RPxpZ+2WUJgCQXVsnCZiTdclvG429SfVC0LU7HreyH51wC2cyuxu5grBZdKxGxOUP7o86fAdnBbzLTQLStJDBVSHSrpDpV0p0aexwZzmlMj0+0g2+vi4xzbrLhOXUeEuvYoVc0hDjUFqG6L0hCI0R5JEIgZhKIJIrpJTLcIxxJEdYuYbiFjSaqtWzYboiUD4EwzGWasgUvFleKib24KI4ozmNQ/h1HlWfhTnLRFEtQ1R5gxuIjsj+hOE6ZJR8KkOa7THNOpiyaojSRoiRt23QfTQhECr6rYKUz/DwB6NEiFlDgss9lp6S95jMRfXKa+SQqBqahd7pMyCal/CWCPZtCPOssHYpYlmAXMlYgy/g+bJUGXkoRpkbBkF5AdisClKPg0hRRNJdWpkuqwe7pTw+/U8LscZLg1MjSNTyxymSZmwiSSMDAN004CnLBQFTsdaCSuowhBqtuB3+MgPcUFPZT7Jntq2/F53ZSk+6iO6xxsD9OWBGNHwqAjYRI07NpaiaSuyaXaUQsu5dQigD+v3U4KW6oXUqJJM+QyjZedlv6i0zKWapYZ7qyWaCWNAnbY978ZYDmWJVAkYhqC6RIxWdr5EPwnOPefPshmMpeAIe28C4Ylk77TsjtXgLCptEtR7H+TYPBoCi5Vxa0KPJqKy6Hh1gRuReB2aKiKSJ5jp8VUhEBV7LFUEDgQdiVC0yScMOiIGbRFE7RFE0QNC0VTMQU0h+M0R+NEDYmRTLmkCjt3gVNRcCgCLRlD9n9KCISwHaaEHc2qWeYRp2WscFrmG05Tf9thmc2mYpfzlLIbSZ8HYLX/K4AkxZeVipQrk4sgXcI0KcQkYJxEDAVy/i8ALABNCDRVHMXQ9HzeTgptSUnMkkRMu9JKZ/BgZ86uzk7n37LbMPJxDkTdOkvRpbtUhF3vSk3mPnCqGh7tXxdqblNQ0VXuSiBRpRl0W/pqzTLXOCzzfYc0VqmWadkVhm2LlSX+Oc+s/SsGoFPbA7yiSvlKkq55JHKwgBGWEOOTIB5EsnbP/yUl7spT2klpP8Vd5Sne49+pyaRq6SN+JWiWVa9Z5iaHNN5VpbXFYRrrNGm1IQVSsasBGEKls+LvP/PdtH/5IHV/jArYqCA3IuVDya0jzxL0lYj+imCQlAxBiH4SemPX+OkBjH8nEPw7ArKTkZOiG1adWX9syilxSLNSsay9KtYu1TJ3a5a1VZXWDlVaCYS9V0rZrU+1LyP/z55f+/cb0B7T3SCgAeRqJbn3WkgUZBGIfhKKEaJUQh+gHCgAkS8h46OT1MlH/f/auuia6NLUHGcB2bFoqiUDCrJakdYB1TIrFSmrFCn3OaS5XbXMwwKJFMIuXpykvDZAe1Zt/1c07T9nQnq0GgVZI4860JmYGYkPIXIlItcGMAVgFQNlUohSIEMiMoXNQ3s/Ound5UmTImdSV/jR7/8ZC6ETHD2o4dEqw6QkfrTo23lvkfRHFVJGhJRtipQNqrSOKMiDipR1Qsp6VZrVCtQq0qoT0upQJdiihdLNCggwsannv+Muof3nUpQTbkRh4KBAHuzmwywEEjOZlkJIS5UCP4g0kGl2gS6RLjAzDKGmqlg+xbK8hqKlapbpk0J4LaF4VctMFSBMofgkKAqWB4lfCpH5ebyPApZqma1SYiCIqNIKCYlhCRERSEO1rIAUIqgg2xTLagHZJoUIqZbVriDbBLIVKdoEVofDskzsakA2ZykFAttQ0Vny3UyWGeq0W4p/Mv/5ebT/NwDG8hAdgEilMQAAAABJRU5ErkJggg==";
        //doc.addImage(logo, 'JPEG', 20,20,20,20);
        doc.setFontSize(22)
        doc.text(35, 25, "Gobind Sarvar Report Card");
		doc.setFontSize(14)
		doc.fromHTML(
			document.getElementById("report-card-table"),
				5.5,
				5.5,
				{
					'width': 500,
					'elementHandlers' : "specialElementHandlers"
		});

        doc.save("Reportcard.pdf");
}

function dlReportCardCSV() {
	var csvContent = "data:text/csv;charset=utf-8,";
	
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
	//console.log(output);
	var encodedUri = encodeURI(output);
	var link = document.createElement("a");
	link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
	link.setAttribute("download", "Reportcard.csv");
	link.click();

}

// Helper function
// remember to pass id string with single-quotes (ie. 'report-card-table')
function getCellContent(id, row, cell) {
    return document.getElementById(id).rows[row].cells[cell].innerHTML;
}
