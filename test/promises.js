var expect = require('chai').expect;
var fs = require('fs');
var rl = require('../index');

describe('Promises', function() {

	it('should parse a file as a promise', function() {
		this.timeout(60 * 1000);

		return rl.promises.parseFile(__dirname + '/data/endnote.xml', {
			fixes: {
				authors: true,
				dates: true,
				pages: true,
			},
		})
		.then(refs => {
			expect(refs).to.be.an('array');
			expect(refs).to.have.length(1988);
		})
	});

});
