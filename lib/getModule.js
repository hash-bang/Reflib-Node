import * as modules from '../modules/default.js';

/**
* Simple wrapper which loads the named module as a keyed lirary of functions
* @param {string} module The module ID as per `lib/formats.js`
* @return {Object} The loaded module as an object of standardised functionality
*/
export function getModule(module) {
	if (!module) throw new Error('No module provided');

	let mod = modules[module];
	if (!mod) throw new Error(`Unknown module "${module}"`);

	return mod;
};
