var EmailView = Backbone.View.extend({
	initialize: function(options) {
		this.emailAddr = options.emailAddr;
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
	},

	sendEmail: function(evt){
		var recipientInput = this.$el.find("#email-to").val();
		var recipients = []; // array where each index contains an email
		var request = {}; // Will hold the Json request for mandrill
		var subject = this.$el.find("#email-subject").val();
		var body = this.$el.find("#email-message").val();
		var apiKey = 'C_s6D7OmZEgKBIspAvuBcw'
		var from = this.$el.find("#email-from").val();
		
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

		// Get recipients
		recipients = recipientInput.replace(/ /g, '').split(","); // Spaces removed, Emails deliminated by comma
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
		// Response from mandrill
		console.log(data);

		if (callback && data.status == "sent") {
			// Adam: see login.js around line 87 to see how I called this function.
			// the "callback" param that I passed into sendEmail() is just a separate
			// function that should be called after the emails have been successfully
			// sent. The callback function is defined in login.js around line 96 and
			// is executed here when you go callback.call(). 
			// In the else case here, you can just write something general
			// for when a callback isn't provided (probably just some kind of indication
			// if the emails have been sent or not, many how many emails got sent, etc)
			callback.call();
		} else {
			// display some kind of message if it was successful or not
		} 
	});
}