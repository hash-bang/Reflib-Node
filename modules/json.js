import Emitter from '../shared/emitter.js';
import bfjc from 'bfj-collections';

export function readStream(stream, options) {
	let recNumber = 1;
	let emitter = Emitter();

	// Queue up the parser in the next tick (so we can return the emitter first)
	setTimeout(()=>
		bfjc(stream, {pause: false})
			.on('bfjc', ref => emitter.emit('ref', {
				recNumber: recNumber++,
				...ref,
			}))
			.on('end', ()=> emitter.emit('end'))
			.on('error', emitter.emit.bind('error'))
	);

	return emitter;
};
