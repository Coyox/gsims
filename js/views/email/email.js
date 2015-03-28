var EmailView = Backbone.View.extend({
	initialize: function(options) {
		this.emailAddr = options.emailAddr;
		//this.emails = options.emails; //STUBBED
		areYouAlive();
		this.render();
	},

	render: function() {
		this.$el.html(html["email.html"]);
		//this.$el.find("#email-to").val(this.emailAddr);

		var userEmail = sessionStorage.getItem('gobind-email') ; // TODO: Get the email of the logged in user
		this.$el.find("#email-from").val(userEmail);
	},

	events: {
		"click #send" : "sendEmail",
		"click #fetch": "checkAccountStatus"
	},

	checkAccountStatus: function(evt){
		var parent = this.$el.find("#stats-panel");
		console.log("Checking Mandrill account status");
		var apiKey = "C_s6D7OmZEgKBIspAvuBcw";

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

	sendEmail: function(evt){
		var recipientInput = this.$el.find("#email-to").val(); // Input from the "to" form
		//TODO: Recipients pulls the array as a parameter from calling page.
		var recipients = []; // array where each index contains an email 
		var request = {}; // Will hold the Json request for mandrill
		var subject = this.$el.find("#email-subject").val();
		var body = this.$el.find("#email-message").val();
		var apiKey = 'C_s6D7OmZEgKBIspAvuBcw'
		var from = this.$el.find("#email-from").val();
		var self = this.$el.find("#self").val();
		
		//Build the JSON request
		//request.type = 'POST'
		//request.url = "https://mandrillapp.com/api/1.0/messages/send.json"
		request.data = {};
		request.data.key = apiKey;
		request.data.message = {};
		request.data.message.from_email = from;
		request.data.message.to = [];
		request.data.message.autotext = 'true'
		request.data.message.subject = subject;
		request.data.message.html = body;

		// Get recipients. Check if we've been passed any as an array.
		if (recipients.length == 0){
			recipients = recipientInput.replace(/ /g, '').split(","); // Spaces removed, Emails deliminated by comma
		}

		if(self == "on"){
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
		})

		// JSONify final request
		//console.log(JSON.stringify(request.data));
		// Send using mandrill API and read response
		$.ajax({
			type: 'POST',
  			url: "https://mandrillapp.com/api/1.0/messages/send.json",
  			data: JSON.stringify(request.data),
		}).done(function(response) {
   		console.log(response);
 		});
	}
});

function areYouAlive(){
	console.log("Checking Mandrill status");
	var apiKey = "C_s6D7OmZEgKBIspAvuBcw";

	$.ajax({
		type: 'POST',

  		url: "https://mandrillapp.com/api/1.0/users/ping.json",
  		data: { 
  			"key": apiKey
  		}
	}).done(function(response) {
   	if (response != "PONG!"){
   		// Alert user
   		alert("Mandrill API is not currently responding:\n" +
   		 "Your emails may not be sent.\nStats may not be fetched.\n\n" +
   			"Please try again later.");
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
		from: "cbarretto7@gmail.com",
		to: [{
			email: "cbarretto7@gmail.com",
			name: "Claire Barretto",
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

// Adam: this function will create a popup email interface. The first chunk of
// code is creating the actual pop up (its called a modal in Bootstrap), and 
// it eventually calls your EmailView to add the actual email interface.
// The recipients are sent in the "emails" property as an array of strings
// (ie. an array of emails). To see an example of this, go to the notifications page,
// and under pending-test students, select a couple students and click on the email button
function openEmailModal(recipients) {
	$("#container").append(html["emailModal.html"]);

	// Deferred object to wait for all recipients to be fetched
	var elem = $("#email-modal");
	var backdrop = $(".modal-backdrop");

	console.log("recipients", recipients);

	elem.find(".modal-body").html(html["email.html"]);

	elem.modal({
		show: true
	});

	elem.on("hidden.bs.modal", function() {
		elem.remove();
		backdrop.remove();
	});

	var emailView = new EmailView({
		el: elem.find(".modal-body"),
		emails: recipients
	});

	var form = elem.find(".form-horizontal");
	form.removeClass("col-sm-8").addClass("col-sm-12").removeClass("well");
	form.parent().addClass("o-auto");

	// Populate the "to" input field (comma separated string)
	form.find("#email-to").val(recipients.join(", "));
}