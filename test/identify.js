var expect = require('chai').expect;
var rl = require('../index');

describe('EndNote XML identifier', function() {
	it('should identify the Reflib driver to use', function() {
		var driver = rl.identify('endnote.xml');
		expect(driver).to.equal('endnotexml');
	});
});
