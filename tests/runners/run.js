dojo.require("doh.runner");
doh.register("run.institutions_MixedPeopleAndOrganizationsMaybeUseFirst", [
    function(){
        var test = new StdRhinoTest("institutions_MixedPeopleAndOrganizationsMaybeUseFirst","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();