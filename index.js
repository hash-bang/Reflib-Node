var _ = require('lodash');
var fsPath = require('path');

module.exports = {
	supported: [
		{
			id: 'endnotexml',
			name: 'EndNote XML file',
			ext: ['.xml'],
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

	output: function(format, callback) {
		var supported = _.find(this.supported, {id: format});
		if (!supported) throw new Error('Format is unsupported: ' + format);
		return supported.driver.output(callback);
	},
};
