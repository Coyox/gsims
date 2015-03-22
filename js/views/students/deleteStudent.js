var DeleteRecordView = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.id;
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.append(html["confirmationModal.html"]);


		$("#confirmation-modal").modal({
			show: true
		});
		
		$("#confirmation-modal").on("hidden.bs.modal", function() {
			$("#confirmation-modal").remove();
			$(".modal-backdrop").remove();
		});
		
		$("#confirmation-modal").on("click", "#confirm-yes", function() {
			$("#confirmation-modal").remove();
			$(".modal-backdrop").remove();

			new Student({id: view.id}).destroy({dataType: "text"}).then(function(data) {
				if (data != "null") {
					console.log("yay");
					new TransactionResponseView({
						message: "The record has been successfully deleted."
					});
				} else {
					new TransactionResponseView({
						message: "The record could not be deleted. Please try again",
						title: "ERROR",
						status: "error"
					});					
				}
			}).fail(function(data) {
				new TransactionResponseView({
					message: "The record could not be deleted. Please try again",
					title: "ERROR",
					status: "error"
				});
			});
		});
	},	
});