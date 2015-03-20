var TransactionResponseView = Backbone.View.extend({
	initialize: function(options) {
		this.message = options.message;
		this.title = options.title;
		this.status = options.status;
		this.render();
	},

	render: function() {
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
		});
	}
});

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function splitChars(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}