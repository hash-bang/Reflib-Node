var _ = require('lodash');
var fs = require('fs');
var fsPath = require('path');

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

	parse: function(format, input, callback) {
		var supported = _.find(this.supported, {id: format});
		if (!supported) throw new Error('Format is unsupported: ' + format);
		var out = supported.driver.parse(input);
		if (callback) { // If optional callback is specified attach to the listeners and return everything as an array
			var refs = [];
			out
				.on('error', callback)
				.on('ref', function(ref) { refs.push(ref) })
				.on('end', function() { callback(null, refs) });
		}
		return out;
	},

	parseFile: function(path, callback) {
		var driver = this.identify(path);
		if (!driver) throw new Error('File type is unsupported');
		return this.parse(driver, fs.readFileSync(path), callback);
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
};
