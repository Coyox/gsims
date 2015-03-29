var CourseView = Backbone.View.extend({
    initialize: function (options) {
        this.model = new Dept();
        this.render();
    },
     
     render: function () {
        this.$el.html(html["viewCourses.html"]);
        var view = this;
        var department = new Dept();
        var course = new Course();
        var school = new School();
        school.fetch({url: school.getDepartmentsUrl("412312"), data: {schoolyearid: "100000"}}).then(function(data) {
            _.each(data, function(department, index) {
                 var dept = new Dept(department, {parse:true});
                 dept.fetch({url: dept.getCoursesUrl(dept.get("deptid")),data: {schoolyearid: "100000"}}).then(function(data) {
                    _.each(data, function(course, index) {
                        var course1 = new Course(course, {parse:true});
                        new CourseRowView({
                            el: view.addRow(),
                            model: course1,
                            untouchedModel: JSON.stringify(course1.toJSON()),
                            deptName: dept.get("deptName")
                        });
                 });
                 });

                });

            });
                 view.$el.find("table").dataTable({
                 dom: "t"
            });
    },


    render2: function () {
        this.$el.html(html["viewCourses.html"]);
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
                    new CourseRowView({
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

    addRow: function () {
        var container = $("<tr></tr>");
        this.$el.find(".results").append(container);
        return container;
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

var CourseRowView = Backbone.View.extend({
    template: _.template("<td><%= model.courseName %></td>"
        + "<td><%= deptName %></td>"
        + "<td><%= model.description %></td>"
        + "<td><button class='edit-dept btn btn-xs btn-primary center-block' id='<%= model.userid %>'>View Course</button></td>"),

    otherusertemplate: _.template("<td><%= model.courseName %></td>"
        + "<td><button class='edit-dept btn btn-xs btn-primary center-block' id='<%= model.userid %>'>View Course</button></td>"),

    edittemplate: _.template("<td><input type='text' class='form-control input-sm' value='<%= model.courseName %>' name='courseName'></td>"
		+ "<td> <button class='save-dept btn btn-xs btn-primary center-block' id='<%= model.courseid %>'>Save Department</button> <button class='cancel-dept btn btn-xs btn-primary center-block' id='<%= model.courseid %>'>Cancel Edit</button></td>"),

    initialize: function (options) {
        this.action = "view";
        this.untouchedModel = options.untouchedModel;
        this.deptName = options.deptName;
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
            model: this.model.toJSON(),
            deptName: this.deptName
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