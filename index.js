var _ = require('lodash');
var events = require('events');
var fs = require('fs');
var fsPath = require('path');
var moment = require('moment');
var promisify = require('util').promisify;

var reflib = module.exports = {
	// .supported - Supported file types {{{
	/**
	* Collection of supported RefLib drivers and their details
	* @type {array<Object>}
	* @property {string} id The unique identifier of the driver
	* @property {string} name Human readable description of the driver
	* @property {array<string>} ext File extensions supported by the driver
	* @property {string} filename Default filename to use when outputting
	* @property {Object} driver NPM module of the driver
	*/
	supported: [
		{
			id: 'csv',
			name: 'Comma Seperated Values',
			ext: ['.csv'],
			filename: 'references.csv',
			driver: require('reflib-csv'),
		},
		{
			id: 'endnotexml',
			name: 'EndNote XML file',
			ext: ['.xml'],
			filename: 'endnote.xml',
			driver: require('reflib-endnotexml'),
		},
		{
			id: 'json',
			name: 'JSON file',
			ext: ['.json'],
			filename: 'library.json',
			driver: require('reflib-json'),
		},
		{
			id: 'medline',
			name: 'MEDLINE / PubMed file',
			ext: ['.nbib'],
			filename: 'medline.nbib',
			driver: require('reflib-medline'),
		},
		{
			id: 'ris',
			name: 'RIS file',
			ext: ['.ris'],
			filename: 'ris.ris',
			driver: require('reflib-ris'),
		},
		{
			id: 'tsv',
			name: 'Tab Seperated Values',
			ext: ['.tsv'],
			filename: 'references.tsv',
			driver: require('reflib-tsv'),
		},
	],
	// }}}

	// .refTypes - Supported reference types {{{
	/**
	* A collection of supported RefLib reference types
	* @type {array<Object>}
	* @property {string} id The internal ID of the reference type
	* @property {string} title The human readable description of the reference type
	*/
	refTypes: [
		{id: 'aggregatedDatabase', title: 'Aggregated Database'},
		{id: 'ancientText', title: 'Ancient Text'},
		{id: 'artwork', title: 'Artwork'},
		{id: 'audiovisualMaterial', title: 'Audiovisual Material'},
		{id: 'bill', title: 'Bill'},
		{id: 'blog', title: 'Blog'},
		{id: 'book', title: 'Book'},
		{id: 'bookSection', title: 'Book Section'},
		{id: 'case', title: 'Case'},
		{id: 'catalog', title: 'Catalog'},
		{id: 'chartOrTable', title: 'Chart or Table'},
		{id: 'classicalWork', title: 'Classical Work'},
		{id: 'computerProgram', title: 'Computer Program'},
		{id: 'conferencePaper', title: 'Conference Paper'},
		{id: 'conferenceProceedings', title:'Conference Proceedings'},
		{id: 'dataset', title: 'Dataset.'},
		{id: 'dictionary', title: 'Dictionary'},
		{id: 'editedBook', title: 'Edited Book'},
		{id: 'electronicArticle', title: 'Electronic Article'},
		{id: 'electronicBook', title:', Electronic Book'},
		{id: 'electronicBookSection', title:', Electronic Book Section'},
		{id: 'encyclopedia', title: 'Encyclopedia'},
		{id: 'equation', title: 'Equation'},
		{id: 'figure', title: 'Figure'},
		{id: 'filmOrBroadcast', title: 'Film or Broadcast'},
		{id: 'generic', title: 'Generic'},
		{id: 'governmentDocument', title: 'Government Document'},
		{id: 'grant', title: 'Grant'},
		{id: 'hearing', title: 'Hearing'},
		{id: 'journalArticle', title: 'Journal Article'},
		{id: 'legalRuleOrRegulation', title:', Legal Rule or Regulation'},
		{id: 'magazineArticle', title: 'Magazine Article'},
		{id: 'manuscript', title: 'Manuscript'},
		{id: 'map', title: 'Map'},
		{id: 'music', title: 'Music'},
		{id: 'newspaperArticle', title: 'Newspaper Article'},
		{id: 'onlineDatabase', title: 'Online Database'},
		{id: 'onlineMultimedia', title: 'Online Multimedia'},
		{id: 'pamphlet', title: 'Pamphlet'},
		{id: 'patent', title: 'Patent'},
		{id: 'personalCommunication', title: 'Personal Communication'},
		{id: 'report', title: 'Report'},
		{id: 'serial', title: 'Serial'},
		{id: 'standard', title: 'Standard'},
		{id: 'statute', title: 'Statute'},
		{id: 'thesis', title: 'Thesis'},
		{id: 'unpublished', title: 'Unpublished Work'},
		{id: 'web', title: 'Web Page'},
	],
	// }}}


	/**
	* Identify the RefLib driver to use from a filename
	* @param {string} filename
	* @returns {string} Either a RefLib driver ID from Reflib.supported or boolean False if the file is unrecognised
	*/
	identify: function(filename) {
		var ext = fsPath.extname(filename).toLowerCase();
		var found = reflib.supported.find(format => _.includes(format.ext, ext));
		return found ? found.id : false;
	},


	/**
	* Parse an input stream, buffer or string into references
	* @param {string} format The Reflib driver to use, must conform to the ID of a member of Reflib.supported
	* @param {string|Buffer|ReadableStream} input The input to parse
	* @param {Object} [options] Additional options to use when parsing
	* @param {Object} [options.fixes] List of fixes to apply while parsing
	* @param {boolean} [options.authors=false] Apply the behaviour of `reflib.fix.authors(ref)`
	* @param {boolean} [options.authors=false] Apply the behaviour of `reflib.fix.dates(ref)`
	* @param {boolean} [options.authors=false] Apply the behaviour of `reflib.fix.pages(ref)`
	* @param {function} [callback] Callback to call as `(refs)` when done
	* @returns {EventEmitter} An EventEmitter instance
	*
	* @emits ref Emitted as `(ref)` for each reference parsed
	* @emits error Emitted as `(error)` if an error occurs
	* @emits progress Emitted as `(currentProgress, maxProgress)` while parsing to show progress (if known)
	* @emits end Emitted as `()` when parsing has completed
	*/
	parse: function(format, input, options, callback) {
		var self = this;

		// Deal with arguments {{{
		if (_.isString(format) && !_.isEmpty(input) && _.isObject(options) && _.isFunction(callback)) {
			// No changes
		} else if (_.isString(format) && !_.isEmpty(input) && _.isFunction(options)) { // Omitted options
			callback = options;
			options = {};
		} else if (_.isString(format) && !_.isEmpty(input)) { // Omitted options + callback
			// No changes
		} else {
			throw new Error('Parse must be called in the form: parse(format, input, [options], [callback])');
		}
		// }}}

		var supported = reflib.supported.find(s => s.id == format);
		if (!supported) throw new Error('Format is unsupported: ' + format);

		var settings = _.defaults(options, {
			fixes: {
				authors: false,
				dates: false,
				pages: false,
			},
		});

		var refs = [];
		var reflibEmitter = new events.EventEmitter();

		supported.driver.parse(input)
			.on('error', function(err) {
				if (callback) {
					callback(err);
				} else {
					reflibEmitter.emit('error', err);
				}
			})
			.on('ref', function(ref) {
				// Apply fixes {{{
				if (settings.fixes.authors) ref = self.fix.authors(ref, options);
				if (settings.fixes.dates) ref = self.fix.dates(ref, options);
				if (settings.fixes.pages) ref = self.fix.pages(ref, options);
				// }}}

				if (callback) {
					refs.push(ref);
				} else {
					reflibEmitter.emit('ref', ref);
				}
			})
			.on('progress', function(cur, max) {
				reflibEmitter.emit('progress', cur, max);
			})
			.on('end', function() {
				if (callback) {
					callback(null, refs);
				} else {
					reflibEmitter.emit('end');
				}
			});

		return reflibEmitter;
	},


	/**
	* Wrapper around parse() which opens a file as as stream and parses it automatically
	* @param {string} path The path of the file to parse
	* @param {Object} [options] Additional options to use when parsing, see `parse()` for full details
	* @param {function} [callback] Callback to call as `(refs)` when done
	* @returns {EventEmitter} An EventEmitter instance
	* @see parse
	* @see promises.parseFile
	*/
	parseFile: function(path, options, callback) {
		// Argument mangling {{{
		if (_.isFunction(options)) { // path, callback
			callback = options;
			options = {};
		}
		// }}}

		var driver = reflib.identify(path);
		if (!driver) throw new Error('File type is unsupported');
		return reflib.parse(driver, fs.createReadStream(path), options, callback);
	},


	/**
	* Output a reference library using the requested driver
	* @param {Object} options Options to use while outputting
	* @param {WritableStream} options.stream Writable stream used to output
	* @param {string} options.format The Reflib driver to use, must conform to the ID of a member of Reflib.supported
	* @param {array<Object>|function} options.content reference library to output. If an array each item is used in turn, if an object a single item is output, if a callback this is called with the arguments `(next, batchNo)` until it returns null. The callback function can return a single object or an array
	* @param {string} [options.defaultType] If the driver requires a default reference type this value is used if that field is omitted from the input
	* @param {function} [options.encode] Overridable callback to use on each reference output
	* @param {function} [options.escape] Overridable callback to use when encoding text
	* @param {string|array<String>|boolean} [options.fields] If undefined only supported fields are output, if an array only those specified fields are output, if true all fields even those not recognised are output. If the input is a string it is split into an array as a CSV
	* @returns {WritableStream} A WriteableSteam instance which will fire `.on('end')` when writing has finished
	* @see promises.output
	*/
	output: function(options) {
		if (!_.isObject(options)) throw new Error('output(options) must be an object');
		if (!options.format) throw new Error('output(options) must specify a format');

		var supported = reflib.supported.find(s => s.id == options.format);
		if (!supported) throw new Error('Format is unsupported: ' + options.format);

		var settings = _.defaults(options, {
			fields: _.isString(options.fields) ? options.fields.split(/\s*,\s*/) : undefined, // Split field list into an array if given a CSV
		});

		return supported.driver.output(settings);
	},


	/**
	* Output a reference library to a file using the requested driver
	* @param {string} path The file path to write to
	* @param {array<Object>} refs The array of references to write
	* @param {Object} options Options to use while outputting, see `output()` for more details
	* @returns {WritableStream} A WriteableSteam instance which will fire `.on('end')` when writing has finished
	* @param {function} [callback] Callback to call as `(refs)` when done
	* @see output
	* @see promises.outputFile
	*/
	outputFile: function(path, refs, options, callback) {
		// Argument mangling {{{
		if (_.isFunction(options)) { // path, refs, callback
			callback = options;
			options = {};
		}
		// }}}

		var driver = reflib.identify(path);
		if (!driver) throw new Error('File type is unsupported for path: ' + path);
		var stream = fs.createWriteStream(path);
		var out = reflib.output(_.defaults(options, {
			format: driver,
			stream: stream,
			content: refs,
		}));
		if (callback) { // If optional callback is specified attach it as a handler
			out.on('error', callback);
			out.on('finish', callback);
		}
		return out;
	},

	// Fixes {{{
	/**
	* A collection of reference fixes
	* @type {Object}
	*/
	fix: {
		/**
		* Attempt to split mangled author fields into an array of strings
		* @param {Object} ref The reference to fix
		* @returns {Object} The fixed reference
		*/
		authors: function(ref, options) {
			if (_.isArray(ref.authors) && ref.authors.length == 1 && /;/.test(ref.authors[0]))
				ref.authors = ref.authors[0].split(/\s*;\s*/);

			return ref;
		},


		/**
		* Attempt to fix mangled date formats
		* @param {Object} ref The reference to fix
		* @returns {Object} The fixed reference
		*/
		dates: function(ref, options) {
			var settings = _.defaults(options, {
				dateFormats: [
					{format: 'MM-DD-YYYY', year: true, month: true, day: true},
					{format: 'DD/MM/YYYY', year: true, month: true, day: true},
					{format: 'DD-MM-YYYY', year: true, month: true, day: true},
					{format: 'YYYY-MM-DD', year: true, month: true, day: true},
					{format: 'Do MMMM YY', year: true, month: true, day: true},
					{format: 'Do MMMM YYYY', year: true, month: true, day: true},
					{format: 'MMM YYYY', year: true, month: true, day: false},
					{format: 'MMM', year: false, month: true, day: false},
					{format: 'MMMM', year: false, month: true, day: false},
					{format: 'YYYY', year: true, month: false, day: false},
				],
			});

			var baseYear = 1000; // Anything equal to this is assumed not to provide a year
			moment.now = function() { return +new Date(baseYear, 1, 1) }; // Force Moment to use baseYear as the basis when parsing
			var momentParsed = moment(ref.date, settings.dateFormats.map(function(f) { return f.format }), true);

			if (ref.date && momentParsed.isValid()) { // Moment matched something
				var dateFormat = settings.dateFormats.find(function(f) { return (f.format == momentParsed._f) });
				if (!dateFormat) throw new Error('Moment parsed date but cannot locate matching format it used!');

				if (dateFormat.year && dateFormat.month && dateFormat.day) { // Date format is fully formed
					ref.date = momentParsed.toDate();
				}

				if (dateFormat.year) ref.year = momentParsed.year();
				if (dateFormat.month) ref.month = momentParsed.format('MMM');
			}

			return ref;
		},


		/**
		* Attempt to fix mangled page formats
		* @param {Object} ref The reference to fix
		* @returns {Object} The fixed reference
		*/
		pages: function(ref) {
			var p = /^\s*([0-9]+)\s*--?\s*([0-9]+)\s*$/.exec(ref.pages);
			if (p) {
				var numericLeft = _.toNumber(p[1]);
				var numericRight = _.toNumber(p[2]);

				if (numericRight < numericLeft) { // Relative number reference e.g. '123 - 4'
					numericRight = numericLeft.toString().substr(0, numericLeft.toString().length - numericRight.toString().length) + numericRight.toString();
				}

				ref.pages = numericLeft + '-' + numericRight;
				return ref;
			}

			return ref;
		},
	},
	// }}}
};

// Compute promises {{{
reflib.promises = _(reflib)
	.pickBy(v => _.isFunction(v))
	.mapValues(v => promisify(v))
	.value();
// }}}
