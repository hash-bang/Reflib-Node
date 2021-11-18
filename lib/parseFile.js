import {createReadStream} from 'node:fs';
import {identifyFormat} from './identifyFormat.js';
import {parseStream} from './parseStream.js';

/**
* Parse a file directly from a path
* This function is a warpper around the parseStream handler + some Promise magic
* @param {string} path The file path to parse
* @param {Object} [options] Additional options to pass to the parser
* @returns {Promise<Array>} An eventual array of all references parsed from the file
*/
export function parseFile(path, options) {
	let format = identifyFormat(path);
	if (!format) throw new Error(`Unable to identify reference library format for file path "${path}"`);

	return new Promise((resolve, reject) => {
		let refs = [];
		parseStream(format.id, createReadStream(path))
			.on('end', ()=> resolve(refs))
			.on('error', reject)
			.on('ref', ref => refs.push(ref))
	});
};
