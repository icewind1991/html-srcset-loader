const cheerio = require("cheerio");
const loaderUtils = require('loader-utils');
const Promise = require("bluebird");
const path = require('path');
const jimp = require('jimp');

module.exports = function (source) {
	this.cacheable && this.cacheable();
	const callback = this.async();

	var $ = cheerio.load(source);

	var sources = $('img').map(function () {
		return $(this).attr('src');
	}).get();

	var relSizes = [1, .75, .5, .25];

	getSizes(this, sources).then(function (sizes) {
		$('img').each(function (i, img) {
			var src = img.attribs.src;
			var size = sizes[src];
			var srcSet = relSizes.map(function (relSize) {
				var targetSize = Math.floor(relSize * size.width);
				return src + '?width=' + targetSize + ' ' + targetSize + 'w'
			}).join(', ');

			$(img).attr({
				srcset: srcSet
			});
		}.bind(this));

		callback(null, $.html());
	});
};

function getSizes (loaderContext, sources) {
	var dir = path.dirname(loaderContext.resourcePath);
	var resolve = Promise.promisify(loaderContext.resolve, {context: loaderContext});
	return Promise.all(sources.map(function (source) {
		return resolve(dir, loaderUtils.urlToRequest(source)).then(function (path) {
			return jimp.read(path);
		}).then(function (image) {
			return {width: image.bitmap.width, height: image.bitmap.height};
		});
	})).then(function (sizes) {
		return toObject(sources, sizes);
	})
}

function toObject (names, values) {
	var result = {};
	for (var i = 0; i < names.length; i++)
		result[names[i]] = values[i];
	return result;
}
