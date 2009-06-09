dojo.provide("csl.util_substitute");


CSL.Util.substituteStart = function(state,target){
	//
	// Contains wrapper code for both substitute and first-field/remaining-fields
	// formatting.
	//
	if (state[state.build.area].opt["second-field-align"]){
		if (state.build.render_nesting_level == 0 && !state.build.render_seen){
			var field_start = new CSL.Factory.Token("group",CSL.START);
			var field_decor_start = function(state,Item){
				// print("    -- first \"field\" start: "+this.name);
				state.output.append(state.fun.decorate["second-field-align-first-field-start"],"empty");
			};
			field_start.execs.push(field_decor_start);
			target.push(field_start);
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
		var choose_start = new CSL.Factory.Token("choose",CSL.START);
		target.push(choose_start);
		var if_start = new CSL.Factory.Token("if",CSL.START);
		//
		// Set a test of the shadow if token to skip this
		// macro if we have acquired a name value.
		var check_for_variable = function(state,Item){
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
		var evaluator = function(state,Item){
			var res = this.fail;
			state.tmp.jump.replace("fail");
			for each (var func in this.tests){
				if (func.call(this,state,Item)){
					res = this.succeed;
					state.tmp.jump.replace("succeed");
					break;
				}
			}
			return res;
		};
		if_start.evaluator = evaluator;
		target.push(if_start);
	};
};


CSL.Util.substituteEnd = function(state,target){
	if (state[state.build.area].opt["second-field-align"]){
		state.build.render_nesting_level += -1;
		if (state.build.render_nesting_level == 0 && !state.build.render_seen){
			state.build.render_seen = true;
			var field_end = new CSL.Factory.Token("group",CSL.END);
			var field_decor_end = function(state,Item){
				// print("    -- first \"field\" end: "+this.name);
				state.output.append(state.fun.decorate["second-field-align-first-field-end"],"empty");
				// print("    -- second \"field\"+ start");
				state.output.append(state.fun.decorate["second-field-align-second-field-start"],"empty");
			};
			field_end.execs.push(field_decor_end);
			target.push(field_end);
		};
	};
	if (state.build.substitute_level.value() == 1){
		var if_end = new CSL.Factory.Token("if",CSL.END);
		target.push(if_end);
		var choose_end = new CSL.Factory.Token("choose",CSL.END);
		target.push(choose_end);
	};
};
