dojo.provide("csl.util_substitute");
if (!CSL) {
	load("./src/csl.js");
}

CSL.Util.substituteStart = function(state,target){
	if (state.build.substitute_level.value() == 1){
		//
		// A text macro inside a substitute environment is
		// treated as a special conditional.
		var choose_start = new CSL.Factory.Token("choose",CSL.START);
		target.push(choose_start);
		var if_start = new CSL.Factory.Token("if",CSL.START);
		//
		// Here's the Clever Part.
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
	if (state.build.substitute_level.value() == 1){
		var if_end = new CSL.Factory.Token("if",CSL.END);
		target.push(if_end);
		var choose_end = new CSL.Factory.Token("choose",CSL.END);
		target.push(choose_end);
	};
};
