Reflib
======
Reference library processing for Node.

This is the internal component to parse and output reference libraries. If you would like something with a user interface you may wish to look at one of the following:

* [reflib-cli](https://github.com/hash-bang/Reflib-CLI) - The command line interface to Reflib
* [Systematic Review Accelerator](http://crebp-sra.com) - Online tools to manage reference libraries
* [reflib-util](https://github.com/hash-bang/Reflib-utils) - Utilities to work with Reflib references or libraries

This module is the main API, for individual drivers [see the relevent NPM module](https://www.npmjs.com/search?q=reflib).

RefLib currently supports the following format for read / write operations:

* [EndNote XML](https://github.com/hash-bang/Reflib-EndNoteXML)
* [CSV](https://github.com/hash-bang/Reflib-CSV)
* [JSON](https://github.com/hash-bang/Reflib-JSON)
* [MEDLINE / PubMed](https://github.com/hash-bang/Reflib-MEDLINE)
* [RIS](https://github.com/hash-bang/Reflib-RIS)
* [TSV](https://github.com/hash-bang/Reflib-TSV)


This module is a ported version of the original [Reflib for PHP](https://github.com/hash-bang/RefLib)


API
===

parse(driver, content, [options], [callback])
---------------------------------------------
The main parser function. This will take a string, buffer or stream to process and return an emitter which should call `ref` for each reference found.

```javascript
var reflib = require('reflib');
reflib.parse('endnotexml', fs.readFileSync('./test/data/endnote.xml'))
	.on('error', function(err) {
		console.log('ERROR:', err);
	})
	.on('ref', function(ref) {
		console.log('FOUND A REFERENCE', ref);
	})
	.on('progress', function(current, max) {
		console.log('Reading position', current);
	})
	.on('end', function() {
		console.log('All done');
	});
```

The `options` parameter is an optional object of properties.

| Option          | Type    | Default | Description                                                                                       |
|-----------------|---------|---------|---------------------------------------------------------------------------------------------------|
| `fixes`         | Object  | `{}`    | Object containing fixes behaviour to apply to each returned reference                             |
| `fixes.authors` | Boolean | `false` | Apply the behaviour of `reflib.fix.authors(ref)` before returning the reference via event handler |
| `fixes.dates`   | Boolean | `false` | Apply the behaviour of `reflib.fix.dates(ref)` before returning the reference via event handler   |
| `fixes.pages`   | Boolean | `false` | Apply the behaviour of `reflib.fix.pages(ref)` before returning the reference via event handler   |


For example, the below imports a file while enabling all fixes:

```javascript
reflib.parse('endnotexml', fs.readFileSync('./test/data/endnote.xml'), {
	fixes: {
		authors: true,
		dates: true,
		pages: true,
	},
}).on('ref', function(ref) { /* ... */ });
```

If the final, optional `callback` parameter is specified the *entire* library will be returned as an array in the form `callback(error, references)`. Due to the shear size of some libraries this method is **not** recommended unless you know your RAM can safely hold this potencially huge arrray.

```javascript
reflib.parse('endnotexml', fs.readFileSync('./test/data/endnote.xml'), function(err, refs) {
	console.log('Error is', err);
	console.log('Refs are', refs);
});
```

parseFile(path, [options], [callback])
--------------------------------------
This is a shortcut of the `identify()` and `parse()` methods together to have RefLib read and process a file:

```javascript
var reflib = require('reflib');
reflib.parseFile('./test/data/endnote.xml')
	.on('error', function(err) {
		console.log('ERROR:', err);
	})
	.on('ref', function(ref) {
		console.log('FOUND A REFERENCE', ref);
	})
	.on('progress', function(current, max) {
		console.log('Reading position', current);
	})
	.on('end', function() {
		console.log('All done');
	});
```

See the `parse()` function for a description of supported options.

If the final, optional `callback` is specified the function returns in the same way as `parse()`.

NOTE: In order to correctly fire the `progress` event `parseFile()` defaults to using `fs.readFile` instead of `fs.createReadStream()` this is because buffers have a *known* length and streams have an *unknown* length. If you wish to read very large files you may wish to use the `parse()` event with `fs.createReadStream()` manually.


output(options)
---------------
Output a reference library.

The options object must at least contain `stream` and `content` properties. Other options supported are:

| Option           | Type                   | Description                                                                                     |
|------------------|------------------------|-------------------------------------------------------------------------------------------------|
| stream           | Stream.Writable stream | The stream object to output content into                                                        |
| format           | String                 | The driver to use when formatting the data                                                      |
| defaultType      | String                 | Some libraries must have a reference type for each reference, if that is omitted use this value |
| encode           | Callback               | Overridable callback to use on each reference output                                            |
| escape           | Callback               | Overridable callback to use when encoding text                                                  |
| content          | Array or Object or Callback | The reference library to output. If an array each item is used in turn, if an object a single item is output, if a callback this is called with the arguments (next, batchNo) until it returns null. The callback function can return a single object or an array |
| fields           | Undefined, string, array, true | If undefined only supported fields are output, if an array only those specified fields are output, if true all fields even those not recognised are output. If the input is a string it is split into an array as a CSV |


See the output tests of individual drivers for more examples.


outputFile(path, refs, [options], [callback])
----------------------------------
This is a shortcut of the `identify()` and `output()` methods together to have RefLib setup a stream and dump refs into a file.

`refs` can be an array of references, a single object or a callback to provide references. See the `output()` function for more information.

```javascript
var reflib = require('reflib');
reflib.outputFile('./test/data/endnote.xml', refs)
	.on('error', function(err) {
		console.log('ERROR:', err);
	})
	.on('end', function() {
		console.log('All done');
	});
```

The final `callback` parameter is optional. If it is specified it is attached automatically as a listener on the 'error' and 'end' events.


identify(path)
--------------
Function to return the supported driver from a file name.

```javascript
reflib.identify('./test/data/endnote.xml');
// -> 'endnotexml'
```

refTypes
--------
A collection of all supported reference types.

NOTE: This is based off the EndNote specification. If anything is missing please contact the author.

```javascript
var reflib = require('reflib');

console.log(reflib.types)
// e.g
// [..., {id: 'journalArticle', title: 'Journal Article'}, ...]
```

promises
--------
Object containing Promise compatible versions for all the internal functionality. e.g. `reflib.promises.parseFile()`


supported
---------
A collection of all supported drivers.

```javascript
var reflib = require('reflib');

console.log(reflib.supported)
// e.g
// {id: 'endnotexml', name: 'EndNote XML file', ext: ['.xml'], driver [object]}
```

fix.authors(reference)
----------------------
Verify that the author information for an incomming reference is correct.

This function will attempt to split mangled author fields up if the `authors` field contains exactly one entry which itself contains the `;` character. Some databases don't split this field up correctly and this fix will attempt to correct the array contents to what it should be.


fix.dates(reference)
--------------------
Attempt to correct the date format of incomming references.

This function has the following behaviour:

1. If the reference has a complete date format (e.g. 15/02/2016) the fields, `date`, `month` and `year` will be created
2. If the reference is missing the full date but contains a `year` and `month` those two fields will be stored with `date` removed
3. If the reference only has a `month` field that will be stored with `date` removed
4. If the reference only has a `year` field that will be stored with `year` removed

In all cases `date` will be a JavaScript date object, `year` will be a JavaScript four digit number, `month` will be the three letter, capitalized month format (e.g. `Jan`, `Dec`).


fix.pages(reference)
--------------------
Attempt to reformat different reference page formats into absolute ones.

For example `123-4` becomes `123-124`


Reference format
================
The following documents the individual reference format used by Reflib.


Reference fields
----------------
Each reference is made up of the following fields. Each field is optional and may or may not be supported by each Reflib driver.

| Field             | Type               | Description              | Aliases |
|-------------------|--------------------|--------------------------|---------|
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
| isbn              | String             | | ISSN |
| abstract          | String             |
| label             | String             |
| caption           | String             |
| notes             | String             |
| address           | String             |
| researchNotes     | String             |
| keywords          | Array (of Strings) | Any tags that apply to the reference | tags |
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
	electronicBook
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
	unknown
	unpublished
	web
