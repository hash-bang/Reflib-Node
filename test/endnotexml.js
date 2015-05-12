var expect = require('chai').expect;
var fs = require('fs');
var rl = require('../index');

describe('EndNote XML identifier', function() {
	it('should identify the Reflib driver to use', function() {
		var driver = rl.identify('endnote.xml');
		expect(driver.id).to.equal('endnotexml');
	});
});

describe('EndNote XML parser', function() {
	var resErr, resCount = 0, resCountCalled = 0;

	before(function(next) {
		this.timeout(60 * 1000);
		rl.parse('endnotexml', fs.readFileSync(__dirname + '/data/endnote.xml'))
			.on('error', function(err) {
				resErr = err;
				next();
			})
			.on('ref', function(ref) {
				resCountCalled++;
			})
			.on('end', function(count) {
				resCount = count;
				next();
			});
	});

	it('should not raise an error', function() {
		expect(resErr).to.be.not.ok;
	});

	it('end count should be accurate', function() {
		expect(resCount).to.not.equal(0);
		expect(resCountCalled).to.not.equal(0);
		expect(resCount).to.equal(resCountCalled);
	});
});
