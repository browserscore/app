import Feature from '../Feature.js';

export default class CSSPropertyFeature extends Feature {
	static children = {
		/** @deprecated */
		tests: { single: 'value' },

		/** Values to test against the property */
		values: { single: 'value' },
	}
	static gatingTest = true;

	static dataTypes = {};

	constructor (def, parent) {
		super(def, parent);

		if (this.def.dataType) {
			this.dataTypes = [this.def.dataType];
		}
		else if (this.def.dataTypes) {
			this.dataTypes = this.def.dataTypes;
		}
		else {
			this.dataTypes = [];
		}

		if (this.dataTypes.length > 0) {
			for (let dataType of this.dataTypes) {
				this.constructor.dataTypes[dataType] ??= [];
				this.constructor.dataTypes[dataType].push(this);
			}
		}
	}
}
