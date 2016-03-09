var expect = require('chai').expect;
var rl = require('../index');

describe('RefLib - fix.pages()', function() {

	it('should pass though full page references', function() {
		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '16-17',
		})).to.have.property('pages', '16-17');

		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '1-3',
		})).to.have.property('pages', '1-3');

		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '8-9',
		})).to.have.property('pages', '8-9');
	});

	it('should reparse slightly mangled page references', function() {
		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '83 - 89',
		})).to.have.property('pages', '83-89');

		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '105 - 113',
		})).to.have.property('pages', '105-113');

		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '123--205',
		})).to.have.property('pages', '123-205');

		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '403 -- 476',
		})).to.have.property('pages', '403-476');
	});

	it('should reparse relative page ranges', function() {
		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '87-9',
		})).to.have.property('pages', '87-89');

		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '62-3',
		})).to.have.property('pages', '62-63');

		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '124-35',
		})).to.have.property('pages', '124-135');

		expect(rl.fix.pages({
			title: 'Test paper',
			pages: '161-5',
		})).to.have.property('pages', '161-165');
	});
});
