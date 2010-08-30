/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights
 * Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the
 * terms of the GNU Affero General Public License (the [AGPLv3]
 * License), in which case the provisions of [AGPLv3] License are
 * applicable instead of those above. If you wish to allow use of your
 * version of this file only under the terms of the [AGPLv3] License
 * and not to allow others to use your version of this file under the
 * CPAL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the
 * [AGPLv3] License. If you do not delete the provisions above, a
 * recipient may use your version of this file under either the CPAL
 * or the [AGPLv3] License.”
 */

dojo.provide("citeproc_js.multiflat");
doh.registerGroup("citeproc_js.multiflat",
	[
		function testPlainFieldReadWrite() {
			var t = citeproc_js.multiflat;
			var myitem = new t.MultiField();
			myitem.title = 'hi';
			doh.assertEqual('hi', myitem.title);
		},
		function testSetGetPlainFieldWithMultiField() {
			var t = citeproc_js.multiflat;
			var myitem = new t.MultiField();
			myitem.setMultiField('title', 'hello');
			doh.assertEqual('hello', myitem.getMultiField('title'));
		},
		function testSetPlainFieldWithMultiFieldGetWithAccessor() {
			var t = citeproc_js.multiflat;
			var myitem = new t.MultiField();
			myitem.setMultiField('title', 'hello');
			doh.assertEqual('hello', myitem.title);
		},
		function testSetGetMultiFieldWithMultiContent() {
			var t = citeproc_js.multiflat;
			var myitem = new t.MultiField();
			myitem.title = 'hiya';
			myitem.setMultiField('title', 'foo', 'ja');
			doh.assertEqual('hiya', myitem.title);
			doh.assertEqual('foo', myitem.getMultiField('title', 'ja'));
		},
		function testDropMultiContent() {
			var t = citeproc_js.multiflat;
			var myitem = new t.MultiField();
			myitem.title = 'hiya';
			myitem.setMultiField('title', 'foo', 'ja');
			doh.assertEqual('hiya', myitem.title);
			doh.assertEqual('foo', myitem.getMultiField('title', 'ja'));
		}
	],
	function () {
		var t = citeproc_js.multiflat;

		t.MultiField = function (item) {
			if (arguments[0]) {
				throw ("Zotero.Creator constructor doesn't take any parameters");
			}
			this._init();
		};

		t.MultiField.prototype._init = function () {
			this._title = null;
			this._title_multi = {};
		};

		t.MultiField.prototype.__defineGetter__('objectType', function () { return 'multifield'; });
		t.MultiField.prototype.__defineGetter__('title', function () { return this.getMultiField('title'); });
		t.MultiField.prototype.__defineSetter__('title', function (val) { return this.setMultiField('title', val); });

		t.MultiField.prototype.setMultiField = function (name, val, lang) {
			var text, texts, code, codes, s, tlen, clen, key, codeslen;
			if (!name || !val) {
				throw "Empty argument to setMultiField";
			}
			if (!this['_' + name + '_base']) {
				this._loadMulti(name);
			}
			// XXXX Restore to non-multilingualized form when
			// no dependent entries exist.
			if (!lang) {
				this['_' + name + '_base'] = val;
			} else {
				this['_' + name + '_multi'][lang] = val;
			}
			text = this['_' + name + '_base'];
			tlen = '' + text.length;
			while (tlen.length < 6) {
				tlen = '0' + tlen;
			}
			code = tlen + '00';
			codes += code;
			texts += text;
			for (key in this['_' + name + '_multi']) {
				text = this['_' + name + '_multi'][key];
				tlen = '' + text.length;
				while (tlen.length < 6) {
					tlen = '0' + tlen;
				}
				clen = '' + code.length;
				while (clen.length < 2) {
					clen = '0' + clen;
				}
				code = tlen + clen + key;
				codes += code;
				texts += text;
			}
			codeslen = '' + codes.length;
			while (codeslen < 4) {
				codeslen = '0' + codeslen;
			}
			this['_' + name] = codeslen + codes + texts;
		};
		t.MultiField.prototype.getMultiField = function (name, lang) {
			if (!this['_' + name + '_base']) {
				this._loadMulti(name);
			}
			if (!lang) {
				// Account for non-multilingualized fields.
				return this['_' + name + '_base'];
			} else if (this['_' + name + '_multi'][lang]) {
				return this['_' + name + '_multi'][lang];
			} else {
				return '';
			}
		};
		t.MultiField.prototype.countMultiField = function (name) {
			return this['_' + name + '_multi'].__count__;
		};

		t.MultiField.prototype._loadMulti = function (name) {
			var base, m, mm, base_len, text_len, code_len, code, text, codes, texts, s;

			// This is invoked once, at item instantiation
			// Reads then play off of the multi object, and
			// writes update both the multi object and the field.
			// Sync of the flattened data in the field happens
			// in the normal way.

			// Data format that can be used to split the field reliably
			// in SQL.

			// Field format is:
			//   Offset to text field content (4 digits)
			//     Text field length (6 digits)
			//     Language code length (2 digits)
			//     Language code (variable length)

			s = this['_' + name];
			if (!s) {
				return '';
			}
			base = '';
			var multi = {};
			m = s.match(/^#([0-9]{4})[0-9]{6}00/);
			if (m) {
				var text_offset = parseInt(m[1]);
				texts = s.slice(text_offset);
				codes = s.slice(5, offset);
				base_len = parseInt(codes.slice(0, 6));
				base = texts.slice(0, base_length);
				texts = texts.slice(base_length);
				codes = codes.slice(8);
				mm = codes.match(/([0-9]{6})([0-9]{2})[-A-Za-z0-9]+/);
				while (mm) {
					text_len = parseInt(m[1]);
					code_len = parseInt(m[2]);
					code = codes.slice(8, 8 + code_len);
					codes = codes.slice(8 + code_len);
					text = texts.slice(0, text_len);
					texts = texts.slice(text_len);
					multi[code] = text;
				}
				if (texts.length) {
					base = '[corrupt field content: ' + texts + '] ' + base;
				}

			} else {
				base = s;
			}
			this['_' + name + '_base'] = base;
			this['_' + name + '_multi'] = multi;
		};
	},
	function () {}
);
