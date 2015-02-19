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
				new TransactionResponseView({
					message: "The record has been successfully deleted. Click the refresh button on the table to see your changes (or just refresh the page)"
				});
			}).fail(function(data) {
				console.log("FAILED");
			});
		});
	},	
});