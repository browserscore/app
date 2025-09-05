
/**
 * Setup dummy elements
 */
import { prefixes, domPrefixes } from '../supports/src/data.js';
import { IS_DEV } from './util.js';

import property from '../supports/src/types/css/property.js';
import value from '../supports/src/types/css/value.js';
import descriptor from '../supports/src/types/css/descriptor.js';
import descriptorvalue from '../supports/src/types/css/descriptor-value.js';
import selector from '../supports/src/types/css/selector.js';
import atrule from '../supports/src/types/css/atrule.js';
import mq from '../supports/src/types/css/mq.js';
import Global from '../supports/src/types/js/global.js';
import member from '../supports/src/types/js/member.js';
import testExtends from '../supports/src/types/js/extends.js';

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
export { property, value, descriptor, descriptorvalue, selector, atrule, mq, Global, member, testExtends };

