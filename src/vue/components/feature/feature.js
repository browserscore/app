/**
 * Component to render one AbstractFeature instance (feature, feature group, spec, etc.)
 */
import { IS_DEV, passclass, round, percent, log } from '../../../util.js';

export default {
	props: {
		feature: {
			type: Object,
			required: true,
		},

		level: {
			type: Number,
			default: 0,
		},

		parent: {
			type: Object,
		},
	},

	inheritAttrs: false,

	data () {
		return {
			open: false,
		};
	},

	emits: ['update:score'],

	created () {
		this.open = this.defaultOpen;
	},

	mounted () {
		let container = this.$refs.container ?? this.$refs.details;

		if (IS_DEV && container) {
			// Expose feature object on container for debugging
			container.feature = this.feature;
		}
	},

	template: '#feature-component-template',

	computed: {
		defaultOpen () {
			return this.species !== 'Feature' || this.level === 0;
		},

		isEmpty () {
			return !this.feature.children?.length;
		},

		score () {
			return this.feature.score;
		},

		species () {
			return this.feature.species;
		},

		isCollapsible () {
			return this.level > 0 && this.feature.children?.length > 0;
		},

		computedParent () {
			return this.parent ?? this.feature.parent;
		},

		showScore () {
			return (
				!this.parent ||
				this.species === 'Feature' ||
				this.parent.score.total !== this.feature.score.total
			);
		},

		showFeatureCount () {
			return (
				this.feature.score.total > 1 &&
				(!this.parent || this.parent.score.total !== this.feature.score.total)
			);
		},

		permalink () {
			if (this.species === 'Spec') {
				let urlParams = new URLSearchParams(location.search);
				urlParams.set('spec', this.feature.id);
				return '?' + urlParams.toString();
			}

			if (this.species === 'Feature') {
				return '#' + this.feature.htmlId;
			}

			return '';
		},
	},

	methods: {
		passclass,
		round,
		percent,
		log,

		handleToggle (event) {
			this.open = event.target.open;
		},
	},

	watch: {
		children: {
			handler () {
				this.feature.test();
			},
			immediate: true,
		},

		'score.value': {
			handler () {
				this.$emit('update:score', this.score);
			},
			immediate: true,
		},
	},

	compilerOptions: {
		isCustomElement: tag => tag === 'ui-tooltip',
	},
};
