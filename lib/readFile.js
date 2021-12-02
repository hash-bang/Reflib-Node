import {createReadStream} from 'node:fs';
import {identifyFormat} from './identifyFormat.js';
import {readStream} from './readStream.js';

/**
* Parse a file directly from a path
* This function is a warpper around the readStream handler + some Promise magic
* @param {string} path The file path to parse
* @param {Object} [options] Additional options to pass to the parser
* @param {string} [options.module] The module to use if overriding from the file path
* @returns {Promise<Array>} An eventual array of all references parsed from the file
*/
export function readFile(path, options) {
	let module = options?.module || identifyFormat(path)?.id;
	if (!module) throw new Error(`Unable to identify reference library format for file path "${path}"`);

	return new Promise((resolve, reject) => {
		let refs = [];
		readStream(module, createReadStream(path), options)
			.on('end', ()=> resolve(refs))
			.on('error', reject)
			.on('ref', ref => refs.push(ref))
	});
};
