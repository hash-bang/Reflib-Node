var _ = require('lodash');
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
	],

	identify: function(filename) {
		var ext = fsPath.extname(filename).toLowerCase();
		var found = _.find(this.supported, function(format) {
			return _.contains(format.ext, ext);
		});
		return found ? found.id : false;
	},

	parse: function(format, input) {
		var supported = _.find(this.supported, {id: format});
		if (!supported) throw new Error('Format is unsupported: ' + format);
		return supported.driver.parse(input);
	},

	parseFile: function(path) {
		var driver = this.identify(path);
		if (!driver) throw new Error('File type is unsupported');
		return this.parse(driver, fs.readFileSync(path));
	},

	output: function(options) {
		if (!_.isObject(options)) throw new Error('output(options) must be an object');
		if (!options.format) throw new Error('output(options) must specify a format');

		var supported = _.find(this.supported, {id: options.format});
		if (!supported) throw new Error('Format is unsupported: ' + options.format);

		return supported.driver.output(options);
	},
};
