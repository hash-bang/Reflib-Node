import {expect} from 'chai';
import {identifyFormat} from '../lib/default.js';

describe('identifyFormat()', ()=> {

	it('should identify formats from file paths', ()=> {
		expect(identifyFormat('My Refs.csv')).to.have.property('id', 'csv');
		expect(identifyFormat('My Refs.json')).to.have.property('id', 'json');
		expect(identifyFormat('My Refs.nbib')).to.have.property('id', 'medline');
		expect(identifyFormat('My Refs.txt.ris')).to.have.property('id', 'ris');
		expect(identifyFormat('MY REFS.TXT.RIS')).to.have.property('id', 'ris');
		expect(identifyFormat('My Refs.data.tsv')).to.have.property('id', 'tsv');
		expect(identifyFormat('My Refs.xml')).to.have.property('id', 'endnoteXml');
	});

});
