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
		return !this.preludeRequired || Boolean(this.prelude);
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

	get uid () {
		let parent = this.parentAtRule?.code;

		if (parent) {
			return parent + '/' + this.code;
		}

		return this.code;
	}

	get testValue () {
		let atrule = this.atrule;
		let ret = atrule === this ? super.testValue : atrule.testValue;

		ret = ret.replace(/^@?/, '@');

		if (this.prelude) {
			ret += ' ' + this.prelude;
		}

		return ret;
	}

	get atrule () {
		if (this.via === 'preludes') {
			return this.parent.atrule;
		}

		return this;
	}

	get prelude () {
		return this.def.prelude ?? this.parent?.prelude ?? '';
	}
	set prelude (value) {
		this.defineProperty('prelude', {value, enumerable: true});
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
