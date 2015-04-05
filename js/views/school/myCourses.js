var MyCoursesView = Backbone.View.extend({
    initialize: function (options) {
        this.model = new Dept();
        this.render();
    },
     
    events: {
        
    },
     render: function () {
        this.$el.html(html["myCourses.html"]);
    },

});