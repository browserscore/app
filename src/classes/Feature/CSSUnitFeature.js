import Feature from '../Feature.js';
import supportsUnit from '../../../../supports/src/types/css/unit.js';

export default class CSSUnitFeature extends Feature {
	testSelf () {
		return supportsUnit(this.id, this.def.dataType);
	}
}
