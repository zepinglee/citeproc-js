dojo.provide("csl.util_substitute");


CSL.Util.substituteStart = function(state,target){
	//
	// Contains wrapper code for both substitute and first-field/remaining-fields
	// formatting.
	//
	if (("text" == this.name && !this.postponed_macro) || ["number","date","names"].indexOf(this.name) > -1){
		var element_trace = function(state,Item){
			if (state.tmp.element_trace.value() == "author" || "names" == this.name){
				if (Item["author-only"]){
					state.tmp.element_trace.push("do-not-suppress-me");
				} else if (Item["suppress-author"]){
					state.tmp.element_trace.push("suppress-me");
				};
			} else {
				if (Item["author-only"]){
					state.tmp.element_trace.push("suppress-me");
				} else if (Item["suppress-author"]){
					state.tmp.element_trace.push("do-not-suppress-me");
				};
			};
		};
		this.execs.push(element_trace);
	};
	if (state.build.area == "bibliography"){
		if (state.build.render_nesting_level == 0){
			var bib_first = new CSL.Factory.Token("group",CSL.START);
			bib_first.decorations = [["@bibliography","first"]];
			var func = function(state,Item){
				if (!state.tmp.render_seen){
					state.output.startTag("bib_first",bib_first);
				};
			};
			bib_first.execs.push(func);
			target.push(bib_first);
		}
		state.build.render_nesting_level += 1;
	}
	if (state.build.substitute_level.value() == 1){
		//
		// All top-level elements in a substitute environment get
		// wrapped in conditionals.  The substitute_level variable
		// is a stack, because spanned names elements (with their
		// own substitute environments) can be nested inside
		// a substitute environment.
		//
		// (okay, we use conditionals a lot more than that.
		// we slot them in for author-only as well...)
		var choose_start = new CSL.Factory.Token("choose",CSL.START);
		target.push(choose_start);
		var if_start = new CSL.Factory.Token("if",CSL.START);
		//
		// Set a test of the shadow if token to skip this
		// macro if we have acquired a name value.
		var check_for_variable = function(state,Item){
			//
			// !!!!!: Just to make life a little more interesting,
			// myval == 0 evaluates to "true" when myval is "false".
			// Hence the explicit test of the type here.
			//
			if (state.tmp.can_substitute.value()){
				return true;
			}
			return false;
		};
		if_start.tests.push(check_for_variable);
		//
		// this is cut-and-paste of the "any" evaluator
		// function, from Attributes.  These functions
		// should be defined in a namespace for reuse.
		// Sometime.
		if_start.evaluator = state.fun.match.any;
		target.push(if_start);
	};
};


CSL.Util.substituteEnd = function(state,target){
	if (state.build.area == "bibliography"){
		state.build.render_nesting_level += -1;
		if (state.build.render_nesting_level == 0){
			var bib_first_end = new CSL.Factory.Token("group",CSL.END);
			var first_func_end = function(state,Item){
				if (!state.tmp.render_seen){
					state.output.endTag(); // closes bib_first
				};
			};
			bib_first_end.execs.push(first_func_end);
			target.push(bib_first_end);

			var bib_other = new CSL.Factory.Token("group",CSL.START);
			bib_other.decorations = [["@bibliography","other"]];
			var other_func = function(state,Item){

				if (!state.tmp.render_seen){
					state.tmp.render_seen = true;
					state.output.startTag("bib_other",bib_other);
				};
			};
			bib_other.execs.push(other_func);
			target.push(bib_other);
		};
	};
//	if (state.build.substitute_level.value() <= 1 && this.name != "group"){
	if (state.build.substitute_level.value() == 1){
		var if_end = new CSL.Factory.Token("if",CSL.END);
		target.push(if_end);
		var choose_end = new CSL.Factory.Token("choose",CSL.END);
		target.push(choose_end);
	};
	if (("text" == this.name && !this.postponed_macro) || ["number","date","names"].indexOf(this.name) > -1){
		var element_trace = function(state,Item){
			state.tmp.element_trace.pop();
		};
		this.execs.push(element_trace);
	};
};
