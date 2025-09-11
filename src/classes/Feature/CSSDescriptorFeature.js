import Feature from '../Feature.js';
import supportsDescriptor from '../../../../supports/src/types/css/descriptor.js';
import supportsDescriptorValue from '../../../../supports/src/types/css/descriptor-value.js';

export default class CSSAtruleDescriptorFeature extends Feature {
	static children = {
		values: {
			type: CSSAtruleDescriptorFeature,
		},
	}

	get uid () {
		let atrule = this.atrule?.code;
		let value = this.value;
		let ret = atrule + '/' + this.name;

		if (value) {
			ret += '/' + value;
		}

		return ret;
	}

	get atrule () {
		if (this.parent instanceof this.constructor) {
			return this.parent.atrule;
		}

		return this.parent;
	}

	get name () {
		if (this.via === 'values') {
			return this.parent.id;
		}

		return this.id ?? this.parent.id;
	}

	get value () {
		if (this.via === 'values') {
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
