var DepartmentView = Backbone.View.extend({
    initialize: function (options) {
        this.model = new Dept();
        this.render();
    },
     
    render: function () {
        var usertype = sessionStorage.getItem("gobind-usertype");
        this.$el.html(html["viewDepartments.html"]);
        if(usertype == "SU"){
            $("#purge-dept").removeClass("hide");
        }
        var view = this;

        var department = new Dept();
        var school = new School();
        school.fetch({
            url: school.getDepartmentsUrl("412312"),
            data: {
            schoolyearid: sessionStorage.getItem("gobind-activeSchoolYear")}}).then(function(data) {
                _.each(data, function (object, index) {
                    var dept1 = new Dept(object, { parse: true });
                    console.log("creating deptrowview");
                    new DepartmentRowView({
                        el: view.addRow(),
                        model: dept1,
                        untouchedModel: JSON.stringify(dept1.toJSON()),
                    });
            });
            view.$el.find("table").dataTable({
                dom: "t"
            });
        });
    },

    events: {
        "click #create-dept": "createDept",
        "click #purge-dept": "purgeDept"
    },

    addRow: function () {
        var container = $("<tr></tr>");
        this.$el.find(".results").append(container);
        return container;
    },

    purgeDept: function(){
        var dept = new Dept();
		dept.fetch().then(function(data) {
            var ids = [];
			_.each(data, function(object, index) {
                 ids.push(object.deptid);
            });
            var purge = new Purge();
            $.ajax({
                type: "POST",
                url: purge.purgeDepartmentss(),
                data: {
                  deptids: JSON.stringify(ids)
                }
            }).then(function(data) {
           // if (typeof data == "string") {
           //     data = JSON.parse(data);
           // }
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
     });
     },
    createDept: function (evt) {
        console.log("in create dept");
        var view = this;
        Backbone.Validation.bind(this);

        this.$el.append(html["createDepartment.html"]);
        $("#create-dept-modal").modal({
            show: true
        });

        $("#create-dept-modal").on("hidden.bs.modal", function () {
            $("#create-dept-modal").remove();
            $(".modal-backdrop").remove();
        });

        $("#create-dept-modal").on("click", "#save", function () {
            view.model.set("deptName", $("#deptName").val());
            view.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
            view.model.set("schoolid", "412312");

            if (view.model.isValid(true)) {
                console.log("model is valid");
                $("#create-dept-modal").remove();
                $(".modal-backdrop").remove();
                console.log(view.model.toJSON());

                view.model.save().then(function (data) {
                    if (data) {
                        new TransactionResponseView({
                            message: "New department successfully created."
                        });
                        view.render();
                    }
                }).fail(function (data) {
                    new TransactionResponseView({
                        title: "ERROR",
                        status: "error",
                        message: "Could not create a new department."
                    });
                });

            }
        });
    },

    refresh: function () {
        this.render();
    }
});

var DepartmentRowView = Backbone.View.extend({
    template: _.template("<td><%= model.deptName %></td>"
        + "<td><span class='edit-dept primary-link pull-left center-block' id='<%= model.userid %>'>[ Edit ] </span> <span class='delete-dept primary-link center-block' id='<%= model.deptid %>'>[ Delete ]</span></td>"),

    otherusertemplate: _.template("<td><%= model.deptName %></td>"
        + "<td><span class='edit-dept primary-link pull-left center-block' id='<%= model.userid %>'>[ Edit ] </span></td>"),

    edittemplate: _.template("<td><input type='text' class='form-control input-sm' value='<%= model.deptName %>' name='deptName'></td>"
		+ "<td> <span class='save-dept primary-link center-block' id='<%= model.deptid %>'>[ Save ]</span> <span class='cancel-dept primary-link center-block' id='<%= model.deptid %>'>[ Cancel ]</span></td>"),

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
        "click .edit-dept": "editDept",
        "click .delete-dept": "deleteDept",
        "click .save-dept": "saveDept",
        "click .cancel-dept": "cancelDept",
        "keyup input": "updateModel"
    },
    
    cancelDept: function(evt) {
        console.log("cancelled dept change");
        this.model.attributes = JSON.parse(this.untouchedModel);
        this.action = "view";
        this.render();
    },

    updateModel: function(evt) {
        var name = $(evt.currentTarget).attr("name");  
        var value = $(evt.currentTarget).val();   
        this.model.set(name, value);
    },

    editDept: function (evt) {
        this.action = "edit";
        this.render();
    },

    deleteDept: function(evt) {
        var usertype = sessionStorage.getItem("gobind-usertype");
        var view = this;
        var id = $(evt.currentTarget).attr("id");
        this.model.set("id", id);
        if (usertype == "SU") {
           this.model.destroy({data:{"purge":1}}).then(function(data){
                    view.action = "view";
                    view.render();
        });
        }else{
           this.model.destroy().then(function(data){
                    view.action = "view";
                    view.render();
            }
        );
        }

    },

    saveDept: function (evt) {
        var view = this;
        var id = $(evt.currentTarget).attr("id");
        this.model.set("id", id);
        this.model.set("schoolyearid", sessionStorage.getItem("gobind-activeSchoolYear"));
        this.model.set("schoolid", "412312");
        console.log(this.model);

        this.model.save().then(function(data){
            if(data){
                console.log("savedmodel");
                view.untouchedModel = JSON.stringify(view.model.toJSON());
                new TransactionResponseView({
                    message: "Department was successfully saved."
                });
            }
            view.action = "view";
            view.render(); 
        });
    }
});