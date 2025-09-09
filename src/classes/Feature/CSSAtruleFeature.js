import Feature from '../Feature.js';
import supportsAtrule from '../../../../supports/src/types/css/atrule.js';
import supportsDescriptor from '../../../../supports/src/types/css/descriptor.js';
import supportsDescriptorValue from '../../../../supports/src/types/css/descriptor-value.js';

export class CSSAtruleDescriptorFeature extends Feature {
	static children = {
		values: {
			type: CSSAtruleDescriptorFeature,
		},
	}

	get atrule () {
		if (this.parent instanceof this.constructor) {
			return this.parent.atrule;
		}

		return this.parent;
	}

	get name () {
		if (this.def.fromParent === 'values') {
			return this.parent.id;
		}

		return this.id ?? this.parent.id;
	}

	get value () {
		if (this.def.fromParent === 'values') {
			return this.id;
		}

		if (!(this.parent instanceof this.constructor)) {
			return undefined;
		}

		return this.parent.value;
	}

	testSelf () {
		let descriptor = this.name;
		let value = this.value;
		let atrule = this.atrule?.getCode();

		if (value) {
			return supportsDescriptorValue(descriptor, value, atrule);
		}

		return supportsDescriptor(descriptor, atrule);
	}
}

export default class CSSAtruleFeature extends Feature {
	static forceTotal = undefined;
	static children = {
		...super.children,
		suffixes: {
			type: CSSAtruleFeature,
			single: 'suffix',
		},
		preludes: {
			type: CSSAtruleFeature,
			single: 'prelude',
		},
		descriptors: {
			type: CSSAtruleDescriptorFeature,
		},
		/** Child @-rules that are only valid within this @-rule */
		atrules: {
			type: CSSAtruleFeature,
		},
	}

	static gatingTest = true;

	constructor (def, parent) {
		super(def, parent);

		this.preludeRequired = def.preludeRequired;

		if (def.contentBefore) {
			this.contentBefore = def.contentBefore;
		}
	}

	get gatingTest () {
		// In some @rules (e.g. @property) a missing prelude is a parse error
		// So we can't use the plain @rule as a gating test
		return !this.preludeRequired || Boolean(this.computedPrelude);
	}

	getCode (o = {}) {
		let ret = this.testValue;

		if (o.contents && this.contents !== false) {
			let contents = typeof o.contents === 'string' ? o.contents : this.contents || '';
			ret += `{ ${contents} }`;
		}
		else if (this.contents === false) {
			ret += ';';
		}

		return ret;
	}

	get code () {
		return this.getCode();
	}

	get testValue () {
		let ret = super.testValue;

		ret = ret.replace(/^@?/, '@');

		if (this.suffix) {
			if (this.def.fromParent === 'suffixes') {
				return this.parent.testValue + this.suffix;
			}
			else {
				ret += this.suffix;
			}
		}

		if (this.prelude) {
			if (this.def.fromParent === 'preludes') {
				return this.parent.testValue + ' ' + this.prelude;
			}
			else {
				ret += ' ' + this.prelude;
			}
		}

		return ret;
	}

	get atrule () {
		if (this.def.fromParent === 'preludes' || this.def.fromParent === 'suffixes') {
			return this.parent;
		}

		return this;
	}

	get computedPrelude () {
		return this.closestValue(f => f.prelude) || '';
	}

	get contents () {
		if (this.def.contents !== undefined) {
			return this.def.contents;
		}

		if (this.def.fromParent !== 'atrules' && this.parent) {
			return this.parent.contents;
		}

		return '';
	}

	get parentAtRule () {
		if (this.def.fromParent === 'atrules' && this.parent instanceof this.constructor) {
			return this.parent;
		}

		return null;
	}

	testSelf () {
		let parent = this.parentAtRule?.getCode();
		let contentBefore = this.contentBefore;

		let code = this.getCode({contents: true});

		let ret = supportsAtrule(code, {parent, contentBefore});

		return ret;
	}
}
