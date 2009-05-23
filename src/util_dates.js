dojo.provide("csl.util_dates");
if (!CSL) {
	load("./src/csl.js");
}

/**
 * Date mangling functions.
 * @namespace Date construction utilities
 */
CSL.Util.Dates = new function(){};

/**
 * Year manglers
 * <p>short, long</p>
 */
CSL.Util.Dates.year = new function(){};

/**
 * Convert year to long form
 * <p>This just passes the number back as a string.</p>
 */
CSL.Util.Dates.year["long"] = function(state,num){
	return num.toString();
}

/**
 * Convert year to short form
 * <p>Just crops any 4-digit year to the last two digits.</p>
 */
CSL.Util.Dates.year["short"] = function(state,num){
	num = num.toString();
	if (num && num.length == 4){
		return num.substr(2);
	}
}


/*
 * MONTH manglers
 * long, short, numeric, numeric-leading-zeros
 */
CSL.Util.Dates["month"] = new function(){};

/**
 * Convert month to numeric form
 * <p>This just passes the number back as a string.</p>
 */
CSL.Util.Dates.month["numeric"] = function(state,num){
	return num.toString();
}

/**
 * Convert month to numeric-leading-zeros form
 * <p>This just passes the number back as string padded with zeros.</p>
 */
CSL.Util.Dates.month["numeric-leading-zeros"] = function(state,num){
	num = num.toString();
	while (num.length < 2){
		num = "0"+num;
	}
	return num.toString();
}

/**
 * Convert month to long form
 * <p>This passes back the month of the locale in long form.</p>
 */
CSL.Util.Dates.month["long"] = function(state,num){
	num = num.toString();
	while (num.length < 2){
		num = "0"+num;
	}
	num = "month-"+num;
	return state.opt.term[num]["long"][0];
}

/**
 * Convert month to long form
 * <p>This passes back the month of the locale in short form.</p>
 */
CSL.Util.Dates.month["short"] = function(state,num){
	num = num.toString();
	while (num.length < 2){
		num = "0"+num;
	}
	num = "month-"+num;
	return state.opt.term[num]["short"][0];
}


/*
 * DAY manglers
 * numeric, numeric-leading-zeros, ordinal
 */
CSL.Util.Dates["day"] = new function(){};

/**
 * Convert day to numeric form
 * <p>This just passes the number back as a string.</p>
 */
CSL.Util.Dates.day["numeric"] = function(state,num){
	return num.toString();
}

/**
 * Convert day to numeric-leading-zeros form
 * <p>This just passes the number back as a string padded with zeros.</p>
 */
CSL.Util.Dates.day["numeric-leading-zeros"] = function(state,num){
	num = num.toString();
	while (num.length < 2){
		num = "0"+num;
	}
	return num.toString();
}

/**
 * Convert day to ordinal form
 * <p>This will one day pass back the number as a string with the
 * ordinal suffix appropriate to the locale.  For the present,
 * it just does what is most of the time right for English.</p>
 */
CSL.Util.Dates.day["ordinal"] = function(state,num){
	var suffixes = ["st","nd","rd","th"];
	var str = num.toString();
	if ( (num/10)%10 == 1){
		str += suffixes[3];
	} else if ( num%10 == 1) {
		str += suffixes[0];
	} else if ( num%10 == 2){
		str += suffixes[1];
	} else if ( num%10 == 3){
		str += suffixes[2];
	} else {
		str += suffixes[3];
	}
	return str;
}
