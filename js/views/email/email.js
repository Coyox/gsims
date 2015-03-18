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