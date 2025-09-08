/**
 * Setup dummy elements
 */
import { IS_DEV } from './util.js';

import * as supports from '../../supports/src/index.js';

if (IS_DEV) {
	window.Supports = supports;
}

export default supports;
export * from '../../supports/src/index.js';
