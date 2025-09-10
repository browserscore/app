import Feature from '../Feature.js';
import supportsAtrule from '../../../../supports/src/types/css/atrule.js';
import CSSDescriptorFeature from './CSSDescriptorFeature.js';

export default class CSSAtruleFeature extends Feature {
	static forceTotal = undefined;
	static children = {
		...super.children,
		preludes: {
			type: CSSAtruleFeature,
			single: 'prelude',
		},
		descriptors: {
			type: CSSDescriptorFeature,
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

	set code (value) {
		super.code = value;
	}

	get testValue () {
		let ret = super.testValue;

		ret = ret.replace(/^@?/, '@');

		if (this.prelude) {
			if (this.via === 'preludes') {
				return this.parent.testValue + ' ' + this.prelude;
			}
			else {
				ret += ' ' + this.prelude;
			}
		}

		return ret;
	}

	get atrule () {
		if (this.via === 'preludes') {
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

		if (this.via !== 'atrules' && this.parent) {
			return this.parent.contents;
		}

		return '';
	}

	get parentAtRule () {
		if (this.via === 'atrules' && this.parent instanceof this.constructor) {
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
