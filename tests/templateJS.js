var path = require("path");
var assert = require('chai').assert;
var Sys = require(%%RUNPREP_PATH%%);

describe('Integration tests', function() {
    var tests = %%TEST_DATA%%
    tests.forEach(function(test) {
        it('should pass ' + test.NAME, function() {
            var sys = new Sys(test);
            var ret = sys.run();
            assert.equal(ret, test.RESULT, "FILE: " + test.PATH);
        });
    });
});
