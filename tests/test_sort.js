dojo.provide("tests.test_sort");

doh.register("tests.sort", [

	function testRegistrationSortKeyReturn(){
		var xml = "<style>"
				  + "<citation>"
					  + "<layout>"
						  + "<text variable=\"title\"/>"
					  + "</layout>"
				  + "</citation>"
				  + "<bibliography>"
				  + "<sort>"
					  + "<key variable=\"title\"/>"
				  + "</sort>"
				  + "</bibliography>"
				  + "</style>";
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build();
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(["simple-sticky-name-1","simple-western-name-1","simple-mongolian-name-1"]);
		style.registry.insert(style,input[0]);
		style.registry.insert(style,input[1]);
		style.registry.insert(style,input[2]);
		var res = style.registry.getSortedIds();
		// An Altogether Unknown History of Soviet-Mongolian Relations
		doh.assertEqual( "simple-mongolian-name-1", res[0] );
		// A Book of Five Rings
		doh.assertEqual( "simple-sticky-name-1", res[1] );
		// His Anonymous Life
		doh.assertEqual( "simple-western-name-1", res[2] );
	},
	function testRegistryCiteNumber(){
		var xml = "<style>"
				  + "<citation>"
					  + "<layout>"
						  + "<text variable=\"title\"/>"
					  + "</layout>"
				  + "</citation>"
				  + "<bibliography>"
				  + "<sort>"
					  + "<key variable=\"title\"/>"
				  + "</sort>"
				  + "</bibliography>"
				  + "</style>";
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build();
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(["simple-sticky-name-1","simple-western-name-1","simple-mongolian-name-1"]);
		style.registry.insert(style,input[0]);
		style.registry.insert(style,input[1]);
		style.registry.insert(style,input[2]);
		// An Altogether Unknown History of Soviet-Mongolian Relations
		doh.assertEqual( 1, style.registry.registry["simple-mongolian-name-1"].seq );
		// A Book of Five Rings
		doh.assertEqual( 2, style.registry.registry["simple-sticky-name-1"].seq );
		// His Anonymous Life
		doh.assertEqual( 3, style.registry.registry["simple-western-name-1"].seq );
	},

]);
