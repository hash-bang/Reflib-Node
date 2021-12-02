import {getModule} from './getModule.js';

/**
* Parse an input stream via a given format ID
* This function is really just a multiplexor around each modules `readStream` export
* @param {string} module The module ID as per `lib/formats.js`
* @param {Stream.Readable} stream Input stream to parse
* @param {Object} [options] Additional options to pass to the parser
* @returns {EventEmitter} An Event-Emitter compatible object which will fire various events while parsing
*
* @emits ref Emitted with an extracted reference object during parse
* @emits end Emitted when the parsing has completed
* @emits error Emitted with an Error object if any occured
*/
export function readStream(module, stream, options) {
	if (!module) throw new Error('No module provided to parse with');
	if (!stream) throw new Error('No stream provided to parse');

	return getModule(module).readStream(stream, options);
};
