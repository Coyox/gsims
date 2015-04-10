/* *******************************************************************************
 *  This file contains the general email interface used throughout the application.
 *	It also includes a function that can be used to send an email out in the
 *	background (without the interface), and a function that can be called to display
 *	the interface in a popup window.
 * ******************************************************************************* */

/**
 *	View to display the email interface
 */
var EmailView = Backbone.View.extend({
	initialize: function(options) {
		var view = this;
		this.emailAddr = options.emailAddr;
		this.deferred = options.def;
		this.model = new Key();
		this.model.fetch({
			url: this.model.getKeyByName("Mandrill"),
		}).then(function(data) {
			view.key = data;
			areYouAlive(view.key);
			view.render();
			if (view.deferred) {
				view.deferred.resolve();
			}
		}).fail(function(data){
			alert("error retrieving API keys from server.");
		});
	},

	render: function() {
		var template = html["email.html"];
		template = template({
			usertype: sessionStorage.getItem("gobind-usertype")
		});
		this.$el.html(template);

		if(this.emailAddr){
			this.$el.find("#email-to").val(this.emailAddr);
		}
		this.$el.find("#pre").hide();

		var userEmail = sessionStorage.getItem('gobind-email') ;
		this.$el.find("#email-from").val(userEmail);
	},

	events: {
		"click #send" :   "sendEmail",
		"click #fetch":   "checkAccountStatus",
		"click #preview": "previewHTML"
	},

	/**
	 *	Previews the email body
	 */
	previewHTML: function(evt){

		var body = this.$el.find("#email-message").val();
		this.$el.find("#pre").show();
		this.$el.find('#dialog').html(body);

	},

	/**
	 *	Fetches statistics about the current mandrill account, including:
	 *		- hourly quota
	 *		- current backlog
	 *		- emails sent today
	 *		- emails sent in the last 30 days
	 *		- emails bounded in the last 30 days
	 */
	checkAccountStatus: function(evt){
		var parent = this.$el.find("#stats-panel");
		var apiKey = this.key;

		$.ajax({
			type: 'POST',

	  		url: "https://mandrillapp.com/api/1.0/users/info.json",
	  		data: {
	  			"key": apiKey
	  		}
		}).done(function(response) {
		   	parent.find(".hourly-quota").text(response.hourly_quota);
		   	parent.find(".backlog").text(response.backlog);
		   	parent.find(".sent-today").text(response.stats.today.sent);
		   	parent.find(".sent-month").text(response.stats.last_30_days.sent);
		   	parent.find(".bounces-month").text(response.stats.last_30_days.hard_bounces);
	 	});
	},

	/**
	 *	Sends an email to the provided recipients
	 */
	sendEmail: function(evt){
		var recipientInput = this.$el.find("#email-to").val(); // Input from the "to" form
		var recipients = []; // array where each index contains an email
		var request = {}; // Will hold the Json request for mandrill
		var subject = this.$el.find("#email-subject").val();
		var body = this.$el.find("#email-message").val();
		var apiKey = this.key;
		var from = this.$el.find("#email-from").val();
		var self = this.$el.find("#self").prop("checked");

		//Build the JSON request
		request.data = {};
		request.data.key = apiKey;
		request.data.message = {};
		request.data.message.from_email = from;
		request.data.message.from_name = "Gobind Sarvar School";
		request.data.message.to = [];
		request.data.message.autotext = 'true'
		request.data.message.subject = subject;
		request.data.message.html = body;

		// Get recipients. Check if we've been passed any as an array.
		if (recipients.length == 0){
			recipients = recipientInput.replace(/ /g, '').split(","); // Spaces removed, Emails deliminated by comma
		}

		// Send an additional email to the sender if the self flag is set to true
		if (self == true) {
			recipients.push(from);
		}

		// Push each recipient's data to JSON object
		recipients.forEach(function(entry){
    		var to = {
        		'email': entry,
        		'name':"",
        		'type': 'to'
    		}
    		request.data.message.to.push(to);
		});

		// Send using mandrill API and read response
		$.ajax({
			type: 'POST',
  			url: "https://mandrillapp.com/api/1.0/messages/send.json",
  			data: JSON.stringify(request.data),
		}).done(function(response) {
			new TransactionResponseView({
				message: "Message(s) sent successfully!"
			});
 		}).fail(function(xhr, textStatus, errorThrown){
			new TransactionResponseView({
				title: "ERROR",
				status: "error",
				message: "Error sending email(s). Reason: " + xhr.responseText
			});
 		});
	}
});

/**
 *	Ping's the email host to ensure the server is available to send emails. If not,
 *	display an alert to indicate that the email service is unavailable.
 */
function areYouAlive(key){
	var apiKey = key;

	$.ajax({
		type: 'POST',

  		url: "https://mandrillapp.com/api/1.0/users/ping.json",
  		data: {
  			"key": apiKey
  		}
	}).done(function(response) {
	   	if (response != "PONG!"){
	   		$("#content").append("<div class='alert alert-danger'>" + "Mandrill API is currently not responding. Your emails may not be sent, and stats may not be fetched. Please try again later." + "</div>");
	   	}
 	});
}

/** Common email function that can be used by any page to send an email (not
	just EmailView()). Expects a "params" object as the first parameter that
	contains the from email, to email(s), email subject, and email body. The
	second parameter is an optional callback function that will be executed
	after all emails have been successfully sent.

	call the function as follows:

	sendEmail({
		from: "claire@gmail.com",
		to: [{
			email: "claire@gmail.com",
			name: "Claire",
			type: "to"
		}],
		subject: "test email",
		body: 'test testestsetset'
	});
*/
function sendEmail(params, callback) {
	var apiKey = "C_s6D7OmZEgKBIspAvuBcw";
	var from = params.from || "info@gobindsarvar.com";
	var to = params.to;
	var subject = params.subject || "Notice from Gobind Sarvar";
	var body = params.body;

	var xhr = $.ajax({
		type: "POST",
		url: "https://mandrillapp.com/api/1.0/messages/send.json",
		data: {
			key: apiKey,
			message: {
				from_email: from,
				to: to,
				autotext: true,
				subject: subject,
				html: body
			}
		}
	});

	$.when(xhr).then(function(data) {
		console.log(data);
		if (callback && data[0] && data[0].status == "sent") {
			callback.call();
		} else {
			// display some kind of message if it was successful or not
		}
	});
}

/**
 *	Opens the email interface in a popup dialog
 */
function openEmailModal(recipients) {
	$("#container").append(html["emailModal.html"]);

	// Deferred object to wait for all recipients to be fetched
	var elem = $("#email-modal");
	var backdrop = $(".modal-backdrop");

	elem.find(".modal-body").html(html["email.html"]);

	elem.on("hidden.bs.modal", function() {
		elem.remove();
		backdrop.remove();
	});

	var def = $.Deferred();
	var emailView = new EmailView({
		el: elem.find(".modal-body"),
		emails: recipients,
		def: def
	});

	$.when(def).then(function() {
		elem.modal({
			show: true
		});

		elem.find("#stats-panel").remove();

		var form = elem.find(".form-horizontal");
		form.removeClass("col-sm-8").addClass("col-sm-12").removeClass("well");
		form.parent().addClass("o-auto");

		// Populate the "to" input field (comma separated string)
		form.find("#email-to").val(recipients.join(", "));
	});
}