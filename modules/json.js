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


/**
*/
export function writeStream(stream, options) {
	var settings = {
		lineSuffix: '\n',
		...options,
	};

	let lastRef; // Hold last refrence string in memory so we know when we've reached the end (last item shoulnd't have a closing comma)

	return {
		start: ()=> {
			stream.write('[\n');
			return Promise.resolve();
		},
		write: ref => {
			if (lastRef) stream.write(lastRef + ',' + settings.lineSuffix); // Flush last reference to disk with comma
			lastRef = JSON.stringify(ref);
			return Promise.resolve();
		},
		end: ()=> {
			if (lastRef) stream.write(lastRef + settings.lineSuffix); // Flush final reference to disk without final comma
			stream.write(']');
			return new Promise((resolve, reject) =>
				stream.end(err => err ? reject(err) : resolve())
			);
		},
	};
};
