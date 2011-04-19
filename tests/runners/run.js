dojo.require("doh.runner");
doh.register("run.name_ImplicitInstitution", [
    function(){
        var test = new StdRhinoTest("name_ImplicitInstitution","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();