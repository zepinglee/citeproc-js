dojo.require("doh.runner");
doh.register("run.name_TwoRolesSameRenderingSeparateRoleLabels", [
    function(){
        var test = new StdRhinoTest("name_TwoRolesSameRenderingSeparateRoleLabels","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();