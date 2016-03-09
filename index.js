var _ = require('lodash');
var events = require('events');
var fs = require('fs');
var fsPath = require('path');
var moment = require('moment');

module.exports = {
	supported: [
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
	],

	identify: function(filename) {
		var ext = fsPath.extname(filename).toLowerCase();
		var found = _.find(this.supported, function(format) {
			return _.includes(format.ext, ext);
		});
		return found ? found.id : false;
	},

	parse: function(format, input, options, callback) {
		var self = this;

		// Deal with arguments {{{
		if (_.isString(format) && _.isString(input) && _.isObject(options) && _.isFunction(callback)) {
			// No changes
		} else if (_.isString(format) && _.isString(input) && _.isFunction(options)) { // Omitted options
			callback = options;
			options = {};
		} else if (_.isString(format) && (_.isString(input) || _.isBuffer(input))) { // Omitted options + callback
			// No changes
		} else {
			throw new Error('Parse must be called in the form: parse(format, input, [options], [callback])');
		}
		// }}}

		var supported = _.find(this.supported, {id: format});
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
			.on('end', function() {
				if (callback) {
					callback(null, refs);
				} else {
					reflibEmitter.emit('end');
				}
			});

		return reflibEmitter;
	},

	parseFile: function(path, options, callback) {
		var driver = this.identify(path);
		if (!driver) throw new Error('File type is unsupported');
		return this.parse(driver, fs.readFileSync(path), options, callback);
	},

	output: function(options) {
		if (!_.isObject(options)) throw new Error('output(options) must be an object');
		if (!options.format) throw new Error('output(options) must specify a format');

		var supported = _.find(this.supported, {id: options.format});
		if (!supported) throw new Error('Format is unsupported: ' + options.format);

		return supported.driver.output(options);
	},

	outputFile: function(path, refs, callback) {
		var driver = this.identify(path);
		if (!driver) throw new Error('File type is unsupported for path: ' + path);
		var stream = fs.createWriteStream(path);
		var out = this.output({
			format: driver,
			stream: stream,
			content: refs,
		});
		if (callback) { // If optional callback is specified attach it as a handler
			out.on('error', callback);
			out.on('finish', callback);
		}
		return out;
	},

	// Fixes {{{
	fix: {
		authors: function(ref, options) {
			if (_.isArray(ref.authors) && ref.authors.length == 1 && /;/.test(ref.authors[0]))
				ref.authors = ref.authors[0].split(/\s*;\s*/);

			return ref;
		},

		dates: function(ref, options) {
			var settings = _.defaults(options, {
				dateFormats: ['MM-DD-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MMM YYYY', 'MMM'],
			});

			var baseYear = 1000; // Anything equal to this is assumed not to provide a year
			moment.now = function() { return +new Date(baseYear, 1, 1) }; // Force Moment to use baseYear as the basis when parsing
			var momentParsed = moment(ref.date, settings.dateFormats, true);
			console.log('PARSE', ref.date, momentParsed.isValid(), momentParsed.year(), momentParsed.month());

			if (ref.date && momentParsed.isValid()) { // Date is fully valid
				if (momentParsed.year() == baseYear) { // Parsed but only date component is useful
					ref.month = momentParsed.month();
					delete ref.date;
					delete ref.year;
					return ref;
				} else {
					ref.date = momentParsed.toDate();
					return ref;
				}
			}

			momentParsed = moment(ref.date + ' ' + ref.year, settings.dateFormats, true);
			if (ref.year && ref.date && momentParsed.isValid()) { // Possible full date combined
				ref.date = momentParsed.toDate();
				return ref;
			} else if (ref.year && ref.date && ref.date != ref.date + ' ' + ref.year) { // Has both date + year but is unparsable
				ref.date = ref.date + ' ' + ref.year;
				return ref;
			} else if (ref.year) { // Just a year
				delete ref.date;
				return ref;
			} else if (ref.date) { // Just a date - unparsable
				delete ref.year;
				return ref;
			}
			
			// FIXME: Stub
			return ref;
		},

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
