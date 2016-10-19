"use strict";

const assert = require('./assert-dom');

const Widget = require('../lib/widget');

describe('Widget', () => {
	let div;

	function element(tag, id, classes) {
		tag = tag || 'div';
		let el = document.createElement(tag);
		el.id = id;
		el.className = classes;
		return el;
	}

	beforeEach(() => {
		// ensure that we have a clean Element to play with
		div = element();
		// also that we have clean 'document.body'
		document.body.innerHTML = '';
	});

	describe('constructor', () => {
		it('should have no Element', () => {
			assert.throws(() => {
				let widget = new Widget();
			}, Error, 'Expected "not an element" error.');
		});

		it('should have given Element', () => {
			let widget = new Widget(div);
			assert.strictEqual(div, widget.el);
		});


		it('should create instance of Widget', () => {
			assert((new Widget(div)) instanceof Widget);
			assert((Widget(div)) instanceof Widget);
		});
	});

	describe('#append', () => {
		let parent, child;
		beforeEach(() => {
			parent = new Widget(element('div', 'parent'));
			child = new Widget(element('div', 'child'))
		});

		it('should append child', () =>  {
			parent.append(child);
		});
	});
});
