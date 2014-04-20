var forecast = require('forecast'),
	fs = require('fs'),
	handlebars = require('handlebars'),
	http = require('http'),
	Q = require('q'),
	webshot = require('webshot'),
	moment = require('moment');

/*
	Setting current plugin 'home directory'
*/
plugin = function (module_dir, settings) {
	this.module_dir = module_dir;
	this.settings = settings;
};

/*
	Preparation. Downloading all required data
*/
plugin.prototype.prepare = function () {
	var deferred = Q.defer(),
		my_forecast = new forecast(this.settings.init);

	my_forecast.get(this.settings.target, function (err, weather) {
		if (err)
			return deferred.reject(err);
			
		deferred.resolve(weather);
	});

	return deferred.promise;
};

/*
	Processing. Returned data will be used in the template
*/
plugin.prototype.process = function (data) {
	var deferred = Q.defer(),
		i;

	for (i = 0; i < data.daily.data.length; i++) {
		data.daily.data[i].moment = moment.unix(data.daily.data[i].time).format('ddd D');
		data.daily.data[i].temperatureMin = Math.round(data.daily.data[i].temperatureMin);
		data.daily.data[i].temperatureMax = Math.round(data.daily.data[i].temperatureMax);
	}

	deferred.resolve(data);

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

module.exports = function (module_dir, settings) {
	return new plugin(module_dir, settings);
};