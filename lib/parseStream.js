import {getModule} from './getModule.js';

/**
* Parse an input stream via a given format ID
* This function is really just a multiplexor around each modules `parseStream` export
* @param {string} module The module ID as per `lib/formats.js`
* @param {Stream.Readable} stream Input stream to parse
* @param {Object} [options] Additional options to pass to the parser
* @returns {EventEmitter} An Event-Emitter compatible object which will fire various events while parsing
*
* @emits ref Emitted with an extracted reference object during parse
* @emits end Emitted when the parsing has completed
* @emits error Emitted with an Error object if any occured
*/
export function parseStream(module, stream, options) {
	return getModule(module).parseStream(stream, options);
};
