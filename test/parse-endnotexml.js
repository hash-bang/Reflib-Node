var expect = require('chai').expect;
var fs = require('fs');
var rl = require('../index');

describe('EndNote XML parser - test #1', function() {
	var resErr, resCount = 0, resCountCalled = 0;
	var sampleData = {};

	before(function(next) {
		this.timeout(60 * 1000);
		rl.parseFile(__dirname + '/data/endnote.xml', {
			fixes: {
				pages: true,
			},
		})
			.on('error', function(err) {
				resErr = err;
				next();
			})
			.on('ref', function(ref) {
				resCountCalled++;
				if (ref.isbn == '1097-685X' && ref.title == 'A method for chest drainage after pediatric cardiac surgery: a prospective randomized trial') {
					sampleData['pediatric-cardiac'] = ref;
				} else if (ref.title == 'Everolimus immunosuppression in de novo heart transplant recipients: What does the evidence tell us now?') {
					sampleData['everolimus-immunosuppression'] = ref;
				} else if (ref.isbn == '0012-3692' && ref.caption == '1456') {
					sampleData['silver-nitrate'] = ref;
				} else if (ref.isbn == '1440-1843' && ref.caption == '1526') {
					sampleData['cosmetic-talc'] = ref;
				}
			})
			.on('end', next);
	});

	it('should not raise an error', function() {
		expect(resErr).to.be.not.ok;
	});

	it('end count should be accurate', function() {
		expect(resCountCalled).to.equal(1988);
	});

	it('should return random sample (pediatric-cardiac)', function() {
		var sample = sampleData['pediatric-cardiac'];
		expect(sample).to.be.ok;
		expect(sample).to.have.property('title', 'A method for chest drainage after pediatric cardiac surgery: a prospective randomized trial');
		expect(sample).to.have.property('journal', 'Journal of Thoracic & Cardiovascular Surgery');
		expect(sample).to.have.property('authors');
		expect(sample.authors).to.have.length(1);
		expect(sample.authors[0]).to.equal('Agati, Salvatore; Mignosa, Carmelo; Gitto, Placido; Trimarchi, Eugenio Santo; Ciccarello, Giuseppe; Salvo, Dario; Trimarchi, Giuseppe');
		expect(sample).to.have.property('address', 'Pediatric Cardiac Surgery Unit, San Vincenzo Hospital, Taormina, Messina, Italy. sasha.agati@tiscali.it');
		expect(sample).to.have.property('pages', '1306-1309');
		expect(sample).to.have.property('volume', '131');
		expect(sample).to.have.property('number', '6');
		expect(sample).to.have.property('date', 'Jun 2006');
		expect(sample).to.have.property('abstract');
		expect(sample.abstract).to.match(/^OBJECTIVES: .*removal\.$/);
		expect(sample).to.have.property('label', 'OK');
		expect(sample).to.have.property('caption', '970');
		expect(sample).to.have.property('notes', 'EM');
		expect(sample).to.have.property('isbn', '1097-685X');
		expect(sample).to.have.property('urls');
		expect(sample.urls).to.have.length(1);
		expect(sample.urls[0]).to.equal('http://ovidsp.ovid.com/ovidweb.cgi?T=JS&CSC=Y&NEWS=N&PAGE=fulltext&D=med4&AN=16733162; http://ZL9EQ5LQ7V.search.serialssolutions.com/?sid=OVID:medline&id=pmid:16733162&id=doi:&issn=0022-5223&isbn=&volume=131&issue=6&spage=1306&pages=1306-9&date=2006&title=Journal+of+Thoracic+%26+Cardiovascular+Surgery&atitle=A+method+for+chest+drainage+after+pediatric+cardiac+surgery%3A+a+prospective+randomized+trial.&aulast=Agati&pid=%3Cauthor%3EAgati+S%3BMignosa+C%3BGitto+P%3BTrimarchi+ES%3BCiccarello+G%3BSalvo+D%3BTrimarchi+G%3C%2Fauthor%3E%3CAN%3E16733162%3C%2FAN%3E%3CDT%3EJournal+Article%3C%2FDT%3E');
		expect(sample).to.have.property('researchNotes', 'Agati S; Mignosa C; Gitto P; Trimarchi ES; Ciccarello G; Salvo D; Trimarchi G');
	});


	it('should return random sample (everolimus-immunosuppression)', function() {
		var sample = sampleData['everolimus-immunosuppression'];
		expect(sample).to.be.ok;
		expect(sample).to.have.property('title', 'Everolimus immunosuppression in de novo heart transplant recipients: What does the evidence tell us now?');
		expect(sample).to.have.property('journal', 'Transplantation Reviews');
		expect(sample).to.have.property('authors');
		expect(sample.authors).to.have.length(10);
		expect(sample.authors).to.deep.equal(['Zuckermann, A.', 'Wang, S. S.', 'Epailly, E.', 'Barten, M. J.', 'Sigurdardottir, V.', 'Segovia, J.', 'Varnous, S.', 'Turazza, F. M.', 'Potena, L.', 'Lehmkuhl, H. B.']);
		expect(sample).to.have.property('address', 'Zuckermann, A., Department of Cardiac Surgery, Medical University of Vienna, 1090 Vienna, Austria');
		expect(sample).to.have.property('pages', '76-84');
		expect(sample).to.have.property('volume', '27');
		expect(sample).to.have.property('number', '3');
		expect(sample).to.have.property('date', '2013');
		expect(sample).to.have.property('abstract');
		expect(sample.abstract).to.match(/^The efficacy of everolimus.*2013 Elsevier Inc\.$/);
		expect(sample).to.have.property('label', 'OK');
		expect(sample).to.have.property('caption', '608');
		expect(sample).to.have.property('notes', 'U');
		expect(sample).to.have.property('isbn', "0955-470X\r1557-9816");
		expect(sample).to.have.property('urls');
		expect(sample.urls).to.have.length(3);
		expect(sample.urls).to.deep.equal(['http://www.embase.com/search/results?subaction=viewrecord&from=export&id=L52565756', 'http://dx.doi.org/10.1016/j.trre.2013.03.002', 'http://cf5pm8sz2l.search.serialssolutions.com/?&issn=0955470X&id=doi:10.1016%2Fj.trre.2013.03.002&atitle=Everolimus+immunosuppression+in+de+novo+heart+transplant+recipients%3A+What+does+the+evidence+tell+us+now%3F&stitle=Transpl.+Rev.&title=Transplantation+Reviews&volume=27&issue=3&spage=76&epage=84&aulast=Zuckermann&aufirst=Andreas&auinit=A.&aufull=Zuckermann+A.&coden=TRPPC&isbn=&pages=76-84&date=2013&auinit1=A&auinitm='], 'urls');
	});


	it('should return random sample (silver-nitrate)', function() {
		var sample = sampleData['silver-nitrate'];
		expect(sample).to.be.ok;
		expect(sample).to.have.property('title', 'Prospective randomized trial of silver nitrate vs talc slurry in pleurodesis for symptomatic malignant pleural effusions');
		expect(sample).to.have.property('journal', 'Chest');
		expect(sample).to.have.property('authors');
		expect(sample.authors).to.have.length(7);
		expect(sample.authors).to.deep.equal(['Paschoalini, Marcello da Silveira','Vargas, Francisco S.','Marchi, Evaldo','Pereira, Jose Rodrigues','Jatene, Fabio B.','Antonangelo, Leila','Light, Richard W.']);
		expect(sample).to.have.property('address', 'Perola Byington Hospital, Sao Paulo, Brazil.');
		expect(sample).to.have.property('pages', '684-689');
		expect(sample).to.have.property('volume', '128');
		expect(sample).to.have.property('number', '2');
		expect(sample).to.have.property('date', 'Aug 2005');
		expect(sample).to.have.property('abstract');
		expect(sample.abstract).to.match(/production of a pleurodesis\.$/);
		expect(sample).to.have.property('label', 'OK');
		expect(sample).to.have.property('caption', '1456');
		expect(sample).to.have.property('notes', 'DUP');
		expect(sample).to.have.property('isbn', "0012-3692");
		expect(sample).to.have.property('urls');
		expect(sample.urls).to.have.length(2);
		expect(sample.urls).to.deep.equal(['http://ovidsp.ovid.com/ovidweb.cgi?T=JS&CSC=Y&NEWS=N&PAGE=fulltext&D=med4&AN=16100154', 'http://ZL9EQ5LQ7V.search.serialssolutions.com/?sid=OVID:medline&id=pmid:16100154&id=doi:&issn=0012-3692&isbn=&volume=128&issue=2&spage=684&pages=684-9&date=2005&title=Chest&atitle=Prospective+randomized+trial+of+silver+nitrate+vs+talc+slurry+in+pleurodesis+for+symptomatic+malignant+pleural+effusions.&aulast=Paschoalini+Mda&pid=%3Cauthor%3EPaschoalini+Mda+S%3BVargas+FS%3BMarchi+E%3BPereira+JR%3BJatene+FB%3BAntonangelo+L%3BLight+RW%3C%2Fauthor%3E%3CAN%3E16100154%3C%2FAN%3E%3CDT%3EClinical+Trial%3C%2FDT%3E'], 'urls');
		expect(sample).to.have.property('researchNotes', 'Paschoalini Mda S\rVargas FS\rMarchi E\rPereira JR\rJatene FB\rAntonangelo L\rLight RW');
	});

	it('should return random sample (cosmetic-talc)', function() {
		var sample = sampleData['cosmetic-talc'];
		expect(sample).to.be.ok;
		expect(sample).to.have.property('title', 'A randomized controlled trial of the efficacy of cosmetic talc compared with iodopovidone for chemical pleurodesis');
		expect(sample).to.have.property('journal', 'Respirology');
		expect(sample).to.have.property('authors');
		expect(sample.authors).to.have.length(5);
		expect(sample.authors).to.deep.equal(['Agarwal, Ritesh','Paul, Abinash S.','Aggarwal, Ashutosh N.','Gupta, Dheeraj','Jindal, Surinder K.']);
		expect(sample).to.have.property('pages', '1064-1069');
		expect(sample).to.have.property('volume', '16');
		expect(sample).to.have.property('number', '7');
		expect(sample).to.have.property('date', 'Oct 2011');
		expect(sample).to.have.property('abstract');
		expect(sample.abstract).to.match(/39 with iodopovidone,/);
		expect(sample).to.have.property('label', 'OK');
		expect(sample).to.have.property('caption', '1526');
		expect(sample).to.have.property('notes', 'EM');
		expect(sample).to.have.property('isbn', "1440-1843");
		expect(sample).to.have.property('urls');
		expect(sample.urls).to.have.length(2);
		expect(sample.urls).to.deep.equal(['http://ovidsp.ovid.com/ovidweb.cgi?T=JS&amp;CSC=Y&amp;NEWS=N&amp;PAGE=fulltext&amp;D=medl&amp;AN=21605278; http://ZL9EQ5LQ7V.search.serialssolutions.com/?sid=OVID:medline&amp;id=pmid:21605278&amp;id=doi:10.1111%2Fj.1440-1843.2011.01999.x&amp;issn=1323-7799&amp;isbn=&amp;volume=16&amp;issue=7&amp;spage=1064&amp;pages=1064-9&amp;date=2011&amp;title=Respirology&amp;atitle=A+randomized+controlled+trial+of+the+efficacy+of+cosmetic+talc+compared+with+iodopovidone+for+chemical+pleurodesis.&amp;aulast=Agarwal&amp;pid=%3Cauthor%3EAgarwal+R%3BPaul+AS%3BAggarwal+AN%3BGupta+D%3BJindal+SK%3C%2Fauthor%3E%3CAN%3E21605278%3C%2FAN%3E%3CDT%3EJournal+Article%3C%2FDT%3E'], 'urls');
	});
});
