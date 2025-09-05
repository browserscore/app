
/**
 * Setup dummy elements
 */
import { prefixes, domPrefixes } from '../supports/src/shared.js';
import { IS_DEV } from './util.js';

import property from '../supports/css/property.js';
import value from '../supports/css/value.js';
import descriptor from '../supports/css/descriptor.js';
import descriptorvalue from '../supports/css/descriptor-value.js';
import selector from '../supports/css/selector.js';
import atrule from '../supports/css/atrule.js';
import mq from '../supports/css/mq.js';
import Global from '../supports/js/global.js';
import member from '../supports/js/member.js';
import testExtends from '../supports/js/extends.js';

const Supports = {
	prefixes,
	domPrefixes,
	property,
	value,
	descriptorvalue,
	descriptor,
	selector,
	atrule,
	mq,
	global: Global,
	member,
	extends: testExtends,
};

if (IS_DEV) {
	window.Supports = Supports;
}

export default Supports;
export { property, value, descriptor, descriptorvalue, selector, atrule, mq, variable, Global, member, testExtends };

