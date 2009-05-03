Zotero.CSL_old = Zotero.CSL;

Zotero.CSL = function(csl) {
  // "with ({});" needed to fix default namespace scope issue
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=330572
  default xml namespace = "http://purl.org/net/xbiblio/csl"; with ({});

  this._csl = new XML(Zotero.CSL.Global.cleanXML(csl));

  // load class and styleID
  this.styleID = this._csl.info.id.toString();
  this['class'] = this._csl["@class"].toString();
  Zotero.debug("CSL: style class is "+this['class']);

  this.hasBibliography = (this._csl.bibliography.length() ? 1 : 0);
  this._formatter = Zotero.CSL.Compiler.compile(this._csl);

  for (var macro in csl.macro) {
    //Zotero.CSL.Compiler.macro(macro);
  }
  //Zotero.CSL.Compiler.bibliography(csl.bibliography);
  //Zotero.CSL.Compiler.bibliography(csl.citation);
};

Zotero.CSL.Global = Zotero.CSL_old.Global;

Zotero.CSL.Text = function (children,options) {
  this._children = children;
  if (options == null) {
    this._options = new Zotero.CSL.TextOptions();
  }
  this._options = options;
};

Zotero.CSL.Text.prototype.toHTML = function () {
  return this.toString();
};

Zotero.CSL.Text.prototype.toRTF = function () {
  return this.toString();
};

Zotero.CSL.Text.prototype.toString = function () {
  return this._options.prefix + this._children.join(this._options.delimeter) + this._options.suffix;
};

Zotero.CSL.TextOptions = function (csl) {
  if (csl == null) {
    csl = {};
  }

  this._defaults = {
    '@font-family': 'serif',
    '@font-style': 'normal',
    '@font-variant': 'normal',
    '@font-weight': 'normal',
    '@text-decoration': 'none',
    '@text-case': '',
    '@vertical-align': 'baseline',
    '@display': '',
    '@quotes': '',
    '@prefix': '',
    '@suffix': '',
    '@delimeter': ''
  };

  this._orDefault = function (csl, attr) {
    if (csl[attr] != undefined) {
      return csl[attr];
    } else {
      return this._defaults[attr];
    }
  };

  this.fontFamily = this._orDefault(csl, '@font-family');
  this.fontStyle = this._orDefault(csl, '@font-style');
  this.fontVariant = this._orDefault(csl, '@font-variant');
  this.fontWeight = this._orDefault(csl, '@font-weight');
  this.textDecoration = this._orDefault(csl, '@text-decoration');
  this.textCase = this._orDefault(csl, '@text-case');
  this.verticalAlign = this._orDefault(csl, '@vertical-align');
  this.display = this._orDefault(csl, '@display');
  this.quotes = this._orDefault(csl, '@quotes');
  this.prefix = this._orDefault(csl, '@prefix');
  this.suffix = this._orDefault(csl, '@suffix');
  this.delimeter = this._orDefault(csl, '@delimeter');
};

Zotero.CSL.prototype.createItemSet = function(items) {
  return new Zotero.CSL.ItemSet(items, this);
};

Zotero.CSL.ItemSet = function (items, csl) {
  this._csl = csl;
  this._items = items;
};

Zotero.CSL.Compiler = {
};

Zotero.CSL.Compiler.noop = function (csl, helper) {
  return Zotero.CSL.Text("", Zotero.CSL.Text.Options());
};

Zotero.CSL.Compiler.compile = function (csl, helper) {
  if (helper == null) {
    helper = {};
    helper.macros = {};
  }
  switch (csl.localName()) {
  case "macro":
    return Zotero.CSL.Compiler.macro(csl);
  case "group":
    return Zotero.CSL.Compiler.group(csl);
  case "style":
    return Zotero.CSL.Compiler.noop;//(csl);
  case "text":
    return Zotero.CSL.Compiler.text(csl);
  case "dates":
    return Zotero.CSL.Compiler.dates(csl);
  default:
    return Zotero.CSL.Compiler.noop;
  }
};

