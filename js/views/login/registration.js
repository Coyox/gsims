var RegistrationFormView = Backbone.View.extend({
	initialize: function(options) {
		this.onlineReg = true;
		this.render();
	},

	render: function() {
		var view = this;
		this.$el.html(html["registrationPage.html"]);

		var school = new School();
		school.fetch().then(function(data) {
			view.studentInfo();
			view.courseSelection(data);
			view.termsAndConditions();

			$("#registration-page").steps({
			    headerTag: "h1",
			    bodyTag: "section",
			    transitionEffect: "slideLeft",
			    autoFocus: true,
				// onStepChanging: function (event, currentIndex, priorIndex) {
				//     if (currentIndex == 0) {
				//     	view.validate();
				//     }
				// }
			});
		});
	},

	studentInfo: function() {
		this.$el.find("#info-form").html(html["enrollmentForm.html"]);

		var formTemplate = html["viewStudent.html"]();
		formTemplate = $(formTemplate).find("#student-info").html();

		this.$el.find("#form").html(formTemplate);
		this.$el.find(".form-buttons").remove();
		this.$el.find(".delete").remove();
		this.$el.find("#to-enrollment").remove();

		this.populateForm();
	},

	populateForm: function(prefilled) {
		this.model = new Student();

		if (this.onlineReg == true) {
			this.model.nonEditable.push("paid");
			this.model.nonEditable.push("status");
		}

		_.each(this.model.toJSON(), function(value, attr) {
			if (this.model.nonEditable.indexOf(attr) == -1) {
				var filled = prefilled ? prefilled[attr] : undefined;
				if (filled) {
					value = filled;
					this.model.set(attr, value);
				} 
				new StudentRecordRowView({
					el: this.addRow(this.model, attr),
					action: "edit",
					name: attr,
					value: value,
					model: this.model,
				});
			}
		}, this);
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

	validate: function() {
    	Backbone.Validation.bind(this);

		setDateOfBirth(this.model);
		if (this.model.isValid(true)) {
			console.log("VALID");
		} else {
			console.log("INVALID");
			// fix this
	    	$("#create-form #form").addClass("o-auto");

	    	var height = $("#create-form #form").height() + 40;
	    	$('.wizard .content').css("height", height);
		}
	},

	courseSelection: function(data) {
		app.courseEnrollment = new CourseEnrollmentView({
			el: this.$el.find("#sections-form"),
			school: true,
			results: data
		});

	},

	termsAndConditions: function() {
		this.$el.find("#terms-form").html(html["termsAndConditions.html"]);
	}
});