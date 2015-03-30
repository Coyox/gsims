var PurgeView = Backbone.View.extend({
    initialize: function(options) {
        this.render();
    },

    events: {
        "click #purge": "purgeRecords"
    },

    render: function() {
        this.$el.html(html["viewPurge.html"]);
    },

    purgeRecords: function() {
        var params = {};
        var checkboxes = this.$el.find(".purge-item");
        _.each(checkboxes, function(checkbox, index) {
            if ($(checkbox).is(":checked")) {
                var name = $(checkbox).attr("name");
                params[name] = 1;
            }
        }, this);

        var purge = new Purge();
        $.ajax({
            type: "DELETE",
            data: params,
            url: purge.purgeInactive()
        }).then(function(data) {
            if (typeof data == "string") {
                data = JSON.parse(data);
            }
            if (data.status == "success") {
                new TransactionResponseView({
                    message: "The selected records have successfully been purged."
                });
            } else {
                new TransactionResponseView({
                    title: "ERROR",
                    status: "error",
                    message: "The selected could not be purged. Please try again."
                });               
            }
        }).fail(function(data) {
            new TransactionResponseView({
                title: "ERROR",
                status: "error",
                message: "The selected could not be purged. Please try again."
            }); 
        });
    }
});