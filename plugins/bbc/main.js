var FeedParser = require('feedparser'),
	fs = require('fs'),
	handlebars = require('handlebars'),
	http = require('http'),
	Q = require('q'),
	webshot = require('webshot');

/*
	Setting current plugin 'home directory'
*/
plugin = function (module_dir) {
	this.module_dir = module_dir;
};

/*
	Preparation. Downloading all required data
*/
plugin.prototype.prepare = function () {
	var deferred = Q.defer();

	request = http.get('http://feeds.bbci.co.uk/news/rss.xml', function (response) {
		deferred.resolve(response);
	});

	return deferred.promise;
};

/*
	Processing. Returned data will be used in the template
*/
plugin.prototype.process = function (data) {
	var deferred = Q.defer(),
		counter = 0,
		article_data = [],
		item,
		feedparser = new FeedParser();

	feedparser.on('error', function (error) {
		console.error(error);
	}).on('readable', function() {
		while ((item = this.read()) && counter < 5) {
			counter++;
			
			article_data.push({
				title: item.title,
				description: item.description,
			});

			if (counter === 5)
				deferred.resolve(article_data);
		}
	});

	data.pipe(feedparser);

	return deferred.promise;
};

/*
	Rendering page to image
*/
plugin.prototype.render = function (data) {
	var deferred = Q.defer(),
		templateFile = fs.readFileSync(this.module_dir + 'index.hbs', 'utf8'),
		template = handlebars.compile(templateFile),
		html = template(data);

	webshot(html, this.module_dir + 'result.png', {
		siteType: 'html',
		windowSize: {
			width: 100,
			height: 100,
		},
		shotSize: {
			width: 'all',
			height: 'all',
		},
	}, function (err) {
		if (err)
			return deferred.reject(err);

		deferred.resolve(this.module_dir + 'result.png');
	}.bind(this));

	return deferred.promise;
};

/*
	Removing all temporary data.
*/
plugin.prototype.done = function () {
	var deferred = Q.defer();

	fs.unlink(this.module_dir + 'result.png', function (err) {
		if (err)
			return deferred.reject(err);

		deferred.resolve();
	});

	return deferred.promise;
};

module.exports = function (module_dir) {
	return new plugin(module_dir);
};