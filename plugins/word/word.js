var fs = require('fs'),
	Promise = require('promise'),
	http = require('http'),
	FeedParser = require('feedparser');

exports.init = function (done) {
	return done();
};

exports.attach = function (configuration) {

	var feed_file = 'word.xml';

	// Preparation. Downloading all required data
	configuration.app.pluglist.prepare.push(function () {
		return new Promise(function (resolve, reject) {
			var file = fs.createWriteStream(configuration.plugins.word.homedir + feed_file);

			// Writing downloaded feed to disk
			http.get('http://wordsmith.org/awad/rss1.xml', function(response) {
				response.pipe(file);
				resolve(feed_file);
			});
		});
	});

	// Processing. Returned data will be used in the template
	configuration.app.pluglist.process.push(function () {
		return new Promise(function (resolve, reject) {

			var article_data = [],
				item;

			fs.createReadStream(configuration.plugins.word.homedir + feed_file).on('error', function (error) {
				reject(error);
			}).pipe(new FeedParser()).on('error', function (error) {
				reject(error);
			}).on('readable', function() {
				while (item = this.read()) {
					resolve({
						word: {
							title: item.title,
							description: item.description,
						},
					});
				}
			});

		});
	});

	// Removing all temporary data.
	configuration.app.pluglist.done.push(function () {
		return new Promise(function (resolve, reject) {
			fs.unlink(configuration.plugins.word.homedir + feed_file, function (err) {
				if (err)
					return reject(err);
				resolve();
			});
		});
	});

};