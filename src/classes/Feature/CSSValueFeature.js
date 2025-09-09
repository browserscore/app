/**
 * A feature that tests whether a specific value is supported for a specific property
 * where the focus is the value
 */
import Feature from '../Feature.js';
import supportsProperty from '../../../../supports/src/types/css/property.js';
import supportsValue from '../../../../supports/src/types/css/value.js';

export default class CSSValueFeature extends Feature {
	static children = {
		tests: {
			type: CSSValueFeature,
			single: 'id'
		},
		properties: {
			type: CSSValueFeature,
			single: 'property',
		},
	}

	_createChildren () {
		let properties = this.def.properties;
		if (properties && !properties.processed) {
			// Subset properties to remove unsupported ones before any children are created
			for (let i = 0; i < properties.length; i++) {
				let property = properties[i];
				if (!supportsProperty(property)) {
					properties.splice(i--, 1);
				}
			}
			properties.processed = true;
		}

		super._createChildren();
	}

	get code () {
		// TODO figure out when to show the property name too and return
		// return `${this.property}: ${this.value}`;

		if (this.def.fromParent === 'properties') {
			return this.property;
		}

		return this.value;
	}

	get value () {
		if (this.def.fromParent === 'properties') {
			return this.parent.value;
		}

		if (!this.gatingTest && this.tests?.length > 0) {
			return this.tests[0].id;
		}

		return this.id;
	}

	get property () {
		if (this.def.property) {
			return this.def.property;
		}

		if (this.def.fromParent === 'properties') {
			return this.id;
		}

		if (this.properties) {
			return this.properties[0].id;
		}

		return this.parent.property;
	}

	set property (value) {
		Object.defineProperty(this, 'property', { value });
	}

	testSelf () {
		return supportsValue(this.property, this.value);
	}
}
