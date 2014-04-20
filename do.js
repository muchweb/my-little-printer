var Q = require('q'),
	exec = require('child_process').exec,
	colors = require('colors'),
	gm = require('gm'),
	plugin_list = require('../printerfile.json'),
	fs = require('fs'),
	i,
	image = gm();

// Loading all modules
plugin_list = plugin_list.map(function (plugin) {
	if (typeof plugin === 'string')
		plugin = {
			name: plugin,
			data: {},
		}

	console.log('Loaded plugin ' + plugin.name.yellow);
	return new require('./plugins/' + plugin.name + '/main.js')('./plugins/' + plugin.name + '/', plugin.data);
});

console.log('Preparing...');
Q.all(plugin_list.map(function (mod) {
	return mod.prepare();
})).done(function (results1) {
	
	console.log('Processing...');
	Q.all(plugin_list.map(function (mod, index) {
		return mod.process(results1[index]);
	})).done(function (results2) {

		console.log('Rendering...');
		Q.all(plugin_list.map(function (mod, index) {
			return mod.render(results2[index]);
		})).done(function (results3) {
			
			console.log('Creating receipt...');

			// Appending images
			for (i = 0; i < results3.length; i++)
				image.append(results3[i]);

			// Wrining final image
			image.write('./out.png', function (err) {
				if (err)
					return console.log(err);

				console.log('Printing...'.green);
				exec('./print.sh', function () {

					console.log('Cleanup...');

					// Removing temporaty files
					Q.all(plugin_list.map(function (mod) {
						return mod.done();
					})).done(function () {

						fs.unlink('./out.png', function (err) {
							console.log('All done.');
						});
					});
				});
			});
		});
	});
});