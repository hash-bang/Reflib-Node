import {getModule} from './getModule.js';

/**
* Write an output stream via a given format ID
* This function is really just a multiplexor around each modules `writeStream` export
* @param {string} module The module ID as per `lib/formats.js`
* @param {Stream.Writable} stream Output stream to write to
* @param {Object} [options] Additional options to pass to the stream writer
*/
export function writeStream(module, stream, options) {
	if (!module) throw new Error('No module provided to parse with');
	if (!stream) throw new Error('No stream provided to parse');

	return getModule(module).writeStream(stream, options);
};
