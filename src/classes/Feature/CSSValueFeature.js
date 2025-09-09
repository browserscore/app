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
		tests: {},
		properties: {
			single: 'property',
		},
		args: {
			single: 'arg',
		}
	}

	_createChildren () {
		this.dataType = this.def.dataType;

		// Use properties specified if available, or infer from type
		// TODO this is run synchronously, so some specs may have have not had a chance to load yet
		let properties = this.def.properties ?? CSSPropertyFeature.dataTypes[this.dataType]?.map(p => p.id);
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
		if (this.def.fromParent === 'properties') {
			return this.property;
		}

		if (this.def.fromParent === 'args') {
			return this.value;
		}

		return this.id;

	}

	get value () {
		if (this.def.fromParent === 'args') {
			let fn = this.parent.id;
			return fn.replace(/\(\)$/, `(${this.id})`);
		}

		if (this.def.fromParent === 'properties') {
			return this.parent.value;
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