Zotero.CSL.Compiler.each = function (ar, helper) {
  var funcs = ar.map (function (i) {
                        append(Zotero.CSL.Compiler.compile(i,helper));
                      });
  return function (citation) {
    var t = funcs.map(function (f) { f (citation); });
    return Zotero.Text(t, Zotero.CSL.Text.Options());
  };
};

Zotero.CSL.Compiler.macro = function (csl, helper) {
  helper.macros[csl['@name']] = Zotero.CSL.Compiler.each(csl.children(), helper);
};

Zotero.CSL.Compiler.group = function (csl, helper) {
  return Zotero.CSL.Compiler.each(csl.children(), helper);
};

Zotero.CSL.getVariable = function (citation, form) {

};

Zotero.CSL.Compiler.text = function (csl, helper) {
  var options = getOptions(csl);
  if (csl['@variable']) {
    var variable = csl['@variable'];
    return function (citation) {
      return Zotero.CSL.Text(prefix + citation.getVariable(variable) + suffix, options);
    };
  } else if (csl['@macro']) {
    var macro = csl['@macro'];
    return function (citation) {
      return Zotero.CSL.Text(prefix + macro(citation) + suffix, options);
    };
  } else if (csl['@term']) {
    var term = csl['@term'];
    return function (citation) {
      return Zotero.CSL.Text(prefix + localize(citation) + suffix, options);
    };
  } else if (csl['@value']) {
    var value = csl['@value'];
    return function (citation) {
      return Zotero.CSL.Text(prefix + value + suffix, options);
    };
  }
};

Zotero.CSL.Compiler.date = function (csl, helper) {
  var options = getOptions(csl);
  var variable = csl['@variable'];
  var parts = children.map( function (child) {
                              Zotero.CSL.compile_date_part(child);
                            } );
  return function (citation) {
    var t = parts.map( function (part) {
                         part(citation);
                       });
    return Zotero.CSL.Text(t,options);
  };
};

Zotero.CSL.Compiler.datePart = function (csl, helper) {
  var options = getOptions(csl);
  var name = this._orDefault(csl, '@name');
  if (name == 'month') {
    return function (citation) {
      citation.getMonth();
    };
  } else if (name == 'day') {

  } else if (name == 'year') {

  } else if (name == 'other') {

  }
};

Zotero.CSL.Compiler.layout = function (csl, helper) {
  var options = getOptions (csl);
  var childrenFunctions = children.map( function (child) {
                                          Zotero.CSL.compile(child);
                                        } );
  return function (citation) {
    return Zotero.CSL.Text(childrenFunctions.map(function(f) { f(citation); }), options);
  };
};

Zotero.CSL.Item = {};

Zotero.CSL.Item['_zoteroRomanNumerals'] = {
  "digits" : [ "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ],
  "tens" : [ "", "x", "xx", "xxx", "xl", "l", "lx", "lxx", "lxxx", "xc" ],
  "hundreds" : [ "", "c", "cc", "ccc", "cd", "d", "dc", "dcc", "dccc", "cm" ],
  "thousands" : [ "", "m", "mm", "mmm", "mmmm", "mmmmm"]
};

Zotero.CSL.Item['makeRoman'] = function(value) {
  var number = parseInt(value);
  if (number > 5000) {
    return "";
  } else {
    return Zotero.CSL.Item._zoteroRomanNumerals["thousands"][Math.floor(number/1000)] + Zotero.CSL.Item._zoteroRomanNumerals["hundreds"][Math.floor((number % 1000)/100)] + Zotero.CSL.Item._zoteroRomanNumerals["tens"][Math.floor((number % 100)/10)] + Zotero.CSL.Item._zoteroRomanNumerals["digits"][number % 10];
  }
};

Zotero.CSL.prototype.formatBibliography = function(itemSet, format) {
  default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
  return "";
};
