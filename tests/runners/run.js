dojo.require("doh.runner");
doh.register("run.institutions_MixedPeopleAndOrganizationsAlwaysUseFirst", [
    function(){
        var test = new StdRhinoTest("institutions_MixedPeopleAndOrganizationsAlwaysUseFirst","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();