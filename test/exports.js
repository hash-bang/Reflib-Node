import {expect} from 'chai';
import {readFile} from '../lib/default.js';

describe('basic export tests', ()=> {

	it('should correctly have exported functions', ()=> {
		expect(readFile).to.be.a('function');
	});

});
