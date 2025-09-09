import { CSSPropertyFeature, CSSValueFeature, CSSAtruleFeature, GlobalFeature } from '../classes/Feature/index.js';

const meta = {
	properties: {
		class: CSSPropertyFeature,
		title: 'CSS Properties',
	},
	values: {
		class: CSSValueFeature,
		title: 'CSS Property values',
	},
	selectors: {
		supports: 'selector',
		title: 'Selectors',
	},
	atrules: {
		class: CSSAtruleFeature,
		title: 'CSS @Rules & their descriptors',
	},
	globals: {
		class: GlobalFeature,
		title: 'JS Globals',
	},
	mediaqueries: {
		supports: 'mediaQuery',
		title: 'Media queries',
	},
};

export default meta;
export const types = new Set(Object.keys(meta));
