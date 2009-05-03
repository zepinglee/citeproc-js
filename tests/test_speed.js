load("./dojo/dojo/dojo.js");
dojo.registerModulePath("dojo","./dojo/dojo");
dojo.registerModulePath("dojox","./dojo/dojox");
dojo.registerModulePath("csl","./src");
dojo.registerModulePath("doh","./dojo/util/doh");

dojo.require("doh.runner");

dojo.provide("tests.test_speed");

dojo.require("csl.csl");

doh.registerGroup("tests.speed",
	[
		function testSpeed(){
			print("iterate over sorted list and print");
			tests.test_speed.registry.iterate();
		}

	],
	function(){ //setup

		print ("loading functions");

		var Registry = function(){
			this.registry = new Object();
			this.start = false;
			this.end = false;
			this.initialized = false;
			this.skip = false;
			this.maxlength = 0;
			this.insert = function(newitem){
				if (newitem.phoneytitle.length > this.maxlength){
					this.maxlength = newitem.phoneytitle.length;
				}
				// if the registry is empty, initialize it with
				// this object.
				if (!this.initialized){
					this.registry[newitem.id] = newitem;
					this.start = newitem.id;
					this.end = newitem.id;
					this.initialized = true;
					return;
				}
				// if this object is less than the first one,
				// insert it as the first.
				if (-1 == this.compareStrings(newitem.phoneytitle,this.registry[this.start].phoneytitle)){
					//print("Sequence at the beginning: "+newitem.phoneytitle+", "+this.registry[this.start].phoneytitle);
					newitem.next = this.registry[this.start].id;
					this.registry[this.start].prev = newitem.id;
					newitem.prev = false;
					this.start = newitem.id;
					this.registry[newitem.id] = newitem;
					return;
				}
				// if this object is greater than the
				// last one, insert it as the last.
				if (-1 == this.compareStrings(this.registry[this.end].phoneytitle,newitem.phoneytitle)){
					//print("Sequence at the end: "+this.registry[this.end].phoneytitle+", "+newitem.phoneytitle);
					newitem.prev = this.registry[this.end].id;
					this.registry[this.end].next = newitem.id;
					newitem.next = false;
					this.end = newitem.id;
					this.registry[newitem.id] = newitem;
					return;
				}
				//
				// if we reach this, it's safe to iterate
				var curr = this.registry[this.start];
				while (true){
					// compare the new token to be added with
					// the one we're thinking about placing it before.
					var cmp = this.compareStrings(curr.phoneytitle,newitem.phoneytitle);
					if (cmp > 0){
						// insert mid-list, before the tested item
						//print("Inserting mid-list: "+newitem.phoneytitle+", next is "+curr.phoneytitle);
						this.registry[curr.prev].next = newitem.id;
						newitem.prev = curr.prev;
						newitem.next = curr.id;
						curr.prev = newitem.id;
						this.registry[newitem.id] = newitem;
						return;
					} else if (cmp == 0) {
						// also insert before, but this is a duplicate,
						// so we need to provide for cases where the
						// inserted object ends up at the beginning of
						// the virtual list.
						//
						//print("I'm a dupe: "+curr.phoneytitle);
						// (disambiguation handling would slot in here)
						//
						if (false == curr.prev){
							newitem.prev = false;
							newitem.next = curr.id;
							curr.prev = newitem.id;
							this.registry[newitem.id] = newitem;
							return;
						} else {
							this.registry[curr.prev].next = newitem.id;
							newitem.prev = curr.prev;
							newitem.next = curr.id;
							curr.prev = newitem.id;
							this.registry[newitem.id] = newitem;
							return;
						}
					}
					curr = this.registry[curr.next];
				};
			};

			this.compareStrings = function(a,b){
				return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
			};

			this.iterate = function(){
				var curr = this.registry[this.start];
				//print("starting iterate at: "+printme);
				while(curr.next != false){
					var printme = curr.phoneytitle;
					while (printme.length < this.maxlength){
						printme = " "+printme;
					}
					print(printme);
					curr = this.registry[curr.next];
				}
			};
		};

		var makeThing = function(key,phoneytitle,transfat){
			this.id = key;
			this.phoneytitle = phoneytitle;
			this.transfat = transfat;
			this.next = false;
			this.prev = false;
		};

		function makePhoneyTitle(){
			var ret = "";
			var mylen = (Math.floor(Math.random()*25)+1);
			for (var i=0; i<mylen; i++){
				var unival = (Math.floor(Math.random()*126)+257);
				unival = unival.toString(16);
				while (unival.length < 4){
					unival = "0"+unival;
				}
				eval("unival = \"\\u"+unival+"\"");
				ret += unival;
			}
			return ret;

		}

		print("instantiating registry object");
		tests.test_speed.registry = new Registry();

		print("loading items to registry");
		for (var i=0; i<1000; i++){
			var key = "item"+i;
			var phoneytitle = makePhoneyTitle();
			var transfat = "All work and no play makes Jack a dull boy."
					  + "All work and no play makes Jack a dull boy."
					  + "All work and no play makes Jack a dull boy."
					  + "All work and no play makes Jack a dull boy."
					  + "All work and no play makes Jack a dull boy."
					  + "All work and no play makes Jack a dull boy."
				+ "All work and no play makes Jack a dull boy.";
			var thing = new makeThing(key,phoneytitle,transfat);
			tests.test_speed.registry.insert(thing);
		}
	},
	function(){ //teardown

	}
);

tests.run();
