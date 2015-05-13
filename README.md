Reflib
======
Reference library processing for Node.

This is a ported version of the original [Reflib for PHP](https://github.com/hash-bang/RefLib)


API
===

parse(content)
--------------
The main parser function. This will take a string or buffer to process and return an emitter which should call `ref` for each reference found.

	var reflib = require('reflib');
	reflib.parse('endnotexml', fs.readFileSync('./test/data/endnote.xml'))
		.on('error', function(err) {
			console.log('ERROR:', err);
		})
		.on('ref', function(ref) {
			console.log('FOUND A REFERENCE', ref);
		})
		.on('end', function() {
			console.log('All done');
		});


identify(path)
--------------
Function to return the supported driver from a file name.

	reflib.identify('./test/data/endnote.xml');
	// -> 'endnotexml'


supported
---------
A collection of all supported drivers.

	var reflib = require('reflib');

	console.log(reflib.supported)
	// e.g
	// {id: 'endnotexml', name: 'EndNote XML file', ext: ['.xml'], driver [object]}


Reference format
================
The following documents the individual reference format used by Reflib.


Reference fields
----------------
Each reference is made up of the following fields. Each field is optional and may or may not be supported by each Reflib driver.

| Field             | Type               | Description              |
|-------------------|--------------------|--------------------------|
| recNumber         | Number             | The sorting number of the reference |
| type              | String             | A supported [reference type](#reference-types) |
| title             | String             | The reference's main title |
| titleSecondary    | String             | The reference's secondary title, this is usually the journal for most published papers |
| authors           | Array (of Strings) | An array of each Author in the originally specified format |
| date              | Date or String     | Depending on how much information can be extracted this could either be a year (e.g. '2015'), a date (e.g. '12th Feb') or a full JS date (if [Moment](http://momentjs.com) understands its format) |
| urls              | Array (of Strings) | An array of each URL for the reference |
| pages             | String             | The page reference, usually in the format `123-4` |
| volume            | String             |
| number            | String             |
| isbn              | String             |
| abstract          | String             |
| label             | String             |
| caption           | String             |
| notes             | String             |
| address           | String             |
| researchNotes     | String             |


Reference Types
---------------
A reference type can be one of the following. Each is translated from and to its individual drivers own supported format (for example if using EndNoteXML 'dataset' is translated to 'Dataset.' with EndNote ID 59 automatically).

	aggregatedDatabase
	ancientText
	artwork
	audiovisualMaterial
	bill
	blog
	book
	bookSection
	case
	catalog
	chartOrTable
	classicalWork
	computerProgram
	conferencePaper
	conferenceProceedings
	dataset
	dictionary
	editedBook
	electronicArticle
	electronicBookSection
	encyclopedia
	equation
	figure
	filmOrBroadcast
	generic
	governmentDocument
	grant
	hearing
	journalArticle
	legalRuleOrRegulation
	magazineArticle
	manuscript
	map
	music
	newspaperArticle
	onlineDatabase
	onlineMultimedia
	pamphlet
	patent
	personalCommunication
	report
	serial
	standard
	statute
	thesis
	unpublished
	web
