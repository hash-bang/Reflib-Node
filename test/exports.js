import {expect} from 'chai';
import {identifyFormat, formats, getModule, readFile, readStream, writeFile, writeStream} from '../lib/default.js';

describe('basic export tests', ()=> {

	it('should correctly have exported functions', ()=> {
		expect(identifyFormat).to.be.a('function');
		expect(getModule).to.be.a('function');
		expect(readFile).to.be.a('function');
		expect(readStream).to.be.a('function');
		expect(writeFile).to.be.a('function');
		expect(writeStream).to.be.a('function');
	});

	it('should correctly have exported objects', ()=> {
		expect(formats).to.be.a('object');
	});

});
