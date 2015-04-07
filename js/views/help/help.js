var HelpView = Backbone.View.extend({

    initialize: function (options) {
        console.log("Render help.");
        this.model = new Section();
        this.render();
    },
     
    events: {
        
    },

     render: function () {
        var view = this;
        this.$el.html(html["userManual.html"]);
    },
});