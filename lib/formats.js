/**
* Lookup table of various citation file formats
* @type {array<Object>} A collection of RefLib supported file formats
* @property {string} title The long form title of the format
* @property {string} titleShort Shorter title of the format
* @property {string} input Input format required by parser
* @property {string} output Output format required by formatter
* @property {array>string>} ext File extensions of this format, the first entry is generally used as the output default
*/
export let formats = {
	csv: { // FIXME: Unchecked
		id: 'csv',
		title: 'Comma Seperated Values',
		titleShort: 'CSV',
		input: 'stream',
		output: 'buffer',
		ext: ['.csv'],
	},
	endnoteXml: { // FIXME: Unchecked
		id: 'endnoteXml',
		title: 'EndNoteXML',
		titleShort: 'EndNoteXML',
		input: 'stream',
		output: 'buffer',
		ext: ['.xml'],
	},
	json: { // FIXME: Unchecked
		id: 'json',
		title: 'JSON',
		titleShort: 'JSON',
		input: 'stream',
		output: 'buffer',
		ext: ['.json'],
	},
	medline: { // FIXME: Unchecked
		id: 'medline',
		title: 'MEDLINE / PubMed',
		titleShort: 'MEDLINE',
		input: 'stream',
		output: 'buffer',
		ext: ['.nbib'],
	},
	ris: { // FIXME: Unchecked
		id: 'ris',
		title: 'RIS',
		titleShort: 'RIS',
		input: 'stream',
		output: 'buffer',
		ext: ['.ris'],
	},
	tsv: { // FIXME: Unchecked
		id: 'tsv',
		title: 'Tab Seperated Values',
		titleShort: 'TSV',
		input: 'stream',
		output: 'buffer',
		ext: ['.tsv'],
	},
}
