module.exports = {
	extends: ['airbnb-base'],
	rules: {
		indent: [2, 'tab'],
		'no-eval': 0,
		'no-tabs': 0,
		'no-alert': 0,
		'no-console': 0,
		'no-underscore-dangle': 0,
		'prefer-template': 0,
		"arrow-parens": 0,
		"no-throw-literal": 0,
		"prefer-promise-reject-errors": 0,
		"no-return-assign": 1,
		"camelcase": 1,
	},
	globals: {
	},
	env: {
		node: true,
	}
}
