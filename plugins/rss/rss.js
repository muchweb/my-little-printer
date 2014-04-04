var fs = require('fs'),
	Promise = require('promise'),
	http = require('http'),
	FeedParser = require('feedparser');

exports.init = function (done) {

	// This plugin does not need any extra preparation

	return done();
};

exports.attach = function (configuration) {

	// Preparation. Downloading all required data
	configuration.app.pluglist.prepare.push(function () {
		return new Promise(function (resolve, reject) {
			var file = fs.createWriteStream(configuration.plugins.rss.homedir + 'rss.xml'),
				request = http.get('http://feeds.bbci.co.uk/news/rss.xml', function (response) {
					response.pipe(file);
					resolve('rss.xml');
				});
		});
	});

	// Processing. Returned data will be used in the template
	configuration.app.pluglist.process.push(function () {
		return new Promise(function (resolve, reject) {

			var counter = 0,
				article_data = [],
				item;

			fs.createReadStream(configuration.plugins.rss.homedir + 'rss.xml').on('error', function (error) {
				console.error(error);
			}).pipe(new FeedParser()).on('error', function (error) {
				console.error(error);
			}).on('meta', function (meta) {
				console.log('===== %s =====', meta.title);
			}).on('readable', function() {
				while ((item = this.read()) && counter < 5) {
					counter++;
					
					article_data.push({
						title: item.title,
						description: item.description,
					});

					if (counter === 5)
						return resolve({
							rss: article_data,
						});
				}
			});
		});
	});

};