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
		var recipient = this.$el.find("#email-to").val();
		var subject = this.$el.find("#email-subject").val();
		var body = this.$el.find("#email-message").val();
		var apiKey = 'C_s6D7OmZEgKBIspAvuBcw'
		var from = this.$el.find("#email-from").val();
	/*
		$.ajax({
  		type: 'POST',
  		url: "https://mandrillapp.com/api/1.0/messages/send.json",
  		data: {
    	'key': apiKey,
    	'message': {
      	'from_email': from, // Todo: replace with user's email
      	'to': [
        	  {
           	 'email': 'adaml@Live.ca',
           	 'name': 'Adam Lloyd',
           	 'type': 'to'
          	},
          	//{
           	// 'email': 'alloudsounds@gmail.com',
           	// 'name': 'Adam Lloyd',
           	// 'type': 'to'
          	//}
        	],
      	'autotext': 'true',
      	'subject': subject,
      	'html': body,
    	}
  	}
 	}).done(function(response) {
   	console.log(response);
 	});
 	*/
 		console.log("No spam plz lol");
		//console.log(recipient);
		//console.log(body);
		//console.log(subject);
	}
});

/** Common email function that can be used by any page to send an email (not 
	just EmailView()). Expects a "params" object as the only parameter that 
	contains the from email, to email(s), email subject, and email body. 

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
function sendEmail(params) {
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
		// validate response.. display some kind of message if it was successful or not
		console.log(data);
	});
}