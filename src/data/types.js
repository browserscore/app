import { CSSPropertyFeature, CSSValueFeature, CSSAtruleFeature, GlobalFeature } from '../classes/Feature/index.js';
import { IS_DEV } from '../util.js';
import * as supports from '../../../supports/src/index.js';
export { supports };

if (IS_DEV) {
	window.supports = supports;
}

const meta = {
	properties: {
		class: CSSPropertyFeature,
		title: 'CSS Properties',
		// mdn: id => `CSS/${id}`,
		test () {
			if (this.def.fromParent === 'values' || this.def.fromParent === 'tests') {
				return supports.css.value(this.parent.id, this.id);
			}

			return supports.css.property(this.id);
		},
	},
	units: {
		title: 'CSS Units',
		test () {
			return supports.css.unit(this.id, this.def.dataType)
		},
	},
	values: {
		class: CSSValueFeature,
		title: 'CSS Property values',
		test () {
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
		test: 'cssSelector',
	},
	atrules: {
		class: CSSAtruleFeature,
		title: 'CSS @Rules & their descriptors',
		test: 'cssAtrule',
	},
	globals: {
		class: GlobalFeature,
		title: 'JS Globals',
		test: 'jsGlobal',
	},
	mediaqueries: {
		test: 'mediaQuery',
		title: 'Media queries',
	},
};

export default meta;
export const types = new Set(Object.keys(meta));
