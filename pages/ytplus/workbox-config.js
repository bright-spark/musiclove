module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{html,png,js,css}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};