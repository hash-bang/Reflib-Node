var expect = require('chai').expect;
var rl = require('../index');

describe('RefLib - fix.dates()', function() {

	it.skip('should parse month + year into individual fields', function() {
		var ref = rl.fix.dates({
			title: 'Test paper',
			date: 'Jun 2016',
		});

		expect(ref).to.have.property('year', '2016');
		expect(ref).to.have.property('month', 'Jun');
		expect(ref).to.not.have.property('date');
	});

	it.skip('should parse just the year into an individual field', function() {
		var ref = rl.fix.dates({
			title: 'Test paper',
			date: '2012',
		});

		expect(ref).to.have.property('year', '2012');
		expect(ref).to.not.have.property('month');
		expect(ref).to.not.have.property('date');
	});

	it.skip('should parse just the month into an individual field', function() {
		var ref = rl.fix.dates({
			title: 'Test paper',
			date: 'February',
		});

		expect(ref).to.not.have.property('year');
		expect(ref).to.have.property('month', 'Feb');
		expect(ref).to.not.have.property('date');
	});

	it.skip('should parse month + year into individual fields', function() {
		var ref = rl.fix.dates({
			title: 'Test paper',
			date: 'Sep',
		});

		expect(ref).to.not.have.property('year');
		expect(ref).to.have.property('month', 'Sep');
		expect(ref).to.not.have.property('date');
	});

	it('should parse full dates #1', function() {
		var ref = rl.fix.dates({
			title: 'Test paper',
			date: '1st December 2013',
		});

		expect(ref).to.have.property('year', '2013');
		expect(ref).to.have.property('month', 'Dec');
		expect(ref).to.have.property('date');
		expect(ref.date).to.deep.equal('2013-12-01');
	});

	it('should parse full dates #2', function() {
		var ref = rl.fix.dates({
			title: 'Test paper',
			date: '15/03/2014',
		});

		expect(ref).to.have.property('year', '2014');
		expect(ref).to.have.property('month', 'Mar');
		expect(ref).to.have.property('date');
		expect(ref.date).to.deep.equal('2014-03-15');
	});
});
