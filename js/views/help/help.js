/**
 *  View to display the help page. 
 */
var HelpView = Backbone.View.extend({
    initialize: function (options) {
        this.model = new Section();
        this.render();
    },

    render: function () {
        var view = this;
        this.$el.html(html["userManual.html"]);
    },
});