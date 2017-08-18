dojo.provide("citeproc_js.makecitationcluster");


doh.registerGroup("citeproc_js.makecitationcluster",
	[
		function testMakeCitationCluster(){
			var xml = "<style "
                + "      xmlns=\"http://purl.org/net/xbiblio/csl\""
                + "      class=\"note\""
                + "      version=\"1.0\">"
                + "      <info>"
                + "        <id />"
                + "        <title />"
                + "        <updated>2009-08-10T04:49:00+09:00</updated>"
                + "      </info>"
                + "      <citation>"
                + "        <layout delimiter=\"; \">"
                + "          <group delimiter=\", \">"
                + "            <text variable=\"title\"/>"
                + "            <group delimiter=\" \">"
                + "              <label variable=\"locator\" form=\"short\"/>"
                + "              <text variable=\"locator\">"
                + "            </group>"
                + "          </group>"
                + "        </layout>"
                + "      </citation>"
                + "    </style>"
			var result = citeproc_js.makecitationcluster.doMakeCitationCluster(xml);
			doh.assertEqual("Hello!, p. 10; Hello again!, p. 15", result);
		}
	],
	function(){  //setup
		citeproc_js.makecitationcluster.doMakeCitationCluster = function(myxml){
			var sys = new StdRhinoTest(null, "rhino");
            sys.test.input = [
                {
                    id: "Item-1",
                    title: "Hello!",
                    type: "book"
                },
                {
                    id: "Item-2",
                    title: "Hello again!",
                    type: "book"
                }
            ];
            sys._setCache();
			var style = new CSL.Engine(sys, myxml);
			var ret = style.makeCitationCluster([
                {
                    id: "Item-1",
                    position: 0,
                    locator: "10"
                },
                {
                    id: "Item-2",
                    position: 0,
                    locator: "15"
                }
            ])
            return ret;
		};
	},
	function(){	// teardown
	}

);

/*
*/
