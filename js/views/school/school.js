var SchoolView = Backbone.View.extend({
    initialize: function (options) {
        this.model = new School();
        this.render();
    },
     
    render: function () {
        this.$el.html(html["viewSchools.html"]);

        var view = this;
        var school = new School();
        school.fetch().then(function (data) {
            _.each(data, function (object, index) {
                var school1 = new School(object, { parse: true });
                new SchoolRowView({
                    el: view.addRow(),
                    model: school1,
                    untouchedModel: JSON.stringify(school1.toJSON()),
                });
            });
            view.$el.find("table").dataTable({
                dom: "t"
            });
        });
    },

    events: {
        "click #create-school": "createSchool",
    },

    addRow: function () {
        var container = $("<tr></tr>");
        this.$el.find(".results").append(container);
        return container;
    },

    createSchool: function (evt) {
        var view = this;
        Backbone.Validation.bind(this);

        this.$el.append(html["createSchool.html"]);
        console.log("asdf");
        $("#create-school-modal").modal({
            show: true
        });

        $("#create-school-modal").on("hidden.bs.modal", function () {
            $("#create-school-modal").remove();
            $(".modal-backdrop").remove();
        });

        $("#create-school-modal").on("click", "#save", function () {
            view.model.set("location", $("#location").val());
            view.model.set("yearOpened", $("#yearOpened").val());
            view.model.set("postalCode", $("#postalCode").val());
            if (view.model.isValid(true)) {
                $("#create-school-modal").remove();
                $(".modal-backdrop").remove();
                console.log(view.model.toJSON());

                view.model.save().then(function (data) {
                    if (data) {
                        new TransactionResponseView({
                            message: "New school successfully created."
                        });
                        view.render();
                    }
                }).fail(function (data) {
                    new TransactionResponseView({
                        title: "ERROR",
                        status: "error",
                        message: "Could not create a new school."
                    });
                });

            }
        });
    },

    refresh: function () {
        this.render();
    }
});

var SchoolRowView = Backbone.View.extend({
    template: _.template("<td><%= model.location %></td>"
		+ "<td> <%= model.postalCode %> </td>"
		+ "<td> <%= model.yearOpened %> </td>"
        + "<td><button class='edit-school btn btn-xs btn-primary center-block' id='<%= model.userid %>'>Edit School</button> <button class='delete-school btn btn-xs btn-primary center-block' id='<%= model.schoolid %>'>Delete School</button></td>"),

    otherusertemplate: _.template("<td><%= model.location %></td>"
		+ "<td> <%= model.postalCode %> </td>"
		+ "<td> <%= model.yearOpened %> </td>"
        + "<td><button class='edit-school btn btn-xs btn-primary center-block' id='<%= model.userid %>'>Edit School</button></td>"),

    edittemplate: _.template("<td><input type='text' class='form-control input-sm' value='<%= model.location %>' name='location'></td>"
		+ "<td> <input type='text' class='form-control input-sm' value='<%= model.postalCode %>' name='postalCode'> </td>"
		+ "<td> <input type='text' class='form-control input-sm' value='<%= model.yearOpened %>' name='yearOpened'> </td>"
        + "<td> <button class='save-school btn btn-xs btn-primary center-block' id='<%= model.schoolid %>'>Save School</button> <button class='cancel-school btn btn-xs btn-primary center-block' id='<%= model.schoolid %>'>Cancel Edit</button></td>"),

    initialize: function (options) {
        this.action = "view";
        this.untouchedModel = options.untouchedModel;
        this.render();
        
    },

    render: function () {
        var view = this;
        var usertype = sessionStorage.getItem("gobind-usertype");
        var template;
        if (this.action == "view") {
            if (usertype == "SU") {
                template = this.template;
            }else{
                template = this.otherusertemplate;
            }
        }
        else {
            template = this.edittemplate;
        }
        this.$el.html(template({
            model: this.model.toJSON()
        }));
    },

    events: {
        "click .edit-school": "editSchool",
        "click .save-school": "saveSchool",
        "click .delete-school": "deleteSchool",
        "click .cancel-school": "cancelSchool",
        "keyup input": "updateModel"
    },
    
    cancelSchool: function(evt) {
        this.model.attributes = JSON.parse(this.untouchedModel);
        this.action = "view";
        this.render();
    },

    updateModel: function(evt) {
        var name = $(evt.currentTarget).attr("name");  
        var value = $(evt.currentTarget).val();   
        this.model.set(name, value);
    },

    editSchool: function (evt) {
        this.action = "edit";
        this.render();
    },

    deleteSchool: function(evt) {
        var usertype = sessionStorage.getItem("gobind-usertype");
        var view = this;
        var id = $(evt.currentTarget).attr("id");
        this.model.set("id", id);
        if (usertype == "SU") {
           this.model.destroy({data:{"purge":1}});
        }
        else{
           this.model.destroy();
        }
        view.render();
    },

    saveSchool: function (evt) {
        var view = this;
        var id = $(evt.currentTarget).attr("id");
        this.model.set("id", id);
        console.log(this.model);
        this.model.save().then(function(data){
            if(data){
                view.untouchedModel = JSON.stringify(view.model.toJSON());
                new TransactionResponseView({
                    message: "School was successfully saved."
                });
            }
            view.action = "view";
            view.render(); 
        });
    }
});