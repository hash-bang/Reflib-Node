import {expect} from 'chai';
import {createReadStream} from 'node:fs';
import {parseStream} from '../lib/parseStream.js';
import fspath from 'node:path';
let __dirname = fspath.resolve(fspath.dirname(decodeURI(new URL(import.meta.url).pathname)));

describe('Module: JSON', ()=> {

	// JSON file #1 (via stream reader) {{{
	it('should parse a JSON file #1 (via stream reader)', function () {
		this.timeout(30 * 1000); //= 30s

		return Promise.resolve()
			// Read JSON file via emitter {{{
			.then(()=> new Promise((resolve, reject) => {
				let refs = {}, refsCount = 0;

				parseStream('json', createReadStream(`${__dirname}/data/json/json1.json`))
					.on('end', ()=> resolve({refs, refsCount}))
					.on('error', reject)
					.on('ref', ref => {
						refsCount++;
						if (ref.isbn == '1097-685X' && ref.title == 'A method for chest drainage after pediatric cardiac surgery: a prospective randomized trial') {
							refs['pediatric-cardiac'] = ref;
						} else if (ref.title == 'Everolimus immunosuppression in de novo heart transplant recipients: What does the evidence tell us now?') {
							refs['everolimus-immunosuppression'] = ref;
						} else if (ref.isbn == '0012-3692' && ref.caption == '1456') {
							refs['silver-nitrate'] = ref;
						}
					})
			}))
			// }}}
			.then(({refs, refsCount}) => {
				let ref;
				expect(refsCount).to.equal(1988);

				// Check 'pediatric-cardiac' reference {{{
				expect(refs).to.have.property('pediatric-cardiac');
				ref = refs['pediatric-cardiac'];
				expect(ref).to.be.ok;
				expect(ref).to.have.property('title', 'A method for chest drainage after pediatric cardiac surgery: a prospective randomized trial');
				expect(ref).to.have.property('journal', 'Journal of Thoracic & Cardiovascular Surgery');
				expect(ref).to.have.property('authors');
				expect(ref.authors).to.have.length(1);
				expect(ref.authors[0]).to.equal('Agati, Salvatore; Mignosa, Carmelo; Gitto, Placido; Trimarchi, Eugenio Santo; Ciccarello, Giuseppe; Salvo, Dario; Trimarchi, Giuseppe');
				expect(ref).to.have.property('address', 'Pediatric Cardiac Surgery Unit, San Vincenzo Hospital, Taormina, Messina, Italy. sasha.agati@tiscali.it');
				expect(ref).to.have.property('pages', '1306-9');
				expect(ref).to.have.property('volume', '131');
				expect(ref).to.have.property('number', '6');
				expect(ref).to.have.property('date', 'Jun 2006');
				expect(ref).to.have.property('abstract');
				expect(ref.abstract).to.match(/^OBJECTIVES: .*removal\.$/);
				expect(ref).to.have.property('label', 'OK');
				expect(ref).to.have.property('caption', '970');
				expect(ref).to.have.property('notes', 'EM');
				expect(ref).to.have.property('isbn', '1097-685X');
				expect(ref).to.have.property('urls');
				expect(ref.urls).to.have.length(1);
				expect(ref.urls[0]).to.equal('http://ovidsp.ovid.com/ovidweb.cgi?T=JS&CSC=Y&NEWS=N&PAGE=fulltext&D=med4&AN=16733162; http://ZL9EQ5LQ7V.search.serialssolutions.com/?sid=OVID:medline&id=pmid:16733162&id=doi:&issn=0022-5223&isbn=&volume=131&issue=6&spage=1306&pages=1306-9&date=2006&title=Journal+of+Thoracic+%26+Cardiovascular+Surgery&atitle=A+method+for+chest+drainage+after+pediatric+cardiac+surgery%3A+a+prospective+randomized+trial.&aulast=Agati&pid=%3Cauthor%3EAgati+S%3BMignosa+C%3BGitto+P%3BTrimarchi+ES%3BCiccarello+G%3BSalvo+D%3BTrimarchi+G%3C%2Fauthor%3E%3CAN%3E16733162%3C%2FAN%3E%3CDT%3EJournal+Article%3C%2FDT%3E');
				expect(ref).to.have.property('researchNotes', 'Agati S; Mignosa C; Gitto P; Trimarchi ES; Ciccarello G; Salvo D; Trimarchi G');
				// }}}

				// Check 'everolimus-immunosuppression' refrence {{{
				expect(refs).to.have.property('everolimus-immunosuppression');
				ref = refs['everolimus-immunosuppression'];
				expect(ref).to.be.ok;
				expect(ref).to.have.property('title', 'Everolimus immunosuppression in de novo heart transplant recipients: What does the evidence tell us now?');
				expect(ref).to.have.property('journal', 'Transplantation Reviews');
				expect(ref).to.have.property('authors');
				expect(ref.authors).to.have.length(10);
				expect(ref.authors).to.deep.equal(['Zuckermann, A.', 'Wang, S. S.', 'Epailly, E.', 'Barten, M. J.', 'Sigurdardottir, V.', 'Segovia, J.', 'Varnous, S.', 'Turazza, F. M.', 'Potena, L.', 'Lehmkuhl, H. B.']);
				expect(ref).to.have.property('address', 'Zuckermann, A., Department of Cardiac Surgery, Medical University of Vienna, 1090 Vienna, Austria');
				expect(ref).to.have.property('pages', '76-84');
				expect(ref).to.have.property('volume', '27');
				expect(ref).to.have.property('number', '3');
				expect(ref).to.have.property('date', '2013');
				expect(ref).to.have.property('abstract');
				expect(ref.abstract).to.match(/^The efficacy of everolimus.*2013 Elsevier Inc\.$/);
				expect(ref).to.have.property('label', 'OK');
				expect(ref).to.have.property('caption', '608');
				expect(ref).to.have.property('notes', 'U');
				expect(ref).to.have.property('isbn', "0955-470X\r1557-9816");
				expect(ref).to.have.property('urls');
				expect(ref.urls).to.have.length(3);
				expect(ref.urls).to.deep.equal(['http://www.embase.com/search/results?subaction=viewrecord&from=export&id=L52565756', 'http://dx.doi.org/10.1016/j.trre.2013.03.002', 'http://cf5pm8sz2l.search.serialssolutions.com/?&issn=0955470X&id=doi:10.1016%2Fj.trre.2013.03.002&atitle=Everolimus+immunosuppression+in+de+novo+heart+transplant+recipients%3A+What+does+the+evidence+tell+us+now%3F&stitle=Transpl.+Rev.&title=Transplantation+Reviews&volume=27&issue=3&spage=76&epage=84&aulast=Zuckermann&aufirst=Andreas&auinit=A.&aufull=Zuckermann+A.&coden=TRPPC&isbn=&pages=76-84&date=2013&auinit1=A&auinitm='], 'urls');
				// }}}

				// Check 'silver-nitrate' reference {{{
				expect(refs).to.have.property('silver-nitrate');
				ref = refs['silver-nitrate'];
				expect(ref).to.be.ok;
				expect(ref).to.have.property('title', 'Prospective randomized trial of silver nitrate vs talc slurry in pleurodesis for symptomatic malignant pleural effusions');
				expect(ref).to.have.property('journal', 'Chest');
				expect(ref).to.have.property('authors');
				expect(ref.authors).to.have.length(7);
				expect(ref.authors).to.deep.equal(['Paschoalini, Marcello da Silveira','Vargas, Francisco S.','Marchi, Evaldo','Pereira, Jose Rodrigues','Jatene, Fabio B.','Antonangelo, Leila','Light, Richard W.']);
				expect(ref).to.have.property('address', 'Perola Byington Hospital, Sao Paulo, Brazil.');
				expect(ref).to.have.property('pages', '684-9');
				expect(ref).to.have.property('volume', '128');
				expect(ref).to.have.property('number', '2');
				expect(ref).to.have.property('date', 'Aug 2005');
				expect(ref).to.have.property('abstract');
				expect(ref.abstract).to.match(/production of a pleurodesis\.$/);
				expect(ref).to.have.property('label', 'OK');
				expect(ref).to.have.property('caption', '1456');
				expect(ref).to.have.property('notes', 'DUP');
				expect(ref).to.have.property('isbn', "0012-3692");
				expect(ref).to.have.property('urls');
				expect(ref.urls).to.have.length(2);
				expect(ref.urls).to.deep.equal(['http://ovidsp.ovid.com/ovidweb.cgi?T=JS&CSC=Y&NEWS=N&PAGE=fulltext&D=med4&AN=16100154', 'http://ZL9EQ5LQ7V.search.serialssolutions.com/?sid=OVID:medline&id=pmid:16100154&id=doi:&issn=0012-3692&isbn=&volume=128&issue=2&spage=684&pages=684-9&date=2005&title=Chest&atitle=Prospective+randomized+trial+of+silver+nitrate+vs+talc+slurry+in+pleurodesis+for+symptomatic+malignant+pleural+effusions.&aulast=Paschoalini+Mda&pid=%3Cauthor%3EPaschoalini+Mda+S%3BVargas+FS%3BMarchi+E%3BPereira+JR%3BJatene+FB%3BAntonangelo+L%3BLight+RW%3C%2Fauthor%3E%3CAN%3E16100154%3C%2FAN%3E%3CDT%3EClinical+Trial%3C%2FDT%3E'], 'urls');
				expect(ref).to.have.property('researchNotes', 'Paschoalini Mda S\rVargas FS\rMarchi E\rPereira JR\rJatene FB\rAntonangelo L\rLight RW');
				// }}}
			})

	});
	// }}}

});
