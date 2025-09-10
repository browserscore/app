/**
 * A feature that tests whether a specific value is supported for a specific property
 * where the focus is the value
 */
import Feature from '../Feature.js';
import supportsProperty from '../../../../supports/src/types/css/property.js';
import supportsValue from '../../../../supports/src/types/css/value.js';
import { dataTypes } from '../../../../supports/src/types/css/type.js';
import CSSPropertyFeature from './CSSPropertyFeature.js';

export default class CSSValueFeature extends Feature {
	static children = {
		...super.children,
		properties: {
			single: 'property',
		},

		dataTypes: {
			single: 'dataType',
		},
		values: {
			single: 'value',
		},
	}

	_createChildren () {
		// Use properties specified if available, or infer from type
		// TODO this is run synchronously, so some specs may have have not had a chance to load yet
		let properties = this.def.properties;

		let isLeaf = !(this.def.args || this.def.values || this.def.tests);
		if (!properties && this.dataType && this.dataType in CSSPropertyFeature.dataTypes && isLeaf) {
			properties = CSSPropertyFeature.dataTypes[this.dataType]?.map(p => p.id);
		}

		if (properties) {
			if (!properties.processed) {
				// Subset properties to remove unsupported ones before any children are created
				for (let i = 0; i < properties.length; i++) {
					let property = properties[i];
					let {success} = supportsProperty(property);
					if (!success) {
						properties.splice(i--, 1);
					}
				}
				properties.processed = true;
			}

			this.def.properties = properties;
		}
		else if (this.dataType) {
			// Fall back to single property, don't create children
			this.property = dataTypes[this.dataType].property;
		}

		super._createChildren();
	}

	get code () {
		// TODO figure out when to show the property name too and return
		// return `${this.property}: ${this.value}`;
		switch (this.def.fromParent) {
			case 'properties':
				return this.property;
			case 'dataTypes':
				return `<${this.id}>`;
		}

		return this.id ?? this.value;

	}

	get dataType () {
		if (this.def.fromParent === 'dataTypes') {
			return this.id;
		}

		if (this.def.dataType) {
			return this.def.dataType;
		}

		return;
	}

	set dataType (value) {
		Object.defineProperty(this, 'dataType', { value });
	}

	get value () {
		if (this.def.fromParent === 'properties' || this.def.fromParent === 'dataTypes') {
			return this.parent.value;
		}

		if (this.def.fromParent === 'args' || this.arg) {
			return this.testValue;
		}

		if (this.args) {
			// It's a CSS function.
			// use the first argument; we don't want to get an invalid value like foobar()
			return this.args[0].value;
		}

		if (!this.gatingTest && this.tests?.length > 0) {
			return this.tests[0].id;
		}

		return this.id;
	}

	set value (value) {
		this.defineProperty('value', { value, enumerable: true });
	}

	get property () {
		if (this.def.property) {
			return this.def.property;
		}

		if (this.def.fromParent === 'properties') {
			return this.id;
		}

		if (this.properties) {
			return this.properties[0].property;
		}

		return this.parent?.property;
	}

	set property (value) {
		if (value && typeof value === 'object' && value.name) {
			value.toString = () => value.name;
		}

		this.defineProperty('property', { value, enumerable: true });
	}

	testSelf () {
		let property = this.property;
		let value = this.value;

		if (!property) {
			// No property to test with
			// This can happen if none of the properties specified are supported
			return { success: undefined, note: 'No property to test with' };
		}

		if (property?.value) {
			value = property.value(value);
		}

		return supportsValue(property, value);
	}
}
