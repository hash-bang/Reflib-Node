import EventEmitter from 'node:events';

/**
* Generic wrapper for an event emitter
* This module returns a wrapped version of the NodeJS emitter with the intention that it will be replaced for browser versions
*/
export default function emitter() {
	return new EventEmitter;
};
