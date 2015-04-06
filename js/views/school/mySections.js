var MySectionsView = Backbone.View.extend({

    initialize: function (options) {
        this.model = new Section();
        this.render();
    },
     
    events: {
        
    },

     render: function () {
        var view = this;
        this.$el.html(html["mySections.html"]);
        var teacher = new Teacher();
        var user = JSON.parse(sessionStorage.getItem("gobind-user"));
        var userid = user["userid"];
        teacher.fetch({
            url: teacher.getTeachingSectionsUrl(userid)
        }).then(function(data){
            console.log(data);
            if (data.length == 0) {
                var table = view.$el.find("#sections-table");
                table.hide();
                table.after("<br><div class='alert alert-danger'>This teacher is not assigned to any sections.</div>");
            }
            _.each(data, function(sec, index) {
                var section = new Section(sec, {parse:true});
               new CourseSectionRowView({
                    el: view.addCourseSection(),
                    model: section
                })
            });
        });
        
    },

    addCourseSection: function() {
        var container = $("<tr></tr>");
        this.$el.find("#sections-table tbody").append(container);
        return container;
    },


});