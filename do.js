var webshot = require('webshot'),
	fs = require('fs'),
	handlebars = require('handlebars'),
	Promise = require('promise'),
	exec = require('child_process').exec,
	broadway = require('broadway'),
	app = new broadway.App();


require('colors');

app.pluglist = {
	prepare: [],
	process: [],
	render: [],
};

var configuration = require('./printerfile.json');
configuration.app = app;
for (var key in configuration.plugins)
	if (configuration.plugins.hasOwnProperty(key)) {
		configuration.plugins[key].homedir = './plugins/' + key + '/';
		app.use(require(configuration.plugins[key].homedir + key), configuration);
	}


app.init(function (err) {
	if (err)
		console.log(err);
});

process.stdout.write('Downloading...');
Promise.all(app.pluglist.prepare.map(function (data_mapped) {
	return data_mapped();
})).then(function (res) {
	console.log(' OK'.green);
	process.stdout.write('Processing results...');

	Promise.all(app.pluglist.process.map(function (data_mapped) {
		return data_mapped();
	})).then(function (res) {
		console.log(' OK'.green);
		process.stdout.write('Creating page...');

		var data = {};

		for (var i = 0; i < res.length; i++)
			for (var j in res[i])
				if (res[i].hasOwnProperty(j))
					data[j] = res[i][j];

	    var templateFile = fs.readFileSync('./index.hbs', 'utf8');
		var template = handlebars.compile(templateFile);
		var html = template(data);

		fs.writeFile('index.html', html, function(err) {
		    if (err)
		        return reject(err);

		    webshot('file://' + __dirname + '/index.html', 'image.png', {
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
					console.log(err);

    			console.log(' OK'.green);
				console.log('All done. Printing.'.cyan);
				
				exec('./print.sh', function (error, stdout, stderr) {
					// output is in stdout
				});
			});

		});
	}, function (e) {
		console.log('aaa', e);
	});
});