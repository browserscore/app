import { CSSPropertyFeature, CSSValueFeature, CSSAtruleFeature, GlobalFeature } from '../classes/Feature/index.js';
import supports from '../supports.js';

const meta = {
	properties: {
		class: CSSPropertyFeature,
		title: 'CSS Properties',
		mdn: id => `CSS/${id}`,
		supports: 'cssProperty',
	},
	units: {
		title: 'CSS Units',
		supports () {
			return supports.css.unit(this.id, this.def.dataType)
		},
	},
	values: {
		class: CSSValueFeature,
		title: 'CSS Property values',
		supports () {
			let property = this.property;
			let value = this.value;

			if (!property) {
				// No property to test with
				// This can happen if none of the properties specified are supported
				return { success: undefined, note: 'No property to test with' };
			}

			if (property?.value) {
				// {name: string, value: function} object
				value = property.value(value);
			}

			return supports.css.value(property, value);
		},
	},
	selectors: {
		title: 'Selectors',
		supports: 'cssSelector',
	},
	atrules: {
		class: CSSAtruleFeature,
		title: 'CSS @Rules & their descriptors',
		supports: 'cssAtrule',
	},
	globals: {
		class: GlobalFeature,
		title: 'JS Globals',
		supports: 'jsGlobal',
	},
	mediaqueries: {
		supports: 'mediaQuery',
		title: 'Media queries',
	},
};

export default meta;
export const types = new Set(Object.keys(meta));
