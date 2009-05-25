dojo.provide("tests.test_dates");


doh.register("tests.dates", [
	function testThatItWorksAtAll(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"year\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("1965",res);
	},
	function testYearFormShort(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"year\" form=\"short\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("65",res);
	},
	function testMonthFormNumeric(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"month\" form=\"numeric\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("6",res);
	},
	function testMonthFormNumericLeadingZeros(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"month\" form=\"numeric-leading-zeros\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("06",res);
	},
	function testMonthFormShort(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"month\" form=\"short\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("Jun",res);
	},
	function testMonthFormLong(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"month\" form=\"long\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("June",res);
	},
	function testDayFormNumeric(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"numeric\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("1",res);
	},
	function testDayFormNumericLeadingZeros(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"numeric-leading-zeros\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("01",res);
	},
	function testDayFormOrdinalOne(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"ordinal\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("1st",res);
	},
	function testDayFormOrdinalTwo(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"ordinal\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-2"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("2nd",res);
	},
	function testDayFormOrdinalThree(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"ordinal\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-3"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("3rd",res);
	},
	function testDayFormOrdinalFour(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"ordinal\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-mongolian-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("4th",res);
	},

]);



