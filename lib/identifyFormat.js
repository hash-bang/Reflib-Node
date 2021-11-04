import {formats} from '../lib/default.js';
import * as fsPath from 'node:path';

/**
* Identify and return the Reflib format (from ./formats) to use for the given file name / path
* @param {string} path The input path to identify
* @returns {Object} A matching entry from ./formats or null if no matching format was found
*/
export function identifyFormat(path) {
	let ext = fsPath.extname(path).toLowerCase();

	return Object.values(formats).find(format => format.ext.includes(ext));
}
