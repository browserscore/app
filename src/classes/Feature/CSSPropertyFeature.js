import Feature from '../Feature.js';
import supportsProperty from '../../../../supports/src/types/css/property.js';
import supportsValue from '../../../../supports/src/types/css/value.js';

export class CSSPropertyValueFeature extends Feature {
	static children = null;

	testSelf () {
		let property = this.parent.id;
		let value = this.id;
		return supportsValue(property, value);
	}
}


export default class CSSPropertyFeature extends Feature {
	static children = {
		/** @deprecated */
		tests: {
			type: CSSPropertyValueFeature,
		},

		values: {
			type: CSSPropertyValueFeature,
			single: 'value',
		},
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

	testSelf () {
		// Has no values
		let property = this.id;
		return supportsProperty(property);
	}
}
