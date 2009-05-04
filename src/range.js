dojo.provide("csl.range");
if (!CSL) {
	load("./src/csl.js");
}

/**
 * An output instance object representing a number or a range
 *
 * with attributes next and start, and
 * methods isRange(), renderStart(), renderEnd() and renderRange().
 * At render time, the output queue will perform optional
 * collapsing of these objects in the queue, according to
 * configurable options, and apply any decorations registered
 * in the object to the output elements.
 * @namespace Range object and friends.
 */

CSL.Output.Number = function(num,mother_token){
	this.num = num;
	this.blobs = num.toString();
	this.status = CSL.START;
	this.strings = new Object();
	if (mother_token){
		this.decorations = mother_token.decorations;
		this.strings.prefix = mother_token.strings.prefix;
		this.strings.suffix = mother_token.strings.suffix;
		this.successor_prefix = mother_token.successor_prefix;
		this.range_prefix = mother_token.range_prefix;
		this.splice_prefix = "";
		this.formatter = mother_token.formatter;
		if (!this.formatter){
			this.formatter =  new CSL.Output.DefaultFormatter();
		}
		if (this.formatter){
			this.type = this.formatter.format(1);
		}
	} else {
		this.decorations = new Array();
		this.strings.prefix = "";
		this.strings.suffix = "";
		this.successor_prefix = "";
		this.range_prefix = "";
		this.splice_prefix = "";
		this.formatter = new CSL.Output.DefaultFormatter();
	}
};


CSL.Output.Number.prototype.setFormatter = function(formatter){
	this.formatter = formatter;
	this.type = this.formatter.format(1);
};


CSL.Output.DefaultFormatter = function (){};
CSL.Output.DefaultFormatter.prototype.format = function (num){
	return num.toString();
};


CSL.Output.Number.prototype.checkNext = function(next){
	if ( ! next || ! next.num || this.type != next.type || next.num != (this.num+1)){
		if (this.status == CSL.SUCCESSOR_OF_SUCCESSOR){
			this.status = CSL.END;
		}
	} else { // next number is in the sequence
		if (this.status == CSL.START){
			next.status = CSL.SUCCESSOR;
		} else if (this.status == CSL.SUCCESSOR || this.status == CSL.SUCCESSOR_OF_SUCCESSOR){
			if (this.range_prefix){
				next.status = CSL.SUCCESSOR_OF_SUCCESSOR;
				this.status = CSL.SUPPRESS;
			} else {
				next.status = CSL.SUCCESSOR;
			}

		}
	};
};
