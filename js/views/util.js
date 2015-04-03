var TransactionResponseView = Backbone.View.extend({
	initialize: function(options) {
		this.message = options.message;
		this.title = options.title;
		this.status = options.status;
		this.redirect = options.redirect;
		this.url = options.url;
		this.render();
	},

	render: function() {
		var view = this;

		$("#container").append(html["transactionResponse.html"]);

		$("#transaction-modal .modal-body").html(this.message);

		if (this.title) {
			$("#transaction-modal .modal-title").html(this.title);
		}

		if (this.status == "error") {
			$("#transaction-modal .modal-title").addClass("red");
		}

		$("#transaction-modal").modal({
			show: true
		});

		$("#transaction-modal").on("hidden.bs.modal", function() {
			$("#transaction-modal").remove();
			$(".modal-backdrop").remove();
			if (view.redirect) {
				app.Router.navigate(view.url, {trigger:true});
			}
		});
	}
});

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function splitChars(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function populateMonthMenu(elem, selected) {
	selected = selected ? parseInt(selected) : selected;

	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	elem.append("<option selected disabled> Month </option>");
	_.each(months, function(val, index) {
		var monthIndex = index + 1;
		var checked = monthIndex == selected ? true : false;
		if (monthIndex < 10) {
			monthIndex = "0" + monthIndex;
		}
		elem.append("<option value='" + monthIndex + "'>" + val + "</option>");
	});

	if (selected) {
		if (parseInt(selected) < 10) {
			selected = "0" + selected;
		}
		elem.find("option[value='" + selected + "']").prop("selected", true);
	}
}

function populateDayMenu(elem, selected) {
	elem.append("<option selected disabled> Day </option>");
	for (var i = 1; i < 32; i++) {
		var checked = selected == i ? true : false;
		if (i < 10) {
			i = "0" + i;
		}
		elem.append("<option value='" + i + "'>" + i + "</option>");
	}

	if (selected) {
		elem.find("option[value='" + selected + "']").prop("selected", true);
	}
}

function populateYearMenu(elem, selected) {
	selected = selected ? parseInt(selected) : selected;

	elem.append("<option selected disabled> Year </option>");
	var start = new Date().getFullYear();
	var end = start - 100;
	for (var i = start; i > end; i--) {
		var checked = i == selected ? true : false;
		elem.append("<option value='" + i + "'>" + i + "</option>");
	}

	if (selected) {
		elem.find("option[value='" + selected + "']").prop("selected", true);
	}
}

function populateStatusMenu(elem, statuses, selected) {
	elem.append("<option selected disabled> Status </option>");
	$.each(statuses, function(i, val) {
		var option = $("<option></option>");
		option.attr("value", val);
		option.prop("selected", val == selected);
		option.text(capitalize(val));
		elem.append(option);
	});
}

function populateSchoolMenu(elem, schools, selected) {
	//elem.append("<option selected disabled> School </option>");
	$.each(schools, function(i, val) {
		var option = $("<option></option>");
		option.attr("value", val.schoolid);
		option.prop("selected", val.schoolid == selected);
		option.text(capitalize(val.location));
		elem.append(option);
	});
}

function getSelectedSchool() {
	return $("#school-menu").find("option:selected").attr("value");
}

function setDateOfBirth(model) {
	if (model.get("dateOfBirth") == "") {
		var month = model.get("month");
		var day = model.get("day");
		var year = model.get("year");
		var dob;
		if (month !== undefined && day !== undefined && year != undefined) {
			dob = year + "-" + month + "-" + day;
		} else {
			dob = "";
		}
		model.set("dateOfBirth", dob);
	}
}

function addDTButtons(elem, btn) {
	elem.find(".dataTables_filter").append(btn);
}

function createRefreshButton(elem) {
	addDTButtons(elem, "<button id='refresh' class='btn btn-sm btn-primary dt-btn'><span class='glyphicon glyphicon-refresh'></span></button>");
}

function createEmailButton(elem) {
	addDTButtons(elem, "<button class='send-email btn btn-sm btn-primary dt-btn'><span class='glyphicon glyphicon-envelope'></span></button>");
}

function createExportButton(elem) {
	addDTButtons(elem, "<button id='export-table' class='btn btn-sm btn-primary dt-btn'><span class='glyphicon glyphicon-export'></span></button>");
}

function openEmailWrapper(nodes) {
	var recipients = [];
	_.each(nodes, function(row, index) {
		var checkbox = $(row).find("input[type='checkbox']");
		if ($(checkbox).is(":checked")) {
			recipients.push($(checkbox).closest("tr").data("email"));
		}
	}, this);

	var numRecipients = recipients.length;
	openEmailModal(recipients);
}

function toggleCheckboxes(nodes, evt) {
	var checked = $(evt.currentTarget).is(":checked");
	_.each(nodes, function(row, index) {
		var checkbox = $(row).find("input[type='checkbox']");
		checkbox.prop("checked", checked);
	}, this);
}