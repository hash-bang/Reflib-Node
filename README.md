Reflib
======
Reference library processing for Node.

This is a ported version of the original [Reflib for PHP](https://github.com/hash-bang/RefLib)


API
===

parse(driver, content, [options], [callback])
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


The `options` parameter is an optional object of properties.

| Option        | Type    | Default | Description                                                                                          |
|---------------|---------|---------|------------------------------------------------------------------------------------------------------|
| `fixes`       | Object  | `{}`    | Object containing fixes behaviour to apply to each returned reference. These are all run in parallel |
| `fixes.dates` | Boolean | `false` | Apply the behaviour of `reflib.fix.dates(ref)` before returning the reference via event handler      |
| `fixes.pages` | Boolean | `false` | Apply the behaviour of `reflib.fix.pages(ref)` before returning the reference via event handler      |


If the final, optional `callback` parameter is specified the *entire* library will be returned as an array in the form `callback(error, references)`. Due to the shear size of some libraries this method is **not** recommended unless you know your RAM can safely hold this potencially huge arrray.

	reflib.parse('endnotexml', fs.readFileSync('./test/data/endnote.xml'), function(err, refs) {
		console.log('Error is', err);
		console.log('Refs are', refs);
	});


parseFile(path, [options], [callback])
------------------
This is a shortcut of the `identify()` and `parse()` methods together to have RefLib read and process a file:

	var reflib = require('reflib');
	reflib.parseFile('./test/data/endnote.xml')
		.on('error', function(err) {
			console.log('ERROR:', err);
		})
		.on('ref', function(ref) {
			console.log('FOUND A REFERENCE', ref);
		})
		.on('end', function() {
			console.log('All done');
		});

See the `parse()` function for a description of supported options.

If the final, optional `callback` is specified the function returns in the same way as `parse()`.


output(options)
---------------
Output a reference library.

The options object must at least contain `stream` and `content` properties. Other options supported are:

| Option           | Type                   | Description                                                                                     |
|------------------|------------------------|-------------------------------------------------------------------------------------------------|
| stream           | Stream.Writable stream | The stream object to output content into                                                        |
| defaultType      | String                 | Some libraries must have a reference type for each reference, if that is omitted use this value |
| encode           | Callback               | Overridable callback to use on each reference output                                            |
| escape           | Callback               | Overridable callback to use when encoding text                                                  |
| content          | Array or Object or Callback | The reference library to output. If an array each item is used in turn, if an object a single item is output, if a callback this is called with the arguments (next, batchNo) until it returns null. The callback function can return a single object or an array |


See the output tests of individual drivers for more examples.


outputFile(path, refs, [callback])
----------------------
This is a shortcut of the `identify()` and `output()` methods together to have RefLib setup a stream and dump refs into a file.

`refs` can be an array of references, a single object or a callback to provide references. See the `output()` function for more information.

	var reflib = require('reflib');
	reflib.outputFile('./test/data/endnote.xml', refs)
		.on('error', function(err) {
			console.log('ERROR:', err);
		})
		.on('end', function() {
			console.log('All done');
		});

The final `callback` parameter is optional. If it is specified it is attached automatically as a listener on the 'error' and 'end' events.


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
| journal           | String             | The reference's secondary title, this is usually the journal for most published papers |
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
| tags              | Array (of Strings) | Any tags that apply to the reference |
| accessDate        | String             |
| accession         | String             |
| doi               | String             |
| section           | String             |
| language          | String             |
| researchNotes     | String             |
| databaseProvider  | String             |
| database          | String             |
| workType          | String             |
| custom1           | String             |
| custom2           | String             |
| custom3           | String             |
| custom4           | String             |
| custom5           | String             |
| custom6           | String             |
| custom7           | String             |

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
