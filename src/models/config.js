//config.js
//defines classes and models for turing assembler configuration

class Configs {
	constructor (states, start, accept, reject, alpha, tapeAlpha) {
		this.states = states;
		this.start = start;
		this.accept = accept;
		this.reject = reject;
		this.alpha = alpha;
		this.tapeAlpha = tapeAlpha;
	}
}

module.exports.Configs = Configs;
