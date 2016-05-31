var _ = require('lodash');
var expect = require('chai').expect;
var fs = require('fs');
var rl = require('../index');

describe('MEDLINE parser - test #1', function() {
	var resErr;
	var data = {};

	before(function(next) {
		this.timeout(60 * 1000);
		rl.parseFile(__dirname + '/data/cancer.nbib')
			.on('error', function(err) {
				resErr = err;
				next();
			})
			.on('ref', function(ref) {
				data[ref.recNo] = ref;
			})
			.on('end', next);
	});

	it('should not raise an error', function() {
		expect(resErr).to.be.not.ok;
	});

	it('end count should be accurate', function() {
		expect(_.keys(data)).to.have.length(20);
	});

	it('should return random sample (prophylactic central neck dissection)', function() {
		var sample = data['27236850'];
		expect(sample).to.be.ok;
		expect(sample).to.have.property('title', 'Evaluating the influence of prophylactic central neck dissection on TNM staging and the recurrence risk stratification of cN differentiated thyroid carcinoma.');
		expect(sample).to.have.property('journal', 'Bulletin du cancer');
		expect(sample).to.have.property('authors');
		expect(sample.authors).to.deep.equal(['Lin, Xiaodong', 'Chen, Xiaoyi', 'Jiru, Yuan', 'Du, Jialin', 'Zhao, Gang', 'Wu, Zeyu']);
		expect(sample).to.have.property('date', '2016 May 25');
		expect(sample).to.have.property('type', 'journalArticle');
		expect(sample).to.have.property('language', 'ENG');
		expect(sample).to.have.property('abstract');
		expect(sample.abstract).to.match(/^OBJECTIVE: The purpose of this study/);
		expect(sample.abstract).to.match(/RESULTS: In the present study/);
		expect(sample.abstract).to.match(/for patients with age>\/=45 years\) and RRS\.$/);
		expect(sample.tags).to.deep.equal(['Central lymph node metastasis (CLNM)', 'Differentiated thyroid carcinoma (DTC)', 'Prophylactic central neck dissection (pCND)', 'Recurrence risk stratification (RRS)', 'Risk factors', 'TNM staging']);
		expect(sample).to.have.property('doi', '10.1016/j.bulcan.2016.04.003 [doi]');
	});
});
