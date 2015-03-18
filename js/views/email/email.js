var EmailView = Backbone.View.extend({
	initialize: function(options) {
		this.emailAddr = options.emailAddr;
		this.render();
	},

	render: function() {
		this.$el.html(html["email.html"]);
		//this.$el.find("#email-to").val(this.emailAddr);
	},

	events: {
		"click #send" : "sendEmail",
	},

	sendEmail: function(evt){
		var recipient = this.$el.find("#email-to").val();
		var subject = this.$el.find("#email-subject").val();
		var body = this.$el.find("#email-message").val();
		
		console.log(recipient);
		console.log(body);
		console.log(subject);
	}

});