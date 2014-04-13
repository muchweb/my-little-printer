var fs = require('fs'),
	Promise = require('promise'),
	forecast = require('forecast'),
	moment = require('moment');

exports.init = function (done) {

	// This plugin does not need any extra preparation
	return done();
};

exports.attach = function (configuration) {

	var save_file = 'forecast.json';

	// Preparation. Downloading all required data
	configuration.app.pluglist.prepare.push(function () {
		var my_forecast = new forecast(configuration.plugins.forecast.init);

		return new Promise(function (resolve, reject) {
			my_forecast.get(configuration.plugins.forecast.target, function (err, weather) {
				if (err)
					console.log(err);
				else
					fs.writeFile(configuration.plugins.forecast.homedir + save_file, JSON.stringify(weather), function(err) {
						if (err)
							console.log(err);
						else
							resolve(save_file);
					}); 
			});
		});
	});

	// Processing. Returned data will be used in the template
	configuration.app.pluglist.process.push(function () {
		return new Promise(function (resolve, reject) {
			var data = require('./' + save_file);

			for (var i = 0; i < data.daily.data.length; i++) {
				data.daily.data[i].moment = moment.unix(data.daily.data[i].time).format('ddd D');
				data.daily.data[i].temperatureMin = Math.round(data.daily.data[i].temperatureMin);
				data.daily.data[i].temperatureMax = Math.round(data.daily.data[i].temperatureMax);
			}

			return resolve({
				forecast: data,
			});

		});
	});



	// Removing all temporary data.
	configuration.app.pluglist.done.push(function () {
		return new Promise(function (resolve, reject) {
			fs.unlink(configuration.plugins.forecast.homedir + save_file, function (err) {
				if (err)
					return reject(err);
				resolve();
			});
		});
	});

};