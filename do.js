var webshot = require('webshot'),
	fs = require('fs'),
	handlebars = require('handlebars'),
	Promise = require('promise'),
	exec = require('child_process').exec,
	broadway = require('broadway'),
	app = new broadway.App();

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

Promise.all(app.pluglist.prepare.map(function (data_mapped) {
	return data_mapped();
})).then(function (res) {
    console.log('preparation results', res);

	Promise.all(app.pluglist.process.map(function (data_mapped) {
		return data_mapped();
	})).then(function (res) {
		var data = {};

		for (var i = 0; i < res.length; i++)
			for (var j in res[i])
				if (res[i].hasOwnProperty(j))
					data[j] = res[i][j];

	    console.log(res, data);

	    var templateFile = fs.readFileSync('./index.hbs', 'utf8');
		var template = handlebars.compile(templateFile);
		var html = template(data);

		fs.writeFile('index.html', html, function(err) {
		    if (err)
		        return reject(err);

		    // TODO
		    webshot('file:///home/full-path-here/index.html', 'image.png', {
				windowSize: {
					width: 100,
					height: 100,
				},
				shotSize: {
					width: 'all',
					height: 'all',
				},
			}, function (err) {
				console.log(err);

				console.log('Printing...');
				
				exec('./print.sh', function (error, stdout, stderr) {
					// output is in stdout
				});
			});

		});
	}, function (e) {
		console.log('aaa', e);
	});
});